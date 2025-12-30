import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import CenteredLayout from './CenteredLayout.svelte';

describe('CenteredLayout', () => {
	it('renders with default size (md)', () => {
		const { container } = render(CenteredLayout, {
			props: {}
		});

		const wrapper = container.querySelector('.max-w-md');
		expect(wrapper).toBeInTheDocument();
	});

	it('renders with small size', () => {
		const { container } = render(CenteredLayout, {
			props: {
				size: 'sm'
			}
		});

		const wrapper = container.querySelector('.max-w-sm');
		expect(wrapper).toBeInTheDocument();
	});

	it('renders with large size', () => {
		const { container } = render(CenteredLayout, {
			props: {
				size: 'lg'
			}
		});

		const wrapper = container.querySelector('.max-w-lg');
		expect(wrapper).toBeInTheDocument();
	});

	it('renders card wrapper when card is true', () => {
		const { container } = render(CenteredLayout, {
			props: {
				card: true
			}
		});

		const card = container.querySelector('.card');
		expect(card).toBeInTheDocument();
	});

	it('does not render card wrapper when card is false', () => {
		const { container } = render(CenteredLayout, {
			props: {
				card: false
			}
		});

		const card = container.querySelector('.card');
		expect(card).not.toBeInTheDocument();
	});

	it('applies gradient background', () => {
		const { container } = render(CenteredLayout, {
			props: {
				background: 'gradient'
			}
		});

		const wrapper = container.querySelector('.bg-gradient-to-br');
		expect(wrapper).toBeInTheDocument();
	});

	it('centers content vertically and horizontally', () => {
		const { container } = render(CenteredLayout, {
			props: {}
		});

		const wrapper = container.querySelector('.flex.items-center.justify-center');
		expect(wrapper).toBeInTheDocument();
	});
});
