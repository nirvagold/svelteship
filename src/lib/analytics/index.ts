/**
 * Analytics integration module
 * Supports Google Analytics and Plausible
 */

export interface AnalyticsConfig {
	provider: 'google' | 'plausible' | 'custom';
	trackingId: string;
	debug?: boolean;
	domain?: string; // For Plausible
}

let config: AnalyticsConfig | null = null;
let initialized = false;

/**
 * Initialize analytics with the given configuration
 */
export function initAnalytics(analyticsConfig: AnalyticsConfig): void {
	if (typeof window === 'undefined') return;

	config = analyticsConfig;

	if (config.provider === 'google') {
		initGoogleAnalytics(config.trackingId);
	} else if (config.provider === 'plausible') {
		initPlausible(config.domain || window.location.hostname);
	}

	initialized = true;

	if (config.debug) {
		console.log('[Analytics] Initialized with provider:', config.provider);
	}
}

/**
 * Track a page view
 */
export function trackPageView(path?: string): void {
	if (!initialized || !config) return;

	const pagePath = path || window.location.pathname;

	if (config.provider === 'google') {
		trackGooglePageView(pagePath);
	} else if (config.provider === 'plausible') {
		trackPlausiblePageView(pagePath);
	}

	if (config.debug) {
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
	if (!initialized || !config) return;

	if (config.provider === 'google') {
		trackGoogleEvent(name, properties);
	} else if (config.provider === 'plausible') {
		trackPlausibleEvent(name, properties);
	}

	if (config.debug) {
		console.log('[Analytics] Event:', name, properties);
	}
}

// Google Analytics implementation
function initGoogleAnalytics(trackingId: string): void {
	// Load gtag script
	const script = document.createElement('script');
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
	document.head.appendChild(script);

	// Initialize gtag
	window.dataLayer = window.dataLayer || [];
	function gtag(...args: unknown[]) {
		window.dataLayer.push(args);
	}
	gtag('js', new Date());
	gtag('config', trackingId);

	// Store gtag function globally
	window.gtag = gtag;
}

function trackGooglePageView(path: string): void {
	if (window.gtag) {
		window.gtag('event', 'page_view', {
			page_path: path
		});
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
	// Plausible automatically tracks page views
	// This is here for manual tracking if needed
	if (window.plausible) {
		window.plausible('pageview');
	}
}

function trackPlausibleEvent(name: string, properties?: Record<string, unknown>): void {
	if (window.plausible) {
		window.plausible(name, { props: properties });
	}
}

// Type declarations for global analytics objects
declare global {
	interface Window {
		dataLayer: unknown[];
		gtag: (...args: unknown[]) => void;
		plausible: (event: string, options?: { props?: Record<string, unknown> }) => void;
	}
}
