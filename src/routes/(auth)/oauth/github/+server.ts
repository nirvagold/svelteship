/**
 * GitHub OAuth - Redirect to GitHub
 */

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGitHubAuthUrl } from '$lib/server/oauth/github';
import { generateId } from '$lib/utils/id';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const redirectUri = `${url.origin}/oauth/github/callback`;

	// Generate state for CSRF protection
	const state = generateId();
	cookies.set('oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: url.protocol === 'https:',
		sameSite: 'lax',
		maxAge: 60 * 10 // 10 minutes
	});

	const authUrl = getGitHubAuthUrl(redirectUri, state);
	redirect(302, authUrl);
};
