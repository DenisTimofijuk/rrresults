export enum ObservationStatus { idle, pending, success, error};

export type ObservationStatusChangeEventDetails = { 
    id: number;
    status: ObservationStatus
}