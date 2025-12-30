// NOTE: This is an example file. Copy to src/routes/(app)/settings/sessions/ to use.
// TypeScript types will be generated automatically when placed in routes folder.

import type { RequestEvent } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { lucia } from '$lib/server/auth';

export const load = async ({ locals }: RequestEvent) => {
	if (!locals.user || !locals.session) {
		throw redirect(302, '/login');
	}

	// Get all sessions for this user
	const userSessions = await db
		.select({
			id: sessions.id,
			userAgent: sessions.userAgent,
			ipAddress: sessions.ipAddress,
			createdAt: sessions.createdAt
		})
		.from(sessions)
		.where(eq(sessions.userId, locals.user.id))
		.orderBy(sessions.createdAt);

	return {
		sessions: userSessions.map((s) => ({
			...s,
			isCurrent: s.id === locals.session!.id
		}))
	};
};

export const actions = {
	revoke: async ({ request, locals }: RequestEvent) => {
		if (!locals.user || !locals.session) {
			throw redirect(302, '/login');
		}

		const formData = await request.formData();
		const sessionId = formData.get('sessionId')?.toString();

		if (!sessionId) {
			return fail(400, { error: 'Session ID is required' });
		}

		// Don't allow revoking current session
		if (sessionId === locals.session.id) {
			return fail(400, { error: 'Cannot revoke current session' });
		}

		try {
			// Verify the session belongs to this user
			const [session] = await db
				.select()
				.from(sessions)
				.where(and(eq(sessions.id, sessionId), eq(sessions.userId, locals.user.id)))
				.limit(1);

			if (!session) {
				return fail(404, { error: 'Session not found' });
			}

			// Invalidate the session
			await lucia.invalidateSession(sessionId);

			return { success: true };
		} catch (error) {
			console.error('Session revoke error:', error);
			return fail(500, { error: 'Failed to revoke session. Please try again.' });
		}
	},

	revokeAll: async ({ locals }: RequestEvent) => {
		if (!locals.user || !locals.session) {
			throw redirect(302, '/login');
		}

		try {
			// Delete all sessions except current one
			await db
				.delete(sessions)
				.where(
					and(eq(sessions.userId, locals.user.id), ne(sessions.id, locals.session.id))
				);

			return { success: true };
		} catch (error) {
			console.error('Revoke all sessions error:', error);
			return fail(500, { error: 'Failed to revoke sessions. Please try again.' });
		}
	}
};
