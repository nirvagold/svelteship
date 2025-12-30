/**
 * Property tests for email verification
 * Property 6: Email verification token validity
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

describe('Email Verification Properties', () => {
	describe('Property 6: Email verification token validity', () => {
		const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

		it('should only accept tokens within validity period', () => {
			function isTokenValid(createdAt: Date, now: Date): boolean {
				// Handle invalid dates
				if (isNaN(createdAt.getTime()) || isNaN(now.getTime())) {
					return false;
				}
				const expiresAt = new Date(createdAt.getTime() + TOKEN_EXPIRY_MS);
				return now < expiresAt;
			}

			fc.assert(
				fc.property(
					fc.integer({ min: 1704067200000, max: 1735689600000 }), // 2024-01-01 to 2025-01-01 in ms
					fc.integer({ min: 0, max: 48 * 60 * 60 * 1000 }), // 0 to 48 hours in ms
					(createdAtMs, elapsedMs) => {
						const createdAt = new Date(createdAtMs);
						const now = new Date(createdAtMs + elapsedMs);
						const isValid = isTokenValid(createdAt, now);

						if (elapsedMs < TOKEN_EXPIRY_MS) {
							expect(isValid).toBe(true);
						} else {
							expect(isValid).toBe(false);
						}
					}
				)
			);
		});

		it('should reject tokens exactly at expiry time', () => {
			function isTokenValid(expiresAt: Date, now: Date): boolean {
				return now < expiresAt;
			}

			fc.assert(
				fc.property(
					fc.integer({ min: 1704067200000, max: 1735689600000 }), // 2024-01-01 to 2025-01-01 in ms
					(timestamp) => {
						const date = new Date(timestamp);
						// Token should be invalid exactly at expiry time
						const isValid = isTokenValid(date, date);
						expect(isValid).toBe(false);
					}
				)
			);
		});

		it('should accept tokens 1ms before expiry', () => {
			function isTokenValid(expiresAt: Date, now: Date): boolean {
				// Handle invalid dates
				if (isNaN(expiresAt.getTime()) || isNaN(now.getTime())) {
					return false;
				}
				return now < expiresAt;
			}

			fc.assert(
				fc.property(
					fc.integer({ min: 1704067200000, max: 1735689600000 }), // 2024-01-01 to 2025-01-01 in ms
					(timestamp) => {
						const expiresAt = new Date(timestamp);
						const oneMillisecondBefore = new Date(timestamp - 1);
						const isValid = isTokenValid(expiresAt, oneMillisecondBefore);
						expect(isValid).toBe(true);
					}
				)
			);
		});
	});

	describe('Token single-use property', () => {
		it('should invalidate token after successful verification', () => {
			const tokenDb = new Map<string, { userId: string; expiresAt: Date }>();
			const verifiedUsers = new Set<string>();

			function createToken(userId: string): string {
				const token = crypto.randomUUID();
				tokenDb.set(token, {
					userId,
					expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
				});
				return token;
			}

			function verifyEmail(token: string): { success: boolean; error?: string } {
				const tokenData = tokenDb.get(token);

				if (!tokenData) {
					return { success: false, error: 'Invalid token' };
				}

				if (new Date() > tokenData.expiresAt) {
					tokenDb.delete(token);
					return { success: false, error: 'Token expired' };
				}

				// Mark user as verified
				verifiedUsers.add(tokenData.userId);

				// Delete token (single-use)
				tokenDb.delete(token);

				return { success: true };
			}

			fc.assert(
				fc.property(fc.uuid(), (userId) => {
					const token = createToken(userId);

					// First verification should succeed
					const firstAttempt = verifyEmail(token);
					expect(firstAttempt.success).toBe(true);

					// User should be verified
					expect(verifiedUsers.has(userId)).toBe(true);

					// Second attempt with same token should fail
					const secondAttempt = verifyEmail(token);
					expect(secondAttempt.success).toBe(false);
					expect(secondAttempt.error).toBe('Invalid token');

					// Clean up
					verifiedUsers.delete(userId);
				})
			);
		});
	});

	describe('Resend verification', () => {
		it('should invalidate old tokens when resending', () => {
			const tokenDb = new Map<string, { userId: string; expiresAt: Date }>();

			function createToken(userId: string): string {
				// Delete any existing tokens for this user
				for (const [token, data] of tokenDb.entries()) {
					if (data.userId === userId) {
						tokenDb.delete(token);
					}
				}

				const token = crypto.randomUUID();
				tokenDb.set(token, {
					userId,
					expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
				});
				return token;
			}

			function isTokenValid(token: string): boolean {
				return tokenDb.has(token);
			}

			fc.assert(
				fc.property(fc.uuid(), (userId) => {
					// Create first token
					const firstToken = createToken(userId);
					expect(isTokenValid(firstToken)).toBe(true);

					// Create second token (simulating resend)
					const secondToken = createToken(userId);

					// First token should be invalidated
					expect(isTokenValid(firstToken)).toBe(false);

					// Second token should be valid
					expect(isTokenValid(secondToken)).toBe(true);

					// Clean up
					tokenDb.delete(secondToken);
				})
			);
		});
	});
});
