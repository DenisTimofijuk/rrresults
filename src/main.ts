import { initResultTable } from './components/resultTableAnimated';
import { getJSONData } from './data/getData';
import './scss/styles.scss';
import './style.css';
import './styles/loader.css';
import { ResultData } from './types/Rezults.type';
import { displayAlert, hideAlert } from './utils/errorHandler';
import { resetProgress, revealNextColumn } from './utils/revealNextColumn';
// import * as bootstrap from 'bootstrap'

(async () => {
    const loader = document.getElementById('loader-wrapper');
    const getDataByYearButton = document.getElementById('get-data-by-year') as HTMLButtonElement;
    const yearSelected = document.getElementById('year-selected') as HTMLSelectElement;
    const revealNext = document.getElementById('reveal-next') as HTMLButtonElement;
    const placeHolder = document.getElementById('results') as HTMLDivElement;
    const yearPlaceHolder = document.getElementById('year-place-holder') as HTMLSpanElement;

    try {
        loader?.classList.remove('hide');
        const availableYears = await getJSONData<number[]>('./mock/years.json');
        availableYears.forEach((value) => {
            const option = document.createElement('option');
            option.value = value.toString();
            option.textContent = value.toString();
            yearSelected.appendChild(option);
        });
        loader?.classList.add('hide');
    } catch (error) {
        displayAlert();
    }

    let currentTable: HTMLTableElement | null = null;
    let currentData: ResultData | null = null;

    revealNext.addEventListener('click', () => {
        if (currentData && currentTable) {
            revealNextColumn(currentData, currentTable);
        }
    });

    getDataByYearButton.addEventListener('click', async () => {
        const selectedValue = yearSelected.value;

        if (!selectedValue) return;

        hideAlert();

        yearPlaceHolder.textContent = yearSelected.value;

        if (currentTable) {
            placeHolder.removeChild(currentTable);
            resetProgress();
        }

        try {
            loader?.classList.remove('hide');
            revealNext.classList.add('hide');
            currentData = await getJSONData<ResultData>('./mock/results.json?y=2025');
            currentTable = initResultTable(currentData);
            placeHolder.appendChild(currentTable);
            loader?.classList.add('hide');
            revealNext.classList.remove('hide');
        } catch (error) {
            displayAlert();
        }
    });

    // const results = await fetchINaturalistObservations();
    // console.log(results);
})();