import { describe, it, expect } from 'vitest';
import { resolveTheme } from './theme';

describe('resolveTheme', () => {
  it('returns the stored theme when it is "dark"', () => {
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('returns the stored theme when it is "light"', () => {
    expect(resolveTheme('light', true)).toBe('light');
  });

  it('falls back to OS preference (dark) when nothing is stored', () => {
    expect(resolveTheme(null, true)).toBe('dark');
  });

  it('falls back to OS preference (light) when nothing is stored', () => {
    expect(resolveTheme(null, false)).toBe('light');
  });

  it('ignores invalid stored values and uses OS preference', () => {
    expect(resolveTheme('purple', true)).toBe('dark');
  });
});
