import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import fc from 'fast-check';
import Modal from './Modal.svelte';

describe('Modal', () => {
	/**
	 * **Feature: ui-components, Property 1: Modal visibility controlled by open prop**
	 * For any boolean value of open prop, the Modal should be visible when open=true and hidden when open=false.
	 */
	it('should be visible when open=true and hidden when open=false', () => {
		fc.assert(
			fc.property(fc.boolean(), (open) => {
				const { container } = render(Modal, {
					props: { open }
				});
				const modal = container.querySelector('.modal');

				if (open) {
					expect(modal).toBeInTheDocument();
					expect(modal).toHaveClass('modal-open');
				} else {
					expect(modal).not.toBeInTheDocument();
				}
			}),
			{ numRuns: 100 }
		);
	});

	it('should render title when provided', () => {
		const { container } = render(Modal, {
			props: { open: true, title: 'Test Title' }
		});
		const title = container.querySelector('#modal-title');
		expect(title?.textContent).toBe('Test Title');
	});

	it('should apply correct size class', () => {
		const sizes = ['sm', 'md', 'lg', 'xl'] as const;

		sizes.forEach((size) => {
			const { container } = render(Modal, {
				props: { open: true, size }
			});
			const modalBox = container.querySelector('.modal-box');
			expect(modalBox).toHaveClass(`max-w-${size}`);
		});
	});

	it('should have accessible attributes', () => {
		const { container } = render(Modal, {
			props: { open: true, title: 'Accessible Modal' }
		});
		const modal = container.querySelector('.modal');
		expect(modal).toHaveAttribute('role', 'dialog');
		expect(modal).toHaveAttribute('aria-modal', 'true');
		expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
	});

	it('should show close button by default', () => {
		const { container } = render(Modal, {
			props: { open: true }
		});
		const closeButton = container.querySelector('button[aria-label="Close modal"]');
		expect(closeButton).toBeInTheDocument();
	});

	it('should hide close button when showCloseButton=false', () => {
		const { container } = render(Modal, {
			props: { open: true, showCloseButton: false }
		});
		const closeButton = container.querySelector('button[aria-label="Close modal"]');
		expect(closeButton).not.toBeInTheDocument();
	});
});
