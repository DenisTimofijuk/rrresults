import apiManager from "./apisManager";
import { displayAlert } from "./errorHandler";
import { generateTableForExpert } from "../components/tableForExperts";
import ExpertManager from "./ExpertManager";

export async function displayDataForExpert(loader: HTMLElement | null, resultPlaceHolder: HTMLElement, selectedYear: string, selectedCategory: string) {
    try {
        loader?.classList.remove('hide');
        const results = await apiManager.getObservations(selectedYear, selectedCategory);
        const dataManager = new ExpertManager(results);
        const table = generateTableForExpert(dataManager);
        resultPlaceHolder.appendChild(table);

        // set validation points for corresponding observations table
        const expertReviewContainer = document.querySelectorAll('div.expert-review-container');
        expertReviewContainer.forEach((container) => {
            const parentRow = container.closest('tr');
            const taxon_id = Number(parentRow!.getAttribute('taxon_id'));

            const textarea = container.querySelector('textarea');
            textarea?.addEventListener('change', (event) => {
                const target = event.target as HTMLTextAreaElement;
                const value = target.value;
                if(!taxon_id) return;
                dataManager.setComment(taxon_id, value);
            });

            const pointsContainer = container.querySelector('.points-container');
            const radioButtons = pointsContainer?.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
            radioButtons?.forEach((radioButton) => {
                radioButton.addEventListener('change', (event) => {
                    const selectedValue = (event.target as HTMLInputElement).value;
                    if(!taxon_id) return;
                    dataManager.setGroupPoints(taxon_id, Number(selectedValue));
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

        // listen changes for radio inputs form-check-input.btn-check on table.observation-table
        // update dataManager with the selected value
        // set validation points for corresponding expert-review-container 
    } catch (error) {
        displayAlert();
    } finally {
        loader?.classList.add('hide');
    }
}