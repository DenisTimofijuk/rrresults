import { generateTableForExpert } from "../components/generateTableForExpert";
import { getJSONData } from "../data/getData";
import { ExperResultData } from "../types/ExpertTableData.type";
import { displayAlert } from "./errorHandler";

export async function displayDataForExpert(loader: HTMLElement | null, resultPlaceHolder: HTMLElement, selectedYear: string, selectedCategory: string) {
    try {
        loader?.classList.remove('hide');
        const results = await getJSONData<ExperResultData[]>(`./mock/observations.json?y=${selectedYear}&c=${selectedCategory}`); //TODO: replace with actual restapi
        const currentTable = generateTableForExpert(results);
        resultPlaceHolder.appendChild(currentTable);
    } catch (error) {
        displayAlert();
    }
}
