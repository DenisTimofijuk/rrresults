import { ObservationStatus } from "../types/ExpertDataManager.type";

export function createStatusElement(id: number) {
    const wrapper = document.createElement('div');
    wrapper.id = `status-wrapper-${id}`;
    wrapper.className = 'status-wrapper';

    const pending = document.createElement('i');
    pending.className = `bi bi-hourglass text-info status-icon status-icon-${ObservationStatus.pending} hide`;
    wrapper.appendChild(pending)

    const success = document.createElement('i');
    success.className = `bi bi-check2-circle text-success status-icon status-icon-${ObservationStatus.success} hide`
    wrapper.appendChild(success);

    const error = document.createElement('i');
    error.className = `bi bi-exclamation-triangle text-danger status-icon status-icon-${ObservationStatus.error} hide`;
    wrapper.appendChild(error);

    
    return wrapper;
}