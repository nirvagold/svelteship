import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import SidebarLayout from './SidebarLayout.svelte';

describe('SidebarLayout', () => {
	const mockNavItems = [
		{ label: 'Dashboard', href: '/dashboard' },
		{ label: 'Profile', href: '/profile' },
		{ label: 'Settings', href: '/settings', badge: 3 }
	];

	it('renders navigation items', () => {
		render(SidebarLayout, {
			props: {
				navItems: mockNavItems
			}
		});

		expect(screen.getByText('Dashboard')).toBeInTheDocument();
		expect(screen.getByText('Profile')).toBeInTheDocument();
		expect(screen.getByText('Settings')).toBeInTheDocument();
	});

	it('renders badge when provided', () => {
		render(SidebarLayout, {
			props: {
				navItems: mockNavItems
			}
		});

		expect(screen.getByText('3')).toBeInTheDocument();
	});

	it('renders with correct href links', () => {
		render(SidebarLayout, {
			props: {
				navItems: mockNavItems
			}
		});

		const dashboardLink = screen.getByText('Dashboard').closest('a');
		expect(dashboardLink).toHaveAttribute('href', '/dashboard');
	});

	it('applies active class to active item', () => {
		const navItemsWithActive = [
			{ label: 'Dashboard', href: '/dashboard', active: true },
			{ label: 'Profile', href: '/profile' }
		];

		render(SidebarLayout, {
			props: {
				navItems: navItemsWithActive
			}
		});

		const dashboardLink = screen.getByText('Dashboard').closest('a');
		expect(dashboardLink).toHaveClass('active');
	});

	it('renders mobile menu button', () => {
		render(SidebarLayout, {
			props: {
				navItems: mockNavItems
			}
		});

		expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
	});

	it('renders collapse button when collapsible is true', () => {
		render(SidebarLayout, {
			props: {
				navItems: mockNavItems,
				collapsible: true
			}
		});

		expect(screen.getByLabelText('Collapse sidebar')).toBeInTheDocument();
	});
});
