import { getJSONData } from './data/getData';
import { generateMockDataForExperts } from '../public/mock/generate-observations-test-data';
import './scss/styles.scss';
import './style.css';
import './styles/loader.css';
import { RequestCategoriesResult } from './types/categories.type';
import { displayAlert } from './utils/errorHandler';
import { fetchINaturalistObservations } from './utils/fetchINaturalistObservations';
import { generateTableForExpert } from './components/generateTableForExpert';
import { updateURLParameter } from './utils/URLParametersHandler';

// For now we ignore authentication problem and continue with scenario as users are authorised.

(async ()=>{
    const loader = document.getElementById('loader-wrapper');
    const getDataButton = document.getElementById('get-data') as HTMLButtonElement;
    const yearSelected = document.getElementById('year-selected') as HTMLSelectElement;
    const categorySelected = document.getElementById('category-selected') as HTMLSelectElement;
    const resultPlaceHolder = document.getElementById('results') as HTMLDivElement;
    const yearPlaceHolder = document.getElementById('year-place-holder') as HTMLSpanElement;
    const categoryPlaceHolder = document.getElementById('category-place-holder') as HTMLSpanElement;
    const alertErrorwrapper = document.getElementById('alert-error-wrapper') as HTMLDivElement;

    try{
        loader?.classList.remove('hide');
        const availableYears = await getJSONData<number[]>('./mock/years.json');
        availableYears.forEach((value)=>{
            const option = document.createElement('option');
            option.value = value.toString();
            option.textContent = value.toString();
            yearSelected.appendChild(option);
        });
        loader?.classList.add('hide');
    }catch(error){
        displayAlert();
    }

    yearSelected.addEventListener('change', async ()=>{
        const selectedYear = yearSelected.value;
        if(!selectedYear) return;
        yearPlaceHolder.textContent = selectedYear;
        categoryPlaceHolder.textContent = '';
        try{
            loader?.classList.remove('hide');
            const availableCategories = await getJSONData<RequestCategoriesResult>(`./mock/categories.json?y=${selectedYear}`); //TODO: replace with actual restapi
            categorySelected.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '----';
            categorySelected.appendChild(defaultOption);
            categorySelected.value = '';
            availableCategories.forEach((value)=>{
                const option = document.createElement('option');
                option.value = value.id.toString();
                option.textContent = value.name;
                categorySelected.appendChild(option);
            });
            loader?.classList.add('hide');
        }catch(error){
            displayAlert();
        }
    })

    categorySelected.addEventListener('change', async ()=>{
        categoryPlaceHolder.textContent = categorySelected.options[categorySelected.selectedIndex].text;
        getDataButton.disabled = categorySelected.value === '';
    })

    getDataButton.addEventListener('click', async ()=>{
        const selectedYear = yearSelected.value;
        const selectedCategory = categorySelected.value;
        if(!selectedYear || !selectedCategory) return;
        try{
            loader?.classList.remove('hide');
            // const results = await getJSONData<any>(`./mock/results.json?y=${selectedYear}&c=${selectedCategory}`); //TODO: replace with actual restapi
            const results = generateMockDataForExperts(); //TODO: replace with actual restapi
            const currentTable = generateTableForExpert(results);
            resultPlaceHolder.appendChild(currentTable);
        }catch(error){
            displayAlert();
        }
        loader?.classList.add('hide');

        updateURLParameter('year', selectedYear);
        updateURLParameter('category', selectedCategory);
    })
})()