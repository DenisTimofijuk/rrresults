import { Collapse } from "bootstrap";
import { createTableForObservations } from "../components/observationTable";
import ExpertManager from "./ExpertManager";
import { initObservationChangeEvent } from "./initObservationChangeEvent";

export function generateSectionForObservations(taxon_id: number, dataManager: ExpertManager, referenceButton: HTMLButtonElement) {
    const newRowForObservations = document.createElement('tr');
    newRowForObservations.id = `observations-${taxon_id}`;
    newRowForObservations.classList.add('collapse');

    const newCellForObservations = document.createElement('td');
    newCellForObservations.colSpan = dataManager.getHeaderColumnOrder().length;
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
            const radioButtons = observationsTable.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
            radioButtons.forEach((radioButton) => {
                radioButton.addEventListener('change', (event: Event) => {
                    const selectedValue = (event.target as HTMLInputElement).value;
                    dataManager.setObservationPoints(taxon_id, Number(newRowForObservations.dataset['observationId']), Number(selectedValue));
                });
            });

            initObservationChangeEvent(dataManager, observationsTable);
        }
    });

    newRowForObservations.addEventListener('hidden.bs.collapse', () => {
        referenceButton.classList.remove('active');
    });

    return newRowForObservations;
}