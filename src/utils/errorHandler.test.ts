import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getRandomMessage } from './errorMessage';
import { displayAlert, hideAlert } from './errorHandler';

// Mock the getRandomMessage function
vi.mock('./errorMessage', () => ({
  getRandomMessage: vi.fn().mockReturnValue('Test error message')
}));

describe('Alert Functions', () => {
  // Setup DOM before each test
  beforeEach(() => {
    // Reset the document body
    document.body.innerHTML = `
      <div id="loader-wrapper"></div>
      <div id="error-text"></div>
      <div id="alert-error-wrapper" class="hide"></div>
    `;

    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('displayAlert', () => {
    it('should hide the loader', () => {
      const loader = document.getElementById('loader-wrapper');
      expect(loader?.classList.contains('hide')).toBe(false);
      
      displayAlert();
      
      expect(loader?.classList.contains('hide')).toBe(true);
    });

    it('should set error text content from getRandomMessage', () => {
      const errorText = document.getElementById('error-text');
      expect(errorText?.innerText).toBe('');
      
      displayAlert();
      
      expect(errorText?.innerText).toBe('Test error message');
      expect(getRandomMessage).toHaveBeenCalledTimes(1);
    });

    it('should show the alert wrapper by removing hide class', () => {
      const alertWrapper = document.getElementById('alert-error-wrapper');
      expect(alertWrapper?.classList.contains('hide')).toBe(true);
      
      displayAlert();
      
      expect(alertWrapper?.classList.contains('hide')).toBe(false);
    });
  });

  describe('hideAlert', () => {
    it('should hide the alert wrapper by adding hide class', () => {
      // First show the alert
      const alertWrapper = document.getElementById('alert-error-wrapper');
      alertWrapper?.classList.remove('hide');
      expect(alertWrapper?.classList.contains('hide')).toBe(false);
      
      hideAlert();
      
      expect(alertWrapper?.classList.contains('hide')).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle missing DOM elements gracefully', () => {
      // Remove all elements
      document.body.innerHTML = '';
      
      // These should not throw errors even if elements don't exist
      expect(() => displayAlert()).not.toThrow();
      expect(() => hideAlert()).not.toThrow();
    });
  });
});