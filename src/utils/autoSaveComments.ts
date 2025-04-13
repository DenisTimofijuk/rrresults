import ExpertDataManager from "./ExpertDataManager";

export function initCommentsAutoSave(table: HTMLTableElement, dataManager: ExpertDataManager) {
    const rows = table.querySelectorAll('tbody tr');
    const debounceDelay = 1500;
    let saveTimers: { [key: string]: number } = {};
    let currentTaxonId: number | null = null;
    let pendingSaves: { [key: string]: { comment?: string } } = {};

    // Track which row user is currently focused on
    const trackFocus = (taxonId: number) => {
        if (currentTaxonId !== taxonId) {
            // User moved to a new row, save any pending data for previous row
            if (currentTaxonId && pendingSaves[currentTaxonId]) {
                dataManager.postComment(currentTaxonId, pendingSaves[currentTaxonId].comment);
                delete pendingSaves[currentTaxonId];
                //handle remaining timers
                if (saveTimers[currentTaxonId]) {
                    window.clearTimeout(saveTimers[currentTaxonId]);
                    delete saveTimers[currentTaxonId];
                }
            }
            currentTaxonId = taxonId;
        }
    };

    // Setup handlers for each row
    rows.forEach((row) => {
        const commentInput = row.querySelector('textarea') as HTMLTextAreaElement;
        const taxonId = Number((row as HTMLElement).getAttribute('taxon_id'));

        if (!taxonId) {
            return;
        }

        // Initialize pending saves object for this row
        pendingSaves[taxonId] = {};

        // Add focus tracking to all interactive elements
        commentInput.addEventListener('focus', () => trackFocus(taxonId));

        // Debounced save function specific to this row
        const debouncedSave = (data: { comment?: string }) => {
            // Clear any existing timer for this row
            if (saveTimers[taxonId]) {
                window.clearTimeout(saveTimers[taxonId]);
            }

            // Update pending data
            pendingSaves[taxonId] = {
                ...pendingSaves[taxonId],
                ...data
            };

            // Set new timer
            saveTimers[taxonId] = window.setTimeout(() => {
                if (Object.keys(pendingSaves[taxonId]).length > 0) {
                    dataManager.postComment(taxonId, pendingSaves[taxonId].comment);
                    pendingSaves[taxonId] = {};
                }
            }, debounceDelay);
        };

        // Set up textarea handlers - only debounce input events, not change events
        commentInput.addEventListener('change', () => {
            // Immediate save on blur/change
            if (pendingSaves[taxonId]?.comment !== undefined) {
                dataManager.postComment(taxonId, pendingSaves[taxonId].comment);
                delete pendingSaves[taxonId].comment;
            }
        });

        commentInput.addEventListener('input', () => {
            debouncedSave({
                comment: commentInput.value
            });
        });
    });

    // Add event listener for when user leaves the table entirely
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!table.contains(target)) {
            // User clicked outside the table, save any pending changes
            if (currentTaxonId && pendingSaves[currentTaxonId]) {
                dataManager.postComment(currentTaxonId, pendingSaves[currentTaxonId].comment);
                pendingSaves[currentTaxonId] = {};
            }
        }
    });

    // Save any pending changes before page unload
    window.addEventListener('beforeunload', () => {
        // e.preventDefault();
        Object.keys(pendingSaves).forEach(id => {
            if (Object.keys(pendingSaves[id]).length > 0) {
                dataManager.postComment(Number(id), pendingSaves[id].comment);
            }
        });
    });
}