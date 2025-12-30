import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import fc from 'fast-check';
import Breadcrumb from './Breadcrumb.svelte';

describe('Breadcrumb', () => {
	/**
	 * **Feature: ui-components, Property 14: Breadcrumb last item is not a link**
	 * For any Breadcrumb items array, the last item should be rendered as text (not a link) regardless of href.
	 */
	it('should render last item as text, not a link', () => {
		fc.assert(
			fc.property(
				fc.array(
					fc.record({
						label: fc.string({ minLength: 1, maxLength: 20 }),
						href: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined })
					}),
					{ minLength: 1, maxLength: 5 }
				),
				(items) => {
					const { container } = render(Breadcrumb, { props: { items } });
					const listItems = container.querySelectorAll('li');
					const lastItem = listItems[listItems.length - 1];

					// Last item should not have an anchor tag
					const anchor = lastItem.querySelector('a');
					expect(anchor).toBeNull();

					// Last item should have a span with font-medium class
					const span = lastItem.querySelector('span.font-medium');
					expect(span).toBeInTheDocument();
					expect(span?.textContent).toBe(items[items.length - 1].label);
				}
			),
			{ numRuns: 100 }
		);
	});

	it('should render all items', () => {
		const items = [
			{ label: 'Home', href: '/' },
			{ label: 'Products', href: '/products' },
			{ label: 'Details' }
		];
		const { container } = render(Breadcrumb, { props: { items } });
		const listItems = container.querySelectorAll('li');
		expect(listItems.length).toBe(3);
	});

	it('should render links for non-last items with href', () => {
		const items = [
			{ label: 'Home', href: '/' },
			{ label: 'Products', href: '/products' },
			{ label: 'Details' }
		];
		const { container } = render(Breadcrumb, { props: { items } });
		const links = container.querySelectorAll('a');
		expect(links.length).toBe(2);
		expect(links[0]).toHaveAttribute('href', '/');
		expect(links[1]).toHaveAttribute('href', '/products');
	});

	it('should render span for non-last items without href', () => {
		const items = [
			{ label: 'Category' },
			{ label: 'Subcategory' },
			{ label: 'Item' }
		];
		const { container } = render(Breadcrumb, { props: { items } });
		const links = container.querySelectorAll('a');
		expect(links.length).toBe(0);
	});

	it('should have breadcrumbs class', () => {
		const { container } = render(Breadcrumb, {
			props: { items: [{ label: 'Home' }] }
		});
		const breadcrumbs = container.querySelector('.breadcrumbs');
		expect(breadcrumbs).toBeInTheDocument();
	});
});
