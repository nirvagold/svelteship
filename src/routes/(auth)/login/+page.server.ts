import { fail, redirect } from '@sveltejs/kit';
import { verify } from '@node-rs/argon2';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { lucia } from '$lib/server/auth';
import { validateEmail } from '$lib/utils/validation';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

// Generic error message for security (Requirements 3.2, 3.3)
const INVALID_CREDENTIALS_ERROR = 'Invalid email or password';

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

		// Validate inputs
		if (typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, { error: 'Invalid form data' });
		}

		const emailValidation = validateEmail(email);
		if (!emailValidation.valid) {
			return fail(400, { error: emailValidation.error });
		}

		// Find user by email
		const user = await db.query.users.findFirst({
			where: eq(users.email, email.toLowerCase().trim())
		});

		// Return generic error if user not found (Requirements 3.3)
		if (!user) {
			return fail(400, { error: INVALID_CREDENTIALS_ERROR });
		}

		// Verify password with Argon2
		const validPassword = await verify(user.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		// Return generic error if password is incorrect (Requirements 3.2)
		if (!validPassword) {
			return fail(400, { error: INVALID_CREDENTIALS_ERROR });
		}

		// Create session (Requirements 3.1)
		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		
		// Set cookie with secure flags (Requirements 3.4)
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		// Redirect to dashboard
		redirect(302, '/dashboard');
	}
};
