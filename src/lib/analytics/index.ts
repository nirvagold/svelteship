/**
 * Analytics integration module
 * Supports Plausible, Umami, Google Analytics, and custom endpoints
 * Features: DNT respect, dev mode disable, auto page view tracking
 */

export type AnalyticsProvider = 'plausible' | 'umami' | 'google' | 'custom';

export interface AnalyticsConfig {
	provider: AnalyticsProvider;
	trackingId?: string;
	domain?: string;
	endpoint?: string; // For custom provider
	debug?: boolean;
	respectDNT?: boolean;
	disableInDev?: boolean;
}

export interface AnalyticsState {
	config: AnalyticsConfig | null;
	initialized: boolean;
	disabled: boolean;
}

// Module state
const state: AnalyticsState = {
	config: null,
	initialized: false,
	disabled: false
};

/**
 * Check if Do Not Track is enabled
 */
export function isDNTEnabled(): boolean {
	if (typeof window === 'undefined' || typeof navigator === 'undefined') {
		return false;
	}
	
	// Check various DNT indicators
	const dnt = navigator.doNotTrack || (window as WindowWithDNT).doNotTrack;
	return dnt === '1' || dnt === 'yes';
}

/**
 * Check if we're in development mode
 */
export function isDevMode(): boolean {
	if (typeof window === 'undefined') {
		return false;
	}
	return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

/**
 * Check if analytics should be disabled
 */
export function shouldDisableAnalytics(config: AnalyticsConfig): boolean {
	// Respect DNT if configured
	if (config.respectDNT && isDNTEnabled()) {
		return true;
	}
	
	// Disable in dev mode if configured
	if (config.disableInDev && isDevMode()) {
		return true;
	}
	
	return false;
}

/**
 * Initialize analytics with the given configuration
 */
export function initAnalytics(analyticsConfig: AnalyticsConfig): void {
	if (typeof window === 'undefined') return;

	state.config = analyticsConfig;
	state.disabled = shouldDisableAnalytics(analyticsConfig);
	
	if (state.disabled) {
		if (analyticsConfig.debug) {
			console.log('[Analytics] Disabled due to DNT or dev mode');
		}
		state.initialized = true;
		return;
	}

	switch (analyticsConfig.provider) {
		case 'google':
			if (analyticsConfig.trackingId) {
				initGoogleAnalytics(analyticsConfig.trackingId);
			}
			break;
		case 'plausible':
			initPlausible(analyticsConfig.domain || window.location.hostname);
			break;
		case 'umami':
			if (analyticsConfig.trackingId && analyticsConfig.endpoint) {
				initUmami(analyticsConfig.trackingId, analyticsConfig.endpoint);
			}
			break;
		case 'custom':
			// Custom provider doesn't need initialization
			break;
	}

	state.initialized = true;

	if (analyticsConfig.debug) {
		console.log('[Analytics] Initialized with provider:', analyticsConfig.provider);
	}
}

/**
 * Track a page view
 */
export function trackPageView(path?: string): void {
	if (!state.initialized || !state.config || state.disabled) return;

	const pagePath = path || window.location.pathname;

	switch (state.config.provider) {
		case 'google':
			trackGooglePageView(pagePath);
			break;
		case 'plausible':
			trackPlausiblePageView(pagePath);
			break;
		case 'umami':
			trackUmamiPageView(pagePath);
			break;
		case 'custom':
			trackCustomPageView(pagePath, state.config.endpoint);
			break;
	}

	if (state.config.debug) {
		console.log('[Analytics] Page view:', pagePath);
	}
}

/**
 * Track a custom event
 */
export function trackEvent(
	name: string,
	properties?: Record<string, unknown>
): void {
	if (!state.initialized || !state.config || state.disabled) return;

	switch (state.config.provider) {
		case 'google':
			trackGoogleEvent(name, properties);
			break;
		case 'plausible':
			trackPlausibleEvent(name, properties);
			break;
		case 'umami':
			trackUmamiEvent(name, properties);
			break;
		case 'custom':
			trackCustomEvent(name, properties, state.config.endpoint);
			break;
	}

	if (state.config.debug) {
		console.log('[Analytics] Event:', name, properties);
	}
}

/**
 * Get current analytics state (for testing)
 */
export function getAnalyticsState(): AnalyticsState {
	return { ...state };
}

/**
 * Reset analytics state (for testing)
 */
export function resetAnalytics(): void {
	state.config = null;
	state.initialized = false;
	state.disabled = false;
}

// Google Analytics implementation
function initGoogleAnalytics(trackingId: string): void {
	const script = document.createElement('script');
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
	document.head.appendChild(script);

	window.dataLayer = window.dataLayer || [];
	function gtag(...args: unknown[]) {
		window.dataLayer.push(args);
	}
	gtag('js', new Date());
	gtag('config', trackingId);

	window.gtag = gtag;
}

function trackGooglePageView(path: string): void {
	if (window.gtag) {
		window.gtag('event', 'page_view', { page_path: path });
	}
}

function trackGoogleEvent(name: string, properties?: Record<string, unknown>): void {
	if (window.gtag) {
		window.gtag('event', name, properties);
	}
}

// Plausible implementation
function initPlausible(domain: string): void {
	const script = document.createElement('script');
	script.defer = true;
	script.dataset.domain = domain;
	script.src = 'https://plausible.io/js/script.js';
	document.head.appendChild(script);
}

function trackPlausiblePageView(_path: string): void {
	if (window.plausible) {
		window.plausible('pageview');
	}
}

function trackPlausibleEvent(name: string, properties?: Record<string, unknown>): void {
	if (window.plausible) {
		window.plausible(name, { props: properties });
	}
}

// Umami implementation
function initUmami(websiteId: string, endpoint: string): void {
	const script = document.createElement('script');
	script.defer = true;
	script.dataset.websiteId = websiteId;
	script.src = endpoint;
	document.head.appendChild(script);
}

function trackUmamiPageView(_path: string): void {
	if (window.umami) {
		window.umami.track();
	}
}

function trackUmamiEvent(name: string, properties?: Record<string, unknown>): void {
	if (window.umami) {
		window.umami.track(name, properties);
	}
}

// Custom endpoint implementation
function trackCustomPageView(path: string, endpoint?: string): void {
	if (!endpoint) return;
	
	sendToCustomEndpoint(endpoint, {
		type: 'pageview',
		path,
		timestamp: new Date().toISOString(),
		referrer: document.referrer,
		userAgent: navigator.userAgent
	});
}

function trackCustomEvent(name: string, properties?: Record<string, unknown>, endpoint?: string): void {
	if (!endpoint) return;
	
	sendToCustomEndpoint(endpoint, {
		type: 'event',
		name,
		properties,
		timestamp: new Date().toISOString(),
		path: window.location.pathname
	});
}

function sendToCustomEndpoint(endpoint: string, data: Record<string, unknown>): void {
	// Use sendBeacon for reliability, fallback to fetch
	const payload = JSON.stringify(data);
	
	if (navigator.sendBeacon) {
		navigator.sendBeacon(endpoint, payload);
	} else {
		fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: payload,
			keepalive: true
		}).catch(() => {
			// Silently fail - analytics should not break the app
		});
	}
}

// Type declarations for global analytics objects
interface WindowWithDNT extends Window {
	doNotTrack?: string;
}

declare global {
	interface Window {
		dataLayer: unknown[];
		gtag: (...args: unknown[]) => void;
		plausible: (event: string, options?: { props?: Record<string, unknown> }) => void;
		umami: {
			track: (event?: string, properties?: Record<string, unknown>) => void;
		};
	}
}
