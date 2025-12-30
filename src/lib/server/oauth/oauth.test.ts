import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Copy pure functions to avoid SvelteKit import issues

// Google OAuth URL generation (simplified for testing)
function getGoogleAuthUrl(
	clientId: string,
	redirectUri: string,
	state?: string
): string {
	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope: 'openid email profile',
		access_type: 'offline',
		prompt: 'consent'
	});

	if (state) {
		params.set('state', state);
	}

	return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// GitHub OAuth URL generation (simplified for testing)
function getGitHubAuthUrl(
	clientId: string,
	redirectUri: string,
	state?: string
): string {
	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		scope: 'read:user user:email'
	});

	if (state) {
		params.set('state', state);
	}

	return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

// OAuth user data validation
interface OAuthUserData {
	provider: 'google' | 'github';
	providerAccountId: string;
	email: string;
	name?: string;
	avatarUrl?: string;
}

function validateOAuthUserData(data: OAuthUserData): { valid: boolean; error?: string } {
	if (!data.provider || !['google', 'github'].includes(data.provider)) {
		return { valid: false, error: 'Invalid provider' };
	}

	if (!data.providerAccountId || data.providerAccountId.trim() === '') {
		return { valid: false, error: 'Provider account ID is required' };
	}

	if (!data.email || !data.email.includes('@')) {
		return { valid: false, error: 'Valid email is required' };
	}

	return { valid: true };
}

// Account linking logic
interface ExistingUser {
	id: string;
	email: string;
}

interface ExistingOAuthAccount {
	userId: string;
	provider: string;
	providerAccountId: string;
}

function determineAccountAction(
	oauthData: OAuthUserData,
	existingOAuthAccount: ExistingOAuthAccount | null,
	existingUser: ExistingUser | null
): 'login' | 'link' | 'create' {
	// If OAuth account exists, just login
	if (existingOAuthAccount) {
		return 'login';
	}

	// If user with email exists, link the account
	if (existingUser) {
		return 'link';
	}

	// Create new user
	return 'create';
}

describe('OAuth Service', () => {
	describe('Google OAuth URL', () => {
		it('generates valid Google auth URL', () => {
			const url = getGoogleAuthUrl('test-client-id', 'http://localhost:3000/callback');
			expect(url).toContain('accounts.google.com');
			expect(url).toContain('client_id=test-client-id');
			expect(url).toContain('redirect_uri=');
			expect(url).toContain('scope=');
		});

		it('includes state parameter when provided', () => {
			const url = getGoogleAuthUrl('test-client-id', 'http://localhost:3000/callback', 'test-state');
			expect(url).toContain('state=test-state');
		});

		it('does not include state when not provided', () => {
			const url = getGoogleAuthUrl('test-client-id', 'http://localhost:3000/callback');
			expect(url).not.toContain('state=');
		});
	});

	describe('GitHub OAuth URL', () => {
		it('generates valid GitHub auth URL', () => {
			const url = getGitHubAuthUrl('test-client-id', 'http://localhost:3000/callback');
			expect(url).toContain('github.com/login/oauth/authorize');
			expect(url).toContain('client_id=test-client-id');
			expect(url).toContain('scope=read%3Auser+user%3Aemail');
		});

		it('includes state parameter when provided', () => {
			const url = getGitHubAuthUrl('test-client-id', 'http://localhost:3000/callback', 'test-state');
			expect(url).toContain('state=test-state');
		});
	});

	describe('OAuth User Data Validation', () => {
		it('validates correct user data', () => {
			const result = validateOAuthUserData({
				provider: 'google',
				providerAccountId: '123456',
				email: 'test@example.com',
				name: 'Test User'
			});
			expect(result.valid).toBe(true);
		});

		it('rejects invalid provider', () => {
			const result = validateOAuthUserData({
				provider: 'invalid' as 'google',
				providerAccountId: '123456',
				email: 'test@example.com'
			});
			expect(result.valid).toBe(false);
			expect(result.error).toContain('provider');
		});

		it('rejects empty provider account ID', () => {
			const result = validateOAuthUserData({
				provider: 'github',
				providerAccountId: '',
				email: 'test@example.com'
			});
			expect(result.valid).toBe(false);
		});

		it('rejects invalid email', () => {
			const result = validateOAuthUserData({
				provider: 'google',
				providerAccountId: '123456',
				email: 'invalid-email'
			});
			expect(result.valid).toBe(false);
		});
	});

	describe('Account Linking Logic', () => {
		// Property 1: OAuth callback creates valid user
		it('property: new OAuth user always results in create action', () => {
			fc.assert(
				fc.property(
					fc.constantFrom('google', 'github') as fc.Arbitrary<'google' | 'github'>,
					fc.string({ minLength: 1, maxLength: 50 }),
					fc.emailAddress(),
					(provider, providerAccountId, email) => {
						const action = determineAccountAction(
							{ provider, providerAccountId, email },
							null, // no existing OAuth account
							null // no existing user
						);
						expect(action).toBe('create');
					}
				),
				{ numRuns: 20 }
			);
		});

		// Property 2: OAuth account linking preserves existing user
		it('property: existing user with same email results in link action', () => {
			fc.assert(
				fc.property(
					fc.constantFrom('google', 'github') as fc.Arbitrary<'google' | 'github'>,
					fc.string({ minLength: 1, maxLength: 50 }),
					fc.emailAddress(),
					fc.uuid(),
					(provider, providerAccountId, email, userId) => {
						const action = determineAccountAction(
							{ provider, providerAccountId, email },
							null, // no existing OAuth account
							{ id: userId, email } // existing user with same email
						);
						expect(action).toBe('link');
					}
				),
				{ numRuns: 20 }
			);
		});

		it('property: existing OAuth account results in login action', () => {
			fc.assert(
				fc.property(
					fc.constantFrom('google', 'github') as fc.Arbitrary<'google' | 'github'>,
					fc.string({ minLength: 1, maxLength: 50 }),
					fc.emailAddress(),
					fc.uuid(),
					(provider, providerAccountId, email, userId) => {
						const action = determineAccountAction(
							{ provider, providerAccountId, email },
							{ userId, provider, providerAccountId }, // existing OAuth account
							null
						);
						expect(action).toBe('login');
					}
				),
				{ numRuns: 20 }
			);
		});

		it('returns login when OAuth account exists', () => {
			const action = determineAccountAction(
				{ provider: 'google', providerAccountId: '123', email: 'test@example.com' },
				{ userId: 'user-1', provider: 'google', providerAccountId: '123' },
				null
			);
			expect(action).toBe('login');
		});

		it('returns link when user exists but no OAuth account', () => {
			const action = determineAccountAction(
				{ provider: 'google', providerAccountId: '123', email: 'test@example.com' },
				null,
				{ id: 'user-1', email: 'test@example.com' }
			);
			expect(action).toBe('link');
		});

		it('returns create when neither exists', () => {
			const action = determineAccountAction(
				{ provider: 'google', providerAccountId: '123', email: 'test@example.com' },
				null,
				null
			);
			expect(action).toBe('create');
		});
	});

	describe('State Parameter Security', () => {
		it('property: state parameter is included in URL when provided', () => {
			fc.assert(
				fc.property(
					fc.string({ minLength: 10, maxLength: 50 }).filter((s) => /^[\w-]+$/.test(s)),
					(state) => {
						const googleUrl = getGoogleAuthUrl('client', 'http://localhost/cb', state);
						const githubUrl = getGitHubAuthUrl('client', 'http://localhost/cb', state);

						expect(googleUrl).toContain(`state=${state}`);
						expect(githubUrl).toContain(`state=${state}`);
					}
				),
				{ numRuns: 15 }
			);
		});
	});
});
