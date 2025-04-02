// mock-api-service.js

/**
 * Mock API service to simulate saving expert review data
 * This simulates network latency and occasional errors for testing
 */
class MockReviewApiService {
  private config: {
    baseDelay: number;
    errorRate: number;
    persistToLocalStorage: boolean;
    storageKey: string;
    verboseLogging: boolean;
  };
    constructor(options: Partial<{
      baseDelay: number;
      errorRate: number;
      persistToLocalStorage: boolean;
      storageKey: string;
      verboseLogging: boolean;
    }> = {}) {
      // Default configuration
      this.config = {
        baseDelay: options.baseDelay || 300, // Base delay in ms to simulate network latency
        errorRate: options.errorRate || 0.05, // 5% chance of error by default
        persistToLocalStorage: options.persistToLocalStorage || true, // Save to localStorage by default
        storageKey: options.storageKey || 'expert_review_data',
        verboseLogging: options.verboseLogging || false
      };
      
      // Initialize storage
      this.initializeStorage();
    }
    
    /**
     * Initialize local storage for persisting review data
     */
    initializeStorage() {
      if (this.config.persistToLocalStorage) {
        if (!localStorage.getItem(this.config.storageKey)) {
          localStorage.setItem(this.config.storageKey, JSON.stringify({}));
        }
      }
    }
    
    /**
     * Save a single row review
     * @param {number} rowId - Unique identifier for the row
     * @param {object} reviewData - Expert review data for this row
     * @returns {Promise<{ status: number; message: string; rowId: number; timestamp: string; }>} - Promise resolving to response object or rejecting with error
     */
    saveRowReview(rowId: number, reviewData: object): Promise<{ status: number; message: string; rowId: number; timestamp: string; }> {
      return new Promise((resolve, reject) => {
        // Add timestamp to the review data
        const dataToSave = {
          ...reviewData,
          timestamp: new Date().toISOString()
        };
        
        // Calculate delay with some random variation
        const delay = this.config.baseDelay + Math.random() * 200;
        
        setTimeout(() => {
          // Determine if we should simulate an error
          if (Math.random() < this.config.errorRate) {
            if (this.config.verboseLogging) {
              console.error('Mock API: Simulated error saving row', rowId);
            }
            
            // Return a realistic error response
            reject({
              status: this._getRandomErrorCode(),
              message: 'Error saving review data',
              rowId
            });
            return;
          }
          
          // Success path - store data if configured
          if (this.config.persistToLocalStorage) {
            try {
              const storedData = localStorage.getItem(this.config.storageKey);
              const existingData = storedData ? JSON.parse(storedData) : {};
              existingData[rowId] = dataToSave;
              localStorage.setItem(this.config.storageKey, JSON.stringify(existingData));
            } catch (e) {
              console.error('Failed to save to localStorage:', e);
            }
          }
          
          if (this.config.verboseLogging) {
            console.log(`Mock API: Successfully saved row ${rowId}`, dataToSave);
          }
          
          // Return a successful response
          resolve({
            status: 200,
            message: 'Review data saved successfully',
            rowId,
            timestamp: dataToSave.timestamp
          });
        }, delay);
      });
    }
    
    /**
     * Get all saved review data
     * @returns {Promise} - Promise resolving to all saved review data
     */
    getAllReviewData() {
      return new Promise((resolve) => {
        const delay = this.config.baseDelay + Math.random() * 100;
        
        setTimeout(() => {
          if (this.config.persistToLocalStorage) {
            try {
              const storedData = localStorage.getItem(this.config.storageKey);
              const data = JSON.parse(storedData || '{}') || {};
              resolve({
                status: 200,
                data
              });
            } catch (e) {
              resolve({
                status: 500,
                message: 'Error retrieving data from storage',
                error: e instanceof Error ? e.message : 'Unknown error'
              });
            }
          } else {
            resolve({
              status: 200,
              data: {}
            });
          }
        }, delay);
      });
    }
    
    /**
     * Clear all saved review data
     * @returns {Promise} - Promise resolving when data is cleared
     */
    clearAllData() {
      return new Promise((resolve) => {
        const delay = this.config.baseDelay;
        
        setTimeout(() => {
          if (this.config.persistToLocalStorage) {
            localStorage.setItem(this.config.storageKey, JSON.stringify({}));
          }
          
          resolve({
            status: 200,
            message: 'All review data cleared'
          });
        }, delay);
      });
    }
    
    /**
     * Generate a realistic error HTTP status code
     * @returns {number} - HTTP error status code
     * @private
     */
    _getRandomErrorCode() {
      const errorCodes = [
        400, // Bad request
        403, // Forbidden
        408, // Request timeout
        429, // Too many requests
        500, // Internal server error
        502, // Bad gateway
        503, // Service unavailable
        504  // Gateway timeout
      ];
      
      const randomIndex = Math.floor(Math.random() * errorCodes.length);
      return errorCodes[randomIndex];
    }
  }
  
  export default MockReviewApiService;