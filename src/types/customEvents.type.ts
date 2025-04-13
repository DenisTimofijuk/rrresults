import { ObservationStatus } from "./ExpertDataManager.type";

export type PageChanged = {
    page: number;
}

export type ObservationStatusChanged = {
    id: number;
    status: ObservationStatus;
}