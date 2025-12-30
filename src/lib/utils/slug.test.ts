import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { slugify, uniqueSlug } from './slug';

describe('slugify', () => {
	it('converts simple text to slug', () => {
		expect(slugify('Hello World')).toBe('hello-world');
	});

	it('handles multiple spaces', () => {
		expect(slugify('Hello   World')).toBe('hello-world');
	});

	it('removes special characters', () => {
		expect(slugify('Hello! @World#')).toBe('hello-world');
	});

	it('handles unicode characters', () => {
		expect(slugify('Café Résumé')).toBe('cafe-resume');
	});

	it('handles underscores', () => {
		expect(slugify('hello_world')).toBe('hello-world');
	});

	it('removes leading/trailing separators', () => {
		expect(slugify('  Hello World  ')).toBe('hello-world');
	});

	it('handles empty string', () => {
		expect(slugify('')).toBe('');
	});

	it('handles null', () => {
		expect(slugify(null)).toBe('');
	});

	it('handles undefined', () => {
		expect(slugify(undefined)).toBe('');
	});

	it('preserves case when lowercase is false', () => {
		expect(slugify('Hello World', { lowercase: false })).toBe('Hello-World');
	});

	it('uses custom separator', () => {
		expect(slugify('Hello World', { separator: '_' })).toBe('hello_world');
	});

	it('respects maxLength', () => {
		const slug = slugify('This is a very long title', { maxLength: 10 });
		expect(slug.length).toBeLessThanOrEqual(10);
	});

	it('removes trailing separator after maxLength cut', () => {
		const slug = slugify('Hello World Test', { maxLength: 11 });
		expect(slug).not.toMatch(/-$/);
	});

	// Property 10: slugify produces URL-safe output
	it('property: produces URL-safe output', () => {
		fc.assert(
			fc.property(fc.string({ maxLength: 100 }), (input) => {
				const slug = slugify(input);
				// Should only contain lowercase letters, numbers, and hyphens
				expect(slug).toMatch(/^[a-z0-9-]*$/);
			})
		);
	});

	// Property 11: slugify collapses consecutive hyphens
	it('property: collapses consecutive hyphens', () => {
		fc.assert(
			fc.property(fc.string({ maxLength: 100 }), (input) => {
				const slug = slugify(input);
				// Should not have consecutive hyphens
				expect(slug).not.toMatch(/--/);
			})
		);
	});

	// Property: no leading or trailing hyphens
	it('property: no leading or trailing hyphens', () => {
		fc.assert(
			fc.property(fc.string({ maxLength: 100 }), (input) => {
				const slug = slugify(input);
				if (slug.length > 0) {
					expect(slug).not.toMatch(/^-/);
					expect(slug).not.toMatch(/-$/);
				}
			})
		);
	});

	// Property: maxLength is respected
	it('property: maxLength is respected', () => {
		fc.assert(
			fc.property(
				fc.string({ maxLength: 200 }),
				fc.integer({ min: 1, max: 50 }),
				(input, maxLength) => {
					const slug = slugify(input, { maxLength });
					expect(slug.length).toBeLessThanOrEqual(maxLength);
				}
			)
		);
	});
});

describe('uniqueSlug', () => {
	it('returns base slug if not in existing', () => {
		expect(uniqueSlug('Hello World', [])).toBe('hello-world');
	});

	it('appends number if slug exists', () => {
		expect(uniqueSlug('Hello World', ['hello-world'])).toBe('hello-world-1');
	});

	it('increments number until unique', () => {
		expect(uniqueSlug('Hello World', ['hello-world', 'hello-world-1', 'hello-world-2'])).toBe(
			'hello-world-3'
		);
	});

	it('respects slugify options', () => {
		expect(uniqueSlug('Hello World', [], { separator: '_' })).toBe('hello_world');
	});

	// Property: uniqueSlug always returns unique slug
	it('property: always returns unique slug', () => {
		fc.assert(
			fc.property(
				fc.string({ minLength: 1, maxLength: 50 }).filter((s) => /[a-zA-Z]/.test(s)),
				fc.array(fc.string({ maxLength: 30 }), { maxLength: 10 }),
				(text, existing) => {
					const slug = uniqueSlug(text, existing);
					expect(existing.includes(slug)).toBe(false);
				}
			)
		);
	});
});
