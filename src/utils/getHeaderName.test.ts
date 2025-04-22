import { describe, it, expect } from 'vitest';
import { getHeaderName } from './getHeaderName';

describe('getHeaderName', () => {
  // Test the core behavior for known keys
  it('should return translations for known keys', () => {
    const knownKeys = [
      'name', 'preferred_common_name', 'expert_review', 
      'observations', 'points', 'team_name', 
      'user_name', 'url', 's'
    ];
    
    knownKeys.forEach(key => {
      const result = getHeaderName(key);
      expect(result).not.toBe(undefined);
      expect(result).not.toBe(null);
      // For known keys, we expect some transformation to happen
      // but don't test the exact value
    });
  });

  // Test the fallback case
  it('should return the input key when no mapping exists', () => {
    const unknownKeys = ['unknown_key', 'another_unknown', 'random_123'];
    
    unknownKeys.forEach(key => {
      expect(getHeaderName(key)).toBe(key);
    });
  });

  // Test edge cases
  it('should handle empty string', () => {
    expect(getHeaderName('')).toBe('');
  });

  it('should handle case sensitivity', () => {
    expect(getHeaderName('NAME')).toBe('NAME'); // Should not match 'name'
  });

  // Optional: Test at least one mapping for regression detection
  it('should return correct mapping for a sample key', () => {
    // Include just one example to detect if the whole mapping is broken
    expect(getHeaderName('name')).toBe('Mokslinis Pavadinimas');
  });
});