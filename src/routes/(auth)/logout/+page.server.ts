import { redirect } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// If not logged in, redirect to login page
	if (!locals.session) {
		redirect(302, '/login');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ locals, cookies }) => {
		// If no session, just redirect to login (Requirements 4.3)
		if (!locals.session) {
			redirect(302, '/login');
		}

		// Invalidate session in database (Requirements 4.1)
		await lucia.invalidateSession(locals.session.id);

		// Clear session cookie from browser (Requirements 4.2)
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		// Redirect to login page (Requirements 4.3)
		redirect(302, '/login');
	}
};
