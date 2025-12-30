import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { validateName } from '$lib/utils/validation';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	// User data is already loaded from parent layout
	const { user } = await parent();
	return { user };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// Ensure user is authenticated
		if (!locals.user) {
			return fail(401, { error: 'You must be logged in to update your profile' });
		}

		const formData = await request.formData();
		const name = formData.get('name');

		// Validate name input
		if (typeof name !== 'string') {
			return fail(400, { error: 'Invalid form data' });
		}

		const nameValidation = validateName(name);
		if (!nameValidation.valid) {
			return fail(400, { error: nameValidation.error });
		}

		// Update user in database
		try {
			const trimmedName = name.trim() || null;
			
			await db
				.update(users)
				.set({
					name: trimmedName,
					updatedAt: new Date()
				})
				.where(eq(users.id, locals.user.id));

			return { success: true };
		} catch (error) {
			console.error('Failed to update profile:', error);
			return fail(500, { error: 'Failed to update profile. Please try again.' });
		}
	}
};
