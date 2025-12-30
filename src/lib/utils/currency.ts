/**
 * Currency formatting utilities
 */

export interface CurrencyFormatOptions {
	currency?: string;
	locale?: string;
	minimumFractionDigits?: number;
	maximumFractionDigits?: number;
}

/**
 * Format a number as currency
 */
export function formatCurrency(
	amount: number | null | undefined,
	options: CurrencyFormatOptions = {}
): string {
	const {
		currency = 'USD',
		locale = 'en-US',
		minimumFractionDigits = 2,
		maximumFractionDigits = 2
	} = options;

	if (amount === null || amount === undefined || isNaN(amount)) {
		return '-';
	}

	if (!isFinite(amount)) {
		return '-';
	}

	try {
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency,
			minimumFractionDigits,
			maximumFractionDigits
		}).format(amount);
	} catch {
		return '-';
	}
}

/**
 * Parse a currency string to number
 */
export function parseCurrency(value: string | null | undefined): number | null {
	if (!value) {
		return null;
	}

	// Remove currency symbols, spaces, and thousand separators
	const cleaned = value.replace(/[^0-9.-]/g, '');

	if (!cleaned) {
		return null;
	}

	const num = parseFloat(cleaned);
	return isNaN(num) ? null : num;
}
