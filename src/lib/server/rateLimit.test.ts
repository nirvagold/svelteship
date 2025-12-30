import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { checkRateLimit, clearRateLimits } from './rateLimit';

describe('checkRateLimit', () => {
	beforeEach(() => {
		clearRateLimits();
	});

	it('allows first request', () => {
		const result = checkRateLimit('test-key', { limit: 5, windowMs: 60000 });
		expect(result.allowed).toBe(true);
		expect(result.remaining).toBe(4);
	});

	it('decrements remaining on each request', () => {
		const config = { limit: 5, windowMs: 60000 };

		const r1 = checkRateLimit('test-key', config);
		expect(r1.remaining).toBe(4);

		const r2 = checkRateLimit('test-key', config);
		expect(r2.remaining).toBe(3);

		const r3 = checkRateLimit('test-key', config);
		expect(r3.remaining).toBe(2);
	});

	it('blocks after limit reached', () => {
		const config = { limit: 3, windowMs: 60000 };

		checkRateLimit('test-key', config);
		checkRateLimit('test-key', config);
		checkRateLimit('test-key', config);

		const result = checkRateLimit('test-key', config);
		expect(result.allowed).toBe(false);
		expect(result.remaining).toBe(0);
	});

	it('uses different counters for different keys', () => {
		const config = { limit: 2, windowMs: 60000 };

		checkRateLimit('key-1', config);
		checkRateLimit('key-1', config);

		const r1 = checkRateLimit('key-1', config);
		expect(r1.allowed).toBe(false);

		const r2 = checkRateLimit('key-2', config);
		expect(r2.allowed).toBe(true);
		expect(r2.remaining).toBe(1);
	});

	it('returns resetAt timestamp', () => {
		const now = Date.now();
		const result = checkRateLimit('test-key', { limit: 5, windowMs: 60000 });

		expect(result.resetAt).toBeGreaterThan(now);
		expect(result.resetAt).toBeLessThanOrEqual(now + 60000);
	});

	// Property 12: Rate limiter enforces limits
	it('property: enforces limits correctly', () => {
		fc.assert(
			fc.property(fc.integer({ min: 1, max: 20 }), (limit) => {
				clearRateLimits();
				const config = { limit, windowMs: 60000 };
				const key = `test-${limit}`;

				// Make exactly limit requests
				for (let i = 0; i < limit; i++) {
					const result = checkRateLimit(key, config);
					expect(result.allowed).toBe(true);
				}

				// The (limit+1)th request should be blocked
				const blocked = checkRateLimit(key, config);
				expect(blocked.allowed).toBe(false);
			})
		);
	});

	// Property: remaining count is always correct
	it('property: remaining count decreases correctly', () => {
		fc.assert(
			fc.property(
				fc.integer({ min: 1, max: 20 }),
				fc.integer({ min: 1, max: 10 }),
				(limit, requests) => {
					clearRateLimits();
					const config = { limit, windowMs: 60000 };
					const key = `test-${limit}-${requests}`;
					const actualRequests = Math.min(requests, limit);

					for (let i = 0; i < actualRequests; i++) {
						const result = checkRateLimit(key, config);
						expect(result.remaining).toBe(limit - i - 1);
					}
				}
			)
		);
	});
});
