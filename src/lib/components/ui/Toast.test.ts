import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import fc from 'fast-check';
import Toast from './Toast.svelte';

describe('Toast', () => {
	/**
	 * **Feature: ui-components, Property 3: Toast variant styling**
	 * For any toast variant (success, error, warning, info), the Toast should apply the corresponding DaisyUI alert class.
	 */
	it('should apply correct alert class for all variants', () => {
		const variants = ['success', 'error', 'warning', 'info'] as const;

		fc.assert(
			fc.property(fc.constantFrom(...variants), (variant) => {
				const { container } = render(Toast, {
					props: {
						data: {
							id: 'test-id',
							message: 'Test message',
							variant,
							duration: 3000
						}
					}
				});
				const alert = container.querySelector('.alert');
				expect(alert).toHaveClass(`alert-${variant}`);
			}),
			{ numRuns: 100 }
		);
	});

	it('should display the message', () => {
		const { container } = render(Toast, {
			props: {
				data: {
					id: 'test-id',
					message: 'Hello World',
					variant: 'success',
					duration: 3000
				}
			}
		});
		expect(container.textContent).toContain('Hello World');
	});

	it('should have dismiss button', () => {
		const { container } = render(Toast, {
			props: {
				data: {
					id: 'test-id',
					message: 'Test',
					variant: 'info',
					duration: 3000
				}
			}
		});
		const dismissButton = container.querySelector('button[aria-label="Dismiss"]');
		expect(dismissButton).toBeInTheDocument();
	});

	it('should have accessible role', () => {
		const { container } = render(Toast, {
			props: {
				data: {
					id: 'test-id',
					message: 'Test',
					variant: 'warning',
					duration: 3000
				}
			}
		});
		const alert = container.querySelector('.alert');
		expect(alert).toHaveAttribute('role', 'alert');
	});
});
