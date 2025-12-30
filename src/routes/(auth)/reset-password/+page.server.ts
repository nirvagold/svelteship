import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, passwordResetTokens, sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from '@node-rs/argon2';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		return { token: null, valid: false };
	}

	// Check if token exists and is not expired
	const [resetToken] = await db
		.select()
		.from(passwordResetTokens)
		.where(eq(passwordResetTokens.id, token))
		.limit(1);

	if (!resetToken) {
		return { token, valid: false };
	}

	// Check if token is expired
	if (new Date() > resetToken.expiresAt) {
		// Clean up expired token
		await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, token));
		return { token, valid: false };
	}

	return { token, valid: true };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const token = formData.get('token')?.toString();
		const password = formData.get('password')?.toString();
		const confirmPassword = formData.get('confirmPassword')?.toString();

		if (!token) {
			return fail(400, { error: 'Invalid reset link' });
		}

		if (!password || password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match' });
		}

		try {
			// Find and validate token
			const [resetToken] = await db
				.select()
				.from(passwordResetTokens)
				.where(eq(passwordResetTokens.id, token))
				.limit(1);

			if (!resetToken) {
				return fail(400, { error: 'Invalid or expired reset link' });
			}

			// Check if token is expired
			if (new Date() > resetToken.expiresAt) {
				await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, token));
				return fail(400, { error: 'Reset link has expired. Please request a new one.' });
			}

			// Hash new password
			const passwordHash = await hash(password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			// Update user password
			await db
				.update(users)
				.set({
					passwordHash,
					updatedAt: new Date()
				})
				.where(eq(users.id, resetToken.userId));

			// Invalidate all sessions for this user (security measure)
			await db.delete(sessions).where(eq(sessions.userId, resetToken.userId));

			// Delete the used token (single-use)
			await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, token));

			// Also delete any other reset tokens for this user
			await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, resetToken.userId));

			return { success: true };
		} catch (error) {
			console.error('Password reset error:', error);
			return fail(500, { error: 'An error occurred. Please try again later.' });
		}
	}
};
