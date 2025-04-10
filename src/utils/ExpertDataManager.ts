import { ObservationStatus, ObservationStatusChangeEventDetails } from "../types/ExpertDataManager.type";
import { ExperResultData } from "../types/ExpertTableData.type";
import apiManager from "./apisManager";

export default class ExpertDataManager {
    dataset: Map<number, ExperResultData> = new Map();
    private pendingRequests: Map<number, Promise<any>> = new Map();
    private observationStatus: Map<number, ObservationStatus> = new Map();
    private maxRetries = 2;

    constructor(data: ExperResultData[]) {
        data.forEach((row) => {
            this.dataset.set(row.taxon_id, row);
            row.observations.forEach(obs => {
                this.observationStatus.set(obs.id, ObservationStatus.idle);
            });
        });
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

    setObservationPoints(taxonId: number, observationId: number, points: number): void {
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
        this.observationStatus.set(observation.id, ObservationStatus.pending);
        this._setStatus(observationId, ObservationStatus.pending);

        const payload = [{ observation_id: observation.id, points }];
        const postPromise = this._getPostPromise(payload, observationId, [observationId]);
        this.pendingRequests.set(observationId, postPromise);
    }

    setGroupPoints(taxonId: number, points: number) {
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

        const postPromise = this._getPostPromise(payload, taxonId, observations.map(obs => obs.id))
        this.pendingRequests.set(taxonId, postPromise);
    }

    private async _getPostPromise(payload: {
        observation_id: number;
        points: number;
    }[], id: number, observationIDs: number[]) {
        return this._postWithRetry(payload, this.maxRetries)
            .then(success => {
                const newStatus = success ? ObservationStatus.success : ObservationStatus.error;
                observationIDs.forEach(obsid => {
                    this._setStatus(obsid, newStatus);
                });
                this._setStatus(id, newStatus);
            })
            .catch(err => {
                console.error(`Final failure for group ${id}:`, err);
                observationIDs.forEach(obsid => this._setStatus(obsid, ObservationStatus.error));
                this._setStatus(id, ObservationStatus.error);
            })
            .finally(() => {
                this.pendingRequests.delete(id);
            });
    }

    setComment(taxonId: number, comment: string): void {
        if (!this.getRowData(taxonId)) return;
        this.getRowData(taxonId)!.expert_review = comment;
    }

    // Retry logic with delay
    private async _postWithRetry(payload: { observation_id: number, points: number }[], retries: number): Promise<boolean> {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const result = await apiManager.savePointsForObservations(payload);
                if (result.status === 200) return true;
                console.warn(`Attempt ${attempt + 1} failed:`, result.message);
            } catch (err) {
                console.warn(`Attempt ${attempt + 1} threw error:`, err);
            }
            await this._delay(500);
        }
        return false;
    }

    private _delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private _setStatus(id: number, status: ObservationStatus) {
        this.observationStatus.set(id, status);
        this._emitStatusUpdate(id, status);
    }

    // Emit a custom DOM event so your UI (vanilla JS) can respond
    private _emitStatusUpdate(id: number, status: ObservationStatus) {
        const event = new CustomEvent('observationStatusChanged', {
            detail : { id, status } as ObservationStatusChangeEventDetails
        });
        document.dispatchEvent(event);
    }
}