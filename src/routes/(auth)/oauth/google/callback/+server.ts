/**
 * Google OAuth Callback - Handle Google response
 */

import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { handleGoogleCallback } from '$lib/server/oauth/google';
import { createOrLinkOAuthAccount, createSession } from '$lib/server/oauth';

export const GET: RequestHandler = async ({ url, cookies, request }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('oauth_state');
	const errorParam = url.searchParams.get('error');

	// Clear state cookie
	cookies.delete('oauth_state', { path: '/' });

	// Handle OAuth errors
	if (errorParam) {
		redirect(302, `/login?error=${encodeURIComponent(errorParam)}`);
	}

	// Validate state
	if (!state || !storedState || state !== storedState) {
		error(400, 'Invalid state parameter');
	}

	// Validate code
	if (!code) {
		error(400, 'Missing authorization code');
	}

	try {
		const redirectUri = `${url.origin}/oauth/google/callback`;
		const { user, tokens } = await handleGoogleCallback(code, redirectUri);

		// Validate email
		if (!user.email || !user.verified_email) {
			redirect(302, '/login?error=email_not_verified');
		}

		// Create or link account
		const { userId } = await createOrLinkOAuthAccount({
			provider: 'google',
			providerAccountId: user.id,
			email: user.email,
			name: user.name,
			avatarUrl: user.picture,
			locale: user.locale,
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token,
			expiresAt: tokens.expires_in
				? new Date(Date.now() + tokens.expires_in * 1000)
				: undefined
		});

		// Create session
		const userAgent = request.headers.get('user-agent') || undefined;
		const sessionId = await createSession(userId, userAgent);

		// Set session cookie
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			secure: url.protocol === 'https:',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		redirect(302, '/dashboard');
	} catch (err) {
		console.error('Google OAuth error:', err);
		redirect(302, '/login?error=oauth_failed');
	}
};
