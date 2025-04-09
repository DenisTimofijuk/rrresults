import apiManager from "./apisManager";
import { displayAlert } from "./errorHandler";

export async function getAvailableCategories( loader: HTMLElement | null, categorySelect: HTMLSelectElement) {
    try {
        const availableCategories = await apiManager.getAvailableCategories();
        categorySelect.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '----';
        categorySelect.appendChild(defaultOption);
        categorySelect.value = '';
        availableCategories.forEach((value) => {
            const option = document.createElement('option');
            option.value = value.id.toString();
            option.textContent = value.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        displayAlert();
    }
    finally {
        loader?.classList.add('hide');
    }
}