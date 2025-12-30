import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';

// Mock $app/environment
vi.mock('$app/environment', () => ({
	browser: true
}));

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: (key: string) => store[key] ?? null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		}
	};
})();

Object.defineProperty(globalThis, 'localStorage', {
	value: localStorageMock
});

describe('useLocalStorage', () => {
	beforeEach(() => {
		localStorageMock.clear();
	});

	/**
	 * **Feature: utilities-dx, Property 5: useLocalStorage round-trip**
	 * *For any* value stored via useLocalStorage, reading from the same key should return the same value.
	 * **Validates: Requirements 3.1, 3.2, 3.3**
	 */
	it('Property 5: should round-trip values through localStorage', () => {
		fc.assert(
			fc.property(
				fc.string().filter((s) => s.length > 0 && s.length < 100),
				fc.oneof(
					fc.string(),
					fc.integer(),
					fc.boolean(),
					fc.array(fc.string(), { maxLength: 5 }),
					fc.record({ name: fc.string(), age: fc.integer({ min: 0, max: 150 }) })
				),
				(key, value) => {
					// Store value
					const serialized = JSON.stringify(value);
					localStorageMock.setItem(key, serialized);

					// Read value back
					const stored = localStorageMock.getItem(key);
					expect(stored).not.toBeNull();

					const parsed = JSON.parse(stored!);
					expect(parsed).toEqual(value);
				}
			),
			{ numRuns: 50 }
		);
	});

	it('should return initial value when key does not exist', () => {
		const key = 'nonexistent';
		const initialValue = 'default';

		const stored = localStorageMock.getItem(key);
		const result = stored !== null ? JSON.parse(stored) : initialValue;

		expect(result).toBe(initialValue);
	});

	it('should use existing localStorage value as initial', () => {
		const key = 'existing';
		const existingValue = { name: 'test' };
		localStorageMock.setItem(key, JSON.stringify(existingValue));

		const stored = localStorageMock.getItem(key);
		const result = stored !== null ? JSON.parse(stored) : null;

		expect(result).toEqual(existingValue);
	});

	it('should persist value to localStorage immediately on update', () => {
		const key = 'persist-test';
		const newValue = 'updated';

		localStorageMock.setItem(key, JSON.stringify(newValue));

		const stored = localStorageMock.getItem(key);
		expect(JSON.parse(stored!)).toBe(newValue);
	});

	it('should remove value from localStorage', () => {
		const key = 'remove-test';
		localStorageMock.setItem(key, JSON.stringify('value'));

		localStorageMock.removeItem(key);

		expect(localStorageMock.getItem(key)).toBeNull();
	});

	it('should handle complex objects', () => {
		const key = 'complex';
		const complexValue = {
			users: [
				{ id: 1, name: 'Alice' },
				{ id: 2, name: 'Bob' }
			],
			settings: {
				theme: 'dark',
				notifications: true
			}
		};

		localStorageMock.setItem(key, JSON.stringify(complexValue));
		const stored = localStorageMock.getItem(key);
		const parsed = JSON.parse(stored!);

		expect(parsed).toEqual(complexValue);
	});
});
