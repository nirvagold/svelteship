import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import fc from 'fast-check';
import Skeleton from './Skeleton.svelte';

describe('Skeleton', () => {
	/**
	 * **Feature: ui-components, Property 12: Skeleton count rendering**
	 * For any count prop value n, the Skeleton should render exactly n skeleton elements.
	 */
	it('should render exactly count number of skeleton elements', () => {
		fc.assert(
			fc.property(fc.integer({ min: 1, max: 10 }), (count) => {
				const { container } = render(Skeleton, { props: { count } });
				const skeletons = container.querySelectorAll('.skeleton');
				expect(skeletons.length).toBe(count);
			}),
			{ numRuns: 100 }
		);
	});

	it('should apply correct styles for text variant', () => {
		const { container } = render(Skeleton, { props: { variant: 'text' } });
		const skeleton = container.querySelector('.skeleton');
		expect(skeleton).toHaveStyle({ width: '100%', height: '1rem' });
	});

	it('should apply correct styles for circle variant', () => {
		const { container } = render(Skeleton, { props: { variant: 'circle' } });
		const skeleton = container.querySelector('.skeleton');
		expect(skeleton).toHaveStyle({ width: '3rem', height: '3rem', borderRadius: '50%' });
	});

	it('should apply correct styles for rectangle variant', () => {
		const { container } = render(Skeleton, { props: { variant: 'rectangle' } });
		const skeleton = container.querySelector('.skeleton');
		expect(skeleton).toHaveStyle({ width: '100%', height: '6rem' });
	});

	it('should use custom width and height when provided', () => {
		const { container } = render(Skeleton, {
			props: { width: '200px', height: '50px' }
		});
		const skeleton = container.querySelector('.skeleton');
		expect(skeleton).toHaveStyle({ width: '200px', height: '50px' });
	});
});
