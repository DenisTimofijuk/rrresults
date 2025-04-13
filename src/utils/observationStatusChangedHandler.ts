import { ObservationStatusChanged } from "../types/customEvents.type";

export function observationStatusChangedHandler(event: Event) {    
    const customEvent = event as CustomEvent;
    const details: ObservationStatusChanged = customEvent.detail ;

    const statusWrapper = document.querySelector(`div#status-wrapper-${details.id}`);

    statusWrapper?.querySelectorAll('.status-icon').forEach((element => element.classList.add('hide')))
    statusWrapper?.querySelector(`.status-icon-${details.status}`)?.classList.remove('hide');    
}