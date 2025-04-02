import apiManager from "./apisManager";
import { displayAlert } from "./errorHandler";

export async function getAvailableCategories( loader: HTMLElement | null, selectedYear: string, categorySelected: HTMLSelectElement) {
    try {
        const availableCategories = await apiManager.getAvailableCategories(selectedYear);
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