import apiManager from "./apisManager";
import { initAutoSave } from "./initAutoSave";
import { displayAlert } from "./errorHandler";
import { generateTableForExpert } from "../components/tableForExperts";

export async function displayDataForExpert(loader: HTMLElement | null, resultPlaceHolder: HTMLElement, selectedYear: string, selectedCategory: string) {
    try {
        loader?.classList.remove('hide');
        const results = await apiManager.getObservations(selectedYear, selectedCategory);
        const table = generateTableForExpert(results);
        // initAutoSave(table);
        resultPlaceHolder.appendChild(table);
    } catch (error) {
        displayAlert();
    } finally {
        loader?.classList.add('hide');
    }
}