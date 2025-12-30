/**
 * Google OAuth provider
 */

import { env } from '$env/dynamic/private';

export interface GoogleUser {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name?: string;
	family_name?: string;
	picture?: string;
	locale?: string;
}

export interface GoogleTokens {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
	token_type: string;
	scope: string;
	id_token?: string;
}

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

/**
 * Get Google OAuth authorization URL
 */
export function getGoogleAuthUrl(redirectUri: string, state?: string): string {
	const clientId = env.GOOGLE_CLIENT_ID;
	if (!clientId) {
		throw new Error('GOOGLE_CLIENT_ID is not configured');
	}

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

	return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function getGoogleTokens(
	code: string,
	redirectUri: string
): Promise<GoogleTokens> {
	const clientId = env.GOOGLE_CLIENT_ID;
	const clientSecret = env.GOOGLE_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		throw new Error('Google OAuth credentials not configured');
	}

	const response = await fetch(GOOGLE_TOKEN_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			code,
			grant_type: 'authorization_code',
			redirect_uri: redirectUri
		})
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to get Google tokens: ${error}`);
	}

	return response.json();
}

/**
 * Get Google user info using access token
 */
export async function getGoogleUser(accessToken: string): Promise<GoogleUser> {
	const response = await fetch(GOOGLE_USERINFO_URL, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to get Google user: ${error}`);
	}

	return response.json();
}

/**
 * Handle Google OAuth callback
 * Returns user info and tokens
 */
export async function handleGoogleCallback(
	code: string,
	redirectUri: string
): Promise<{ user: GoogleUser; tokens: GoogleTokens }> {
	const tokens = await getGoogleTokens(code, redirectUri);
	const user = await getGoogleUser(tokens.access_token);

	return { user, tokens };
}
