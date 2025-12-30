// NOTE: This is an example file. Copy to src/routes/(app)/settings/security/ to use.
// TypeScript types will be generated automatically when placed in routes folder.

import type { RequestEvent } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	users,
	sessions,
	passwordResetTokens,
	emailVerificationTokens,
	notifications
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verify, hash } from '@node-rs/argon2';
import { lucia } from '$lib/server/auth';
import { sendAccountDeletedEmail } from '$lib/server/email';

export const load = async ({ locals }: RequestEvent) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	return {
		user: {
			email: locals.user.email,
			emailVerified: locals.user.emailVerified
		}
	};
};

export const actions = {
	changePassword: async ({ request, locals, cookies }: RequestEvent) => {
		if (!locals.user || !locals.session) {
			throw redirect(302, '/login');
		}

		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword')?.toString();
		const newPassword = formData.get('newPassword')?.toString();
		const confirmPassword = formData.get('confirmPassword')?.toString();

		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, { error: 'All fields are required', action: 'password' as const });
		}

		if (newPassword.length < 8) {
			return fail(400, { error: 'New password must be at least 8 characters', action: 'password' as const });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match', action: 'password' as const });
		}

		try {
			// Get current user with password hash
			const [user] = await db
				.select({ passwordHash: users.passwordHash })
				.from(users)
				.where(eq(users.id, locals.user.id))
				.limit(1);

			if (!user) {
				return fail(400, { error: 'User not found', action: 'password' as const });
			}

			// Verify current password
			const validPassword = await verify(user.passwordHash, currentPassword, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			if (!validPassword) {
				return fail(400, { error: 'Current password is incorrect', action: 'password' as const });
			}

			// Hash new password
			const newPasswordHash = await hash(newPassword, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			// Update password
			await db
				.update(users)
				.set({
					passwordHash: newPasswordHash,
					updatedAt: new Date()
				})
				.where(eq(users.id, locals.user.id));

			// Invalidate all other sessions (keep current session)
			await db
				.delete(sessions)
				.where(eq(sessions.userId, locals.user.id));

			// Create new session for current user
			const session = await lucia.createSession(locals.user.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			return { success: true, action: 'password' as const };
		} catch (error) {
			console.error('Password change error:', error);
			return fail(500, { error: 'Failed to change password. Please try again.', action: 'password' as const });
		}
	},

	deleteAccount: async ({ request, locals, cookies }: RequestEvent) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const formData = await request.formData();
		const password = formData.get('password')?.toString();
		const confirmText = formData.get('confirmText')?.toString();

		if (!password) {
			return fail(400, { error: 'Password is required', action: 'delete' as const });
		}

		if (confirmText !== 'DELETE') {
			return fail(400, { error: 'Please type DELETE to confirm', action: 'delete' as const });
		}

		try {
			// Get current user with password hash
			const [user] = await db
				.select({ passwordHash: users.passwordHash, email: users.email })
				.from(users)
				.where(eq(users.id, locals.user.id))
				.limit(1);

			if (!user) {
				return fail(400, { error: 'User not found', action: 'delete' as const });
			}

			// Verify password
			const validPassword = await verify(user.passwordHash, password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			if (!validPassword) {
				return fail(400, { error: 'Password is incorrect', action: 'delete' as const });
			}

			// Delete all user data (cascade will handle related tables)
			// But let's be explicit for safety
			await db.delete(notifications).where(eq(notifications.userId, locals.user.id));
			await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.userId, locals.user.id));
			await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, locals.user.id));
			await db.delete(sessions).where(eq(sessions.userId, locals.user.id));
			await db.delete(users).where(eq(users.id, locals.user.id));

			// Send confirmation email
			await sendAccountDeletedEmail(user.email);

			// Clear session cookie
			const sessionCookie = lucia.createBlankSessionCookie();
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			throw redirect(302, '/?deleted=true');
		} catch (error) {
			if (error instanceof Response) throw error; // Re-throw redirects
			console.error('Account deletion error:', error);
			return fail(500, { error: 'Failed to delete account. Please try again.', action: 'delete' as const });
		}
	}
};
