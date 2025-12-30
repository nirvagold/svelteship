import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import fc from 'fast-check';
import Tooltip from './Tooltip.svelte';

describe('Tooltip', () => {
	/**
	 * **Feature: ui-components, Property 9: Tooltip position classes**
	 * For any position prop (top, bottom, left, right), the Tooltip should apply the corresponding tooltip-{position} class.
	 */
	it('should apply correct position class for all positions', () => {
		const positions = ['top', 'bottom', 'left', 'right'] as const;

		fc.assert(
			fc.property(fc.constantFrom(...positions), (position) => {
				const { container } = render(Tooltip, {
					props: { content: 'Test tooltip', position }
				});
				const tooltip = container.querySelector('.tooltip');
				expect(tooltip).toHaveClass(`tooltip-${position}`);
			}),
			{ numRuns: 100 }
		);
	});

	it('should set data-tip attribute with content', () => {
		const { container } = render(Tooltip, {
			props: { content: 'Hello World' }
		});
		const tooltip = container.querySelector('.tooltip');
		expect(tooltip).toHaveAttribute('data-tip', 'Hello World');
	});

	it('should default to top position', () => {
		const { container } = render(Tooltip, {
			props: { content: 'Test' }
		});
		const tooltip = container.querySelector('.tooltip');
		expect(tooltip).toHaveClass('tooltip-top');
	});

	it('should apply custom delay', () => {
		const { container } = render(Tooltip, {
			props: { content: 'Test', delay: 500 }
		});
		const tooltip = container.querySelector('.tooltip');
		expect(tooltip).toHaveStyle('--tooltip-delay: 500ms');
	});
});
