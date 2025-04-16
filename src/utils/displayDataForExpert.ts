import apiManager from "./apisManager";
import { generateTableForExpert } from "../components/tableForExperts";
import ExpertDataManager from "./ExpertDataManager";
import { initCommentsAutoSave } from "./autoSaveComments";
import { generatePagination } from "../components/pagination";
import { initSetPointsPerGroup } from "./initSetPointsPerGroup";
import { PageChanged } from "../types/customEvents.type";
import { urlParameters } from "./URLParametersHandler";

export async function displayDataForExpert(selectedCategory: string) {
    const resultPlaceHolder = document.getElementById('results') as HTMLDivElement;
    const itemsPerPageSelect = document.getElementById('items-per-page') as HTMLSelectElement;
    try {
        const results = await apiManager.getObservations(selectedCategory);
        const dataManager = new ExpertDataManager(results);

        const itemsPerPage = urlParameters.get('items-per-page');
        if(itemsPerPage !== null) {
            dataManager.itemsPerPage = parseInt(itemsPerPage, 10);
            itemsPerPageSelect.value = itemsPerPage;
        }else if(itemsPerPageSelect.value !== '') {
            dataManager.itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
            urlParameters.update('items-per-page', itemsPerPageSelect.value);
        }

        const currentPage = urlParameters.get('page') || '1';
        dataManager.currentPage = parseInt(currentPage, 10);

        const pagination = createPagination(dataManager.getTotalPages(), currentPage);

        const table = generateTableForExpert(dataManager);
        resultPlaceHolder.appendChild(table);

        initSetPointsPerGroup(dataManager);
        initCommentsAutoSave(table, dataManager);

        document.getElementById('items-per-page')!.addEventListener('change', (event) => {
            const itemsPerPage = (event.target as HTMLInputElement).value;

            dataManager.currentPage = 1; // Reset to first page
            dataManager.itemsPerPage = parseInt(itemsPerPage, 10);
            
            urlParameters.update('page', '1');
            urlParameters.update('items-per-page', itemsPerPage);

            resultPlaceHolder.innerHTML = ''; // Clear previous table
            const newTable = generateTableForExpert(dataManager);
            resultPlaceHolder.appendChild(newTable);

            const newPagination = createPagination(dataManager.getTotalPages(), '1');
            newPagination.addEventListener('pageChanged', (event) => {
                pageChangeHandler(event, dataManager);
            });

            initSetPointsPerGroup(dataManager);
            initCommentsAutoSave(newTable, dataManager);
        })

        pagination.addEventListener('pageChanged', (event) => {
            pageChangeHandler(event, dataManager);
        });
    } catch (error) {
        console.error(error);
        throw new Error("Unable display data for experts.");
    } finally {
        const onlyWithCommentsInput = document.getElementById('only-with-comments') as HTMLInputElement;
        onlyWithCommentsInput.disabled = false;
    }
}

function createPagination(totalPages: number, currentPage: string) {
    const paginationWrapper = document.getElementById('review-pagination-wrapper-bottom') as HTMLDivElement;
    paginationWrapper.innerHTML = ''; // Clear previous pagination
    const pagination = generatePagination(totalPages, currentPage);
    paginationWrapper.appendChild(pagination);

    return pagination;
}

function pageChangeHandler(event: Event, dataManager: ExpertDataManager) {
    const resultPlaceHolder = document.getElementById('results') as HTMLDivElement;

    const page = (event as CustomEvent<PageChanged>).detail.page;
    dataManager.currentPage = page;
    urlParameters.update('page', page.toString());

    resultPlaceHolder.innerHTML = ''; // Clear previous table
    const table = generateTableForExpert(dataManager);
    resultPlaceHolder.appendChild(table);

    initSetPointsPerGroup(dataManager);
    initCommentsAutoSave(table, dataManager);

    // scroll page to top
    window.scrollTo({top: 0, behavior: 'smooth'});
}