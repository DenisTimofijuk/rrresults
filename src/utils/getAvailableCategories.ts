import { getJSONData } from "../data/getData";
import { RequestCategoriesResult } from "../types/categories.type";
import { displayAlert } from "./errorHandler";

export async function getAvailableCategories( loader: HTMLElement | null, selectedYear: string, categorySelected: HTMLSelectElement) {
    try {
        const availableCategories = await getJSONData<RequestCategoriesResult>(`./mock/categories.json?y=${selectedYear}`); //TODO: replace with actual restapi
        categorySelected.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '----';
        categorySelected.appendChild(defaultOption);
        categorySelected.value = '';
        availableCategories.forEach((value) => {
            const option = document.createElement('option');
            option.value = value.id.toString();
            option.textContent = value.name;
            categorySelected.appendChild(option);
        });
    } catch (error) {
        displayAlert();
    }
    finally {
        loader?.classList.add('hide');
    }
}