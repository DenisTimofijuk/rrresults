import { jsonDataHandler } from "../data/jsonDataHandler";
import { RequestCategoriesResult } from "../types/categories.type";
import { PointsForObservationsData, SaveReviewCommentData } from "../types/Data.type";
import { ExpertResultData } from "../types/ExpertTableData.type";
import { ResultData } from "../types/Rezults.type";


const apiManager = {
  getObservations: (selectedCategory: string) => jsonDataHandler.get<ExpertResultData[]>(`./mock/observations.json?c=${selectedCategory}`),
  getAvailableYears: () => jsonDataHandler.get<number[]>('./mock/years.json'),
  getAvailableCategories: () => jsonDataHandler.get<RequestCategoriesResult>(`./mock/categories.json`),
  getResultsByYear: (selectedYear: string) => jsonDataHandler.get<ResultData>(`./mock/results.json?y=${selectedYear}`),
  savePointsForObservations: (data: PointsForObservationsData[]) => jsonDataHandler.post<PointsForObservationsData[]>('./endpoint-to-save-points-for-observations', data),
  saveReviewComment: (data: SaveReviewCommentData) => jsonDataHandler.post<SaveReviewCommentData>('./endpoint-to-save-comment', data),
};

export default apiManager;

/**
 * What would be your recommendetation writing Vitest tests for this file?
 * Do I need to test this fiel at all?
 */