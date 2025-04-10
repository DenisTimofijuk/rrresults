import { Collapse } from "bootstrap";
import { createTableForObservations } from "../components/observationTable";
import ExpertDataManager from "./ExpertDataManager";
import { initObservationChangeEvent } from "./initObservationChangeEvent";

export function generateSectionForObservations(taxon_id: number, dataManager: ExpertDataManager, referenceButton: HTMLButtonElement) {
    const newRowForObservations = document.createElement('tr');
    newRowForObservations.id = `observations-${taxon_id}`;
    newRowForObservations.classList.add('collapse');

    const newCellForObservations = document.createElement('td');
    newCellForObservations.colSpan = dataManager.getHeaderColumnOrder().length+1;
    newRowForObservations.appendChild(newCellForObservations);

    new Collapse(newRowForObservations, {
        toggle: false // Prevent automatic toggling
    });

    newRowForObservations.addEventListener('show.bs.collapse', () => {
        referenceButton.classList.add('active');
        const isExpanded = newRowForObservations.getAttribute('aria-expanded') === 'true';

        if (!isExpanded) {
            newRowForObservations.setAttribute('aria-expanded', 'true');
            const observationsTable = createTableForObservations(dataManager.getRowData(taxon_id)!.observations, dataManager.getObservationColumnOreder());
            observationsTable.setAttribute('data-taxon-id', taxon_id.toString());
            newCellForObservations.appendChild(observationsTable);
            initObservationChangeEvent(dataManager, observationsTable);
        }
    });

    newRowForObservations.addEventListener('hidden.bs.collapse', () => {
        referenceButton.classList.remove('active');
    });

    return newRowForObservations;
}