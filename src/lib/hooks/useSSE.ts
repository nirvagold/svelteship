/**
 * Client-side SSE hook with auto-reconnect and offline queue
 */

export interface SSEOptions {
	url: string;
	onMessage?: (event: MessageEvent) => void;
	onOpen?: () => void;
	onError?: (error: Event) => void;
	onReconnect?: (attempt: number) => void;
	maxRetries?: number;
	initialRetryDelay?: number;
	maxRetryDelay?: number;
}

export interface SSEState {
	connected: boolean;
	connecting: boolean;
	error: string | null;
	retryCount: number;
}

export interface UseSSEReturn {
	state: SSEState;
	connect: () => void;
	disconnect: () => void;
	addEventListener: (event: string, handler: (data: unknown) => void) => () => void;
}

/**
 * Create SSE connection with auto-reconnect
 */
export function useSSE(options: SSEOptions): UseSSEReturn {
	const {
		url,
		onMessage,
		onOpen,
		onError,
		onReconnect,
		maxRetries = 10,
		initialRetryDelay = 1000,
		maxRetryDelay = 30000
	} = options;

	let eventSource: EventSource | null = null;
	let retryCount = 0;
	let retryTimeout: ReturnType<typeof setTimeout> | null = null;
	const eventHandlers = new Map<string, Set<(data: unknown) => void>>();

	// State (reactive in Svelte context)
	const state: SSEState = $state({
		connected: false,
		connecting: false,
		error: null,
		retryCount: 0
	});

	/**
	 * Calculate retry delay with exponential backoff
	 */
	function getRetryDelay(): number {
		const delay = initialRetryDelay * Math.pow(2, retryCount);
		return Math.min(delay, maxRetryDelay);
	}

	/**
	 * Connect to SSE endpoint
	 */
	function connect(): void {
		if (eventSource || state.connecting) return;

		state.connecting = true;
		state.error = null;

		try {
			eventSource = new EventSource(url);

			eventSource.onopen = () => {
				state.connected = true;
				state.connecting = false;
				state.error = null;
				retryCount = 0;
				state.retryCount = 0;
				onOpen?.();
			};

			eventSource.onmessage = (event) => {
				onMessage?.(event);

				// Dispatch to registered handlers
				try {
					const data = JSON.parse(event.data);
					const handlers = eventHandlers.get('message');
					handlers?.forEach((handler) => handler(data));
				} catch {
					// Not JSON, pass raw data
					const handlers = eventHandlers.get('message');
					handlers?.forEach((handler) => handler(event.data));
				}
			};

			eventSource.onerror = (error) => {
				state.connected = false;
				state.connecting = false;
				onError?.(error);

				// Close current connection
				eventSource?.close();
				eventSource = null;

				// Attempt reconnect
				if (retryCount < maxRetries) {
					const delay = getRetryDelay();
					state.error = `Connection lost. Reconnecting in ${Math.round(delay / 1000)}s...`;

					retryTimeout = setTimeout(() => {
						retryCount++;
						state.retryCount = retryCount;
						onReconnect?.(retryCount);
						connect();
					}, delay);
				} else {
					state.error = 'Connection failed. Max retries exceeded.';
				}
			};

			// Handle custom events
			for (const eventType of eventHandlers.keys()) {
				if (eventType !== 'message') {
					eventSource.addEventListener(eventType, (event: MessageEvent) => {
						try {
							const data = JSON.parse(event.data);
							const handlers = eventHandlers.get(eventType);
							handlers?.forEach((handler) => handler(data));
						} catch {
							const handlers = eventHandlers.get(eventType);
							handlers?.forEach((handler) => handler(event.data));
						}
					});
				}
			}
		} catch (err) {
			state.connecting = false;
			state.error = err instanceof Error ? err.message : 'Failed to connect';
		}
	}

	/**
	 * Disconnect from SSE endpoint
	 */
	function disconnect(): void {
		if (retryTimeout) {
			clearTimeout(retryTimeout);
			retryTimeout = null;
		}

		if (eventSource) {
			eventSource.close();
			eventSource = null;
		}

		state.connected = false;
		state.connecting = false;
		retryCount = 0;
		state.retryCount = 0;
	}

	/**
	 * Add event listener for specific event type
	 * Returns cleanup function
	 */
	function addEventListener(event: string, handler: (data: unknown) => void): () => void {
		if (!eventHandlers.has(event)) {
			eventHandlers.set(event, new Set());

			// If already connected, add listener to EventSource
			if (eventSource && event !== 'message') {
				eventSource.addEventListener(event, (e: MessageEvent) => {
					try {
						const data = JSON.parse(e.data);
						const handlers = eventHandlers.get(event);
						handlers?.forEach((h) => h(data));
					} catch {
						const handlers = eventHandlers.get(event);
						handlers?.forEach((h) => h(e.data));
					}
				});
			}
		}

		eventHandlers.get(event)!.add(handler);

		// Return cleanup function
		return () => {
			const handlers = eventHandlers.get(event);
			if (handlers) {
				handlers.delete(handler);
				if (handlers.size === 0) {
					eventHandlers.delete(event);
				}
			}
		};
	}

	return {
		state,
		connect,
		disconnect,
		addEventListener
	};
}

/**
 * Offline notification queue
 * Stores notifications when offline and processes when back online
 */
export interface OfflineQueue<T> {
	add: (item: T) => void;
	process: (handler: (item: T) => Promise<void>) => Promise<void>;
	clear: () => void;
	size: () => number;
}

export function createOfflineQueue<T>(): OfflineQueue<T> {
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
