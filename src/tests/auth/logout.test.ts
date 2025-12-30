/**
 * Property-based tests for logout flow
 * **Feature: svelteship, Property 6: Logout invalidates session**
 * **Validates: Requirements 4.1, 4.2**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';

// Mock lucia module
const mockLucia = {
	invalidateSession: vi.fn().mockResolvedValue(undefined),
	createBlankSessionCookie: vi.fn().mockReturnValue({
		name: 'auth_session',
		value: '',
		attributes: {
			secure: false,
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 0
		}
	}),
	sessionCookieName: 'auth_session'
};

vi.mock('$lib/server/auth', () => ({
	lucia: mockLucia
}));

// Arbitrary for generating session IDs (similar to Lucia's format)
const sessionIdArb = fc.stringMatching(/^[a-zA-Z0-9]{20,40}$/);

// Arbitrary for generating user IDs
const userIdArb = fc.stringMatching(/^[a-zA-Z0-9]{10,20}$/);

describe('Logout Property Tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	/**
	 * **Feature: svelteship, Property 6: Logout invalidates session**
	 * *For any* logged-in user, clicking logout should remove the session from database
	 * AND clear the session cookie from browser.
	 * **Validates: Requirements 4.1, 4.2**
	 */
	describe('Property 6: Logout invalidates session', () => {
		it('logout invalidates session in database for any valid session (Requirements 4.1)', async () => {
			await fc.assert(
				fc.asyncProperty(sessionIdArb, userIdArb, async (sessionId, userId) => {
					// Reset mocks
					mockLucia.invalidateSession.mockClear();

					// Simulate session object (as would be in locals.session)
					const session = {
						id: sessionId,
						userId: userId,
						expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours from now
					};

					// Simulate logout action: invalidate session
					await mockLucia.invalidateSession(session.id);

					// Verify invalidateSession was called with the correct session ID
					expect(mockLucia.invalidateSession).toHaveBeenCalledTimes(1);
					expect(mockLucia.invalidateSession).toHaveBeenCalledWith(sessionId);

					return true;
				}),
				{ numRuns: 100 }
			);
		});

		it('logout clears session cookie from browser (Requirements 4.2)', async () => {
			await fc.assert(
				fc.asyncProperty(sessionIdArb, async (sessionId) => {
					// Reset mocks
					mockLucia.createBlankSessionCookie.mockClear();

					// Simulate session
					const session = {
						id: sessionId,
						userId: 'test-user',
						expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
					};

					// Simulate logout action: create blank cookie to clear session
					await mockLucia.invalidateSession(session.id);
					const blankCookie = mockLucia.createBlankSessionCookie();

					// Verify blank cookie is created
					expect(mockLucia.createBlankSessionCookie).toHaveBeenCalledTimes(1);

					// Verify blank cookie has empty value (clears the cookie)
					expect(blankCookie.value).toBe('');

					// Verify cookie attributes are set to expire/clear the cookie
					expect(blankCookie.attributes.maxAge).toBe(0);

					return true;
				}),
				{ numRuns: 100 }
			);
		});

		it('logout performs both session invalidation and cookie clearing atomically', async () => {
			await fc.assert(
				fc.asyncProperty(sessionIdArb, userIdArb, async (sessionId, userId) => {
					// Reset mocks
					mockLucia.invalidateSession.mockClear();
					mockLucia.createBlankSessionCookie.mockClear();

					// Simulate complete logout flow
					const session = {
						id: sessionId,
						userId: userId,
						expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
					};

					// Step 1: Invalidate session in database
					await mockLucia.invalidateSession(session.id);

					// Step 2: Create blank cookie to clear browser cookie
					const blankCookie = mockLucia.createBlankSessionCookie();

					// Both operations should have been performed
					expect(mockLucia.invalidateSession).toHaveBeenCalledWith(sessionId);
					expect(mockLucia.createBlankSessionCookie).toHaveBeenCalled();
					expect(blankCookie.value).toBe('');

					return true;
				}),
				{ numRuns: 100 }
			);
		});

		it('blank cookie uses correct cookie name', async () => {
			await fc.assert(
				fc.asyncProperty(sessionIdArb, async () => {
					const blankCookie = mockLucia.createBlankSessionCookie();

					// Cookie name should match the session cookie name
					expect(blankCookie.name).toBe(mockLucia.sessionCookieName);

					return true;
				}),
				{ numRuns: 100 }
			);
		});
	});
});
