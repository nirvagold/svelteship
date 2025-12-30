// Notifications schema - add this to your main schema.ts if using notifications
import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from '$lib/server/db/schema';

export const notifications = pgTable('notifications', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	message: text('message').notNull(),
	type: text('type').notNull(), // 'info' | 'success' | 'warning' | 'error'
	read: boolean('read').default(false).notNull(),
	link: text('link'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
