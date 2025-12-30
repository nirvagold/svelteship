import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Check for valid session, redirect if not authenticated
	if (!locals.user || !locals.session) {
		throw redirect(302, '/login');
	}

	// Pass user data to layout
	return {
		user: locals.user
	};
};
