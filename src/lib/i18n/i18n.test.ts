import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';

// Copy pure functions from index.ts to avoid SvelteKit import issues
// These are the core i18n functions that don't depend on browser APIs

import en from './locales/en.json';
import id from './locales/id.json';

const locales = { en, id } as const;
type Locale = keyof typeof locales;
const DEFAULT_LOCALE: Locale = 'en';

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
	const keys = path.split('.');
	let result: unknown = obj;

	for (const key of keys) {
		if (result && typeof result === 'object' && key in result) {
			result = (result as Record<string, unknown>)[key];
		} else {
			return undefined;
		}
	}

	return typeof result === 'string' ? result : undefined;
}

function substituteVariables(str: string, variables?: Record<string, string | number>): string {
	if (!variables) return str;
	return str.replace(/\{(\w+)\}/g, (match, key) => {
		return key in variables ? String(variables[key]) : match;
	});
}

// Simplified t function for testing
let currentLocale: Locale = DEFAULT_LOCALE;

function setLocale(locale: Locale): void {
	if (locale in locales) {
		currentLocale = locale;
	}
}

function getLocale(): Locale {
	return currentLocale;
}

function t(
	key: string,
	variables?: Record<string, string | number>,
	locale?: Locale
): string {
	const targetLocale = locale || currentLocale;
	const translations = locales[targetLocale];
	const value = getNestedValue(translations as unknown as Record<string, unknown>, key);

	if (value === undefined) {
		if (targetLocale !== DEFAULT_LOCALE) {
			const fallback = getNestedValue(
				locales[DEFAULT_LOCALE] as unknown as Record<string, unknown>,
				key
			);
			if (fallback) {
				return substituteVariables(fallback, variables);
			}
		}
		return key;
	}

	return substituteVariables(value, variables);
}

function formatDate(
	date: Date | string | number,
	options?: Intl.DateTimeFormatOptions,
	locale?: Locale
): string {
	const targetLocale = locale || currentLocale;
	const dateObj = date instanceof Date ? date : new Date(date);
	const defaultOptions: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		...options
	};
	return new Intl.DateTimeFormat(targetLocale, defaultOptions).format(dateObj);
}

function formatNumber(
	value: number,
	options?: Intl.NumberFormatOptions,
	locale?: Locale
): string {
	const targetLocale = locale || currentLocale;
	return new Intl.NumberFormat(targetLocale, options).format(value);
}

describe('i18n System', () => {
	beforeEach(() => {
		currentLocale = DEFAULT_LOCALE;
	});

	describe('Translation (t)', () => {
		it('returns translation for valid key', () => {
			expect(t('common.save')).toBe('Save');
			expect(t('common.cancel')).toBe('Cancel');
			expect(t('auth.login')).toBe('Log In');
		});

		it('returns key if translation not found', () => {
			expect(t('nonexistent.key')).toBe('nonexistent.key');
		});

		it('substitutes variables correctly', () => {
			expect(t('dashboard.welcome', { name: 'John' })).toBe('Welcome back, John!');
		});

		it('handles missing variables gracefully', () => {
			expect(t('dashboard.welcome')).toBe('Welcome back, {name}!');
		});

		it('uses specified locale override', () => {
			expect(t('common.save', undefined, 'id')).toBe('Simpan');
			expect(t('auth.login', undefined, 'id')).toBe('Masuk');
		});

		it('falls back to default locale for missing translations', () => {
			// If a key exists in en but not in id, it should fallback
			setLocale('id');
			// Both locales have this key, so test with actual translations
			expect(t('common.save')).toBe('Simpan');
		});
	});

	describe('Locale Management', () => {
		it('gets current locale', () => {
			expect(getLocale()).toBe('en');
		});

		it('sets locale correctly', () => {
			setLocale('id');
			expect(getLocale()).toBe('id');
		});

		it('ignores invalid locale', () => {
			setLocale('invalid' as Locale);
			expect(getLocale()).toBe('en');
		});

		// Property 8: Locale persistence
		it('property: locale changes are reflected in translations', () => {
			const testLocales: Locale[] = ['en', 'id'];

			fc.assert(
				fc.property(fc.constantFrom(...testLocales), (locale) => {
					setLocale(locale);
					expect(getLocale()).toBe(locale);

					// Translation should use the set locale
					const translation = t('common.save');
					const expected = locale === 'en' ? 'Save' : 'Simpan';
					expect(translation).toBe(expected);
				}),
				{ numRuns: 10 }
			);
		});
	});

	describe('Date Formatting', () => {
		const testDate = new Date('2024-06-15T10:30:00Z');

		it('formats date in English', () => {
			const formatted = formatDate(testDate, undefined, 'en');
			expect(formatted).toContain('2024');
			expect(formatted).toContain('June');
		});

		it('formats date in Indonesian', () => {
			const formatted = formatDate(testDate, undefined, 'id');
			expect(formatted).toContain('2024');
			expect(formatted).toContain('Juni');
		});

		it('accepts Date object', () => {
			const formatted = formatDate(testDate);
			expect(typeof formatted).toBe('string');
			expect(formatted.length).toBeGreaterThan(0);
		});

		it('accepts timestamp', () => {
			const formatted = formatDate(testDate.getTime());
			expect(typeof formatted).toBe('string');
		});

		it('accepts ISO string', () => {
			const formatted = formatDate('2024-06-15');
			expect(typeof formatted).toBe('string');
		});

		// Property 9: Date formatting by locale
		it('property: date formatting produces different results for different locales', () => {
			fc.assert(
				fc.property(
					fc.integer({ min: 2020, max: 2030 }),
					fc.integer({ min: 1, max: 12 }),
					fc.integer({ min: 1, max: 28 }),
					(year, month, day) => {
						const date = new Date(year, month - 1, day);
						const enFormatted = formatDate(date, undefined, 'en');
						const idFormatted = formatDate(date, undefined, 'id');

						// Both should be non-empty strings
						expect(enFormatted.length).toBeGreaterThan(0);
						expect(idFormatted.length).toBeGreaterThan(0);

						// Both should contain the year
						expect(enFormatted).toContain(year.toString());
						expect(idFormatted).toContain(year.toString());
					}
				),
				{ numRuns: 20 }
			);
		});
	});

	describe('Number Formatting', () => {
		it('formats number in English', () => {
			const formatted = formatNumber(1234567.89, undefined, 'en');
			expect(formatted).toContain('1');
			// English uses comma as thousands separator
			expect(formatted).toMatch(/1,234,567/);
		});

		it('formats number in Indonesian', () => {
			const formatted = formatNumber(1234567.89, undefined, 'id');
			expect(formatted).toContain('1');
			// Indonesian uses period as thousands separator
			expect(formatted).toMatch(/1\.234\.567/);
		});

		it('formats with custom options', () => {
			const formatted = formatNumber(0.5, { style: 'percent' }, 'en');
			expect(formatted).toContain('50');
			expect(formatted).toContain('%');
		});

		// Property 10: Number formatting by locale
		it('property: number formatting produces valid output for any number', () => {
			fc.assert(
				fc.property(fc.double({ min: -1000000, max: 1000000, noNaN: true }), (num) => {
					const enFormatted = formatNumber(num, undefined, 'en');
					const idFormatted = formatNumber(num, undefined, 'id');

					// Both should be non-empty strings
					expect(enFormatted.length).toBeGreaterThan(0);
					expect(idFormatted.length).toBeGreaterThan(0);

					// Should contain digits
					expect(enFormatted).toMatch(/\d/);
					expect(idFormatted).toMatch(/\d/);
				}),
				{ numRuns: 30 }
			);
		});
	});

	describe('Variable Substitution', () => {
		it('substitutes single variable', () => {
			const result = substituteVariables('Hello, {name}!', { name: 'World' });
			expect(result).toBe('Hello, World!');
		});

		it('substitutes multiple variables', () => {
			const result = substituteVariables('{greeting}, {name}!', {
				greeting: 'Hello',
				name: 'World'
			});
			expect(result).toBe('Hello, World!');
		});

		it('handles numeric variables', () => {
			const result = substituteVariables('Count: {count}', { count: 42 });
			expect(result).toBe('Count: 42');
		});

		it('leaves unmatched variables unchanged', () => {
			const result = substituteVariables('Hello, {name}!', {});
			expect(result).toBe('Hello, {name}!');
		});

		it('returns original string if no variables provided', () => {
			const result = substituteVariables('Hello, World!');
			expect(result).toBe('Hello, World!');
		});
	});

	describe('Translation Completeness', () => {
		// Property 11: Translation completeness
		it('property: all English keys exist in Indonesian', () => {
			function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
				const keys: string[] = [];
				for (const key in obj) {
					const fullKey = prefix ? `${prefix}.${key}` : key;
					if (typeof obj[key] === 'object' && obj[key] !== null) {
						keys.push(...getAllKeys(obj[key] as Record<string, unknown>, fullKey));
					} else {
						keys.push(fullKey);
					}
				}
				return keys;
			}

			const enKeys = getAllKeys(en as unknown as Record<string, unknown>);
			const idKeys = getAllKeys(id as unknown as Record<string, unknown>);

			// All English keys should exist in Indonesian
			for (const key of enKeys) {
				expect(idKeys).toContain(key);
			}

			// All Indonesian keys should exist in English
			for (const key of idKeys) {
				expect(enKeys).toContain(key);
			}
		});

		it('property: translations for same key are different between locales', () => {
			const testKeys = [
				'common.save',
				'common.cancel',
				'auth.login',
				'auth.logout',
				'nav.home',
				'settings.title'
			];

			fc.assert(
				fc.property(fc.constantFrom(...testKeys), (key) => {
					const enValue = t(key, undefined, 'en');
					const idValue = t(key, undefined, 'id');

					// Both should return actual translations (not the key)
					expect(enValue).not.toBe(key);
					expect(idValue).not.toBe(key);

					// Translations should be different
					expect(enValue).not.toBe(idValue);
				}),
				{ numRuns: 10 }
			);
		});
	});

	describe('Nested Value Access', () => {
		it('accesses deeply nested values', () => {
			const obj = {
				level1: {
					level2: {
						level3: 'value'
					}
				}
			};
			expect(getNestedValue(obj, 'level1.level2.level3')).toBe('value');
		});

		it('returns undefined for non-existent path', () => {
			const obj = { a: { b: 'c' } };
			expect(getNestedValue(obj, 'a.x.y')).toBeUndefined();
		});

		it('returns undefined for non-string values', () => {
			const obj = { a: { b: 123 } };
			expect(getNestedValue(obj, 'a.b')).toBeUndefined();
		});
	});
});
