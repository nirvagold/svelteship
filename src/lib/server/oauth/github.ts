/**
 * GitHub OAuth provider
 */

import { env } from '$env/dynamic/private';

export interface GitHubUser {
	id: number;
	login: string;
	name: string | null;
	email: string | null;
	avatar_url: string;
	html_url: string;
}

export interface GitHubEmail {
	email: string;
	primary: boolean;
	verified: boolean;
	visibility: string | null;
}

export interface GitHubTokens {
	access_token: string;
	token_type: string;
	scope: string;
}

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';
const GITHUB_EMAILS_URL = 'https://api.github.com/user/emails';

/**
 * Get GitHub OAuth authorization URL
 */
export function getGitHubAuthUrl(redirectUri: string, state?: string): string {
	const clientId = env.GITHUB_CLIENT_ID;
	if (!clientId) {
		throw new Error('GITHUB_CLIENT_ID is not configured');
	}

	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		scope: 'read:user user:email'
	});

	if (state) {
		params.set('state', state);
	}

	return `${GITHUB_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function getGitHubTokens(
	code: string,
	redirectUri: string
): Promise<GitHubTokens> {
	const clientId = env.GITHUB_CLIENT_ID;
	const clientSecret = env.GITHUB_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		throw new Error('GitHub OAuth credentials not configured');
	}

	const response = await fetch(GITHUB_TOKEN_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({
			client_id: clientId,
			client_secret: clientSecret,
			code,
			redirect_uri: redirectUri
		})
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to get GitHub tokens: ${error}`);
	}

	const data = await response.json();

	if (data.error) {
		throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
	}

	return data;
}

/**
 * Get GitHub user info using access token
 */
export async function getGitHubUser(accessToken: string): Promise<GitHubUser> {
	const response = await fetch(GITHUB_USER_URL, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to get GitHub user: ${error}`);
	}

	return response.json();
}

/**
 * Get GitHub user's primary email
 */
export async function getGitHubPrimaryEmail(accessToken: string): Promise<string | null> {
	const response = await fetch(GITHUB_EMAILS_URL, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});

	if (!response.ok) {
		return null;
	}

	const emails: GitHubEmail[] = await response.json();

	// Find primary verified email
	const primary = emails.find((e) => e.primary && e.verified);
	if (primary) return primary.email;

	// Fallback to any verified email
	const verified = emails.find((e) => e.verified);
	if (verified) return verified.email;

	return null;
}

/**
 * Handle GitHub OAuth callback
 * Returns user info and tokens
 */
export async function handleGitHubCallback(
	code: string,
	redirectUri: string
): Promise<{ user: GitHubUser; email: string | null; tokens: GitHubTokens }> {
	const tokens = await getGitHubTokens(code, redirectUri);
	const user = await getGitHubUser(tokens.access_token);

	// Get email if not in user profile
	let email = user.email;
	if (!email) {
		email = await getGitHubPrimaryEmail(tokens.access_token);
	}

	return { user, email, tokens };
}
