import { ObservationStatusChanged } from "../types/customEvents.type";
import { ObservationStatus } from "../types/ExpertDataManager.type";
import { ExperResultData } from "../types/ExpertTableData.type";
import apiManager from "./apisManager";

// Define API call type to make the code more generic
type ApiCallFunction<T> = (payload: T) => Promise<{ status: number, message?: string }>;

export default class ExpertDataManager {
    dataset: Map<number, ExperResultData> = new Map();
    private pendingRequests: Map<number, Promise<any>> = new Map();
    private observationStatus: Map<number, ObservationStatus> = new Map();
    private readonly maxRetries = 2;
    private readonly retryDelay = 500; // ms
    readonly rowsPerPage = 20;
    private page: number = 1;

    constructor(private data: ExperResultData[]) {
        this.setDataset();
    }

    setDataset() {
        const startIdx = (this.currentPage - 1) * this.rowsPerPage;
        const endIdx = Math.min(startIdx + this.rowsPerPage, this.data.length);

        for (let i = startIdx; i < endIdx; i++) {
            this.dataset.set(this.data[i].taxon_id, this.data[i]);
            this.data[i].observations.forEach(obs => {
                this.observationStatus.set(obs.id, ObservationStatus.idle);
            });
        };
    }

    set currentPage(page: number) {
        if (page < 1) {
            this.page = 1;
        } else if (page > this.getTotalPages()) {
            this.page = this.getTotalPages();
        } else {
            this.page = page;
        }

        this.dataset.clear(); // Clear the current dataset
        this.setDataset(); // Re-populate the dataset for the new page
    }

    get currentPage() {
        return this.page;
    }

    getTotalPages() {
        return Math.ceil(this.data.length / this.rowsPerPage);
    }

    getObservationStatus(observationId: number) {
        return this.observationStatus.get(observationId) ?? ObservationStatus.idle;
    }

    getHeaderColumnOrder() {
        const firstValue = this.dataset.values().next().value;
        return firstValue ? Object.keys(firstValue).filter((key) => key !== "taxon_id") : [];
    }

    getObservationColumnOreder() {
        const firstValue = this.dataset.values().next().value;
        return firstValue && firstValue.observations.length > 0 ? Object.keys(firstValue.observations[0]) : [];
    }

    getRowData(taxonId: number) {
        return this.dataset.get(taxonId);
    }

    hasObservationGroupSamePoints(taxonId: number): boolean {
        const observations = this.getRowData(taxonId)?.observations;
        if (!observations) return false;
        const firstPoints = observations[0].points;

        return observations.every((observation) => observation.points === firstPoints);
    }

    postObservationPoints(taxonId: number, observationId: number, points: number): void {
        const row = this.getRowData(taxonId);
        const observation = row?.observations.find(o => o.id === observationId);

        if (!observation) {
            console.error("Observation not found:", observationId);
            return;
        }

        // Avoid duplicate requests
        if (this.pendingRequests.has(observationId)) {
            console.warn(`Request already in progress for observation ${observationId}`);
            return;
        }

        observation.points = points;
        this._setStatus(observation.id, ObservationStatus.pending);

        const payload = [{ observation_id: observation.id, points }];
        const affectedIds = [observationId];
        this._processApiRequest(
            apiManager.savePointsForObservations,
            payload,
            observationId,
            affectedIds
        );
    }

    postGroupPoints(taxonId: number, points: number): void {
        const row = this.getRowData(taxonId);
        if (!row) {
            console.error("Taxon not found:", taxonId);
            return;
        }

        const observations = row.observations;
        if (observations.length === 0) return;

        // Avoid duplicate submissions for this group
        if (this.pendingRequests.has(taxonId)) {
            console.warn(`Request already in progress for group ${taxonId}`);
            return;
        }

        // Prepare payload and update local data
        const payload = observations.map(obs => {
            obs.points = points;
            this._setStatus(obs.id, ObservationStatus.pending);
            return { observation_id: obs.id, points };
        });
        this._setStatus(taxonId, ObservationStatus.pending);

        const affectedIds = observations.map(obs => obs.id);
        this._processApiRequest(
            apiManager.savePointsForObservations,
            payload,
            taxonId,
            affectedIds
        );
    }

    postComment(taxonID: number, comment?: string): void {
        if (!this.getRowData(taxonID) || comment === undefined) return;

        this.getRowData(taxonID)!.expert_review = comment;
        this._setStatus(taxonID, ObservationStatus.pending);

        const payload = { taxonID, comment };
        const affectedIds = [taxonID];
        this._processApiRequest(
            apiManager.saveReviewComment,
            payload,
            taxonID,
            affectedIds
        );
    }

    /**
     * Generic method to process API requests with retry logic
     * @param apiCall The API function to call
     * @param payload The payload to send
     * @param requestId Unique identifier for the request
     * @param affectedIds IDs that should be updated with status changes
     */
    private _processApiRequest<T>(
        apiCall: ApiCallFunction<T>,
        payload: T,
        requestId: number,
        affectedIds: number[]
    ): void {
        // Register the request as pending
        const promise = this._executeWithRetry(apiCall, payload, this.maxRetries)
            .then(success => {
                const newStatus = success ? ObservationStatus.success : ObservationStatus.error;
                // Update status for all affected IDs
                affectedIds.forEach(id => this._setStatus(id, newStatus));
                // Also update the main request ID status
                this._setStatus(requestId, newStatus);
                return success;
            })
            .catch(err => {
                console.error(`Final failure for request ${requestId}:`, err);
                // Update status for all affected IDs to error
                affectedIds.forEach(id => this._setStatus(id, ObservationStatus.error));
                // Also update the main request ID status
                this._setStatus(requestId, ObservationStatus.error);
                throw err;
            })
            .finally(() => {
                // Clean up the pending request
                this.pendingRequests.delete(requestId);
            });

        this.pendingRequests.set(requestId, promise);
    }

    /**
     * Generic retry mechanism for API calls
     * @param apiCall The API function to call
     * @param payload The payload to send
     * @param retries Number of retries allowed
     * @returns Promise resolving to success status
     */
    private async _executeWithRetry<T>(
        apiCall: ApiCallFunction<T>,
        payload: T,
        retries: number
    ): Promise<boolean> {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const result = await apiCall(payload);
                if (result.status === 200) return true;
                console.warn(`Attempt ${attempt + 1} failed:`, result.message);
            } catch (err) {
                console.warn(`Attempt ${attempt + 1} threw error:`, err);
                if (attempt === retries) throw err; // Re-throw on final attempt
            }

            if (attempt < retries) {
                await this._delay(this.retryDelay);
            }
        }
        return false;
    }

    private _delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private _setStatus(id: number, status: ObservationStatus): void {
        this.observationStatus.set(id, status);
        this._emitStatusUpdate(id, status);
    }

    private _emitStatusUpdate(id: number, status: ObservationStatus): void {
        const event = new CustomEvent<ObservationStatusChanged>('observationStatusChanged', {
            detail: { id, status }
        });
        document.dispatchEvent(event);
    }
}