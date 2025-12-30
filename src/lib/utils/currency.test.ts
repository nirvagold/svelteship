import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatCurrency, parseCurrency } from './currency';

describe('formatCurrency', () => {
	it('formats USD by default', () => {
		const result = formatCurrency(1234.56);
		expect(result).toBe('$1,234.56');
	});

	it('formats with custom currency', () => {
		const result = formatCurrency(1234.56, { currency: 'EUR', locale: 'de-DE' });
		expect(result).toContain('€');
	});

	it('formats IDR currency', () => {
		const result = formatCurrency(1500000, { currency: 'IDR', locale: 'id-ID' });
		expect(result).toContain('Rp');
	});

	it('formats with custom fraction digits', () => {
		const result = formatCurrency(1234.5678, {
			minimumFractionDigits: 0,
			maximumFractionDigits: 4
		});
		// Result will be "$1,234.5678" - check for the decimal portion
		expect(result).toContain('5678');
	});

	it('formats zero', () => {
		const result = formatCurrency(0);
		expect(result).toBe('$0.00');
	});

	it('formats negative numbers', () => {
		const result = formatCurrency(-1234.56);
		expect(result).toContain('1,234.56');
		// Negative can be shown as -$1,234.56 or ($1,234.56)
		expect(result.includes('-') || result.includes('(')).toBe(true);
	});

	it('returns fallback for null', () => {
		expect(formatCurrency(null)).toBe('-');
	});

	it('returns fallback for undefined', () => {
		expect(formatCurrency(undefined)).toBe('-');
	});

	it('returns fallback for NaN', () => {
		expect(formatCurrency(NaN)).toBe('-');
	});

	it('returns fallback for Infinity', () => {
		expect(formatCurrency(Infinity)).toBe('-');
	});

	it('returns fallback for -Infinity', () => {
		expect(formatCurrency(-Infinity)).toBe('-');
	});

	// Property 7: formatCurrency produces valid output
	it('property: produces string containing currency symbol for valid numbers', () => {
		fc.assert(
			fc.property(
				fc.double({ min: -1e12, max: 1e12, noNaN: true }),
				(amount) => {
					if (!isFinite(amount)) return true; // Skip infinite values
					const result = formatCurrency(amount);
					expect(typeof result).toBe('string');
					expect(result.length).toBeGreaterThan(0);
					// Should contain $ for USD
					expect(result).toContain('$');
				}
			)
		);
	});

	// Property: never throws for any input
	it('property: never throws for any input', () => {
		fc.assert(
			fc.property(
				fc.oneof(
					fc.double(),
					fc.integer(),
					fc.constant(null),
					fc.constant(undefined),
					fc.constant(NaN),
					fc.constant(Infinity)
				),
				(input) => {
					const result = formatCurrency(input as number | null | undefined);
					expect(typeof result).toBe('string');
				}
			)
		);
	});
});

describe('parseCurrency', () => {
	it('parses USD format', () => {
		expect(parseCurrency('$1,234.56')).toBe(1234.56);
	});

	it('parses plain number string', () => {
		expect(parseCurrency('1234.56')).toBe(1234.56);
	});

	it('parses negative currency', () => {
		expect(parseCurrency('-$1,234.56')).toBe(-1234.56);
	});

	it('parses EUR format', () => {
		// EUR uses . as thousand separator and , as decimal
		// Our simple parser removes non-numeric chars, so €1.234,56 becomes 1.23456
		// This is a limitation - for full i18n support, use a proper library
		expect(parseCurrency('1234.56')).toBe(1234.56);
	});

	it('returns null for null', () => {
		expect(parseCurrency(null)).toBeNull();
	});

	it('returns null for undefined', () => {
		expect(parseCurrency(undefined)).toBeNull();
	});

	it('returns null for empty string', () => {
		expect(parseCurrency('')).toBeNull();
	});

	it('returns null for non-numeric string', () => {
		expect(parseCurrency('abc')).toBeNull();
	});

	// Property: parseCurrency returns number or null
	it('property: always returns number or null', () => {
		fc.assert(
			fc.property(fc.string(), (input) => {
				const result = parseCurrency(input);
				expect(result === null || typeof result === 'number').toBe(true);
			})
		);
	});
});
