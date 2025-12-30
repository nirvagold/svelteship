// NOTE: This is an example file. Copy to src/routes/(app)/onboarding/ to use.
// TypeScript types will be generated automatically when placed in routes folder.

import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }: RequestEvent) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// If user already completed onboarding, redirect to dashboard
	if (locals.user.onboardingCompleted) {
		throw redirect(302, '/dashboard');
	}

	return {
		user: {
			name: locals.user.name,
			email: locals.user.email
		}
	};
};

export const actions = {
	default: async ({ request, locals }: RequestEvent) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() || null;
		const theme = formData.get('theme')?.toString() as 'light' | 'dark' | 'system';
		const language = formData.get('language')?.toString() || 'en';
		const emailNotifications = formData.get('emailNotifications') === 'on';

		try {
			await db
				.update(users)
				.set({
					name,
					onboardingCompleted: true,
					preferences: {
						theme: theme || 'system',
						language,
						timezone: 'UTC',
						emailNotifications
					},
					updatedAt: new Date()
				})
				.where(eq(users.id, locals.user.id));

			throw redirect(302, '/dashboard');
		} catch (error) {
			if (error instanceof Response) throw error; // Re-throw redirects
			console.error('Onboarding error:', error);
			throw redirect(302, '/dashboard'); // Redirect anyway on error
		}
	}
};
