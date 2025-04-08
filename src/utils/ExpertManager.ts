import { ExperResultData } from "../types/ExpertTableData.type";

export default class ExpertManager {
    dataset: Map<number,  ExperResultData>;
    constructor(data: ExperResultData[]) {
        this.dataset = new Map();
        data.forEach((rowData) => {
            this.dataset.set(rowData.taxon_id, rowData);
        });
    }

    getHeaderColumnOrder(){
        const firstValue = this.dataset.values().next().value;
        return firstValue ? Object.keys(firstValue).filter((key) => key !== "taxon_id") : [];
    }

    getObservationColumnOreder(){
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
        const observations = this.getRowData(taxonId)?.observations;
        if (!observations) {
            console.error("No observations found for taxonId:", taxonId);
            return
        };

        const observation = observations.find((obs) => obs.id === observationId);
        if (observation) {
            observation.points = points;
        }
    }

    setGroupPoints(taxonId: number, points: number): void {
        const observations = this.getRowData(taxonId)?.observations;
        if (!observations) {
            console.error("No observations found for taxonId:", taxonId);
            return;
        }

        observations.forEach((observation) => {
            observation.points = points;
        });
    }

    setComment(taxonId: number, comment: string): void {
        if (!this.getRowData(taxonId)) return;
        this.getRowData(taxonId)!.expert_review = comment;
    }
}