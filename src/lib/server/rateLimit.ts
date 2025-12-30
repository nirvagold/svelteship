/**
 * Rate limiting middleware for SvelteKit
 */

import type { Handle, RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export interface RateLimitConfig {
	limit: number;
	windowMs: number;
	keyGenerator?: (event: RequestEvent) => string;
	message?: string;
}

interface RateLimitEntry {
	count: number;
	resetAt: number;
}

// In-memory store for rate limiting
const store = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
function cleanup() {
	const now = Date.now();
	for (const [key, entry] of store.entries()) {
		if (entry.resetAt < now) {
			store.delete(key);
		}
	}
}

// Run cleanup every minute
if (typeof setInterval !== 'undefined') {
	setInterval(cleanup, 60000);
}

/**
 * Default key generator using IP address
 */
function defaultKeyGenerator(event: RequestEvent): string {
	return (
		event.getClientAddress?.() ||
		event.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		event.request.headers.get('x-real-ip') ||
		'unknown'
	);
}

/**
 * Check if a request should be rate limited
 */
export function checkRateLimit(
	key: string,
	config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
	const now = Date.now();
	const entry = store.get(key);

	if (!entry || entry.resetAt < now) {
		// Create new entry
		const resetAt = now + config.windowMs;
		store.set(key, { count: 1, resetAt });
		return { allowed: true, remaining: config.limit - 1, resetAt };
	}

	if (entry.count >= config.limit) {
		return { allowed: false, remaining: 0, resetAt: entry.resetAt };
	}

	entry.count++;
	return { allowed: true, remaining: config.limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Create a rate limiting handle for SvelteKit
 */
export function rateLimit(config: RateLimitConfig): Handle {
	const { limit, windowMs, keyGenerator = defaultKeyGenerator, message = 'Too many requests' } = config;

	return async ({ event, resolve }) => {
		const key = keyGenerator(event);
		const result = checkRateLimit(key, { limit, windowMs });

		if (!result.allowed) {
			const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
			return json(
				{ error: message },
				{
					status: 429,
					headers: {
						'Retry-After': String(retryAfter),
						'X-RateLimit-Limit': String(limit),
						'X-RateLimit-Remaining': '0',
						'X-RateLimit-Reset': String(result.resetAt)
					}
				}
			);
		}

		const response = await resolve(event);

		// Add rate limit headers to successful responses
		const headers = new Headers(response.headers);
		headers.set('X-RateLimit-Limit', String(limit));
		headers.set('X-RateLimit-Remaining', String(result.remaining));
		headers.set('X-RateLimit-Reset', String(result.resetAt));

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers
		});
	};
}

/**
 * Reset rate limit for a specific key (useful for testing)
 */
export function resetRateLimit(key: string): void {
	store.delete(key);
}

/**
 * Clear all rate limit entries (useful for testing)
 */
export function clearRateLimits(): void {
	store.clear();
}
