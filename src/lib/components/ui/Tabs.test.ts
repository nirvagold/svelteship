import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import fc from 'fast-check';
import Tabs from './Tabs.svelte';

describe('Tabs', () => {
	/**
	 * **Feature: ui-components, Property 7: Tabs render all provided tabs**
	 * For any array of tabs, the Tabs component should render exactly that many tab buttons.
	 */
	it('should render exactly the number of tabs provided', () => {
		fc.assert(
			fc.property(
				fc.array(
					fc.record({
						id: fc.string({ minLength: 1, maxLength: 10 }),
						label: fc.string({ minLength: 1, maxLength: 20 })
					}),
					{ minLength: 1, maxLength: 10 }
				),
				(tabs) => {
					// Ensure unique ids
					const uniqueTabs = tabs.filter(
						(tab, idx, arr) => arr.findIndex((t) => t.id === tab.id) === idx
					);

					const { container } = render(Tabs, { props: { tabs: uniqueTabs } });
					const tabButtons = container.querySelectorAll('[role="tab"]');
					expect(tabButtons.length).toBe(uniqueTabs.length);
				}
			),
			{ numRuns: 100 }
		);
	});

	it('should mark first tab as active by default', () => {
		const { container } = render(Tabs, {
			props: {
				tabs: [
					{ id: 'tab1', label: 'Tab 1' },
					{ id: 'tab2', label: 'Tab 2' }
				]
			}
		});
		const firstTab = container.querySelector('[role="tab"]');
		expect(firstTab).toHaveClass('tab-active');
	});

	it('should mark specified activeTab as active', () => {
		const { container } = render(Tabs, {
			props: {
				tabs: [
					{ id: 'tab1', label: 'Tab 1' },
					{ id: 'tab2', label: 'Tab 2' }
				],
				activeTab: 'tab2'
			}
		});
		const tabs = container.querySelectorAll('[role="tab"]');
		expect(tabs[0]).not.toHaveClass('tab-active');
		expect(tabs[1]).toHaveClass('tab-active');
	});

	it('should apply correct variant class', () => {
		const variants = ['boxed', 'lifted', 'bordered'] as const;

		variants.forEach((variant) => {
			const { container } = render(Tabs, {
				props: {
					tabs: [{ id: 'tab1', label: 'Tab 1' }],
					variant
				}
			});
			const tabsContainer = container.querySelector('.tabs');
			expect(tabsContainer).toHaveClass(`tabs-${variant}`);
		});
	});

	it('should disable tab when disabled prop is true', () => {
		const { container } = render(Tabs, {
			props: {
				tabs: [
					{ id: 'tab1', label: 'Tab 1' },
					{ id: 'tab2', label: 'Tab 2', disabled: true }
				]
			}
		});
		const tabs = container.querySelectorAll('[role="tab"]');
		expect(tabs[1]).toBeDisabled();
		expect(tabs[1]).toHaveClass('tab-disabled');
	});

	it('should have accessible attributes', () => {
		const { container } = render(Tabs, {
			props: {
				tabs: [{ id: 'tab1', label: 'Tab 1' }],
				activeTab: 'tab1'
			}
		});
		const tab = container.querySelector('[role="tab"]');
		expect(tab).toHaveAttribute('aria-selected', 'true');
		expect(tab).toHaveAttribute('aria-controls', 'tabpanel-tab1');
	});
});
