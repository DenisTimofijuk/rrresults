import ExpertDataManager from "./ExpertDataManager";

export function initSetPointsPerGroup(dataManager: ExpertDataManager) {
    const expertReviewContainer = document.querySelectorAll('div.expert-review-container');
    expertReviewContainer.forEach((container) => {
        const parentRow = container.closest('tr');
        const taxon_id = Number(parentRow!.getAttribute('taxon_id'));

        const pointsContainer = container.querySelector('.points-container');
        const radioButtons = pointsContainer?.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
        radioButtons?.forEach((radioButton) => {
            radioButton.addEventListener('change', (event) => {
                const selectedValue = (event.target as HTMLInputElement).value;
                if (!taxon_id) return;
                dataManager.postGroupPoints(taxon_id, Number(selectedValue));
                const observationTable = document.querySelector(`table.observation-table[data-taxon-id="${taxon_id}"]`);
                if (!observationTable) return;
                const observationRows = observationTable.querySelectorAll('tbody tr');
                observationRows.forEach((row) => {
                    const pointsRadioButtons = row.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
                    pointsRadioButtons.forEach((pointsRadioButton) => {
                        if (Number(pointsRadioButton.value) === Number(selectedValue)) {
                            pointsRadioButton.checked = true;
                        } else {
                            pointsRadioButton.checked = false;
                        }
                    });
                });
            });
        });
    });
}