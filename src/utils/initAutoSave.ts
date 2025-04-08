import apiManager from "./apisManager";

// @deprecated
// This function is deprecated and will be removed in future versions. Use Manager isntead
export function initAutoSave(table: HTMLTableElement) {
    const rows = table.querySelectorAll('tbody tr');
    const debounceDelay = 1500; // 1 second delay
    let saveTimers: { [key: string]: number } = {};
    let currentRowId: string | null = null;
    let pendingSaves: { [key: string]: { points?: number, comments?: string } } = {};

    // Track which row user is currently focused on
    const trackFocus = (observationId: string) => {
        if (currentRowId !== observationId) {
            // User moved to a new row, save any pending data for previous row
            if (currentRowId && pendingSaves[currentRowId]) {
                const previousRow = Array.from(rows).find(r =>
                    (r as HTMLElement).dataset['observationId'] === currentRowId
                ) as HTMLTableRowElement;

                saveReviewData(currentRowId, pendingSaves[currentRowId], (isDataSaved) => {
                    if (previousRow) {  // Make sure we have reference to the previous row
                        handleRowAnimation({ row: previousRow, isDataSaved });
                    }
                });
                delete pendingSaves[currentRowId];
                //handle remaining timers
                if (saveTimers[currentRowId]) {
                    window.clearTimeout(saveTimers[currentRowId]);
                    delete saveTimers[currentRowId];
                }
            }
            currentRowId = observationId;
        }
    };

    // Setup handlers for each row
    rows.forEach((row) => {
        const pointInputs = row.querySelectorAll('input[type="radio"]');
        const commentInput = row.querySelector('textarea') as HTMLTextAreaElement;
        const observationId = (row as HTMLElement).dataset['observationId'];

        if (!observationId) {
            console.error('Observation ID not found for row:', row);
            return;
        }

        // Initialize pending saves object for this row
        pendingSaves[observationId] = {};

        // Add focus tracking to all interactive elements
        [...pointInputs, commentInput].forEach(el => {
            el.addEventListener('focus', () => trackFocus(observationId));
        });

        // Debounced save function specific to this row
        const debouncedSave = (data: { points?: number, comments?: string }) => {
            // Clear any existing timer for this row
            if (saveTimers[observationId]) {
                window.clearTimeout(saveTimers[observationId]);
            }

            // Update pending data
            pendingSaves[observationId] = {
                ...pendingSaves[observationId],
                ...data
            };

            // Set new timer
            saveTimers[observationId] = window.setTimeout(() => {
                if (Object.keys(pendingSaves[observationId]).length > 0) {
                    saveReviewData(observationId, pendingSaves[observationId], (isDataSaved) => {
                        handleRowAnimation({ row: row as HTMLTableRowElement, isDataSaved });
                    });
                    pendingSaves[observationId] = {};
                }
            }, debounceDelay);
        };

        // Set up radio button change handlers
        pointInputs.forEach((input) => {
            input.addEventListener('change', () => {
                row.classList.remove('table-danger');
                row.classList.remove('table-success');
                debouncedSave({
                    points: parseFloat((input as HTMLInputElement).value)
                });
            });
        });

        // Set up textarea handlers - only debounce input events, not change events
        commentInput.addEventListener('change', () => {
            // Immediate save on blur/change
            if (pendingSaves[observationId]?.comments !== undefined) {
                saveReviewData(observationId, {
                    comments: commentInput.value
                }, (isDataSaved) => {
                    handleRowAnimation({ row: row as HTMLTableRowElement, isDataSaved });
                });
                delete pendingSaves[observationId].comments;
            }
        });

        commentInput.addEventListener('input', () => {
            row.classList.remove('table-danger');
            row.classList.remove('table-success');
            debouncedSave({
                comments: commentInput.value
            });
        });
    });

    // Add event listener for when user leaves the table entirely
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!table.contains(target)) {
            // User clicked outside the table, save any pending changes
            if (currentRowId && pendingSaves[currentRowId]) {
                saveReviewData(currentRowId, pendingSaves[currentRowId]);
                pendingSaves[currentRowId] = {};
            }
        }
    });

    // Save any pending changes before page unload
    window.addEventListener('beforeunload', () => {
        Object.keys(pendingSaves).forEach(rowId => {
            if (Object.keys(pendingSaves[rowId]).length > 0) {
                saveReviewData(rowId, pendingSaves[rowId]);
            }
        });
    });
}

async function saveReviewData(rowId: string, data: { points?: number, comments?: string }, callback: (isDataSaved: boolean) => void = () => { }) {
    if (data.points === undefined && data.comments === undefined) return;
    if (!rowId) return;

    // fetch api and handle response animations
    try {
        const response = await apiManager.saveExpertReview(parseInt(rowId), data)
        callback(response.status === 200);
    } catch (error) {
        console.error('Error saving review data:', error);
        callback(false);
    }
}

interface RowAnimationParams {
    row: HTMLTableRowElement;
    isDataSaved: boolean;
}

function handleRowAnimation(params: RowAnimationParams) {
    const { row, isDataSaved } = params;
    if (isDataSaved) {
        row.classList.remove('table-danger');
        row.classList.add('table-success');
    } else {
        row.classList.remove('table-success');
        row.classList.add('table-danger');
    }
}