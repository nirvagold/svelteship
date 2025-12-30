import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatDate, formatRelative, parseDate } from './date';

describe('formatDate', () => {
	it('formats valid date with default options', () => {
		const date = new Date('2024-06-15');
		const result = formatDate(date);
		expect(result).toContain('2024');
		expect(result).toContain('Jun');
		expect(result).toContain('15');
	});

	it('formats date with short format', () => {
		const date = new Date('2024-06-15');
		const result = formatDate(date, { format: 'short' });
		expect(result).toMatch(/\d+/);
	});

	it('formats date with long format', () => {
		const date = new Date('2024-06-15');
		const result = formatDate(date, { format: 'long' });
		expect(result).toContain('June');
	});

	it('formats date with full format', () => {
		const date = new Date('2024-06-15');
		const result = formatDate(date, { format: 'full' });
		expect(result).toContain('Saturday');
	});

	it('formats date from string', () => {
		const result = formatDate('2024-06-15');
		expect(result).toContain('2024');
	});

	it('formats date from timestamp', () => {
		const timestamp = new Date('2024-06-15').getTime();
		const result = formatDate(timestamp);
		expect(result).toContain('2024');
	});

	// Property 6: formatDate handles invalid dates
	it('returns fallback for null', () => {
		expect(formatDate(null)).toBe('-');
	});

	it('returns fallback for undefined', () => {
		expect(formatDate(undefined)).toBe('-');
	});

	it('returns fallback for invalid date string', () => {
		expect(formatDate('not-a-date')).toBe('-');
	});

	it('returns fallback for invalid Date object', () => {
		expect(formatDate(new Date('invalid'))).toBe('-');
	});

	// Property-based test: formatDate handles invalid dates without throwing
	it('property: never throws for any input', () => {
		fc.assert(
			fc.property(
				fc.oneof(
					fc.string(),
					fc.integer(),
					fc.constant(null),
					fc.constant(undefined),
					fc.constant(NaN),
					fc.constant(Infinity)
				),
				(input) => {
					const result = formatDate(input as Date | string | number | null | undefined);
					expect(typeof result).toBe('string');
				}
			)
		);
	});
});

describe('formatRelative', () => {
	it('formats date in the past', () => {
		const now = new Date('2024-06-15T12:00:00');
		const past = new Date('2024-06-15T10:00:00');
		const result = formatRelative(past, now);
		expect(result).toContain('hour');
	});

	it('formats date in the future', () => {
		const now = new Date('2024-06-15T12:00:00');
		const future = new Date('2024-06-15T14:00:00');
		const result = formatRelative(future, now);
		expect(result).toContain('hour');
	});

	it('formats seconds ago', () => {
		const now = new Date('2024-06-15T12:00:30');
		const past = new Date('2024-06-15T12:00:00');
		const result = formatRelative(past, now);
		expect(result).toContain('second');
	});

	it('formats days ago', () => {
		const now = new Date('2024-06-15');
		const past = new Date('2024-06-12');
		const result = formatRelative(past, now);
		expect(result).toContain('day');
	});

	it('formats weeks ago', () => {
		const now = new Date('2024-06-15');
		const past = new Date('2024-06-01');
		const result = formatRelative(past, now);
		expect(result).toContain('week');
	});

	it('formats months ago', () => {
		const now = new Date('2024-06-15');
		const past = new Date('2024-03-15');
		const result = formatRelative(past, now);
		expect(result).toContain('month');
	});

	it('formats years ago', () => {
		const now = new Date('2024-06-15');
		const past = new Date('2022-06-15');
		const result = formatRelative(past, now);
		expect(result).toContain('year');
	});

	it('returns fallback for null', () => {
		expect(formatRelative(null)).toBe('-');
	});

	it('returns fallback for undefined', () => {
		expect(formatRelative(undefined)).toBe('-');
	});

	it('returns fallback for invalid date', () => {
		expect(formatRelative('invalid')).toBe('-');
	});
});

describe('parseDate', () => {
	it('parses valid ISO date string', () => {
		const result = parseDate('2024-06-15');
		expect(result).toBeInstanceOf(Date);
		expect(result?.getFullYear()).toBe(2024);
	});

	it('parses valid datetime string', () => {
		const result = parseDate('2024-06-15T12:30:00');
		expect(result).toBeInstanceOf(Date);
	});

	it('returns null for null input', () => {
		expect(parseDate(null)).toBeNull();
	});

	it('returns null for undefined input', () => {
		expect(parseDate(undefined)).toBeNull();
	});

	it('returns null for empty string', () => {
		expect(parseDate('')).toBeNull();
	});

	it('returns null for invalid date string', () => {
		expect(parseDate('not-a-date')).toBeNull();
	});

	// Property-based test: parseDate returns Date or null
	it('property: always returns Date or null', () => {
		fc.assert(
			fc.property(fc.string(), (input) => {
				const result = parseDate(input);
				expect(result === null || result instanceof Date).toBe(true);
			})
		);
	});
});
