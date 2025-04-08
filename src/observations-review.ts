import './scss/styles.scss';
import './style.css';
import './styles/loader.css';
import './styles/collapse.css';
import { displayAlert } from './utils/errorHandler';
import { getURLParameter, updateURLParameter } from './utils/URLParametersHandler';
import { getAvailableCategories } from './utils/getAvailableCategories';
import { displayDataForExpert } from './utils/displayDataForExpert';
import apiManager from './utils/apisManager';
import { generateMockDataForExperts } from './data/mock/generate-observations-test-data';

// For now, we will ignore the authentication problem and continue with the scenario as if the users were authorized.

(async () => {
    const loader = document.getElementById('loader-wrapper');
    const getDataButton = document.getElementById('get-data') as HTMLButtonElement;
    const yearSelect = document.getElementById('year-selected') as HTMLSelectElement;
    const categorySelect = document.getElementById('category-selected') as HTMLSelectElement;
    const resultPlaceHolder = document.getElementById('results') as HTMLDivElement;
    const yearPlaceHolder = document.getElementById('year-place-holder') as HTMLSpanElement;
    const categoryPlaceHolder = document.getElementById('category-place-holder') as HTMLSpanElement;

    let selectedYear = getURLParameter('year');
    let selectedCategory = getURLParameter('category');
    
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

    categorySelect.addEventListener('change', () => {
        selectedCategory = categorySelect.value;
        getDataButton.disabled = categorySelect.value === '';
    })

    getDataButton.addEventListener('click', async () => {
        if (!yearSelect.value || !categorySelect.value) return;
        yearPlaceHolder.textContent = selectedYear;
        categoryPlaceHolder.textContent = categorySelect.options[categorySelect.selectedIndex].text;

        resetContentView();
        await displayDataForExpert(loader, resultPlaceHolder, yearSelect.value, categorySelect.value);

        updateURLParameter('year', yearSelect.value);
        updateURLParameter('category', categorySelect.value);
    })

    // restore page state from URL parameters
    if (selectedYear) {
        yearSelect.value = selectedYear;
        yearPlaceHolder.textContent = selectedYear;
        await getAvailableCategories( loader, selectedYear, categorySelect);
    }
    if (selectedCategory) {
        categorySelect.value = selectedCategory;
        categoryPlaceHolder.textContent = categorySelect.options[categorySelect.selectedIndex].text;
    } 
    if (selectedYear && selectedCategory) {
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

    // console.log(generateMockDataForExperts());
})();