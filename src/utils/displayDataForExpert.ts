import { generateTableForExpert } from "../components/generateTableForExpert";
import apiManager from "./apisManager";
import { initAutoSave } from "./initAutoSave";
import { displayAlert } from "./errorHandler";

export async function displayDataForExpert(loader: HTMLElement | null, resultPlaceHolder: HTMLElement, selectedYear: string, selectedCategory: string) {
    try {
        loader?.classList.remove('hide');
        const results = await apiManager.getObservations(selectedYear, selectedCategory);
        const table = generateTableForExpert(results);
        initAutoSave(table);
        resultPlaceHolder.appendChild(table);
    } catch (error) {
        displayAlert();
    } finally {
        loader?.classList.add('hide');
    }
}