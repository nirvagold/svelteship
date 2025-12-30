import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import fc from 'fast-check';
import Progress from './Progress.svelte';

describe('Progress', () => {
	/**
	 * **Feature: ui-components, Property 11: Progress percentage calculation**
	 * For any value and max props, the Progress should display (value/max * 100)% filled.
	 */
	it('should calculate percentage correctly for any value and max', () => {
		fc.assert(
			fc.property(
				fc.integer({ min: 0, max: 1000 }),
				fc.integer({ min: 1, max: 1000 }),
				(value, max) => {
					const { container } = render(Progress, {
						props: { value, max, showLabel: true }
					});
					const progress = container.querySelector('progress');
					const label = container.querySelector('span');

					expect(progress).toHaveAttribute('value', String(value));
					expect(progress).toHaveAttribute('max', String(max));

					const expectedPercentage = Math.round(Math.min(100, Math.max(0, (value / max) * 100)));
					expect(label?.textContent).toBe(`${expectedPercentage}%`);
				}
			),
			{ numRuns: 100 }
		);
	});

	it('should apply correct variant class', () => {
		const variants = ['primary', 'secondary', 'accent', 'success', 'warning', 'error'] as const;

		fc.assert(
			fc.property(fc.constantFrom(...variants), (variant) => {
				const { container } = render(Progress, {
					props: { value: 50, variant }
				});
				const progress = container.querySelector('progress');
				expect(progress).toHaveClass(`progress-${variant}`);
			}),
			{ numRuns: 100 }
		);
	});

	it('should clamp percentage between 0 and 100', () => {
		const { container: container1 } = render(Progress, {
			props: { value: 150, max: 100, showLabel: true }
		});
		expect(container1.querySelector('span')?.textContent).toBe('100%');

		const { container: container2 } = render(Progress, {
			props: { value: -50, max: 100, showLabel: true }
		});
		expect(container2.querySelector('span')?.textContent).toBe('0%');
	});
});
