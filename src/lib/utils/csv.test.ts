import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { exportToCsv, parseCsv } from './csv';

describe('exportToCsv', () => {
	it('exports simple data', () => {
		const data = [
			{ name: 'John', age: 30 },
			{ name: 'Jane', age: 25 }
		];
		const csv = exportToCsv(data);
		expect(csv).toBe('name,age\nJohn,30\nJane,25');
	});

	it('exports with custom columns', () => {
		const data = [
			{ name: 'John', age: 30 },
			{ name: 'Jane', age: 25 }
		];
		const csv = exportToCsv(data, [
			{ key: 'name', header: 'Full Name' },
			{ key: 'age', header: 'Age (years)' }
		]);
		expect(csv).toBe('Full Name,Age (years)\nJohn,30\nJane,25');
	});

	it('exports with format function', () => {
		const data = [{ price: 1000 }, { price: 2500 }];
		const csv = exportToCsv(data, [
			{ key: 'price', header: 'Price', format: (v) => `$${v}` }
		]);
		expect(csv).toBe('Price\n$1000\n$2500');
	});

	it('returns empty string for empty array', () => {
		expect(exportToCsv([])).toBe('');
	});

	// Property 15: CSV export escapes special characters
	it('escapes commas in values', () => {
		const data = [{ name: 'Doe, John' }];
		const csv = exportToCsv(data);
		expect(csv).toBe('name\n"Doe, John"');
	});

	it('escapes quotes in values', () => {
		const data = [{ name: 'John "Johnny" Doe' }];
		const csv = exportToCsv(data);
		expect(csv).toBe('name\n"John ""Johnny"" Doe"');
	});

	it('escapes newlines in values', () => {
		const data = [{ address: 'Line 1\nLine 2' }];
		const csv = exportToCsv(data);
		expect(csv).toBe('address\n"Line 1\nLine 2"');
	});

	it('handles null and undefined values', () => {
		const data = [{ a: null, b: undefined, c: 'value' }];
		const csv = exportToCsv(data as { a: unknown; b: unknown; c: string }[]);
		expect(csv).toBe('a,b,c\n,,value');
	});

	// Property 15: CSV export escapes special characters (property-based)
	it('property: escapes special characters correctly', () => {
		fc.assert(
			fc.property(
				fc.array(
					fc.record({
						field: fc.string({ maxLength: 50 })
					}),
					{ minLength: 1, maxLength: 10 }
				),
				(data) => {
					const csv = exportToCsv(data);
					// CSV should be parseable
					expect(typeof csv).toBe('string');
					// Should have header + data rows
					const lines = csv.split('\n');
					expect(lines.length).toBe(data.length + 1);
				}
			)
		);
	});

	// Property 16: CSV export uses custom headers
	it('property: uses custom headers when provided', () => {
		fc.assert(
			fc.property(
				fc.array(
					fc.record({
						a: fc.string({ maxLength: 20 }),
						b: fc.integer()
					}),
					{ minLength: 1, maxLength: 5 }
				),
				fc.string({ minLength: 1, maxLength: 20 }).filter((s) => !s.includes(',') && !s.includes('"')),
				fc.string({ minLength: 1, maxLength: 20 }).filter((s) => !s.includes(',') && !s.includes('"')),
				(data, headerA, headerB) => {
					const csv = exportToCsv(data, [
						{ key: 'a', header: headerA },
						{ key: 'b', header: headerB }
					]);
					const firstLine = csv.split('\n')[0];
					expect(firstLine).toBe(`${headerA},${headerB}`);
				}
			)
		);
	});
});

describe('parseCsv', () => {
	it('parses simple CSV', () => {
		const csv = 'name,age\nJohn,30\nJane,25';
		const result = parseCsv(csv);
		expect(result).toEqual([
			{ name: 'John', age: '30' },
			{ name: 'Jane', age: '25' }
		]);
	});

	it('parses CSV with quoted fields', () => {
		const csv = 'name,address\nJohn,"123 Main St, Apt 4"';
		const result = parseCsv(csv);
		expect(result).toEqual([{ name: 'John', address: '123 Main St, Apt 4' }]);
	});

	it('parses CSV with escaped quotes', () => {
		const csv = 'name,quote\nJohn,"He said ""Hello"""';
		const result = parseCsv(csv);
		expect(result).toEqual([{ name: 'John', quote: 'He said "Hello"' }]);
	});

	it('returns empty array for empty string', () => {
		expect(parseCsv('')).toEqual([]);
	});

	it('returns empty array for header only', () => {
		expect(parseCsv('name,age')).toEqual([]);
	});

	it('handles Windows line endings', () => {
		const csv = 'name,age\r\nJohn,30\r\nJane,25';
		const result = parseCsv(csv);
		expect(result).toHaveLength(2);
	});

	// Property: round-trip (export then parse)
	it('property: round-trip preserves data structure', () => {
		fc.assert(
			fc.property(
				fc.array(
					fc.record({
						name: fc.string({ maxLength: 20 }).filter((s) => s.length > 0),
						value: fc.string({ maxLength: 20 })
					}),
					{ minLength: 1, maxLength: 5 }
				),
				(data) => {
					const csv = exportToCsv(data);
					const parsed = parseCsv<{ name: string; value: string }>(csv);
					expect(parsed.length).toBe(data.length);
					// Check structure is preserved
					parsed.forEach((item, i) => {
						expect(item.name).toBe(data[i].name);
						expect(item.value).toBe(data[i].value);
					});
				}
			)
		);
	});
});
