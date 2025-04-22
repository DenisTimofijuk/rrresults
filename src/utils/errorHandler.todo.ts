// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// import { displayAlert, hideAlert } from './errorHandler';

// // Mock the getRandomMessage import
// vi.mock('./errorMessage', () => ({
//   getRandomMessage: vi.fn(() => 'Test error message'),
// }));

// describe('Alert Functions', () => {
//   // Set up the required DOM elements before each test
//   beforeEach(() => {
//     // Create the necessary DOM elements for testing
//     document.body.innerHTML = `
//       <div id="loader-wrapper"></div>
//       <div id="error-text"></div>
//       <div id="alert-error-wrapper" class="hide"></div>
//     `;
//   });

//   // Clean up after each test
//   afterEach(() => {
//     document.body.innerHTML = '';
//     vi.resetAllMocks();
//   });

//   describe('displayAlert', () => {
//     it('should throw an error if required HTML elements do not exist', () => {
//       // Remove elements to test error condition
//       document.body.innerHTML = '';
      
//       // Check if accessing non-existent elements throws an error
//       expect(() => displayAlert()).toThrow();
//     });

//     it('should find all required HTML elements', () => {
//       // Test if all required elements exist
//       const loader = document.getElementById('loader-wrapper');
//       const errorText = document.getElementById('error-text');
//       const alertWrapper = document.getElementById('alert-error-wrapper');

//       expect(loader).not.toBeNull();
//       expect(errorText).not.toBeNull();
//       expect(alertWrapper).not.toBeNull();
      
//       // Call the function to ensure it doesn't throw errors
//       expect(() => displayAlert()).not.toThrow();
//     });
//   });

//   describe('hideAlert', () => {
//     it('should throw an error if required HTML elements do not exist', () => {
//       // Remove elements to test error condition
//       document.body.innerHTML = '';
      
//       // Check if accessing non-existent elements throws an error
//       expect(() => hideAlert()).toThrow();
//     });

//     it('should find all required HTML elements', () => {
//       // Test if required element exists
//       const alertWrapper = document.getElementById('alert-error-wrapper');
      
//       expect(alertWrapper).not.toBeNull();
      
//       // Call the function to ensure it doesn't throw errors
//       expect(() => hideAlert()).not.toThrow();
//     });
//   });
// });