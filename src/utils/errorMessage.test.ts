import { describe, it, expect, vi } from 'vitest';
import { getRandomMessage } from './errorMessage';

describe('getRandomMessage', () => {
  it('should return a string', () => {
    const result = getRandomMessage();
    expect(typeof result).toBe('string');
  });

  it('should start with "Oi! Kažkas nepavyko."', () => {
    const result = getRandomMessage();
    expect(result.startsWith('Oi! Kažkas nepavyko.')).toBe(true);
  });

  it('should return different messages over multiple calls', () => {
    // Mock Math.random to ensure we get different values
    const randomValues = [0, 0.5, 0.99];
    vi.spyOn(Math, 'random').mockImplementation(() => randomValues.shift() || 0);
    
    const results = new Set();
    for (let i = 0; i < 3; i++) {
      results.add(getRandomMessage());
    }
    
    // Restore the original implementation
    vi.restoreAllMocks();
    
    // We expect to have multiple different messages
    // Note: This test might occasionally fail due to random chance if the same message is chosen
    expect(results.size).toBeGreaterThan(1);
  });

  it('should use Math.random for selecting messages', () => {
    // Spy on Math.random
    const randomSpy = vi.spyOn(Math, 'random');
    
    getRandomMessage();
    
    expect(randomSpy).toHaveBeenCalled();
    
    // Restore the original implementation
    vi.restoreAllMocks();
  });

  it('should handle edge cases when Math.random returns 0 or 0.999...', () => {
    // Test with Math.random returning 0 (first message)
    vi.spyOn(Math, 'random').mockReturnValueOnce(0);
    const firstResult = getRandomMessage();
    vi.restoreAllMocks();
    
    // Test with Math.random returning almost 1 (last message)
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.999999);
    const lastResult = getRandomMessage();
    vi.restoreAllMocks();
    
    // We just verify they're strings, as we can't easily check the exact message without access to the array
    expect(typeof firstResult).toBe('string');
    expect(typeof lastResult).toBe('string');
  });
});