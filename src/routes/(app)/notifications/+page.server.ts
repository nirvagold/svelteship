import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { notifications } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	// Get all notifications for this user, sorted by date descending (newest first)
	const userNotifications = await db
		.select()
		.from(notifications)
		.where(eq(notifications.userId, locals.user.id))
		.orderBy(desc(notifications.createdAt));

	const unreadCount = userNotifications.filter((n) => !n.read).length;

	return {
		notifications: userNotifications,
		unreadCount
	};
};

export const actions: Actions = {
	markRead: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Notification ID is required' });
		}

		try {
			// Verify notification belongs to user
			const [notification] = await db
				.select()
				.from(notifications)
				.where(and(eq(notifications.id, id), eq(notifications.userId, locals.user.id)))
				.limit(1);

			if (!notification) {
				return fail(404, { error: 'Notification not found' });
			}

			await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));

			return { success: true };
		} catch (error) {
			console.error('Mark read error:', error);
			return fail(500, { error: 'Failed to mark notification as read' });
		}
	},

	markAllRead: async ({ locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		try {
			await db
				.update(notifications)
				.set({ read: true })
				.where(eq(notifications.userId, locals.user.id));

			return { success: true };
		} catch (error) {
			console.error('Mark all read error:', error);
			return fail(500, { error: 'Failed to mark notifications as read' });
		}
	},

	delete: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Notification ID is required' });
		}

		try {
			// Verify notification belongs to user
			const [notification] = await db
				.select()
				.from(notifications)
				.where(and(eq(notifications.id, id), eq(notifications.userId, locals.user.id)))
				.limit(1);

			if (!notification) {
				return fail(404, { error: 'Notification not found' });
			}

			await db.delete(notifications).where(eq(notifications.id, id));

			return { success: true };
		} catch (error) {
			console.error('Delete notification error:', error);
			return fail(500, { error: 'Failed to delete notification' });
		}
	}
};
