import apiManager from "./apisManager";
import { generateTableForExpert } from "../components/tableForExperts";
import ExpertDataManager from "./ExpertDataManager";
import { initCommentsAutoSave } from "./autoSaveComments";
import { generatePagination } from "../components/pagination";
import { initSetPointsPerGroup } from "./initSetPointsPerGroup";
import { PageChanged } from "../types/customEvents.type";

export async function displayDataForExpert(resultPlaceHolder: HTMLElement, selectedCategory: string) {
    try {
        const results = await apiManager.getObservations(selectedCategory);
        const dataManager = new ExpertDataManager(results);

        // TODO: implement SPA
        // generate pagination
        // regenarate table depending on pagination active item

        // TODO: generate table if url has page param

        const paginationWrapper = document.getElementById('review-pagination-wrapper') as HTMLDivElement;
        paginationWrapper.innerHTML = ''; // Clear previous pagination
        paginationWrapper.appendChild(generatePagination(dataManager.getTotalPages()));

        const table = generateTableForExpert(dataManager);
        resultPlaceHolder.appendChild(table);

        initSetPointsPerGroup(dataManager);
        initCommentsAutoSave(table, dataManager);

        // listen for an CustomEvenPageChanged event when the page is changed
        document.addEventListener('pageChanged', (event) => {
            // paginationWrapper.querySelectorAll('li.page-item').forEach((item) => {
            //     item.classList.add('disabled');
            // });

            const page = (event as CustomEvent<PageChanged>).detail.page;
            dataManager.currentPage = page;

            resultPlaceHolder.innerHTML = ''; // Clear previous table
            const table = generateTableForExpert(dataManager);
            resultPlaceHolder.appendChild(table);

            initSetPointsPerGroup(dataManager);
            initCommentsAutoSave(table, dataManager);

            // paginationWrapper.querySelectorAll('li.page-item').forEach((item) => {
            //     item.classList.remove('disabled');
            // });
        });

        // and regenerate the table
    } catch (error) {
        console.error(error);
        throw new Error("Unable display data for experts.");
    } finally {
        const onlyWithCommentsInput = document.getElementById('only-with-comments') as HTMLInputElement;
        onlyWithCommentsInput.disabled = false;
    }
}