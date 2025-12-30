import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { validateName } from '$lib/utils/validation';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOAD_DIR = 'static/uploads/avatars';
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	return { user };
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'You must be logged in to update your profile' });
		}

		const formData = await request.formData();
		const name = formData.get('name');

		if (typeof name !== 'string') {
			return fail(400, { error: 'Invalid form data' });
		}

		const nameValidation = validateName(name);
		if (!nameValidation.valid) {
			return fail(400, { error: nameValidation.error });
		}

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
	},

	uploadAvatar: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { avatarError: 'You must be logged in to upload an avatar' });
		}

		const formData = await request.formData();
		const file = formData.get('avatar') as File;

		if (!file || file.size === 0) {
			return fail(400, { avatarError: 'Please select an image file' });
		}

		if (!ALLOWED_TYPES.includes(file.type)) {
			return fail(400, { avatarError: 'Invalid file type. Please use JPG, PNG, or WebP' });
		}

		if (file.size > MAX_FILE_SIZE) {
			return fail(400, { avatarError: 'File too large. Maximum size is 2MB' });
		}

		try {
			// Create upload directory if it doesn't exist
			if (!existsSync(UPLOAD_DIR)) {
				await mkdir(UPLOAD_DIR, { recursive: true });
			}

			// Generate unique filename
			const ext = file.name.split('.').pop() || 'jpg';
			const filename = `${locals.user.id}-${Date.now()}.${ext}`;
			const filepath = path.join(UPLOAD_DIR, filename);

			// Delete old avatar if exists
			if (locals.user.avatarUrl) {
				const oldPath = `static${locals.user.avatarUrl}`;
				if (existsSync(oldPath)) {
					await unlink(oldPath);
				}
			}

			// Save new file
			const buffer = Buffer.from(await file.arrayBuffer());
			await writeFile(filepath, buffer);

			// Update database
			const avatarUrl = `/uploads/avatars/${filename}`;
			await db
				.update(users)
				.set({
					avatarUrl,
					updatedAt: new Date()
				})
				.where(eq(users.id, locals.user.id));

			return { avatarSuccess: true };
		} catch (error) {
			console.error('Failed to upload avatar:', error);
			return fail(500, { avatarError: 'Failed to upload avatar. Please try again.' });
		}
	},

	removeAvatar: async ({ locals }) => {
		if (!locals.user) {
			return fail(401, { avatarError: 'You must be logged in' });
		}

		try {
			// Delete file if exists
			if (locals.user.avatarUrl) {
				const filepath = `static${locals.user.avatarUrl}`;
				if (existsSync(filepath)) {
					await unlink(filepath);
				}
			}

			// Update database
			await db
				.update(users)
				.set({
					avatarUrl: null,
					updatedAt: new Date()
				})
				.where(eq(users.id, locals.user.id));

			return { avatarSuccess: true };
		} catch (error) {
			console.error('Failed to remove avatar:', error);
			return fail(500, { avatarError: 'Failed to remove avatar. Please try again.' });
		}
	}
};
