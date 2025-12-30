/**
 * Internationalization (i18n) system
 * Provides translation, date formatting, and number formatting with locale support
 */

import en from './locales/en.json';
import id from './locales/id.json';

// Available locales
export const locales = {
	en,
	id
} as const;

export type Locale = keyof typeof locales;
export type TranslationKeys = typeof en;

// Default locale
const DEFAULT_LOCALE: Locale = 'en';
const STORAGE_KEY = 'svelteship-locale';

// Current locale state (for SSR compatibility, we use a simple variable)
let currentLocale: Locale = DEFAULT_LOCALE;

/**
 * Get nested value from object using dot notation
 */
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

/**
 * Substitute variables in a string
 * Supports {variable} syntax
 */
function substituteVariables(str: string, variables?: Record<string, string | number>): string {
	if (!variables) return str;

	return str.replace(/\{(\w+)\}/g, (match, key) => {
		return key in variables ? String(variables[key]) : match;
	});
}

/**
 * Get current locale
 */
export function getLocale(): Locale {
	return currentLocale;
}

/**
 * Set current locale
 */
export function setLocale(locale: Locale): void {
	if (locale in locales) {
		currentLocale = locale;
		// Persist to localStorage if available
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, locale);
		}
	}
}

/**
 * Initialize locale from browser or localStorage
 */
export function initLocale(): Locale {
	if (typeof window === 'undefined') {
		return DEFAULT_LOCALE;
	}

	// Check localStorage first
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored && stored in locales) {
		currentLocale = stored as Locale;
		return currentLocale;
	}

	// Detect from browser
	const browserLocale = detectBrowserLocale();
	currentLocale = browserLocale;
	localStorage.setItem(STORAGE_KEY, browserLocale);

	return currentLocale;
}

/**
 * Detect browser language preference
 */
export function detectBrowserLocale(): Locale {
	if (typeof window === 'undefined') {
		return DEFAULT_LOCALE;
	}

	const browserLang = navigator.language.split('-')[0];
	return browserLang in locales ? (browserLang as Locale) : DEFAULT_LOCALE;
}

/**
 * Translation function
 * @param key - Dot notation key (e.g., 'common.save', 'auth.login')
 * @param variables - Optional variables to substitute
 * @param locale - Optional locale override
 */
export function t(
	key: string,
	variables?: Record<string, string | number>,
	locale?: Locale
): string {
	const targetLocale = locale || currentLocale;
	const translations = locales[targetLocale];

	const value = getNestedValue(translations as unknown as Record<string, unknown>, key);

	if (value === undefined) {
		// Fallback to default locale
		if (targetLocale !== DEFAULT_LOCALE) {
			const fallback = getNestedValue(
				locales[DEFAULT_LOCALE] as unknown as Record<string, unknown>,
				key
			);
			if (fallback) {
				return substituteVariables(fallback, variables);
			}
		}
		// Return key if not found
		console.warn(`Translation missing: ${key}`);
		return key;
	}

	return substituteVariables(value, variables);
}

/**
 * Pluralization helper
 * @param key - Base key (will append _plural for count > 1)
 * @param count - Count for pluralization
 * @param variables - Additional variables
 */
export function tp(
	key: string,
	count: number,
	variables?: Record<string, string | number>
): string {
	const pluralKey = count === 1 ? key : `${key}_plural`;
	return t(pluralKey, { count, ...variables });
}

/**
 * Format date according to locale
 */
export function formatDate(
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

/**
 * Format date with time
 */
export function formatDateTime(
	date: Date | string | number,
	options?: Intl.DateTimeFormatOptions,
	locale?: Locale
): string {
	return formatDate(
		date,
		{
			hour: '2-digit',
			minute: '2-digit',
			...options
		},
		locale
	);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number, locale?: Locale): string {
	const targetLocale = locale || currentLocale;
	const dateObj = date instanceof Date ? date : new Date(date);
	const now = new Date();
	const diffMs = now.getTime() - dateObj.getTime();
	const diffSeconds = Math.floor(diffMs / 1000);
	const diffMinutes = Math.floor(diffSeconds / 60);
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);
	const diffWeeks = Math.floor(diffDays / 7);

	// Use Intl.RelativeTimeFormat if available
	if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
		const rtf = new Intl.RelativeTimeFormat(targetLocale, { numeric: 'auto' });

		if (diffSeconds < 60) {
			return t('time.justNow', undefined, targetLocale);
		} else if (diffMinutes < 60) {
			return rtf.format(-diffMinutes, 'minute');
		} else if (diffHours < 24) {
			return rtf.format(-diffHours, 'hour');
		} else if (diffDays < 7) {
			return rtf.format(-diffDays, 'day');
		} else {
			return rtf.format(-diffWeeks, 'week');
		}
	}

	// Fallback to translation keys
	if (diffSeconds < 60) {
		return t('time.justNow', undefined, targetLocale);
	} else if (diffMinutes < 60) {
		return tp('time.minutesAgo', diffMinutes, undefined);
	} else if (diffHours < 24) {
		return tp('time.hoursAgo', diffHours, undefined);
	} else if (diffDays < 7) {
		return tp('time.daysAgo', diffDays, undefined);
	} else {
		return tp('time.weeksAgo', diffWeeks, undefined);
	}
}

/**
 * Format number according to locale
 */
export function formatNumber(
	value: number,
	options?: Intl.NumberFormatOptions,
	locale?: Locale
): string {
	const targetLocale = locale || currentLocale;
	return new Intl.NumberFormat(targetLocale, options).format(value);
}

/**
 * Format currency
 */
export function formatCurrency(
	value: number,
	currency: string = 'USD',
	locale?: Locale
): string {
	const targetLocale = locale || currentLocale;
	return new Intl.NumberFormat(targetLocale, {
		style: 'currency',
		currency
	}).format(value);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 0, locale?: Locale): string {
	const targetLocale = locale || currentLocale;
	return new Intl.NumberFormat(targetLocale, {
		style: 'percent',
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	}).format(value);
}

/**
 * Get all available locales with their display names
 */
export function getAvailableLocales(): Array<{ code: Locale; name: string; nativeName: string }> {
	return [
		{ code: 'en', name: 'English', nativeName: 'English' },
		{ code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' }
	];
}

/**
 * Check if a locale is supported
 */
export function isLocaleSupported(locale: string): locale is Locale {
	return locale in locales;
}


