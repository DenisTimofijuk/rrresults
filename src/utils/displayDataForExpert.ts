import apiManager from "./apisManager";
import { generateTableForExpert } from "../components/tableForExperts";
import ExpertDataManager from "./ExpertDataManager";
import { initCommentsAutoSave } from "./autoSaveComments";
import { generatePagination } from "../components/pagination";
import { initSetPointsPerGroup } from "./initSetPointsPerGroup";
import { PageChanged } from "../types/customEvents.type";
import { urlParameters } from "./URLParametersHandler";

export async function displayDataForExpert(resultPlaceHolder: HTMLElement, selectedCategory: string) {
    try {
        const results = await apiManager.getObservations(selectedCategory);
        const dataManager = new ExpertDataManager(results);

        const currentPage = urlParameters.get('page') || '1';
        dataManager.currentPage = parseInt(currentPage, 10);

        createPaginations(['review-pagination-wrapper-bottom'], dataManager.getTotalPages(), currentPage);
        
        const table = generateTableForExpert(dataManager);
        resultPlaceHolder.appendChild(table);

        initSetPointsPerGroup(dataManager);
        initCommentsAutoSave(table, dataManager);

        document.addEventListener('pageChanged', (event) => {
            const page = (event as CustomEvent<PageChanged>).detail.page;
            dataManager.currentPage = page;
            urlParameters.update('page', page.toString());

            resultPlaceHolder.innerHTML = ''; // Clear previous table
            const table = generateTableForExpert(dataManager);
            resultPlaceHolder.appendChild(table);

            initSetPointsPerGroup(dataManager);
            initCommentsAutoSave(table, dataManager);
        });
    } catch (error) {
        console.error(error);
        throw new Error("Unable display data for experts.");
    } finally {
        const onlyWithCommentsInput = document.getElementById('only-with-comments') as HTMLInputElement;
        onlyWithCommentsInput.disabled = false;
    }
}

function createPaginations(ids: string[], totalPages: number, currentPage: string) {
    ids.forEach((id) => {
        const paginationWrapper = document.getElementById(id) as HTMLDivElement;
        paginationWrapper.innerHTML = ''; // Clear previous pagination
        paginationWrapper.appendChild(generatePagination(totalPages, currentPage));
    })
}