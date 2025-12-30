import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import SplitLayout from './SplitLayout.svelte';

describe('SplitLayout', () => {
	it('renders with default 1:1 ratio', () => {
		const { container } = render(SplitLayout, {
			props: {}
		});

		const columns = container.querySelectorAll('.lg\\:w-1\\/2');
		expect(columns.length).toBe(2);
	});

	it('renders with 1:2 ratio', () => {
		const { container } = render(SplitLayout, {
			props: {
				ratio: '1:2'
			}
		});

		expect(container.querySelector('.lg\\:w-1\\/3')).toBeInTheDocument();
		expect(container.querySelector('.lg\\:w-2\\/3')).toBeInTheDocument();
	});

	it('renders with 2:1 ratio', () => {
		const { container } = render(SplitLayout, {
			props: {
				ratio: '2:1'
			}
		});

		expect(container.querySelector('.lg\\:w-2\\/3')).toBeInTheDocument();
		expect(container.querySelector('.lg\\:w-1\\/3')).toBeInTheDocument();
	});

	it('applies reverse class when reverse is true', () => {
		const { container } = render(SplitLayout, {
			props: {
				reverse: true
			}
		});

		const wrapper = container.querySelector('.flex-col-reverse');
		expect(wrapper).toBeInTheDocument();
	});

	it('does not apply reverse class when reverse is false', () => {
		const { container } = render(SplitLayout, {
			props: {
				reverse: false
			}
		});

		const wrapper = container.querySelector('.flex-col-reverse');
		expect(wrapper).not.toBeInTheDocument();
	});

	it('applies gap classes', () => {
		const { container } = render(SplitLayout, {
			props: {
				gap: 'lg'
			}
		});

		const wrapper = container.querySelector('.gap-6');
		expect(wrapper).toBeInTheDocument();
	});

	it('renders as flex column on mobile and row on desktop', () => {
		const { container } = render(SplitLayout, {
			props: {}
		});

		const wrapper = container.querySelector('.flex-col.lg\\:flex-row');
		expect(wrapper).toBeInTheDocument();
	});
});
