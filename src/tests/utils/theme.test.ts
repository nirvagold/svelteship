/**
 * Property-based tests for theme utilities
 * **Feature: svelteship, Property 9: Theme preference round-trip**
 * **Validates: Requirements 7.2, 7.3**
 */

import { describe, it, beforeEach, expect } from 'vitest';
import * as fc from 'fast-check';
import {
	saveTheme,
	loadTheme,
	clearTheme,
	isValidTheme,
	THEME_KEY,
	type Theme
} from '$lib/utils/theme';

// Mock localStorage for testing
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: (key: string) => store[key] ?? null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		}
	};
})();

Object.defineProperty(globalThis, 'localStorage', {
	value: localStorageMock
});

describe('Theme utilities', () => {
	beforeEach(() => {
		localStorageMock.clear();
	});

	describe('isValidTheme', () => {
		it('returns true for "light"', () => {
			expect(isValidTheme('light')).toBe(true);
		});

		it('returns true for "dark"', () => {
			expect(isValidTheme('dark')).toBe(true);
		});

		/**
		 * Property: Any string that is not "light" or "dark" should be invalid
		 */
		it('rejects any string that is not light or dark', () => {
			fc.assert(
				fc.property(
					fc.string().filter((s) => s !== 'light' && s !== 'dark'),
					(value) => {
						return isValidTheme(value) === false;
					}
				),
				{ numRuns: 100 }
			);
		});
	});

	describe('Theme preference round-trip', () => {
		/**
		 * **Feature: svelteship, Property 9: Theme preference round-trip**
		 * Property: For any valid theme (light or dark), saving to localStorage
		 * and then reading back should return the same theme value.
		 * **Validates: Requirements 7.2, 7.3**
		 */
		it('round-trips theme preference through localStorage', () => {
			const themeArbitrary = fc.constantFrom<Theme>('light', 'dark');

			fc.assert(
				fc.property(themeArbitrary, (theme) => {
					// Clear any existing theme
					clearTheme();

					// Save the theme
					saveTheme(theme);

					// Load it back
					const loaded = loadTheme();

					// Should be the same
					return loaded === theme;
				}),
				{ numRuns: 100 }
			);
		});

		/**
		 * **Feature: svelteship, Property 9: Theme preference round-trip**
		 * Property: Multiple consecutive saves should preserve only the last value
		 * **Validates: Requirements 7.2, 7.3**
		 */
		it('preserves only the last saved theme', () => {
			const themeArbitrary = fc.constantFrom<Theme>('light', 'dark');

			fc.assert(
				fc.property(
					fc.array(themeArbitrary, { minLength: 1, maxLength: 10 }),
					(themes) => {
						clearTheme();

						// Save all themes in sequence
						for (const theme of themes) {
							saveTheme(theme);
						}

						// Load should return the last one
						const loaded = loadTheme();
						const lastTheme = themes[themes.length - 1];

						return loaded === lastTheme;
					}
				),
				{ numRuns: 100 }
			);
		});
	});

	describe('loadTheme', () => {
		it('returns null when no theme is stored', () => {
			clearTheme();
			expect(loadTheme()).toBe(null);
		});

		/**
		 * Property: Loading after storing an invalid value should return null
		 */
		it('returns null for invalid stored values', () => {
			fc.assert(
				fc.property(
					fc.string().filter((s) => s !== 'light' && s !== 'dark'),
					(invalidValue) => {
						localStorage.setItem(THEME_KEY, invalidValue);
						return loadTheme() === null;
					}
				),
				{ numRuns: 100 }
			);
		});
	});

	describe('clearTheme', () => {
		it('removes stored theme', () => {
			saveTheme('dark');
			expect(loadTheme()).toBe('dark');

			clearTheme();
			expect(loadTheme()).toBe(null);
		});
	});
});
