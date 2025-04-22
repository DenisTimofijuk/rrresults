import { describe, it, expect, vi, beforeEach } from 'vitest';
import { jsonDataHandler } from "../data/jsonDataHandler";
import apiManager from './apisManager';

// Mock the jsonDataHandler module
vi.mock("../data/jsonDataHandler", () => ({
  jsonDataHandler: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

describe('apiManager', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should call getObservations with correct URL and category', async () => {
    // Arrange
    const mockData = [{ id: 1, name: 'Test Observation' }];
    vi.mocked(jsonDataHandler.get).mockResolvedValue(mockData);
    const category = 'testCategory';

    // Act
    const result = await apiManager.getObservations(category);

    // Assert
    expect(jsonDataHandler.get).toHaveBeenCalledWith(`./mock/observations.json?c=${category}`);
    expect(result).toEqual(mockData);
    expect(jsonDataHandler.get).toHaveBeenCalledTimes(1);
  });

  it('should call getAvailableYears with correct URL', async () => {
    // Arrange
    const mockYears = [2020, 2021, 2022];
    vi.mocked(jsonDataHandler.get).mockResolvedValue(mockYears);

    // Act
    const result = await apiManager.getAvailableYears();

    // Assert
    expect(jsonDataHandler.get).toHaveBeenCalledWith('./mock/years.json');
    expect(result).toEqual(mockYears);
  });

  it('should call getAvailableCategories with correct URL', async () => {
    // Arrange
    const mockCategories = { categories: ['cat1', 'cat2'] };
    vi.mocked(jsonDataHandler.get).mockResolvedValue(mockCategories);

    // Act
    const result = await apiManager.getAvailableCategories();

    // Assert
    expect(jsonDataHandler.get).toHaveBeenCalledWith('./mock/categories.json');
    expect(result).toEqual(mockCategories);
  });

  it('should call getResultsByYear with correct URL and year', async () => {
    // Arrange
    const mockResults = { id: 1, data: [] };
    vi.mocked(jsonDataHandler.get).mockResolvedValue(mockResults);
    const year = '2022';

    // Act
    const result = await apiManager.getResultsByYear(year);

    // Assert
    expect(jsonDataHandler.get).toHaveBeenCalledWith(`./mock/results.json?y=${year}`);
    expect(result).toEqual(mockResults);
  });

  it('should call savePointsForObservations with correct endpoint and data', async () => {
    // Arrange
    const mockData = [{ observation_id: 1, points: 10 }];
    vi.mocked(jsonDataHandler.post).mockResolvedValue(mockData);

    // Act
    const result = await apiManager.savePointsForObservations(mockData);

    // Assert
    expect(jsonDataHandler.post).toHaveBeenCalledWith('./endpoint-to-save-points-for-observations', mockData);
    expect(result).toEqual(mockData);
  });

  it('should call saveReviewComment with correct endpoint and data', async () => {
    // Arrange
    const mockData = { taxonID: 1, comment: 'Test comment' };
    vi.mocked(jsonDataHandler.post).mockResolvedValue(mockData);

    // Act
    const result = await apiManager.saveReviewComment(mockData);

    // Assert
    expect(jsonDataHandler.post).toHaveBeenCalledWith('./endpoint-to-save-comment', mockData);
    expect(result).toEqual(mockData);
  });
});