import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateId, generateUUID } from './id';

describe('generateId', () => {
	it('generates ID with default length', () => {
		const id = generateId();
		expect(id).toHaveLength(12);
	});

	it('generates ID with custom length', () => {
		const id = generateId({ length: 20 });
		expect(id).toHaveLength(20);
	});

	it('generates ID with prefix', () => {
		const id = generateId({ prefix: 'user_' });
		expect(id).toMatch(/^user_/);
		expect(id).toHaveLength(17); // prefix (5) + default length (12)
	});

	it('generates ID with custom alphabet', () => {
		const id = generateId({ alphabet: '0123456789', length: 10 });
		expect(id).toMatch(/^[0-9]+$/);
	});

	it('generates ID with prefix and custom length', () => {
		const id = generateId({ prefix: 'id_', length: 8 });
		expect(id).toMatch(/^id_/);
		expect(id).toHaveLength(11); // prefix (3) + length (8)
	});

	// Property 8: generateId uniqueness
	it('property: generates unique IDs', () => {
		fc.assert(
			fc.property(fc.integer({ min: 10, max: 100 }), (count) => {
				const ids = new Set<string>();
				for (let i = 0; i < count; i++) {
					ids.add(generateId());
				}
				expect(ids.size).toBe(count);
			})
		);
	});

	// Property 9: generateId respects length
	it('property: respects specified length', () => {
		fc.assert(
			fc.property(fc.integer({ min: 1, max: 100 }), (length) => {
				const id = generateId({ length });
				expect(id).toHaveLength(length);
			})
		);
	});

	// Property: prefix is always at the start
	it('property: prefix is always at the start', () => {
		fc.assert(
			fc.property(
				fc.string({ minLength: 1, maxLength: 10 }).filter((s) => /^[a-zA-Z_]+$/.test(s)),
				(prefix) => {
					const id = generateId({ prefix });
					expect(id.startsWith(prefix)).toBe(true);
				}
			)
		);
	});

	// Property: uses only characters from alphabet
	it('property: uses only characters from alphabet', () => {
		fc.assert(
			fc.property(
				fc.string({ minLength: 2, maxLength: 20 }).filter((s) => s.length > 0 && new Set(s).size > 1),
				(alphabet) => {
					const id = generateId({ alphabet, length: 50 });
					const alphabetSet = new Set(alphabet);
					for (const char of id) {
						expect(alphabetSet.has(char)).toBe(true);
					}
				}
			)
		);
	});
});

describe('generateUUID', () => {
	it('generates valid UUID format', () => {
		const uuid = generateUUID();
		expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
	});

	it('generates unique UUIDs', () => {
		const uuids = new Set<string>();
		for (let i = 0; i < 100; i++) {
			uuids.add(generateUUID());
		}
		expect(uuids.size).toBe(100);
	});

	// Property: UUID format is always valid
	it('property: always generates valid UUID v4 format', () => {
		fc.assert(
			fc.property(fc.integer({ min: 1, max: 50 }), () => {
				const uuid = generateUUID();
				expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
			})
		);
	});
});
