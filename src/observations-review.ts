import './scss/styles.scss';
import './style.css';
import './styles/loader.css';
import { displayAlert } from './utils/errorHandler';
// import { fetchINaturalistObservations } from './utils/fetchINaturalistObservations';
import { getURLParameter, updateURLParameter } from './utils/URLParametersHandler';
import { getAvailableCategories } from './utils/getAvailableCategories';
import { displayDataForExpert } from './utils/displayDataForExpert';
import apiManager from './utils/apisManager';

// For now, we will ignore the authentication problem and continue with the scenario as if the users were authorized.

(async () => {
    const loader = document.getElementById('loader-wrapper');
    const getDataButton = document.getElementById('get-data') as HTMLButtonElement;
    const yearSelect = document.getElementById('year-selected') as HTMLSelectElement;
    const categorySelect = document.getElementById('category-selected') as HTMLSelectElement;
    const resultPlaceHolder = document.getElementById('results') as HTMLDivElement;
    const yearPlaceHolder = document.getElementById('year-place-holder') as HTMLSpanElement;
    const categoryPlaceHolder = document.getElementById('category-place-holder') as HTMLSpanElement;

    let selectedYear = yearSelect.value;
    let selectedCategory = categorySelect.value;

    loader?.classList.remove('hide');
    try {
        const availableYears = await apiManager.getAvailableYears();
        availableYears.forEach((value) => {
            const option = document.createElement('option');
            option.value = value.toString();
            option.textContent = value.toString();
            yearSelect.appendChild(option);
        });
    } catch (error) {
        displayAlert();
    }finally{
        loader?.classList.add('hide');
    }

    yearSelect.addEventListener('change', async () => {
        selectedYear = yearSelect.value;
        if (!selectedYear) return;
        loader?.classList.remove('hide');
        await getAvailableCategories( loader, selectedYear, categorySelect);
        getDataButton.disabled = categorySelect.value === '';
    })

    categorySelect.addEventListener('change', async () => {
        selectedCategory = categorySelect.value;
        getDataButton.disabled = categorySelect.value === '';
    })

    getDataButton.addEventListener('click', async () => {
        if (!yearSelect.value || !categorySelect.value) return;
        yearPlaceHolder.textContent = selectedYear;

        categoryPlaceHolder.textContent = categorySelect.options[categorySelect.selectedIndex].text;
        resetContentView();
        displayDataForExpert(loader, resultPlaceHolder, yearSelect.value, categorySelect.value);

        updateURLParameter('year', yearSelect.value);
        updateURLParameter('category', categorySelect.value);
    })

    // restore page state from URL parameters
    const year = getURLParameter('year');
    const category = getURLParameter('category');
    if (year) {
        selectedYear = year;
        yearSelect.value = year;
        yearPlaceHolder.textContent = year;
        await getAvailableCategories( loader, year, categorySelect);
    }
    if (category) {
        selectedCategory = category;
        categorySelect.value = category;
        categoryPlaceHolder.textContent = categorySelect.options[categorySelect.selectedIndex].text;
    } 
    if (year && category) {
        getDataButton.disabled = false;
        displayDataForExpert(loader, resultPlaceHolder, yearSelect.value, categorySelect.value);
    } else {
        getDataButton.disabled = true;
    }

    const onlyWithCommentsInput = document.getElementById('only-with-comments') as HTMLInputElement;
    onlyWithCommentsInput.addEventListener('change', () => {
        const table = resultPlaceHolder.querySelector('table');
        if (table) {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const comment = row.querySelector('textarea');
                if (comment) {
                    row.classList.toggle('hide', onlyWithCommentsInput.checked && comment.value === '');
                }
            });
        }
    });

    function resetContentView() {
        resultPlaceHolder.innerHTML = '';
        onlyWithCommentsInput.checked = false;
    }
})();