import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import fc from 'fast-check';
import Badge from './Badge.svelte';

describe('Badge', () => {
	/**
	 * **Feature: ui-components, Property 5: Badge variant and size styling**
	 * For any combination of variant and size props, the Badge should apply both corresponding classes.
	 */
	it('should apply correct variant class for all variants', () => {
		const variants = ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'] as const;

		fc.assert(
			fc.property(fc.constantFrom(...variants), (variant) => {
				const { container } = render(Badge, {
					props: { variant }
				});
				const badge = container.querySelector('.badge');
				expect(badge).toHaveClass(`badge-${variant}`);
			}),
			{ numRuns: 100 }
		);
	});

	it('should apply correct size class for all sizes', () => {
		const sizes = ['sm', 'md', 'lg'] as const;
		const sizeClasses: Record<string, string> = {
			sm: 'badge-sm',
			md: '',
			lg: 'badge-lg'
		};

		fc.assert(
			fc.property(fc.constantFrom(...sizes), (size) => {
				const { container } = render(Badge, {
					props: { size }
				});
				const badge = container.querySelector('.badge');
				if (size !== 'md') {
					expect(badge).toHaveClass(sizeClasses[size]);
				}
			}),
			{ numRuns: 100 }
		);
	});

	it('should apply outline class when outline prop is true', () => {
		const { container } = render(Badge, {
			props: { outline: true }
		});
		const badge = container.querySelector('.badge');
		expect(badge).toHaveClass('badge-outline');
	});
});
