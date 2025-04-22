import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { jsonDataHandler } from './jsonDataHandler';

describe('jsonDataHandler', () => {
  // Setup and teardown
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  afterEach(() => {
    // Restore all mocks after each test
    vi.restoreAllMocks();
  });

  describe('get method', () => {
    it('should successfully fetch and return data', async () => {
      // Mock data
      const mockData = { id: 1, name: 'Test' };
      
      // Mock the fetch API
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData)
      });
      
      // Call the function
      const result = await jsonDataHandler.get<typeof mockData>('https://api.example.com/data');
      
      // Assertions
      expect(globalThis.fetch).toHaveBeenCalledWith('https://api.example.com/data');
      expect(result).toEqual(mockData);
    });
    
    it('should throw an error when fetch response is not ok', async () => {
      // Mock fetch failure
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404
      });
      
      // Test error handling
      await expect(jsonDataHandler.get('https://api.example.com/nonexistent'))
        .rejects.toThrow('HTTP error! status: 404');
      
      expect(globalThis.fetch).toHaveBeenCalledWith('https://api.example.com/nonexistent');
    });
    
    it('should throw an error when fetch rejects', async () => {
      // Mock network error
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      
      // Test error handling
      await expect(jsonDataHandler.get('https://api.example.com/data'))
        .rejects.toThrow('Network error');
      
      expect(globalThis.fetch).toHaveBeenCalledWith('https://api.example.com/data');
    });
  });
  
  describe('post method', () => {
    it('should successfully post data and return result', async () => {
      // Mock data
      const mockPostData = { name: 'New Item' };
      const mockResponse = { id: 123, name: 'New Item' };
      
      // Mock the fetch API
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });
      
      // Call the function
      const result = await jsonDataHandler.post('https://api.example.com/items', mockPostData);
      
      // Assertions
      expect(globalThis.fetch).toHaveBeenCalledWith('https://api.example.com/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockPostData)
      });
      expect(result).toEqual(mockResponse);
    });
    
    it('should throw an error when post response is not ok', async () => {
      // Mock data
      const mockPostData = { name: 'Invalid Item' };
      
      // Mock fetch failure
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400
      });
      
      // Test error handling
      await expect(jsonDataHandler.post('https://api.example.com/items', mockPostData))
        .rejects.toThrow('HTTP error! status: 400');
      
      expect(globalThis.fetch).toHaveBeenCalledWith('https://api.example.com/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockPostData)
      });
    });
    
    it('should throw an error when post fetch rejects', async () => {
      // Mock data
      const mockPostData = { name: 'Test Item' };
      
      // Mock network error
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      
      // Test error handling
      await expect(jsonDataHandler.post('https://api.example.com/items', mockPostData))
        .rejects.toThrow('Network error');
      
      expect(globalThis.fetch).toHaveBeenCalledWith('https://api.example.com/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockPostData)
      });
    });
  });
  
  // Additional edge cases
  describe('edge cases', () => {
    it('should handle empty response properly', async () => {
      // Mock empty response
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      });
      
      const result = await jsonDataHandler.get('https://api.example.com/empty');
      
      expect(result).toEqual({});
    });
    
    it('should handle posting empty data', async () => {
      const emptyData = {};
      
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
      
      const result = await jsonDataHandler.post('https://api.example.com/items', emptyData);
      
      expect(globalThis.fetch).toHaveBeenCalledWith('https://api.example.com/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emptyData)
      });
      expect(result).toEqual({ success: true });
    });
  });
});