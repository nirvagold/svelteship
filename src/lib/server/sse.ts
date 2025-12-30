/**
 * Server-Sent Events (SSE) connection manager
 * Provides real-time notifications to connected clients
 */

export interface SSEClient {
	id: string;
	userId?: string;
	controller: ReadableStreamDefaultController;
	createdAt: Date;
}

export interface SSEMessage {
	event?: string;
	data: unknown;
	id?: string;
	retry?: number;
}

// Store active connections
const clients = new Map<string, SSEClient>();

/**
 * Generate unique client ID
 */
function generateClientId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Format SSE message
 */
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

	const data = typeof message.data === 'string' ? message.data : JSON.stringify(message.data);
	// Handle multi-line data
	data.split('\n').forEach((line) => {
		lines.push(`data: ${line}`);
	});

	return lines.join('\n') + '\n\n';
}

/**
 * Create SSE stream for a client
 */
export function createSSEStream(userId?: string): {
	stream: ReadableStream;
	clientId: string;
} {
	const clientId = generateClientId();

	const stream = new ReadableStream({
		start(controller) {
			// Register client
			clients.set(clientId, {
				id: clientId,
				userId,
				controller,
				createdAt: new Date()
			});

			// Send initial connection message
			const connectMessage = formatSSEMessage({
				event: 'connected',
				data: { clientId, timestamp: new Date().toISOString() }
			});
			controller.enqueue(new TextEncoder().encode(connectMessage));
		},
		cancel() {
			// Remove client on disconnect
			clients.delete(clientId);
		}
	});

	return { stream, clientId };
}

/**
 * Send message to a specific client
 */
export function sendToClient(clientId: string, message: SSEMessage): boolean {
	const client = clients.get(clientId);
	if (!client) return false;

	try {
		const formatted = formatSSEMessage(message);
		client.controller.enqueue(new TextEncoder().encode(formatted));
		return true;
	} catch {
		// Client disconnected, remove from map
		clients.delete(clientId);
		return false;
	}
}

/**
 * Send message to a specific user (all their connections)
 */
export function sendToUser(userId: string, message: SSEMessage): number {
	let sent = 0;

	for (const [clientId, client] of clients) {
		if (client.userId === userId) {
			if (sendToClient(clientId, message)) {
				sent++;
			}
		}
	}

	return sent;
}

/**
 * Broadcast message to all connected clients
 */
export function broadcast(message: SSEMessage): number {
	let sent = 0;

	for (const clientId of clients.keys()) {
		if (sendToClient(clientId, message)) {
			sent++;
		}
	}

	return sent;
}

/**
 * Broadcast message to all authenticated users
 */
export function broadcastToAuthenticated(message: SSEMessage): number {
	let sent = 0;

	for (const [clientId, client] of clients) {
		if (client.userId && sendToClient(clientId, message)) {
			sent++;
		}
	}

	return sent;
}

/**
 * Get number of connected clients
 */
export function getClientCount(): number {
	return clients.size;
}

/**
 * Get number of connected users (unique)
 */
export function getConnectedUserCount(): number {
	const userIds = new Set<string>();
	for (const client of clients.values()) {
		if (client.userId) {
			userIds.add(client.userId);
		}
	}
	return userIds.size;
}

/**
 * Check if a user is connected
 */
export function isUserConnected(userId: string): boolean {
	for (const client of clients.values()) {
		if (client.userId === userId) {
			return true;
		}
	}
	return false;
}

/**
 * Disconnect a specific client
 */
export function disconnectClient(clientId: string): boolean {
	const client = clients.get(clientId);
	if (!client) return false;

	try {
		client.controller.close();
	} catch {
		// Already closed
	}

	clients.delete(clientId);
	return true;
}

/**
 * Disconnect all clients for a user
 */
export function disconnectUser(userId: string): number {
	let disconnected = 0;

	for (const [clientId, client] of clients) {
		if (client.userId === userId) {
			disconnectClient(clientId);
			disconnected++;
		}
	}

	return disconnected;
}

/**
 * Send heartbeat to all clients (keep connections alive)
 */
export function sendHeartbeat(): number {
	return broadcast({
		event: 'heartbeat',
		data: { timestamp: new Date().toISOString() }
	});
}
