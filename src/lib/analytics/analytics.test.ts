/**
 * Tests for analytics module
 * Property-based tests using fast-check
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';

// Copy pure functions from analytics to avoid browser-specific issues
type AnalyticsProvider = 'plausible' | 'umami' | 'google' | 'custom';

interface AnalyticsConfig {
	provider: AnalyticsProvider;
	trackingId?: string;
	domain?: string;
	endpoint?: string;
	debug?: boolean;
	respectDNT?: boolean;
	disableInDev?: boolean;
}

// Pure function to check if analytics should be disabled
function shouldDisableAnalytics(
	config: AnalyticsConfig,
	dntEnabled: boolean,
	isDevMode: boolean
): boolean {
	if (config.respectDNT && dntEnabled) {
		return true;
	}
	if (config.disableInDev && isDevMode) {
		return true;
	}
	return false;
}

// Arbitraries
const providerArb = fc.constantFrom<AnalyticsProvider>('plausible', 'umami', 'google', 'custom');

const configArb = fc.record({
	provider: providerArb,
	trackingId: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
	domain: fc.option(fc.domain(), { nil: undefined }),
	endpoint: fc.option(fc.webUrl(), { nil: undefined }),
	debug: fc.option(fc.boolean(), { nil: undefined }),
	respectDNT: fc.option(fc.boolean(), { nil: undefined }),
	disableInDev: fc.option(fc.boolean(), { nil: undefined })
});

describe('Analytics', () => {
	describe('shouldDisableAnalytics', () => {
		it('should disable when DNT is enabled and respectDNT is true', () => {
			fc.assert(
				fc.property(
					configArb,
					fc.boolean(),
					(config, isDevMode) => {
						const configWithDNT = { ...config, respectDNT: true };
						const result = shouldDisableAnalytics(configWithDNT, true, isDevMode);
						expect(result).toBe(true);
					}
				),
				{ numRuns: 30 }
			);
		});

		it('should not disable when DNT is enabled but respectDNT is false', () => {
			fc.assert(
				fc.property(
					configArb,
					(config) => {
						const configWithoutDNT = { ...config, respectDNT: false, disableInDev: false };
						const result = shouldDisableAnalytics(configWithoutDNT, true, false);
						expect(result).toBe(false);
					}
				),
				{ numRuns: 30 }
			);
		});

		it('should disable in dev mode when disableInDev is true', () => {
			fc.assert(
				fc.property(
					configArb,
					fc.boolean(),
					(config, dntEnabled) => {
						const configWithDevDisable = { ...config, disableInDev: true, respectDNT: false };
						const result = shouldDisableAnalytics(configWithDevDisable, dntEnabled, true);
						expect(result).toBe(true);
					}
				),
				{ numRuns: 30 }
			);
		});

		it('should not disable in dev mode when disableInDev is false', () => {
			fc.assert(
				fc.property(
					configArb,
					(config) => {
						const configWithoutDevDisable = { ...config, disableInDev: false, respectDNT: false };
						const result = shouldDisableAnalytics(configWithoutDevDisable, false, true);
						expect(result).toBe(false);
					}
				),
				{ numRuns: 30 }
			);
		});

		it('should not disable when both DNT and dev mode are off', () => {
			fc.assert(
				fc.property(
					configArb,
					(config) => {
						const result = shouldDisableAnalytics(config, false, false);
						expect(result).toBe(false);
					}
				),
				{ numRuns: 30 }
			);
		});

		it('DNT takes precedence over dev mode check', () => {
			// If respectDNT is true and DNT is enabled, should disable regardless of dev mode
			const config: AnalyticsConfig = {
				provider: 'plausible',
				respectDNT: true,
				disableInDev: false
			};
			
			expect(shouldDisableAnalytics(config, true, false)).toBe(true);
			expect(shouldDisableAnalytics(config, true, true)).toBe(true);
		});
	});

	describe('Provider configuration', () => {
		it('should accept all valid provider types', () => {
			const providers: AnalyticsProvider[] = ['plausible', 'umami', 'google', 'custom'];
			
			providers.forEach(provider => {
				const config: AnalyticsConfig = { provider };
				expect(config.provider).toBe(provider);
			});
		});

		it('should handle optional fields correctly', () => {
			fc.assert(
				fc.property(
					providerArb,
					(provider) => {
						// Minimal config should be valid
						const minimalConfig: AnalyticsConfig = { provider };
						expect(minimalConfig.provider).toBe(provider);
						expect(minimalConfig.trackingId).toBeUndefined();
						expect(minimalConfig.domain).toBeUndefined();
						expect(minimalConfig.endpoint).toBeUndefined();
					}
				),
				{ numRuns: 10 }
			);
		});
	});
});

describe('Analytics Integration', () => {
	let originalWindow: typeof globalThis.window;
	let originalNavigator: typeof globalThis.navigator;

	beforeEach(() => {
		originalWindow = globalThis.window;
		originalNavigator = globalThis.navigator;
		
		// Mock window
		globalThis.window = {
			location: {
				hostname: 'example.com',
				pathname: '/test'
			},
			document: {
				referrer: 'https://google.com',
				createElement: vi.fn(() => ({
					async: false,
					defer: false,
					src: '',
					dataset: {}
				})),
				head: {
					appendChild: vi.fn()
				}
			}
		} as unknown as typeof window;

		// Mock navigator
		globalThis.navigator = {
			doNotTrack: null,
			userAgent: 'test-agent',
			sendBeacon: vi.fn(() => true)
		} as unknown as typeof navigator;
	});

	afterEach(() => {
		globalThis.window = originalWindow;
		globalThis.navigator = originalNavigator;
		vi.restoreAllMocks();
	});

	it('should detect DNT from navigator.doNotTrack', async () => {
		const { isDNTEnabled } = await import('./index');
		
		// DNT not set
		(navigator as { doNotTrack: string | null }).doNotTrack = null;
		expect(isDNTEnabled()).toBe(false);
		
		// DNT set to '1'
		(navigator as { doNotTrack: string | null }).doNotTrack = '1';
		expect(isDNTEnabled()).toBe(true);
		
		// DNT set to 'yes'
		(navigator as { doNotTrack: string | null }).doNotTrack = 'yes';
		expect(isDNTEnabled()).toBe(true);
		
		// DNT set to '0'
		(navigator as { doNotTrack: string | null }).doNotTrack = '0';
		expect(isDNTEnabled()).toBe(false);
	});

	it('should detect dev mode from localhost', async () => {
		const { isDevMode } = await import('./index');
		
		// Production hostname
		(window.location as { hostname: string }).hostname = 'example.com';
		expect(isDevMode()).toBe(false);
		
		// Localhost
		(window.location as { hostname: string }).hostname = 'localhost';
		expect(isDevMode()).toBe(true);
		
		// 127.0.0.1
		(window.location as { hostname: string }).hostname = '127.0.0.1';
		expect(isDevMode()).toBe(true);
	});

	it('should not track when disabled', async () => {
		const { initAnalytics, trackPageView, trackEvent, resetAnalytics } = await import('./index');
		
		resetAnalytics();
		
		// Enable DNT
		(navigator as { doNotTrack: string | null }).doNotTrack = '1';
		
		initAnalytics({
			provider: 'custom',
			endpoint: 'https://analytics.example.com/track',
			respectDNT: true
		});
		
		// These should not send any data
		trackPageView('/test');
		trackEvent('click', { button: 'submit' });
		
		// sendBeacon should not have been called
		expect(navigator.sendBeacon).not.toHaveBeenCalled();
	});

	it('should track when not disabled', async () => {
		const { initAnalytics, trackPageView, resetAnalytics } = await import('./index');
		
		resetAnalytics();
		
		// Disable DNT
		(navigator as { doNotTrack: string | null }).doNotTrack = '0';
		(window.location as { hostname: string }).hostname = 'example.com';
		
		initAnalytics({
			provider: 'custom',
			endpoint: 'https://analytics.example.com/track',
			respectDNT: true,
			disableInDev: true
		});
		
		trackPageView('/test');
		
		// sendBeacon should have been called
		expect(navigator.sendBeacon).toHaveBeenCalled();
	});

	it('should reset state correctly', async () => {
		const { initAnalytics, getAnalyticsState, resetAnalytics } = await import('./index');
		
		initAnalytics({
			provider: 'plausible',
			domain: 'example.com'
		});
		
		let state = getAnalyticsState();
		expect(state.initialized).toBe(true);
		expect(state.config).not.toBeNull();
		
		resetAnalytics();
		
		state = getAnalyticsState();
		expect(state.initialized).toBe(false);
		expect(state.config).toBeNull();
	});
});
