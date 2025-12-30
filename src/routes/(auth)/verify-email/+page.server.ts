import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, emailVerificationTokens } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '$lib/utils/id';
import { sendVerificationEmail } from '$lib/server/email';

// Token expires in 24 hours
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

export const load: PageServerLoad = async ({ url, locals }) => {
	const token = url.searchParams.get('token');

	// No token provided - show pending verification page
	if (!token) {
		return {
			status: 'pending' as const,
			email: locals.user?.email
		};
	}

	// Find token in database
	const [verificationToken] = await db
		.select()
		.from(emailVerificationTokens)
		.where(eq(emailVerificationTokens.id, token))
		.limit(1);

	if (!verificationToken) {
		return { status: 'invalid' as const };
	}

	// Check if token is expired
	if (new Date() > verificationToken.expiresAt) {
		// Get user email for resend option
		const [user] = await db
			.select({ email: users.email })
			.from(users)
			.where(eq(users.id, verificationToken.userId))
			.limit(1);

		// Clean up expired token
		await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, token));

		return {
			status: 'expired' as const,
			email: user?.email
		};
	}

	// Token is valid - verify the email
	try {
		await db
			.update(users)
			.set({
				emailVerified: true,
				updatedAt: new Date()
			})
			.where(eq(users.id, verificationToken.userId));

		// Delete the used token
		await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, token));

		// Delete any other verification tokens for this user
		await db
			.delete(emailVerificationTokens)
			.where(eq(emailVerificationTokens.userId, verificationToken.userId));

		return { status: 'success' as const };
	} catch (error) {
		console.error('Email verification error:', error);
		return { status: 'invalid' as const };
	}
};

export const actions: Actions = {
	resend: async ({ request, locals }) => {
		const formData = await request.formData();
		let email = formData.get('email')?.toString().trim().toLowerCase();

		// If no email in form, try to get from logged-in user
		if (!email && locals.user) {
			email = locals.user.email;
		}

		if (!email) {
			return fail(400, { error: 'Email is required' });
		}

		try {
			// Find user by email
			const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

			if (!user) {
				// Don't reveal if user exists
				return { success: true };
			}

			// Check if already verified
			if (user.emailVerified) {
				return fail(400, { error: 'Email is already verified' });
			}

			// Delete any existing verification tokens
			await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.userId, user.id));

			// Generate new token
			const tokenId = generateId();
			const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

			// Save token to database
			await db.insert(emailVerificationTokens).values({
				id: tokenId,
				userId: user.id,
				expiresAt
			});

			// Send verification email
			await sendVerificationEmail(email, tokenId);

			return { success: true };
		} catch (error) {
			console.error('Resend verification error:', error);
			return fail(500, { error: 'An error occurred. Please try again later.' });
		}
	}
};
