export class CommentsAutoSave {
    private saveTimers: { [key: string]: number } = {};
    private currentTaxonId: number | null = null;
    private pendingSaves: { [key: string]: { comment?: string } } = {};
    private debounceDelay: number;
    private onSaveComment: (taxonId: number, comment?: string) => Promise<void>;
    private eventListeners: { element: HTMLElement | Document | Window, type: string, handler: EventListener }[] = [];
    private isDestroyed = false;
    private table: HTMLTableElement | null = null;

    constructor({
        debounceDelay = 1500,
        onSaveComment
    }: {
        debounceDelay?: number,
        onSaveComment: (taxonId: number, comment?: string) => Promise<void>
    }) {
        this.debounceDelay = debounceDelay;
        this.onSaveComment = onSaveComment;
    }

    public init(table: HTMLTableElement): void {
        // If already initialized with a table, destroy first
        if (this.table) {
            this.destroy();
        }

        if (this.isDestroyed) {
            console.warn('Attempting to initialize a destroyed CommentsAutoSave instance. Create a new instance instead.');
            return;
        }

        this.table = table;
        const rows = table.querySelectorAll('tbody tr');

        // Setup handlers for each row
        rows.forEach((row) => this.setupRow(row as HTMLTableRowElement));

        // Add event listener for when user leaves the table entirely
        this.addEventListener(document, 'click', (e) => {
            const target = e.target as HTMLElement;
            if (this.table && !this.table.contains(target)) {
                // User clicked outside the table, save any pending changes
                this.saveCurrentRow();
            }
        });

        // Save any pending changes before page unload
        this.addEventListener(window, 'beforeunload', () => {
            this.saveAllPending();
        });
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }

        // Clean up all timers
        Object.keys(this.saveTimers).forEach(id => {
            window.clearTimeout(this.saveTimers[Number(id)]);
        });
        this.saveTimers = {};

        // Remove all event listeners
        this.eventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        this.eventListeners = [];

        // Save any pending changes
        this.saveAllPending();

        // Reset state
        this.pendingSaves = {};
        this.currentTaxonId = null;
        this.table = null;
        this.isDestroyed = true;
    }

    // All other methods remain the same...
    private setupRow(row: HTMLTableRowElement): void {
        const commentInput = row.querySelector('textarea') as HTMLTextAreaElement;
        const taxonIdAttr = row.getAttribute('taxon_id');

        if (!taxonIdAttr) {
            return;
        }

        const taxonId = Number(taxonIdAttr);

        // Initialize pending saves object for this row
        this.pendingSaves[taxonId] = {};

        // Add focus tracking to comment input
        this.addEventListener(commentInput, 'focus', () => this.trackFocus(taxonId));

        // Set up textarea handlers
        this.addEventListener(commentInput, 'change', () => this.handleCommentChange(taxonId));
        this.addEventListener(commentInput, 'input', () => this.handleCommentInput(taxonId, commentInput.value));
    }

    private trackFocus(taxonId: number): void {
        if (this.currentTaxonId !== taxonId) {
            // User moved to a new row, save any pending data for previous row
            this.saveCurrentRow();
            this.currentTaxonId = taxonId;
        }
    }

    private handleCommentChange(taxonId: number): void {
        // Immediate save on blur/change
        if (this.pendingSaves[taxonId]?.comment !== undefined) {
            this.onSaveComment(taxonId, this.pendingSaves[taxonId].comment);
            delete this.pendingSaves[taxonId].comment;
        }
    }

    private handleCommentInput(taxonId: number, value: string): void {
        this.debouncedSave(taxonId, { comment: value });
    }

    private debouncedSave(taxonId: number, data: { comment?: string }): void {
        // Clear any existing timer for this row
        if (this.saveTimers[taxonId]) {
            window.clearTimeout(this.saveTimers[taxonId]);
        }

        // Update pending data
        this.pendingSaves[taxonId] = {
            ...this.pendingSaves[taxonId],
            ...data
        };

        // Set new timer
        this.saveTimers[taxonId] = window.setTimeout(() => {
            if (this.isDestroyed) return;

            if (Object.keys(this.pendingSaves[taxonId]).length > 0) {
                this.onSaveComment(taxonId, this.pendingSaves[taxonId].comment);
                this.pendingSaves[taxonId] = {};
            }
        }, this.debounceDelay);
    }

    private saveCurrentRow(): void {
        if (this.currentTaxonId && this.pendingSaves[this.currentTaxonId]) {
            this.onSaveComment(this.currentTaxonId, this.pendingSaves[this.currentTaxonId].comment);
            delete this.pendingSaves[this.currentTaxonId];

            // Handle remaining timers
            if (this.saveTimers[this.currentTaxonId]) {
                window.clearTimeout(this.saveTimers[this.currentTaxonId]);
                delete this.saveTimers[this.currentTaxonId];
            }
        }
    }

    private saveAllPending(): void {
        Object.keys(this.pendingSaves).forEach(id => {
            if (Object.keys(this.pendingSaves[id]).length > 0) {
                this.onSaveComment(Number(id), this.pendingSaves[id].comment);
            }
        });
    }

    private addEventListener(
        element: HTMLElement | Document | Window,
        type: string,
        handler: EventListener
    ): void {
        element.addEventListener(type, handler);
        this.eventListeners.push({ element, type, handler });
    }
}