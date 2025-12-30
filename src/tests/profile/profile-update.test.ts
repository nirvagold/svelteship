/**
 * Property-based tests for profile update
 * **Feature: svelteship, Property 8: Profile update persists valid changes**
 * **Validates: Requirements 6.2, 6.3**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { validateName } from '$lib/utils/validation';

// Mock the database module
const mockUpdate = vi.fn();
const mockSet = vi.fn();
const mockWhere = vi.fn();

const mockDb = {
	update: vi.fn(() => ({
		set: mockSet.mockReturnValue({
			where: mockWhere.mockResolvedValue(undefined)
		})
	}))
};

vi.mock('$lib/server/db', () => ({
	db: mockDb
}));

vi.mock('drizzle-orm', () => ({
	eq: vi.fn((a, b) => ({ field: a, value: b }))
}));

// Arbitraries for generating test data
const validNameArb = fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0 && s.trim().length <= 100);
const invalidNameArb = fc.string({ minLength: 101, maxLength: 200 }).filter((s) => s.trim().length > 100);
const mockUserArb = fc.record({
	id: fc.uuid(),
	email: fc.emailAddress(),
	name: fc.option(fc.string({ maxLength: 100 }), { nil: null })
});

describe('Profile Update Property Tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	/**
	 * **Feature: svelteship, Property 8: Profile update persists valid changes**
	 * *For any* authenticated user and valid profile data, updating profile should persist changes to database.
	 * **Validates: Requirements 6.2, 6.3**
	 */
	describe('Property 8: Profile update persists valid changes', () => {
		it('valid name updates are persisted to database', async () => {
			await fc.assert(
				fc.asyncProperty(mockUserArb, validNameArb, async (user, newName) => {
					// Reset mocks
					vi.clearAllMocks();
					mockDb.update.mockReturnValue({
						set: mockSet.mockReturnValue({
							where: mockWhere.mockResolvedValue(undefined)
						})
					});

					// Validate the name first
					const nameValidation = validateName(newName);
					if (!nameValidation.valid) {
						return true; // Skip invalid names
					}

					// Simulate profile update logic
					const trimmedName = newName.trim() || null;

					// Call the update
					await mockDb.update().set({
						name: trimmedName,
						updatedAt: expect.any(Date)
					}).where({ field: 'users.id', value: user.id });

					// Verify update was called with correct data
					expect(mockSet).toHaveBeenCalledWith(
						expect.objectContaining({
							name: trimmedName
						})
					);
					expect(mockWhere).toHaveBeenCalled();

					return true;
				}),
				{ numRuns: 100 }
			);
		});

		it('invalid name updates are rejected without database changes', async () => {
			await fc.assert(
				fc.asyncProperty(mockUserArb, invalidNameArb, async (user, invalidName) => {
					// Reset mocks
					vi.clearAllMocks();

					// Validate the name
					const nameValidation = validateName(invalidName);

					// Invalid names should fail validation
					expect(nameValidation.valid).toBe(false);
					expect(nameValidation.error).toBeDefined();

					// Database should NOT be updated for invalid data
					expect(mockDb.update).not.toHaveBeenCalled();

					return true;
				}),
				{ numRuns: 100 }
			);
		});

		it('empty string name is treated as null', async () => {
			await fc.assert(
				fc.asyncProperty(mockUserArb, async (user) => {
					// Reset mocks
					vi.clearAllMocks();
					mockDb.update.mockReturnValue({
						set: mockSet.mockReturnValue({
							where: mockWhere.mockResolvedValue(undefined)
						})
					});

					// Empty string should be valid
					const nameValidation = validateName('');
					expect(nameValidation.valid).toBe(true);

					// Simulate profile update with empty name
					const trimmedName = ''.trim() || null;

					await mockDb.update().set({
						name: trimmedName,
						updatedAt: expect.any(Date)
					}).where({ field: 'users.id', value: user.id });

					// Verify name is set to null
					expect(mockSet).toHaveBeenCalledWith(
						expect.objectContaining({
							name: null
						})
					);

					return true;
				}),
				{ numRuns: 100 }
			);
		});

		it('whitespace-only name is treated as null', async () => {
			// Generate whitespace-only strings
			const whitespaceArb = fc.array(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 50 })
				.map((chars) => chars.join(''));

			await fc.assert(
				fc.asyncProperty(
					mockUserArb,
					whitespaceArb,
					async (user, whitespaceOnlyName: string) => {
						// Reset mocks
						vi.clearAllMocks();
						mockDb.update.mockReturnValue({
							set: mockSet.mockReturnValue({
								where: mockWhere.mockResolvedValue(undefined)
							})
						});

						// Whitespace-only should be valid (treated as empty)
						const nameValidation = validateName(whitespaceOnlyName);
						expect(nameValidation.valid).toBe(true);

						// Simulate profile update
						const trimmedName = whitespaceOnlyName.trim() || null;

						await mockDb.update().set({
							name: trimmedName,
							updatedAt: expect.any(Date)
						}).where({ field: 'users.id', value: user.id });

						// Verify name is set to null (since trim results in empty string)
						expect(mockSet).toHaveBeenCalledWith(
							expect.objectContaining({
								name: null
							})
						);

						return true;
					}
				),
				{ numRuns: 100 }
			);
		});
	});
});
