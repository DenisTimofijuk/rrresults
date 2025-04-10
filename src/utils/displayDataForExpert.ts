import apiManager from "./apisManager";
import { generateTableForExpert } from "../components/tableForExperts";
import ExpertDataManager from "./ExpertDataManager";
import { Collapse } from "bootstrap";
import { observationStatusChangedHandler } from "./observationStatusChanged";
import { initCommentsAutoSave } from "./autoSaveComments";

export async function displayDataForExpert(resultPlaceHolder: HTMLElement, selectedCategory: string) {
    try {
        const results = await apiManager.getObservations(selectedCategory);
        const dataManager = new ExpertDataManager(results);
        const table = generateTableForExpert(dataManager);
        resultPlaceHolder.appendChild(table);

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

        const onlyWithCommentsInput = document.getElementById('only-with-comments') as HTMLInputElement;
        onlyWithCommentsInput.addEventListener('change', () => {
            const table = resultPlaceHolder.querySelector('table#expert-table');
            if (table) {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const comment = row.querySelector('textarea');
                    if (comment) {
                        row.classList.toggle('hide', onlyWithCommentsInput.checked && comment.value === '');
                    }

                    if (row.classList.contains('collapse')) {
                        const collapse = Collapse.getInstance(row);
                        collapse?.hide();
                    }
                });
            }
        });

        initCommentsAutoSave(table, dataManager);

        document.addEventListener('observationStatusChanged', observationStatusChangedHandler)
    } catch (error) {
        console.error(error);
        throw new Error("Unable display data for experts.");
    }
}