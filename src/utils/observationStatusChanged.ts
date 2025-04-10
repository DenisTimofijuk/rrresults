import { ObservationStatusChangeEventDetails } from "../types/ExpertDataManager.type";

export function observationStatusChangedHandler(event: Event) {
    const customEvent = event as CustomEvent;
    const details = customEvent.detail as ObservationStatusChangeEventDetails;

    const statusWrapper = document.querySelector(`div#status-wrapper-${details.id}`);

    statusWrapper?.querySelectorAll('.status-icon').forEach((element => element.classList.add('hide')))
    statusWrapper?.querySelector(`.status-icon-${details.status}`)?.classList.remove('hide');    
}