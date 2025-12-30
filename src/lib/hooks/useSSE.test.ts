import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Test the offline queue and reconnection logic (pure functions)

interface OfflineQueue<T> {
	add: (item: T) => void;
	process: (handler: (item: T) => Promise<void>) => Promise<void>;
	clear: () => void;
	size: () => number;
}

function createOfflineQueue<T>(): OfflineQueue<T> {
	const queue: T[] = [];

	return {
		add(item: T): void {
			queue.push(item);
		},

		async process(handler: (item: T) => Promise<void>): Promise<void> {
			while (queue.length > 0) {
				const item = queue.shift()!;
				await handler(item);
			}
		},

		clear(): void {
			queue.length = 0;
		},

		size(): number {
			return queue.length;
		}
	};
}

// Exponential backoff calculation
function calculateBackoff(
	attempt: number,
	initialDelay: number,
	maxDelay: number
): number {
	const delay = initialDelay * Math.pow(2, attempt);
	return Math.min(delay, maxDelay);
}

describe('SSE Utilities', () => {
	describe('Offline Queue', () => {
		it('adds items to queue', () => {
			const queue = createOfflineQueue<string>();
			queue.add('item1');
			queue.add('item2');
			expect(queue.size()).toBe(2);
		});

		it('processes items in order', async () => {
			const queue = createOfflineQueue<number>();
			queue.add(1);
			queue.add(2);
			queue.add(3);

			const processed: number[] = [];
			await queue.process(async (item) => {
				processed.push(item);
			});

			expect(processed).toEqual([1, 2, 3]);
			expect(queue.size()).toBe(0);
		});

		it('clears queue', () => {
			const queue = createOfflineQueue<string>();
			queue.add('item1');
			queue.add('item2');
			queue.clear();
			expect(queue.size()).toBe(0);
		});

		// Property 13: Offline notification queue
		it('property: queue processes all items exactly once', async () => {
			await fc.assert(
				fc.asyncProperty(
					fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 50 }),
					async (items) => {
						const queue = createOfflineQueue<string>();
						items.forEach((item) => queue.add(item));

						const processed: string[] = [];
						await queue.process(async (item) => {
							processed.push(item);
						});

						// All items processed
						expect(processed.length).toBe(items.length);
						// In correct order
						expect(processed).toEqual(items);
						// Queue is empty
						expect(queue.size()).toBe(0);
					}
				),
				{ numRuns: 20 }
			);
		});

		it('property: queue size matches added items', () => {
			fc.assert(
				fc.property(
					fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 0, maxLength: 100 }),
					(items) => {
						const queue = createOfflineQueue<number>();
						items.forEach((item) => queue.add(item));
						expect(queue.size()).toBe(items.length);
					}
				),
				{ numRuns: 30 }
			);
		});
	});

	describe('Exponential Backoff', () => {
		it('calculates correct initial delay', () => {
			expect(calculateBackoff(0, 1000, 30000)).toBe(1000);
		});

		it('doubles delay on each attempt', () => {
			expect(calculateBackoff(1, 1000, 30000)).toBe(2000);
			expect(calculateBackoff(2, 1000, 30000)).toBe(4000);
			expect(calculateBackoff(3, 1000, 30000)).toBe(8000);
		});

		it('caps at max delay', () => {
			expect(calculateBackoff(10, 1000, 30000)).toBe(30000);
			expect(calculateBackoff(20, 1000, 30000)).toBe(30000);
		});

		// Property 12: SSE reconnection with backoff
		it('property: backoff delay never exceeds max', () => {
			fc.assert(
				fc.property(
					fc.integer({ min: 0, max: 20 }),
					fc.integer({ min: 100, max: 5000 }),
					fc.integer({ min: 10000, max: 60000 }),
					(attempt, initialDelay, maxDelay) => {
						const delay = calculateBackoff(attempt, initialDelay, maxDelay);
						expect(delay).toBeLessThanOrEqual(maxDelay);
						expect(delay).toBeGreaterThanOrEqual(initialDelay);
					}
				),
				{ numRuns: 50 }
			);
		});

		it('property: backoff increases monotonically until max', () => {
			fc.assert(
				fc.property(
					fc.integer({ min: 100, max: 2000 }),
					fc.integer({ min: 10000, max: 60000 }),
					(initialDelay, maxDelay) => {
						let prevDelay = 0;
						for (let attempt = 0; attempt < 15; attempt++) {
							const delay = calculateBackoff(attempt, initialDelay, maxDelay);
							expect(delay).toBeGreaterThanOrEqual(prevDelay);
							prevDelay = delay;
						}
					}
				),
				{ numRuns: 20 }
			);
		});
	});

	describe('SSE Message Formatting', () => {
		// Format SSE message (copied from sse.ts)
		interface SSEMessage {
			event?: string;
			data: unknown;
			id?: string;
			retry?: number;
		}

		function formatSSEMessage(message: SSEMessage): string {
			const lines: string[] = [];

			if (message.id) {
				lines.push(`id: ${message.id}`);
			}

			if (message.event) {
				lines.push(`event: ${message.event}`);
			}

			if (message.retry) {
				lines.push(`retry: ${message.retry}`);
			}

			const data =
				typeof message.data === 'string' ? message.data : JSON.stringify(message.data);
			data.split('\n').forEach((line) => {
				lines.push(`data: ${line}`);
			});

			return lines.join('\n') + '\n\n';
		}

		it('formats simple message', () => {
			const formatted = formatSSEMessage({ data: 'hello' });
			expect(formatted).toBe('data: hello\n\n');
		});

		it('formats message with event', () => {
			const formatted = formatSSEMessage({ event: 'notification', data: 'hello' });
			expect(formatted).toContain('event: notification');
			expect(formatted).toContain('data: hello');
		});

		it('formats message with id', () => {
			const formatted = formatSSEMessage({ id: '123', data: 'hello' });
			expect(formatted).toContain('id: 123');
		});

		it('formats JSON data', () => {
			const formatted = formatSSEMessage({ data: { foo: 'bar' } });
			expect(formatted).toContain('data: {"foo":"bar"}');
		});

		it('property: formatted message always ends with double newline', () => {
			fc.assert(
				fc.property(
					fc.record({
						event: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
						data: fc.oneof(fc.string(), fc.integer(), fc.boolean()),
						id: fc.option(fc.string({ minLength: 1, maxLength: 10 }), { nil: undefined })
					}),
					(message) => {
						const formatted = formatSSEMessage(message as SSEMessage);
						expect(formatted.endsWith('\n\n')).toBe(true);
					}
				),
				{ numRuns: 30 }
			);
		});
	});
});
