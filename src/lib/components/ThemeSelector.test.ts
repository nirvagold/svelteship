import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ThemeSelector from './ThemeSelector.svelte';

describe('ThemeSelector', () => {
	beforeEach(() => {
		const localStorageMock = {
			getItem: vi.fn(() => null),
			setItem: vi.fn()
		};
		Object.defineProperty(window, 'localStorage', { value: localStorageMock });

		Object.defineProperty(window, 'matchMedia', {
			value: vi.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn()
			}))
		});
	});

	it('renders theme selector button', () => {
		render(ThemeSelector);
		expect(screen.getByLabelText('Select theme')).toBeInTheDocument();
	});

	it('renders with custom themes', () => {
		render(ThemeSelector, {
			props: {
				themes: ['light', 'dark', 'cupcake']
			}
		});
		expect(screen.getByLabelText('Select theme')).toBeInTheDocument();
	});

	it('shows label when showLabel is true', () => {
		render(ThemeSelector, {
			props: {
				showLabel: true
			}
		});
		expect(screen.getByText('Light')).toBeInTheDocument();
	});

	it('applies correct size class', () => {
		const { container } = render(ThemeSelector, {
			props: {
				size: 'lg'
			}
		});
		const button = container.querySelector('.btn-lg');
		expect(button).toBeInTheDocument();
	});

	it('applies xs size class', () => {
		const { container } = render(ThemeSelector, {
			props: {
				size: 'xs'
			}
		});
		const button = container.querySelector('.btn-xs');
		expect(button).toBeInTheDocument();
	});
});
