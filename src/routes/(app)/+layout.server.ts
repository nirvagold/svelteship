import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { notifications } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Check for valid session, redirect if not authenticated
	if (!locals.user || !locals.session) {
		throw redirect(302, '/login');
	}

	// Check onboarding status - redirect new users to onboarding
	// Skip if already on onboarding page
	if (!locals.user.onboardingCompleted && !url.pathname.startsWith('/onboarding')) {
		throw redirect(302, '/onboarding');
	}

	// Get unread notifications count
	let unreadCount = 0;
	try {
		const unreadNotifications = await db
			.select()
			.from(notifications)
			.where(and(eq(notifications.userId, locals.user.id), eq(notifications.read, false)));
		unreadCount = unreadNotifications.length;
	} catch {
		// DB not available, default to 0
	}

	// Pass user data to layout
	return {
		user: locals.user,
		unreadNotificationsCount: unreadCount
	};
};
