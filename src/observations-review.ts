import './scss/styles.scss';
import './style.css';
import './styles/loader.css';
import './styles/collapse.css';
import { displayAlert } from './utils/errorHandler';
import { getURLParameter, updateURLParameter } from './utils/URLParametersHandler';
import { getAvailableCategories } from './utils/getAvailableCategories';
import { displayDataForExpert } from './utils/displayDataForExpert';

// For now, we will ignore the authentication problem and continue with the scenario as if the users were authorized.

(async () => {
    const loader = document.getElementById('loader-wrapper');
    const getDataButton = document.getElementById('get-data') as HTMLButtonElement;
    const categorySelect = document.getElementById('category-selected') as HTMLSelectElement;
    const resultPlaceHolder = document.getElementById('results') as HTMLDivElement;
    const categoryPlaceHolder = document.getElementById('category-place-holder') as HTMLSpanElement;

    let selectedCategory = getURLParameter('category');

    try {
        loader?.classList.remove('hide');
        await getAvailableCategories(loader, categorySelect);
        getDataButton.disabled = categorySelect.value === '';
    } catch (error) {
        displayAlert();
    } finally {
        loader?.classList.add('hide');
    }

    categorySelect.addEventListener('change', () => {
        selectedCategory = categorySelect.value;
        getDataButton.disabled = categorySelect.value === '';
    })

    getDataButton.addEventListener('click', async () => {
        if (!categorySelect.value) return;
        categoryPlaceHolder.textContent = categorySelect.options[categorySelect.selectedIndex].text;

        resetContentView();
        await displayDataForExpert(loader, resultPlaceHolder, categorySelect.value);

        updateURLParameter('category', categorySelect.value);
    })

    if (selectedCategory) {
        try {
            loader?.classList.remove('hide');
            await getAvailableCategories(loader, categorySelect);
            categorySelect.value = selectedCategory;
            categoryPlaceHolder.textContent = categorySelect.options[categorySelect.selectedIndex].text;
            getDataButton.disabled = false;
            displayDataForExpert(loader, resultPlaceHolder, categorySelect.value);
        } catch (error) {
            displayAlert()
        } finally {
            loader?.classList.add('hide');
        }
    } else {
        getDataButton.disabled = true;
    }

    function resetContentView() {
        resultPlaceHolder.innerHTML = '';
        const onlyWithCommentsInput = document.getElementById('only-with-comments') as HTMLInputElement;
        onlyWithCommentsInput.checked = false;
    }

    // console.log(generateMockDataForExperts());
})();