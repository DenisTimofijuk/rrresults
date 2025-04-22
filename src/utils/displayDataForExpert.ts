import apiManager from "./apisManager";
import { generateTableForExpert } from "../components/tableForExperts";
import ExpertDataManager from "./ExpertDataManager";
import { generatePagination } from "../components/pagination";
import { initSetPointsPerGroup } from "./initSetPointsPerGroup";
import { PageChanged } from "../types/customEvents.type";
import { urlParameters } from "./URLParametersHandler";
import { CommentsAutoSave } from "./CommentsAutoSave";

let currentAutoSave: CommentsAutoSave | null = null;

export async function displayDataForExpert(selectedCategory: string) {
    const itemsPerPageSelect = document.getElementById('items-per-page') as HTMLSelectElement;

    try {
        const results = await apiManager.getObservations(selectedCategory);
        const dataManager = new ExpertDataManager(results);

        const itemsPerPage = urlParameters.get('items-per-page');
        if (itemsPerPage !== null) {
            dataManager.itemsPerPage = parseInt(itemsPerPage, 10);
            itemsPerPageSelect.value = itemsPerPage;
        } else if (itemsPerPageSelect.value !== '') {
            dataManager.itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
            urlParameters.update('items-per-page', itemsPerPageSelect.value);
        }

        const currentPage = urlParameters.get('page') || '1';
        dataManager.currentPage = parseInt(currentPage, 10);
        dataManager.setDataset();

        const pagination = createPagination(dataManager.getTotalPages(), currentPage);

        updateTable(dataManager);
        initSetPointsPerGroup(dataManager);

        dataManager.initiateDisplayOnlyCommentsFilter((hidePagination) => {
            updateTable(dataManager);
            initSetPointsPerGroup(dataManager);

            if (hidePagination) {
                document.getElementById('review-pagination-wrapper-bottom')!.classList.add('hide');
            } else {
                document.getElementById('review-pagination-wrapper-bottom')!.classList.remove('hide');
            }
        })

        document.getElementById('items-per-page')!.addEventListener('change', (event) => {
            const itemsPerPage = (event.target as HTMLInputElement).value;

            dataManager.currentPage = 1;
            dataManager.itemsPerPage = parseInt(itemsPerPage, 10);
            dataManager.setDataset()

            urlParameters.update('page', '1');
            urlParameters.update('items-per-page', itemsPerPage);

            updateTable(dataManager);
            initSetPointsPerGroup(dataManager);

            const newPagination = createPagination(dataManager.getTotalPages(), '1');
            newPagination.addEventListener('pageChanged', (event) => {
                pageChangeHandler(event, dataManager);
            });
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
    paginationWrapper.innerHTML = '';
    const pagination = generatePagination(totalPages, currentPage);
    paginationWrapper.appendChild(pagination);

    return pagination;
}

function pageChangeHandler(event: Event, dataManager: ExpertDataManager) {
    const page = (event as CustomEvent<PageChanged>).detail.page;
    dataManager.currentPage = page;
    urlParameters.update('page', page.toString());
    dataManager.setDataset();

    updateTable(dataManager);
    initSetPointsPerGroup(dataManager);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateTable(dataManager: ExpertDataManager) {
    if (currentAutoSave) {
        currentAutoSave.destroy();
        currentAutoSave = null;
    }

    const newTable = generateTableForExpert(dataManager);
    const container = document.getElementById('results') as HTMLDivElement;
    container.innerHTML = '';
    container.appendChild(newTable);

    currentAutoSave = new CommentsAutoSave({
        onSaveComment: async (taxonId, comment) => dataManager.postComment(taxonId, comment)
    });

    currentAutoSave.init(newTable);
}