/**
 * GitHub OAuth Callback - Handle GitHub response
 */

import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { handleGitHubCallback } from '$lib/server/oauth/github';
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
		const errorDescription = url.searchParams.get('error_description') || errorParam;
		redirect(302, `/login?error=${encodeURIComponent(errorDescription)}`);
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
		const redirectUri = `${url.origin}/oauth/github/callback`;
		const { user, email, tokens } = await handleGitHubCallback(code, redirectUri);

		// Validate email
		if (!email) {
			redirect(302, '/login?error=email_required');
		}

		// Create or link account
		const { userId } = await createOrLinkOAuthAccount({
			provider: 'github',
			providerAccountId: user.id.toString(),
			email,
			name: user.name || user.login,
			avatarUrl: user.avatar_url,
			accessToken: tokens.access_token
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
		console.error('GitHub OAuth error:', err);
		redirect(302, '/login?error=oauth_failed');
	}
};
