import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, passwordResetTokens } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '$lib/utils/id';
import { sendPasswordResetEmail } from '$lib/server/email';

// Token expires in 1 hour
const TOKEN_EXPIRY_MS = 60 * 60 * 1000;

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString().trim().toLowerCase();

		if (!email) {
			return fail(400, { error: 'Email is required', email: '' });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, { error: 'Please enter a valid email address', email });
		}

		try {
			// Find user by email
			const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

			// IMPORTANT: Always return success to prevent email enumeration
			// Even if user doesn't exist, we show the same message
			if (user) {
				// Delete any existing reset tokens for this user
				await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));

				// Generate new token
				const tokenId = generateId();
				const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

				// Save token to database
				await db.insert(passwordResetTokens).values({
					id: tokenId,
					userId: user.id,
					expiresAt
				});

				// Send reset email
				await sendPasswordResetEmail(email, tokenId);
			}

			// Always return success (prevents email enumeration)
			return { success: true, email };
		} catch (error) {
			console.error('Password reset error:', error);
			// Generic error message
			return fail(500, { error: 'An error occurred. Please try again later.', email });
		}
	}
};
