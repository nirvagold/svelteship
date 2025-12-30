import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	const [user] = await db
		.select({
			email: users.email,
			name: users.name,
			preferences: users.preferences
		})
		.from(users)
		.where(eq(users.id, locals.user.id))
		.limit(1);

	return {
		user: {
			email: user.email,
			name: user.name,
			preferences: user.preferences ?? {
				theme: 'system' as const,
				language: 'en',
				timezone: 'UTC',
				emailNotifications: true
			}
		}
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() || null;
		const theme = formData.get('theme')?.toString() as 'light' | 'dark' | 'system';
		const language = formData.get('language')?.toString() || 'en';
		const timezone = formData.get('timezone')?.toString() || 'UTC';
		const emailNotifications = formData.get('emailNotifications') === 'on';

		// Validate theme
		if (!['light', 'dark', 'system'].includes(theme)) {
			return fail(400, { error: 'Invalid theme selection' });
		}

		try {
			await db
				.update(users)
				.set({
					name,
					preferences: {
						theme,
						language,
						timezone,
						emailNotifications
					},
					updatedAt: new Date()
				})
				.where(eq(users.id, locals.user.id));

			return { success: true };
		} catch (error) {
			console.error('Settings update error:', error);
			return fail(500, { error: 'Failed to save settings. Please try again.' });
		}
	}
};
