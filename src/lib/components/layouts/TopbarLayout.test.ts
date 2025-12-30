import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TopbarLayout from './TopbarLayout.svelte';

describe('TopbarLayout', () => {
	const mockNavItems = [
		{ label: 'Home', href: '/' },
		{ label: 'About', href: '/about' },
		{ label: 'Contact', href: '/contact' }
	];

	it('renders navigation items', () => {
		render(TopbarLayout, {
			props: {
				navItems: mockNavItems
			}
		});

		expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
		expect(screen.getAllByText('About').length).toBeGreaterThan(0);
		expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
	});

	it('renders with correct href links', () => {
		render(TopbarLayout, {
			props: {
				navItems: mockNavItems
			}
		});

		const homeLinks = screen.getAllByText('Home');
		const firstHomeLink = homeLinks[0].closest('a');
		expect(firstHomeLink).toHaveAttribute('href', '/');
	});

	it('applies active class to active item', () => {
		const navItemsWithActive = [
			{ label: 'Home', href: '/', active: true },
			{ label: 'About', href: '/about' }
		];

		render(TopbarLayout, {
			props: {
				navItems: navItemsWithActive
			}
		});

		const homeLinks = screen.getAllByText('Home');
		const activeLink = homeLinks.find((link) => link.closest('a')?.classList.contains('active'));
		expect(activeLink).toBeTruthy();
	});

	it('renders mobile menu button', () => {
		render(TopbarLayout, {
			props: {
				navItems: mockNavItems
			}
		});

		expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
	});

	it('applies sticky class when sticky is true', () => {
		const { container } = render(TopbarLayout, {
			props: {
				navItems: mockNavItems,
				sticky: true
			}
		});

		const navbar = container.querySelector('nav');
		expect(navbar).toHaveClass('sticky');
	});

	it('does not apply sticky class when sticky is false', () => {
		const { container } = render(TopbarLayout, {
			props: {
				navItems: mockNavItems,
				sticky: false
			}
		});

		const navbar = container.querySelector('nav');
		expect(navbar).not.toHaveClass('sticky');
	});
});
