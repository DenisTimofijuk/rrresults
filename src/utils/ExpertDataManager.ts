import { ObservationStatusChanged } from "../types/customEvents.type";
import { ObservationStatus } from "../types/ExpertDataManager.type";
import { ExpertResultData } from "../types/ExpertTableData.type";
import apiManager from "./apisManager";
import { urlParameters } from "./URLParametersHandler";

// Define API call type to make the code more generic
type ApiCallFunction<T> = (payload: T) => Promise<{ status: number, message?: string }>;

export default class ExpertDataManager {
    dataset: Map<number, ExpertResultData> = new Map();
    private pendingRequests: Map<number, Promise<any>> = new Map();
    private observationStatus: Map<number, ObservationStatus> = new Map();
    private readonly maxRetries = 2;
    private readonly retryDelay = 500; // ms
    private rowsPerPage = 20;
    private page: number = 1;

    constructor(private data: ExpertResultData[]) {}

    set itemsPerPage(rows: number) {
        this.rowsPerPage = rows;
    }

    get itemsPerPage() {
        return this.rowsPerPage;
    }

    setDataset() {
        this.dataset.clear();

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

        if (this.pendingRequests.has(taxonId)) {
            console.warn(`Request already in progress for group ${taxonId}`);
            return;
        }

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

    private _processApiRequest<T>(
        apiCall: ApiCallFunction<T>,
        payload: T,
        requestId: number,
        affectedIds: number[]
    ): void {
        const promise = this._executeWithRetry(apiCall, payload, this.maxRetries)
            .then(success => {
                const newStatus = success ? ObservationStatus.success : ObservationStatus.error;
                affectedIds.forEach(id => this._setStatus(id, newStatus));
                this._setStatus(requestId, newStatus);
                return success;
            })
            .catch(err => {
                console.error(`Final failure for request ${requestId}:`, err);
                affectedIds.forEach(id => this._setStatus(id, ObservationStatus.error));
                this._setStatus(requestId, ObservationStatus.error);
                throw err;
            })
            .finally(() => {
                this.pendingRequests.delete(requestId);
            });

        this.pendingRequests.set(requestId, promise);
    }

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

    initiateDisplayOnlyCommentsFilter(regenerateTable: (hidePagination: boolean) => void) {
        const originalButton = document.getElementById('only-with-comments') as HTMLInputElement;
        const clonedButton = originalButton.cloneNode() as HTMLInputElement;
        const parent = originalButton.parentElement as HTMLDivElement;
        parent.removeChild(originalButton);
        parent.appendChild(clonedButton);

        clonedButton.addEventListener('change', (e) => {            
            const button = e.target as HTMLInputElement;
            if (button.checked) {
                // reset all indexes
                this.itemsPerPage = this.dataset.size;
                this.currentPage = 1;
                this._setDatasetOnlyWithComments();
            } else {
                // restore all indexes from url parameters
                const itemsPerPage = urlParameters.get('items-per-page');
                const currentPage = urlParameters.get('page');
                this.itemsPerPage = itemsPerPage ? parseInt(itemsPerPage, 10) : 20;
                this.currentPage = currentPage ? parseInt(currentPage, 10) : 1;
                this.rowsPerPage = this.itemsPerPage; // Set the rows per page to the one from URL parameters
                this.setDataset(); // Reset to original dataset
            }

            regenerateTable(button.checked); // Regenerate the table with the filtered dataset
        });
    }

    private _setDatasetOnlyWithComments() {
        const data = this.data.filter(item => item.expert_review !== '');
        this.dataset.clear();
        this.observationStatus.clear(); // Clear previous observation statuses

        data.forEach(item => {
            this.dataset.set(item.taxon_id, item);
            item.observations.forEach(obs => {
                this.observationStatus.set(obs.id, ObservationStatus.idle);
            });
        });
    }
}