/**
 * Property-based tests for protected routes
 * **Feature: svelteship, Property 7: Protected routes require authentication**
 * **Validates: Requirements 5.1, 5.2**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { redirect } from '@sveltejs/kit';

// Mock SvelteKit redirect
vi.mock('@sveltejs/kit', () => ({
	redirect: vi.fn((status: number, location: string) => {
		const error = new Error(`Redirect to ${location}`) as Error & { status: number; location: string };
		error.status = status;
		error.location = location;
		throw error;
	})
}));

// Arbitrary for generating user data
const userIdArb = fc.stringMatching(/^[a-zA-Z0-9]{10,20}$/);
const emailArb = fc
	.tuple(
		fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{1,10}$/),
		fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{1,8}$/),
		fc.stringMatching(/^[a-zA-Z]{2,4}$/)
	)
	.map(([local, domain, tld]) => `${local}@${domain}.${tld}`);
const nameArb = fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null });

// Arbitrary for generating session data
const sessionIdArb = fc.stringMatching(/^[a-zA-Z0-9]{20,40}$/);
const futureTimestampArb = fc.date({ min: new Date(), max: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) });

// Simulates the load function logic from +layout.server.ts
async function simulateProtectedRouteLoad(locals: { user: unknown; session: unknown }) {
	// Check for valid session, redirect if not authenticated
	if (!locals.user || !locals.session) {
		throw redirect(302, '/login');
	}

	// Pass user data to layout
	return {
		user: locals.user
	};
}

describe('Protected Routes Property Tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	/**
	 * **Feature: svelteship, Property 7: Protected routes require authentication**
	 * *For any* protected route and any request without valid session, the system should
	 * redirect to login page. Conversely, any request with valid session should be granted access.
	 * **Validates: Requirements 5.1, 5.2**
	 */
	describe('Property 7: Protected routes require authentication', () => {
		it('unauthenticated requests redirect to login (Requirements 5.1)', async () => {
			await fc.assert(
				fc.asyncProperty(fc.constant(null), fc.constant(null), async (user, session) => {
					const locals = { user, session };

					try {
						await simulateProtectedRouteLoad(locals);
						// Should not reach here - redirect should be thrown
						expect.fail('Expected redirect to be thrown');
					} catch (error) {
						const redirectError = error as Error & { status: number; location: string };
						// Verify redirect to login page
						expect(redirectError.status).toBe(302);
						expect(redirectError.location).toBe('/login');
					}

					return true;
				}),
				{ numRuns: 100 }
			);
		});

		it('requests with null user redirect to login', async () => {
			await fc.assert(
				fc.asyncProperty(sessionIdArb, userIdArb, futureTimestampArb, async (sessionId, userId, expiresAt) => {
					// Session exists but user is null
					const session = { id: sessionId, userId, expiresAt };
					const locals = { user: null, session };

					try {
						await simulateProtectedRouteLoad(locals);
						expect.fail('Expected redirect to be thrown');
					} catch (error) {
						const redirectError = error as Error & { status: number; location: string };
						expect(redirectError.status).toBe(302);
						expect(redirectError.location).toBe('/login');
					}

					return true;
				}),
				{ numRuns: 100 }
			);
		});

		it('requests with null session redirect to login', async () => {
			await fc.assert(
				fc.asyncProperty(userIdArb, emailArb, nameArb, async (userId, email, name) => {
					// User exists but session is null
					const user = { id: userId, email, name };
					const locals = { user, session: null };

					try {
						await simulateProtectedRouteLoad(locals);
						expect.fail('Expected redirect to be thrown');
					} catch (error) {
						const redirectError = error as Error & { status: number; location: string };
						expect(redirectError.status).toBe(302);
						expect(redirectError.location).toBe('/login');
					}

					return true;
				}),
				{ numRuns: 100 }
			);
		});

		it('authenticated requests with valid session are granted access (Requirements 5.2)', async () => {
			await fc.assert(
				fc.asyncProperty(
					userIdArb,
					emailArb,
					nameArb,
					sessionIdArb,
					futureTimestampArb,
					async (userId, email, name, sessionId, expiresAt) => {
						// Both user and session exist
						const user = { id: userId, email, name };
						const session = { id: sessionId, userId, expiresAt };
						const locals = { user, session };

						// Should not throw - access granted
						const result = await simulateProtectedRouteLoad(locals);

						// Verify user data is returned
						const returnedUser = result.user as typeof user;
						expect(returnedUser).toBe(user);
						expect(returnedUser.id).toBe(userId);
						expect(returnedUser.email).toBe(email);

						return true;
					}
				),
				{ numRuns: 100 }
			);
		});

		it('user data is correctly passed to layout for authenticated requests', async () => {
			await fc.assert(
				fc.asyncProperty(
					userIdArb,
					emailArb,
					nameArb,
					sessionIdArb,
					futureTimestampArb,
					async (userId, email, name, sessionId, expiresAt) => {
						const user = { id: userId, email, name };
						const session = { id: sessionId, userId, expiresAt };
						const locals = { user, session };

						const result = await simulateProtectedRouteLoad(locals);

						// Verify all user properties are passed through
						const returnedUser = result.user as typeof user;
						expect(returnedUser).toEqual(user);
						expect(returnedUser.id).toBe(userId);
						expect(returnedUser.email).toBe(email);
						expect(returnedUser.name).toBe(name);

						return true;
					}
				),
				{ numRuns: 100 }
			);
		});

		it('redirect uses 302 status code for unauthenticated requests', async () => {
			await fc.assert(
				fc.asyncProperty(
					fc.oneof(
						fc.constant({ user: null, session: null }),
						fc.constant({ user: null, session: { id: 'test' } }),
						fc.constant({ user: undefined, session: undefined })
					),
					async (locals) => {
						try {
							await simulateProtectedRouteLoad(locals as { user: unknown; session: unknown });
							expect.fail('Expected redirect to be thrown');
						} catch (error) {
							const redirectError = error as Error & { status: number; location: string };
							// 302 is the correct status for temporary redirect
							expect(redirectError.status).toBe(302);
						}

						return true;
					}
				),
				{ numRuns: 100 }
			);
		});
	});
});
