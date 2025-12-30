/**
 * Date formatting utilities
 */

export interface DateFormatOptions {
	format?: 'short' | 'medium' | 'long' | 'full' | string;
	locale?: string;
	timezone?: string;
}

const FORMAT_OPTIONS: Record<string, Intl.DateTimeFormatOptions> = {
	short: { year: 'numeric', month: 'numeric', day: 'numeric' },
	medium: { year: 'numeric', month: 'short', day: 'numeric' },
	long: { year: 'numeric', month: 'long', day: 'numeric' },
	full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
};

/**
 * Format a date to a localized string
 */
export function formatDate(
	date: Date | string | number | null | undefined,
	options: DateFormatOptions = {}
): string {
	const { format = 'medium', locale = 'en-US', timezone } = options;

	if (date === null || date === undefined) {
		return '-';
	}

	const dateObj = date instanceof Date ? date : new Date(date);

	if (isNaN(dateObj.getTime())) {
		return '-';
	}

	const formatOptions: Intl.DateTimeFormatOptions = {
		...(FORMAT_OPTIONS[format] || FORMAT_OPTIONS.medium),
		...(timezone && { timeZone: timezone })
	};

	try {
		return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
	} catch {
		return '-';
	}
}

/**
 * Format a date relative to now (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelative(
	date: Date | string | number | null | undefined,
	baseDate: Date = new Date()
): string {
	if (date === null || date === undefined) {
		return '-';
	}

	const dateObj = date instanceof Date ? date : new Date(date);

	if (isNaN(dateObj.getTime())) {
		return '-';
	}

	const diffMs = dateObj.getTime() - baseDate.getTime();
	const diffSec = Math.round(diffMs / 1000);
	const diffMin = Math.round(diffSec / 60);
	const diffHour = Math.round(diffMin / 60);
	const diffDay = Math.round(diffHour / 24);
	const diffWeek = Math.round(diffDay / 7);
	const diffMonth = Math.round(diffDay / 30);
	const diffYear = Math.round(diffDay / 365);

	const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

	if (Math.abs(diffSec) < 60) {
		return rtf.format(diffSec, 'second');
	}
	if (Math.abs(diffMin) < 60) {
		return rtf.format(diffMin, 'minute');
	}
	if (Math.abs(diffHour) < 24) {
		return rtf.format(diffHour, 'hour');
	}
	if (Math.abs(diffDay) < 7) {
		return rtf.format(diffDay, 'day');
	}
	if (Math.abs(diffWeek) < 4) {
		return rtf.format(diffWeek, 'week');
	}
	if (Math.abs(diffMonth) < 12) {
		return rtf.format(diffMonth, 'month');
	}
	return rtf.format(diffYear, 'year');
}

/**
 * Parse a date string to Date object
 */
export function parseDate(dateString: string | null | undefined): Date | null {
	if (!dateString) {
		return null;
	}

	const date = new Date(dateString);
	return isNaN(date.getTime()) ? null : date;
}
