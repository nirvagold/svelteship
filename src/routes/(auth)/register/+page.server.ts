import { fail, redirect } from '@sveltejs/kit';
import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { lucia } from '$lib/server/auth';
import { validateEmail, validatePassword } from '$lib/utils/validation';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect to dashboard if already logged in
	if (locals.user) {
		redirect(302, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		// Validate inputs
		if (typeof email !== 'string' || typeof password !== 'string' || typeof confirmPassword !== 'string') {
			return fail(400, { error: 'Invalid form data' });
		}

		const emailValidation = validateEmail(email);
		if (!emailValidation.valid) {
			return fail(400, { error: emailValidation.error });
		}

		const passwordValidation = validatePassword(password);
		if (!passwordValidation.valid) {
			return fail(400, { error: passwordValidation.error });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match' });
		}

		// Check if email already exists
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, email.toLowerCase().trim())
		});

		if (existingUser) {
			return fail(400, { error: 'Email is already registered' });
		}

		// Hash password with Argon2
		const passwordHash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		// Create user
		const userId = generateIdFromEntropySize(10);
		
		try {
			await db.insert(users).values({
				id: userId,
				email: email.toLowerCase().trim(),
				passwordHash,
				name: null,
				createdAt: new Date(),
				updatedAt: new Date()
			});
		} catch (error) {
			console.error('Failed to create user:', error);
			return fail(500, { error: 'Failed to create account. Please try again.' });
		}

		// Create session
		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		// Redirect to dashboard (Requirements 2.5)
		redirect(302, '/dashboard');
	}
};
