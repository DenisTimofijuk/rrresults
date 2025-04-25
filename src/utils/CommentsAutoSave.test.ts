import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CommentsAutoSave } from './CommentsAutoSave';

describe('CommentsAutoSave', () => {
    let commentsAutoSave: CommentsAutoSave;
    let mockOnSaveComment: (taxonId: number, comment?: string) => Promise<void>;
    let mockTable: HTMLTableElement;
    let mockRows: HTMLTableRowElement[];
    let mockTextareas: HTMLTextAreaElement[];

    beforeEach(() => {
        // Setup DOM mocks
        mockTable = document.createElement('table');
        const tbody = document.createElement('tbody');
        mockTable.appendChild(tbody);

        // Create mock rows with textareas
        mockRows = [];
        mockTextareas = [];

        for (let i = 0; i < 3; i++) {
            const row = document.createElement('tr');
            row.setAttribute('taxon_id', String(i + 1));

            const textarea = document.createElement('textarea');
            textarea.value = '';

            const cell = document.createElement('td');
            cell.appendChild(textarea);
            row.appendChild(cell);

            tbody.appendChild(row);
            mockRows.push(row);
            mockTextareas.push(textarea);
        }

        // Create mock save function
        mockOnSaveComment = vi.fn().mockResolvedValue(undefined);

        // Initialize the class
        commentsAutoSave = new CommentsAutoSave({
            onSaveComment: mockOnSaveComment,
            debounceDelay: 100 // Use a shorter delay for tests
        });

        // Mock timers
        vi.useFakeTimers();
    });

    afterEach(() => {
        // Clean up
        commentsAutoSave.destroy();
        vi.restoreAllMocks();
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    it('should initialize correctly', () => {
        commentsAutoSave.init(mockTable);
        expect(mockOnSaveComment).not.toHaveBeenCalled();
    });

    it('should save comment after debounce delay', async () => {
        commentsAutoSave.init(mockTable);

        // Simulate typing in a textarea
        mockTextareas[0].value = 'Test comment';
        mockTextareas[0].dispatchEvent(new Event('input'));

        // Simulate input event
        expect(mockOnSaveComment).not.toHaveBeenCalled();

        // Fast-forward time to trigger debounce
        vi.advanceTimersByTime(100);

        // Verify the save was called
        expect(mockOnSaveComment).toHaveBeenCalledTimes(1);
        expect(mockOnSaveComment).toHaveBeenCalledWith(1, 'Test comment');
    });

    it('should save comment when focus changes to another row', () => {
        commentsAutoSave.init(mockTable);
    
        // Simulate focus event on first row 
        // (this is crucial to set currentTaxonId)
        mockTextareas[0].dispatchEvent(new Event('focus'));
        mockTextareas[0].value = 'Comment for row 1';
        mockTextareas[0].dispatchEvent(new Event('input'));
    
        // Now dispatch focus event on the second textarea
        mockTextareas[1].dispatchEvent(new Event('focus'));
    
        // Verify the save was called immediately without waiting for debounce
        expect(mockOnSaveComment).toHaveBeenCalledTimes(1);
        expect(mockOnSaveComment).toHaveBeenCalledWith(1, 'Comment for row 1');
    });

    it('should save comment when clicking outside the table', () => {
        commentsAutoSave.init(mockTable);
    
        // Add table to body to test click outside
        document.body.appendChild(mockTable);
    
        // First establish currentTaxonId by dispatching focus event
        mockTextareas[0].dispatchEvent(new Event('focus'));
        mockTextareas[0].value = 'Comment before click outside';
        mockTextareas[0].dispatchEvent(new Event('input'));
    
        // Create a click event with a specific target outside the table
        const outsideElement = document.createElement('div');
        document.body.appendChild(outsideElement);
        
        // Create event with the outside element as target
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        
        // Dispatch click on outside element
        outsideElement.dispatchEvent(clickEvent);
    
        // Verify the save was called
        expect(mockOnSaveComment).toHaveBeenCalledTimes(1);
        expect(mockOnSaveComment).toHaveBeenCalledWith(1, 'Comment before click outside');
    });

    it('should save all pending changes on destroy', () => {
        commentsAutoSave.init(mockTable);

        // Simulate changes to multiple rows
        mockTextareas[0].focus();
        mockTextareas[0].value = 'Comment 1';
        mockTextareas[0].dispatchEvent(new Event('input'));

        mockTextareas[1].focus();
        mockTextareas[1].value = 'Comment 2';
        mockTextareas[1].dispatchEvent(new Event('input'));

        // Destroy instance before debounce timer completes
        commentsAutoSave.destroy();

        // Verify both saves were called
        expect(mockOnSaveComment).toHaveBeenCalledTimes(2);
        expect(mockOnSaveComment).toHaveBeenCalledWith(1, 'Comment 1');
        expect(mockOnSaveComment).toHaveBeenCalledWith(2, 'Comment 2');
    });

    it('should save changes when textarea blur/change event fires', () => {
        commentsAutoSave.init(mockTable);

        // Simulate focus and input
        mockTextareas[0].focus();
        mockTextareas[0].value = 'Comment before blur';
        mockTextareas[0].dispatchEvent(new Event('input'));

        // Simulate blur/change event
        mockTextareas[0].dispatchEvent(new Event('change'));

        // Verify save was called immediately
        expect(mockOnSaveComment).toHaveBeenCalledTimes(1);
        expect(mockOnSaveComment).toHaveBeenCalledWith(1, 'Comment before blur');
    });

    it('should cancel pending debounced save when new input occurs', () => {
        commentsAutoSave.init(mockTable);

        // Simulate typing in a textarea
        mockTextareas[0].focus();
        mockTextareas[0].value = 'First draft';
        mockTextareas[0].dispatchEvent(new Event('input'));

        // Advance time but not enough to trigger debounce
        vi.advanceTimersByTime(50);

        // Simulate more typing
        mockTextareas[0].value = 'Updated draft';
        mockTextareas[0].dispatchEvent(new Event('input'));

        // Advance time enough to trigger the second debounce
        vi.advanceTimersByTime(100);

        // Verify save was called only once with the updated value
        expect(mockOnSaveComment).toHaveBeenCalledTimes(1);
        expect(mockOnSaveComment).toHaveBeenCalledWith(1, 'Updated draft');
    });

    it('should warn when trying to initialize a destroyed instance', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        commentsAutoSave.init(mockTable);
        commentsAutoSave.destroy();
        commentsAutoSave.init(mockTable);

        expect(consoleSpy).toHaveBeenCalledWith(
            'Attempting to initialize a destroyed CommentsAutoSave instance. Create a new instance instead.'
        );

        consoleSpy.mockRestore();
    });

    it('should clean up event listeners on destroy', () => {
        // This test ensures event listeners are properly removed
        const addEventListenerSpy = vi.spyOn(HTMLElement.prototype, 'addEventListener');
        const removeEventListenerSpy = vi.spyOn(HTMLElement.prototype, 'removeEventListener');

        commentsAutoSave.init(mockTable);
        const addCallCount = addEventListenerSpy.mock.calls.length;

        commentsAutoSave.destroy();
        expect(removeEventListenerSpy.mock.calls.length).toBe(addCallCount);

        addEventListenerSpy.mockRestore();
        removeEventListenerSpy.mockRestore();
    });

    it('should save changes before window unload', () => {
        commentsAutoSave.init(mockTable);

        // Simulate input in textarea
        mockTextareas[0].focus();
        mockTextareas[0].value = 'Save before unload';
        mockTextareas[0].dispatchEvent(new Event('input'));

        // Simulate window unload
        window.dispatchEvent(new Event('beforeunload'));

        // Verify save was called
        expect(mockOnSaveComment).toHaveBeenCalledTimes(1);
        expect(mockOnSaveComment).toHaveBeenCalledWith(1, 'Save before unload');
    });

    it('should not attempt to save if there are no changes', () => {
        commentsAutoSave.init(mockTable);

        // Focus without changing anything
        mockTextareas[0].focus();
        mockTextareas[1].focus();

        // Verify no saves were attempted
        expect(mockOnSaveComment).not.toHaveBeenCalled();
    });

    it('should handle rows without taxon_id gracefully', () => {
        // Create a row without taxon_id
        const invalidRow = document.createElement('tr');
        const invalidTextarea = document.createElement('textarea');
        invalidRow.appendChild(invalidTextarea);
        mockTable.querySelector('tbody')!.appendChild(invalidRow);

        // Should not throw an error
        expect(() => commentsAutoSave.init(mockTable)).not.toThrow();

        // Input to the invalid textarea should not trigger saves
        invalidTextarea.value = 'This should not be saved';
        invalidTextarea.dispatchEvent(new Event('input'));

        vi.advanceTimersByTime(100);
        expect(mockOnSaveComment).not.toHaveBeenCalled();
    });
});