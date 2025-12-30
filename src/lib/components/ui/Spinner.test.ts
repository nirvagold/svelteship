import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import fc from 'fast-check';
import Spinner from './Spinner.svelte';

describe('Spinner', () => {
	/**
	 * **Feature: ui-components, Property 4: Spinner size classes**
	 * For any valid size prop (xs, sm, md, lg), the Spinner should apply the corresponding loading-{size} class.
	 */
	it('should apply correct size class for all valid sizes', () => {
		const sizes = ['xs', 'sm', 'md', 'lg'] as const;

		fc.assert(
			fc.property(fc.constantFrom(...sizes), (size) => {
				const { container } = render(Spinner, { props: { size } });
				const spinner = container.querySelector('.loading');
				expect(spinner).toHaveClass(`loading-${size}`);
			}),
			{ numRuns: 100 }
		);
	});

	it('should apply correct variant class', () => {
		const variants = ['primary', 'secondary', 'accent'] as const;

		fc.assert(
			fc.property(fc.constantFrom(...variants), (variant) => {
				const { container } = render(Spinner, { props: { variant } });
				const spinner = container.querySelector('.loading');
				expect(spinner).toHaveClass(`text-${variant}`);
			}),
			{ numRuns: 100 }
		);
	});

	it('should have accessible role and label', () => {
		const { container } = render(Spinner, { props: { label: 'Loading data' } });
		const spinner = container.querySelector('.loading');
		expect(spinner).toHaveAttribute('role', 'status');
		expect(spinner).toHaveAttribute('aria-label', 'Loading data');
	});
});
