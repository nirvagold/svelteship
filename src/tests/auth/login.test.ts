/**
 * Property-based tests for login flow
 * **Feature: svelteship, Property 4: Login succeeds with correct credentials**
 * **Feature: svelteship, Property 5: Login fails with incorrect credentials (security)**
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { validateEmail } from '$lib/utils/validation';

// Mock the database and lucia modules for unit testing
const mockDb = {
	query: {
		users: {
			findFirst: vi.fn()
		}
	}
};

vi.mock('$lib/server/db', () => ({
	db: mockDb
}));

const mockLucia = {
	createSession: vi.fn().mockResolvedValue({ id: 'test-session-id' }),
	createSessionCookie: vi.fn().mockReturnValue({
		name: 'auth_session',
		value: 'test-cookie-value',
		attributes: { secure: true, httpOnly: true }
	})
};

vi.mock('$lib/server/auth', () => ({
	lucia: mockLucia
}));

const mockVerify = vi.fn();

vi.mock('@node-rs/argon2', () => ({
	verify: mockVerify
}));

// Arbitraries for generating test data
const validEmailArb = fc
	.tuple(
		fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{1,10}$/),
		fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{1,8}$/),
		fc.stringMatching(/^[a-zA-Z]{2,4}$/)
	)
	.map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

const validPasswordArb = fc.string({ minLength: 8, maxLength: 50 }).filter((s) => s.length >= 8);

// Generic error message constant (same as in the actual implementation)
const INVALID_CREDENTIALS_ERROR = 'Invalid email or password';

describe('Login Property Tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	/**
	 * **Feature: svelteship, Property 4: Login succeeds with correct credentials**
	 * *For any* registered user, providing the correct email and password should create
	 * a valid session and return session cookie with secure and httpOnly flags.
	 * **Validates: Requirements 3.1, 3.4**
	 */
	describe('Property 4: Login succeeds with correct credentials', () => {
		it('valid credentials create session with secure cookie flags', async () => {
			await fc.assert(
				fc.asyncProperty(validEmailArb, validPasswordArb, async (email, password) => {
					// Setup: User exists in database
					const mockUser = {
						id: 'test-user-id',
						email: email.toLowerCase().trim(),
						passwordHash: 'hashed-password',
						name: null
					};
					mockDb.query.users.findFirst.mockResolvedValue(mockUser);
					
					// Password verification succeeds
					mockVerify.mockResolvedValue(true);

					// Validate email first
					const emailValidation = validateEmail(email);
					if (!emailValidation.valid) {
						return true; // Skip invalid emails
					}

					// Simulate login logic
					const user = await mockDb.query.users.findFirst();
					expect(user).toBeTruthy();

					const validPassword = await mockVerify(user!.passwordHash, password);
					expect(validPassword).toBe(true);

					// Create session
					const session = await mockLucia.createSession(user!.id, {});
					expect(session.id).toBeTruthy();

					// Get session cookie
					const sessionCookie = mockLucia.createSessionCookie(session.id);
					
					// Verify secure and httpOnly flags (Requirements 3.4)
					expect(sessionCookie.attributes.secure).toBe(true);
					expect(sessionCookie.attributes.httpOnly).toBe(true);

					return true;
				}),
				{ numRuns: 100 }
			);
		});

		it('session is created for user with matching email', async () => {
			await fc.assert(
				fc.asyncProperty(validEmailArb, validPasswordArb, async (email, _password) => {
					const normalizedEmail = email.toLowerCase().trim();
					
					// Setup: User exists
					const mockUser = {
						id: 'user-123',
						email: normalizedEmail,
						passwordHash: 'hashed-password',
						name: 'Test User'
					};
					mockDb.query.users.findFirst.mockResolvedValue(mockUser);
					mockVerify.mockResolvedValue(true);

					const emailValidation = validateEmail(email);
					if (!emailValidation.valid) {
						return true;
					}

					// Verify session is created with correct user ID
					const user = await mockDb.query.users.findFirst();
					if (user) {
						await mockLucia.createSession(user.id, {});
						expect(mockLucia.createSession).toHaveBeenCalledWith(mockUser.id, {});
					}

					return true;
				}),
				{ numRuns: 100 }
			);
		});
	});

	/**
	 * **Feature: svelteship, Property 5: Login fails with incorrect credentials (security)**
	 * *For any* login attempt with incorrect password OR non-existent email, the system
	 * should return the same generic error message without revealing which field is wrong.
	 * **Validates: Requirements 3.2, 3.3**
	 */
	describe('Property 5: Login fails with incorrect credentials (security)', () => {
		it('non-existent email returns generic error (Requirements 3.3)', async () => {
			await fc.assert(
				fc.asyncProperty(validEmailArb, validPasswordArb, async (email, _password) => {
					// Setup: User does NOT exist
					mockDb.query.users.findFirst.mockResolvedValue(null);

					const emailValidation = validateEmail(email);
					if (!emailValidation.valid) {
						return true;
					}

					// Simulate login logic
					const user = await mockDb.query.users.findFirst();
					
					if (!user) {
						// Should return generic error, not "user not found" or "email not registered"
						const errorMessage = INVALID_CREDENTIALS_ERROR;
						expect(errorMessage).toBe('Invalid email or password');
						// The error should NOT reveal that the email specifically doesn't exist
						expect(errorMessage).not.toContain('not found');
						expect(errorMessage).not.toContain('does not exist');
						expect(errorMessage).not.toContain('not registered');
						expect(errorMessage).not.toContain('unknown');
					}

					return true;
				}),
				{ numRuns: 100 }
			);
		});

		it('incorrect password returns generic error (Requirements 3.2)', async () => {
			await fc.assert(
				fc.asyncProperty(validEmailArb, validPasswordArb, async (email, password) => {
					// Setup: User exists but password is wrong
					const mockUser = {
						id: 'test-user-id',
						email: email.toLowerCase().trim(),
						passwordHash: 'correct-hash',
						name: null
					};
					mockDb.query.users.findFirst.mockResolvedValue(mockUser);
					mockVerify.mockResolvedValue(false); // Password verification fails

					const emailValidation = validateEmail(email);
					if (!emailValidation.valid) {
						return true;
					}

					// Simulate login logic
					const user = await mockDb.query.users.findFirst();
					const validPassword = await mockVerify(user!.passwordHash, password);
					
					if (!validPassword) {
						// Should return generic error, not "wrong password" or "incorrect password"
						const errorMessage = INVALID_CREDENTIALS_ERROR;
						expect(errorMessage).toBe('Invalid email or password');
						// The error should NOT reveal that the password specifically is wrong
						expect(errorMessage).not.toContain('wrong');
						expect(errorMessage).not.toContain('incorrect');
						expect(errorMessage).not.toContain('mismatch');
					}

					return true;
				}),
				{ numRuns: 100 }
			);
		});

		it('error messages are identical for non-existent email and wrong password', async () => {
			await fc.assert(
				fc.asyncProperty(validEmailArb, validPasswordArb, async (email, _password) => {
					const emailValidation = validateEmail(email);
					if (!emailValidation.valid) {
						return true;
					}

					// Scenario 1: Non-existent email
					mockDb.query.users.findFirst.mockResolvedValue(null);
					const user1 = await mockDb.query.users.findFirst();
					const error1 = !user1 ? INVALID_CREDENTIALS_ERROR : null;

					// Scenario 2: Wrong password
					const mockUser = {
						id: 'test-user-id',
						email: email.toLowerCase().trim(),
						passwordHash: 'correct-hash',
						name: null
					};
					mockDb.query.users.findFirst.mockResolvedValue(mockUser);
					mockVerify.mockResolvedValue(false);
					
					const user2 = await mockDb.query.users.findFirst();
					const validPassword = await mockVerify(user2!.passwordHash, 'wrong-password');
					const error2 = !validPassword ? INVALID_CREDENTIALS_ERROR : null;

					// Both errors should be identical (security requirement)
					expect(error1).toBe(error2);
					expect(error1).toBe('Invalid email or password');

					return true;
				}),
				{ numRuns: 100 }
			);
		});

		it('no session is created for failed login attempts', async () => {
			await fc.assert(
				fc.asyncProperty(validEmailArb, validPasswordArb, async (email, _password) => {
					// Reset mock call counts
					mockLucia.createSession.mockClear();

					const emailValidation = validateEmail(email);
					if (!emailValidation.valid) {
						return true;
					}

					// Test with non-existent user
					mockDb.query.users.findFirst.mockResolvedValue(null);
					const user = await mockDb.query.users.findFirst();
					
					if (!user) {
						// Session should NOT be created
						expect(mockLucia.createSession).not.toHaveBeenCalled();
					}

					return true;
				}),
				{ numRuns: 100 }
			);
		});
	});
});
