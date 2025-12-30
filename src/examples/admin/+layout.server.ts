import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }: RequestEvent) => {
	// Check if user is logged in
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Check if user has admin role
	if (locals.user.role !== 'admin') {
		throw redirect(302, '/unauthorized');
	}

	return {
		user: {
			id: locals.user.id,
			email: locals.user.email,
			name: locals.user.name,
			role: locals.user.role
		}
	};
};
