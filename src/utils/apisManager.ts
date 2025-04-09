import MockReviewApiService from "../data/mock/mock-api-service";
import { getJSONData } from "../data/getData";
import { RequestCategoriesResult } from "../types/categories.type";
import { ExperResultData } from "../types/ExpertTableData.type";
import { ResultData } from "../types/Rezults.type";

const mockApiService = new MockReviewApiService({
    errorRate: 0.15,
    verboseLogging: true // Enable for development
  });

const apiManager = {
    getObservations: (selectedCategory: string) => getJSONData<ExperResultData[]>(`./mock/observations.json?c=${selectedCategory}`),
    getAvailableYears: () => getJSONData<number[]>('./mock/years.json'),
    getAvailableCategories: () => getJSONData<RequestCategoriesResult>(`./mock/categories.json`),
    getResultsByYear: (selectedYear: string) => getJSONData<ResultData>(`./mock/results.json?y=${selectedYear}`),
    saveExpertReview: (rowId: number, data: {points?: number, comments?: string}) => mockApiService.saveRowReview(rowId, data),
};

export default apiManager;