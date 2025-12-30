import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Dropdown from './Dropdown.svelte';

describe('Dropdown', () => {
	/**
	 * **Feature: ui-components, Property 2: Dropdown renders all options**
	 * For any array of options provided, the Dropdown should render exactly that many option elements in the menu.
	 */
	it('should render exactly the number of options provided', async () => {
		const options = [
			{ value: '1', label: 'Option 1' },
			{ value: '2', label: 'Option 2' },
			{ value: '3', label: 'Option 3' }
		];

		const { container } = render(Dropdown, { props: { options } });

		// Open dropdown
		const button = container.querySelector('button');
		await fireEvent.click(button!);

		const listItems = container.querySelectorAll('li');
		expect(listItems.length).toBe(options.length);
	});

	it('should render different number of options correctly', async () => {
		// Test with 1 option
		const { container: c1 } = render(Dropdown, {
			props: { options: [{ value: 'a', label: 'A' }] }
		});
		await fireEvent.click(c1.querySelector('button')!);
		expect(c1.querySelectorAll('li').length).toBe(1);

		// Test with 5 options
		const options5 = Array.from({ length: 5 }, (_, i) => ({
			value: `v${i}`,
			label: `Label ${i}`
		}));
		const { container: c5 } = render(Dropdown, { props: { options: options5 } });
		await fireEvent.click(c5.querySelector('button')!);
		expect(c5.querySelectorAll('li').length).toBe(5);
	});

	it('should show placeholder when no value selected', () => {
		const { container } = render(Dropdown, {
			props: {
				options: [{ value: '1', label: 'Option 1' }],
				placeholder: 'Choose one'
			}
		});
		expect(container.textContent).toContain('Choose one');
	});

	it('should show selected option label', () => {
		const { container } = render(Dropdown, {
			props: {
				options: [
					{ value: '1', label: 'Option 1' },
					{ value: '2', label: 'Option 2' }
				],
				value: '2'
			}
		});
		expect(container.textContent).toContain('Option 2');
	});

	it('should display label when provided', () => {
		const { container } = render(Dropdown, {
			props: {
				options: [{ value: '1', label: 'Option 1' }],
				label: 'Select Country'
			}
		});
		expect(container.textContent).toContain('Select Country');
	});

	it('should display error message', () => {
		const { container } = render(Dropdown, {
			props: {
				options: [{ value: '1', label: 'Option 1' }],
				error: 'This field is required'
			}
		});
		expect(container.textContent).toContain('This field is required');
	});

	it('should be disabled when disabled prop is true', () => {
		const { container } = render(Dropdown, {
			props: {
				options: [{ value: '1', label: 'Option 1' }],
				disabled: true
			}
		});
		const button = container.querySelector('button');
		expect(button).toBeDisabled();
	});
});
