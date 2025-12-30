export const THEME_KEY = 'svelteship-theme';
export type Theme = 'light' | 'dark';

/**
 * Validates if a value is a valid theme
 */
export function isValidTheme(value: unknown): value is Theme {
	return value === 'light' || value === 'dark';
}

/**
 * Saves theme preference to localStorage
 */
export function saveTheme(theme: Theme): void {
	if (!isValidTheme(theme)) {
		throw new Error(`Invalid theme: ${theme}`);
	}
	localStorage.setItem(THEME_KEY, theme);
}

/**
 * Loads theme preference from localStorage
 * Returns null if no valid theme is stored
 */
export function loadTheme(): Theme | null {
	const stored = localStorage.getItem(THEME_KEY);
	return isValidTheme(stored) ? stored : null;
}

/**
 * Clears theme preference from localStorage
 */
export function clearTheme(): void {
	localStorage.removeItem(THEME_KEY);
}
