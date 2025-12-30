import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, sessions } from '$lib/server/db/schema';
import { count, gte } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	// Get today's start timestamp
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Get stats
	const [totalUsersResult] = await db.select({ count: count() }).from(users);

	const [activeUsersResult] = await db
		.select({ count: count() })
		.from(sessions)
		.where(gte(sessions.expiresAt, new Date()));

	const [newUsersTodayResult] = await db
		.select({ count: count() })
		.from(users)
		.where(gte(users.createdAt, today));

	const [totalSessionsResult] = await db
		.select({ count: count() })
		.from(sessions)
		.where(gte(sessions.expiresAt, new Date()));

	return {
		stats: {
			totalUsers: totalUsersResult?.count ?? 0,
			activeUsers: activeUsersResult?.count ?? 0,
			newUsersToday: newUsersTodayResult?.count ?? 0,
			totalSessions: totalSessionsResult?.count ?? 0
		}
	};
};
