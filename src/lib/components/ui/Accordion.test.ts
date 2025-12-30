import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Accordion from './Accordion.svelte';

describe('Accordion', () => {
	const createItems = (count: number) =>
		Array.from({ length: count }, (_, i) => ({
			id: `item-${i}`,
			title: `Item ${i}`,
			content: (() => {}) as unknown as import('svelte').Snippet
		}));

	/**
	 * **Feature: ui-components, Property 10: Accordion single-open mode**
	 * For any Accordion with multiple=false, clicking a closed section should close any currently open section.
	 */
	it('should close other items when opening a new one in single mode', async () => {
		const items = createItems(3);
		const { container } = render(Accordion, {
			props: { items, multiple: false, defaultOpen: ['item-0'] }
		});

		// First item should be open
		let collapses = container.querySelectorAll('.collapse');
		expect(collapses[0]).toHaveClass('collapse-open');
		expect(collapses[1]).not.toHaveClass('collapse-open');

		// Click second item
		const buttons = container.querySelectorAll('.collapse-title');
		await fireEvent.click(buttons[1]);

		// Now second should be open, first should be closed
		collapses = container.querySelectorAll('.collapse');
		expect(collapses[0]).not.toHaveClass('collapse-open');
		expect(collapses[1]).toHaveClass('collapse-open');
	});

	it('should allow multiple items open when multiple=true', async () => {
		const items = createItems(3);
		const { container } = render(Accordion, {
			props: { items, multiple: true, defaultOpen: ['item-0'] }
		});

		// Click second item
		const buttons = container.querySelectorAll('.collapse-title');
		await fireEvent.click(buttons[1]);

		// Both should be open
		const collapses = container.querySelectorAll('.collapse');
		expect(collapses[0]).toHaveClass('collapse-open');
		expect(collapses[1]).toHaveClass('collapse-open');
	});

	it('should render all items', () => {
		const items = createItems(5);
		const { container } = render(Accordion, { props: { items } });
		const collapses = container.querySelectorAll('.collapse');
		expect(collapses.length).toBe(5);
	});

	it('should open items specified in defaultOpen', () => {
		const items = createItems(3);
		const { container } = render(Accordion, {
			props: { items, defaultOpen: ['item-1'] }
		});
		const collapses = container.querySelectorAll('.collapse');
		expect(collapses[0]).not.toHaveClass('collapse-open');
		expect(collapses[1]).toHaveClass('collapse-open');
		expect(collapses[2]).not.toHaveClass('collapse-open');
	});

	it('should toggle item on click', async () => {
		const items = createItems(2);
		const { container } = render(Accordion, { props: { items } });

		const buttons = container.querySelectorAll('.collapse-title');
		let collapses = container.querySelectorAll('.collapse');

		// Initially closed
		expect(collapses[0]).not.toHaveClass('collapse-open');

		// Click to open
		await fireEvent.click(buttons[0]);
		collapses = container.querySelectorAll('.collapse');
		expect(collapses[0]).toHaveClass('collapse-open');

		// Click to close
		await fireEvent.click(buttons[0]);
		collapses = container.querySelectorAll('.collapse');
		expect(collapses[0]).not.toHaveClass('collapse-open');
	});

	it('should not toggle disabled items', async () => {
		const items = [
			{ id: 'item-0', title: 'Item 0', content: (() => {}) as unknown as import('svelte').Snippet, disabled: true }
		];
		const { container } = render(Accordion, { props: { items } });

		const button = container.querySelector('.collapse-title');
		await fireEvent.click(button!);

		const collapse = container.querySelector('.collapse');
		expect(collapse).not.toHaveClass('collapse-open');
	});

	it('should have accessible attributes', () => {
		const items = createItems(1);
		const { container } = render(Accordion, {
			props: { items, defaultOpen: ['item-0'] }
		});

		const button = container.querySelector('.collapse-title');
		expect(button).toHaveAttribute('aria-expanded', 'true');
		expect(button).toHaveAttribute('aria-controls', 'accordion-content-item-0');

		const content = container.querySelector('.collapse-content');
		expect(content).toHaveAttribute('role', 'region');
	});
});
