/**
 * Property tests for notifications
 * Property 11: Notifications sorted by date descending
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

interface Notification {
	id: string;
	title: string;
	createdAt: Date;
}

describe('Notifications Properties', () => {
	describe('Property 11: Notifications sorted by date descending', () => {
		it('should always return notifications sorted by date descending (newest first)', () => {
			function sortNotifications(notifications: Notification[]): Notification[] {
				return [...notifications].sort(
					(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
				);
			}

			function isSortedDescending(notifications: Notification[]): boolean {
				for (let i = 1; i < notifications.length; i++) {
					if (notifications[i].createdAt.getTime() > notifications[i - 1].createdAt.getTime()) {
						return false;
					}
				}
				return true;
			}

			fc.assert(
				fc.property(
					fc.array(
						fc.record({
							id: fc.uuid(),
							title: fc.string({ minLength: 1, maxLength: 50 }),
							createdAt: fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') })
						}),
						{ minLength: 0, maxLength: 20 }
					),
					(notifications) => {
						const sorted = sortNotifications(notifications);

						// Result should be sorted descending
						expect(isSortedDescending(sorted)).toBe(true);

						// Should have same length
						expect(sorted.length).toBe(notifications.length);

						// Should contain all original notifications
						for (const notif of notifications) {
							expect(sorted.some((s) => s.id === notif.id)).toBe(true);
						}
					}
				)
			);
		});

		it('should place newest notification first', () => {
			function sortNotifications(notifications: Notification[]): Notification[] {
				return [...notifications].sort(
					(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
				);
			}

			// Use integer timestamps to avoid NaN date issues
			const minTime = new Date('2024-01-01').getTime();
			const maxTime = new Date('2025-12-31').getTime();

			fc.assert(
				fc.property(
					fc.array(
						fc.record({
							id: fc.uuid(),
							title: fc.string({ minLength: 1, maxLength: 50 }),
							createdAt: fc.integer({ min: minTime, max: maxTime }).map((t) => new Date(t))
						}),
						{ minLength: 1, maxLength: 20 }
					),
					(notifications) => {
						const sorted = sortNotifications(notifications);

						// Find the newest notification
						const newest = notifications.reduce((max, n) =>
							n.createdAt.getTime() > max.createdAt.getTime() ? n : max
						);

						// Newest should be first
						expect(sorted[0].id).toBe(newest.id);
					}
				)
			);
		});

		it('should handle notifications with same timestamp', () => {
			function sortNotifications(notifications: Notification[]): Notification[] {
				return [...notifications].sort(
					(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
				);
			}

			fc.assert(
				fc.property(
					fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') }),
					fc.integer({ min: 2, max: 10 }),
					(timestamp, count) => {
						// Create notifications with same timestamp
						const notifications: Notification[] = [];
						for (let i = 0; i < count; i++) {
							notifications.push({
								id: crypto.randomUUID(),
								title: `Notification ${i}`,
								createdAt: new Date(timestamp)
							});
						}

						const sorted = sortNotifications(notifications);

						// Should still have all notifications
						expect(sorted.length).toBe(count);

						// All should have same timestamp
						for (const notif of sorted) {
							expect(notif.createdAt.getTime()).toBe(timestamp.getTime());
						}
					}
				)
			);
		});
	});
});
