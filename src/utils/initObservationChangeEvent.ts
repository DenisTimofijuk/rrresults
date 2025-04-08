import ExpertManager from "./ExpertManager";

export function initObservationChangeEvent(dataManager: ExpertManager, observationTable: HTMLTableElement) {
    console.log("initObservationChangeEvent", observationTable);

    const radioButtons = observationTable.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    radioButtons?.forEach((radioButton) => {
        radioButton.addEventListener('change', (event) => {
            const selectedValue = (event.target as HTMLInputElement).value;
            const parentRow = (event.target as HTMLInputElement).closest('tr');
            const observationId = Number(parentRow!.getAttribute('data-observation-id'));
            const parentTable = parentRow?.closest('table');
            const taxon_id = Number(parentTable?.getAttribute('data-taxon-id'));

            if (!taxon_id || !observationId) {
                console.error("Taxon ID or Observation ID not found.");
                return
            };
            dataManager.setObservationPoints(taxon_id, observationId, Number(selectedValue));

            const groupValidationValue = dataManager.hasObservationGroupSamePoints(taxon_id) ? Number(selectedValue) : "-Mixed";

            const mainTable = document.getElementById('expert-table') as HTMLTableElement;
            const input = mainTable.querySelector(`tr[taxon_id="${taxon_id}"] .points-container input[type="radio"][value="${groupValidationValue}"]`) as HTMLInputElement;
            input.checked = true;
        });
    });
}