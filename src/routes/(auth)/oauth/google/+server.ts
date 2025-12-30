/**
 * Google OAuth - Redirect to Google
 */

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGoogleAuthUrl } from '$lib/server/oauth/google';
import { generateId } from '$lib/utils/id';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const redirectUri = `${url.origin}/oauth/google/callback`;

	// Generate state for CSRF protection
	const state = generateId();
	cookies.set('oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: url.protocol === 'https:',
		sameSite: 'lax',
		maxAge: 60 * 10 // 10 minutes
	});

	const authUrl = getGoogleAuthUrl(redirectUri, state);
	redirect(302, authUrl);
};
