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

/**
 * dataset will have to be created
 * it will be responsable for the data and willhold values in memory
 * because not all radio inputs with points will be created
 * most of them will have default values or be validated in groups
 * so on each new observations table creation dataset will have to be checked for existing values
 * on each change dataset will have to be updated
 * post data to server from dataset
 */