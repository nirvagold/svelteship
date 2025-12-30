import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import fc from 'fast-check';
import Pagination from './Pagination.svelte';

describe('Pagination', () => {
	/**
	 * **Feature: ui-components, Property 13: Pagination boundary buttons**
	 * For any Pagination on page 1, the prev button should be disabled. For any Pagination on last page, the next button should be disabled.
	 */
	it('should disable prev button on first page', () => {
		fc.assert(
			fc.property(fc.integer({ min: 1, max: 100 }), (totalPages) => {
				const { container } = render(Pagination, {
					props: { totalPages, currentPage: 1 }
				});
				const prevButton = container.querySelector('[aria-label="Previous page"]');
				expect(prevButton).toBeDisabled();
			}),
			{ numRuns: 100 }
		);
	});

	it('should disable next button on last page', () => {
		fc.assert(
			fc.property(fc.integer({ min: 1, max: 100 }), (totalPages) => {
				const { container } = render(Pagination, {
					props: { totalPages, currentPage: totalPages }
				});
				const nextButton = container.querySelector('[aria-label="Next page"]');
				expect(nextButton).toBeDisabled();
			}),
			{ numRuns: 100 }
		);
	});

	it('should enable both buttons on middle pages', () => {
		const { container } = render(Pagination, {
			props: { totalPages: 10, currentPage: 5 }
		});
		const prevButton = container.querySelector('[aria-label="Previous page"]');
		const nextButton = container.querySelector('[aria-label="Next page"]');
		expect(prevButton).not.toBeDisabled();
		expect(nextButton).not.toBeDisabled();
	});

	it('should mark current page as active', () => {
		const { container } = render(Pagination, {
			props: { totalPages: 5, currentPage: 3 }
		});
		const activeButton = container.querySelector('.btn-active');
		expect(activeButton?.textContent).toBe('3');
		expect(activeButton).toHaveAttribute('aria-current', 'page');
	});

	it('should show ellipsis for many pages', () => {
		const { container } = render(Pagination, {
			props: { totalPages: 20, currentPage: 10, maxVisible: 5 }
		});
		const ellipsis = container.querySelectorAll('.btn-disabled');
		expect(ellipsis.length).toBeGreaterThan(0);
	});

	it('should show first/last buttons when enabled', () => {
		const { container } = render(Pagination, {
			props: { totalPages: 10, currentPage: 5, showFirstLast: true }
		});
		const firstButton = container.querySelector('[aria-label="First page"]');
		const lastButton = container.querySelector('[aria-label="Last page"]');
		expect(firstButton).toBeInTheDocument();
		expect(lastButton).toBeInTheDocument();
	});

	it('should have accessible navigation role', () => {
		const { container } = render(Pagination, {
			props: { totalPages: 5, currentPage: 1 }
		});
		const nav = container.querySelector('[role="navigation"]');
		expect(nav).toHaveAttribute('aria-label', 'Pagination');
	});
});
