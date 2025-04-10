import { initResultTable } from './components/resultTableAnimated';
import './scss/results.scss';
import './style.css';
import './styles/loader.css';
import { ResultData } from './types/Rezults.type';
import apiManager from './utils/apisManager';
import ColumnDisplayManager from './utils/ColumnDisplayManager';
import { displayAlert, hideAlert } from './utils/errorHandler';
// import { resetProgress, revealNextColumnAnimated, revielCurrentColumns } from './utils/revealNextColumn';
import { getURLParameter, updateURLParameter } from './utils/URLParametersHandler';

(async () => {
    const loader = document.getElementById('loader-wrapper') as HTMLDivElement;
    const getDataByYearButton = document.getElementById('get-data-by-year') as HTMLButtonElement;
    const yearSelect = document.getElementById('year-selected') as HTMLSelectElement;
    const revealNextButton = document.getElementById('reveal-next') as HTMLButtonElement;
    const placeHolder = document.getElementById('results') as HTMLDivElement;
    const yearPlaceHolder = document.getElementById('year-place-holder') as HTMLSpanElement;

    const allreadyRevieledColumns = getURLParameter('column');
    const allreadyRevieledYear = getURLParameter('year');

    try {
        loader.classList.remove('hide');
        const availableYears = await apiManager.getAvailableYears();
        availableYears.forEach((value) => {
            const option = document.createElement('option');
            option.value = value.toString();
            option.textContent = value.toString();
            yearSelect.appendChild(option);
        });
        loader.classList.add('hide');

        if (allreadyRevieledYear) {
            yearSelect.value = allreadyRevieledYear;
            yearPlaceHolder.textContent = allreadyRevieledYear;
        }
    } catch (error) {
        displayAlert();
    }

    let currentTable: HTMLTableElement | null = null;
    let currentData: ResultData | null = null;
    const columnManager = new ColumnDisplayManager(currentData, currentTable);

    if (allreadyRevieledColumns && allreadyRevieledYear) {
        await processDataForUsers(allreadyRevieledYear);

        const column = parseInt(allreadyRevieledColumns);
        if (currentData && currentTable) {
            console.log('restoring progress', column);

            columnManager.revealColumnsUpToIndex(column);
        } else {
            console.error("Error: unable to restore current progress. Missing column value or data or table is not yet initiated.");
        }
    }



    revealNextButton.addEventListener('click', () => {
        if (currentData && currentTable) {
            // revealNextColumnAnimated(currentData, currentTable);
            columnManager.revealNextColumnAnimated();
        }
    });

    getDataByYearButton.addEventListener('click', async () => {
        const selectedValue = yearSelect.value;
        if (!selectedValue) return;

        updateURLParameter('year', yearSelect.value);
        hideAlert();

        yearPlaceHolder.textContent = yearSelect.value;

        if (currentTable) {
            placeHolder.removeChild(currentTable);
            columnManager.resetProgress();
        }

        processDataForUsers(selectedValue);
    });

    async function processDataForUsers(selectedYear: string,) {
        try {
            loader.classList.remove('hide');
            revealNextButton.classList.add('hide');
            currentData = await apiManager.getResultsByYear(selectedYear);
            currentTable = initResultTable(currentData);
            columnManager.updateSources(currentData, currentTable);
            placeHolder.appendChild(currentTable);
            loader.classList.add('hide');
            revealNextButton.classList.remove('hide');
        } catch (error) {
            displayAlert();
        }
    }

    // const results = await fetchINaturalistObservations();
    // console.log(results);
})();