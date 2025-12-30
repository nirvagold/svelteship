/**
 * SSE endpoint for real-time notifications
 */

import type { RequestHandler } from './$types';
import { createSSEStream } from '$lib/server/sse';

export const GET: RequestHandler = async ({ locals }) => {
	// Get user ID if authenticated
	const userId = locals.user?.id;

	// Create SSE stream
	const { stream } = createSSEStream(userId);

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive',
			'X-Accel-Buffering': 'no' // Disable nginx buffering
		}
	});
};
