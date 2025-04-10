import { getJSONData } from "../data/getData";
import { RequestCategoriesResult } from "../types/categories.type";
import { ExperResultData } from "../types/ExpertTableData.type";
import { ResultData } from "../types/Rezults.type";

// const mockApiService = new MockReviewApiService({
//   errorRate: 0.15,
//   verboseLogging: true // Enable for development
// });

const apiManager = {
  getObservations: (selectedCategory: string) => getJSONData<ExperResultData[]>(`./mock/observations.json?c=${selectedCategory}`),
  getAvailableYears: () => getJSONData<number[]>('./mock/years.json'),
  getAvailableCategories: () => getJSONData<RequestCategoriesResult>(`./mock/categories.json`),
  getResultsByYear: (selectedYear: string) => getJSONData<ResultData>(`./mock/results.json?y=${selectedYear}`),
  savePointsForObservations: (data: Array<{
    observation_id: number;
    points: number;
  }>) => fetch('./endpoint-to-save-points-for-observations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }),
  saveReviewComment: (data: {
    taxonID: number;
    comment: string
  }) => fetch('./endpoint-to-save-comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
};

export default apiManager;