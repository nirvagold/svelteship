import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import * as fc from 'fast-check';
import Input from './Input.svelte';
import Select from './Select.svelte';
import Checkbox from './Checkbox.svelte';
import Radio from './Radio.svelte';
import Textarea from './Textarea.svelte';
import DatePicker from './DatePicker.svelte';
import FileInput from './FileInput.svelte';

describe('Form Components', () => {
	describe('Input', () => {
		it('renders with label', () => {
			render(Input, { props: { name: 'test', label: 'Test Label' } });
			expect(screen.getByText('Test Label')).toBeInTheDocument();
		});

		it('renders with error message', () => {
			render(Input, { props: { name: 'test', error: 'This field is required' } });
			expect(screen.getByText('This field is required')).toBeInTheDocument();
		});

		it('renders with helper text', () => {
			render(Input, { props: { name: 'test', helper: 'Enter your name' } });
			expect(screen.getByText('Enter your name')).toBeInTheDocument();
		});

		it('shows required indicator', () => {
			render(Input, { props: { name: 'test', label: 'Name', required: true } });
			expect(screen.getByText('*')).toBeInTheDocument();
		});

		// Property 3: Form component error display
		it('property: error prop always displays error message', () => {
			fc.assert(
				fc.property(fc.string({ minLength: 1, maxLength: 100 }), (errorMsg) => {
					const { container } = render(Input, { props: { name: 'test', error: errorMsg } });
					const errorElement = container.querySelector('.text-error');
					expect(errorElement?.textContent).toBe(errorMsg);
				}),
				{ numRuns: 20 }
			);
		});

		// Property 4: Form validation consistency - required with empty value
		it('property: required input has aria-invalid when error is set', () => {
			fc.assert(
				fc.property(fc.string({ minLength: 1 }), (errorMsg) => {
					const { unmount } = render(Input, { props: { name: 'test', required: true, error: errorMsg } });
					const input = screen.getByRole('textbox');
					expect(input.getAttribute('aria-invalid')).toBe('true');
					unmount();
				}),
				{ numRuns: 10 }
			);
		});
	});

	describe('Select', () => {
		const options = [
			{ value: 'a', label: 'Option A' },
			{ value: 'b', label: 'Option B' },
			{ value: 'c', label: 'Option C' }
		];

		it('renders with options', () => {
			render(Select, { props: { name: 'test', options } });
			expect(screen.getByRole('combobox')).toBeInTheDocument();
			expect(screen.getByText('Option A')).toBeInTheDocument();
		});

		it('renders with placeholder', () => {
			render(Select, { props: { name: 'test', options, placeholder: 'Select one' } });
			expect(screen.getByText('Select one')).toBeInTheDocument();
		});

		it('renders with error', () => {
			render(Select, { props: { name: 'test', options, error: 'Required' } });
			expect(screen.getByText('Required')).toBeInTheDocument();
		});

		// Property 3: Form component error display
		it('property: error prop always displays error message', () => {
			fc.assert(
				fc.property(fc.string({ minLength: 1, maxLength: 100 }), (errorMsg) => {
					const { container } = render(Select, { props: { name: 'test', options, error: errorMsg } });
					const errorElement = container.querySelector('.text-error');
					expect(errorElement?.textContent).toBe(errorMsg);
				}),
				{ numRuns: 20 }
			);
		});
	});

	describe('Checkbox', () => {
		it('renders with label', () => {
			render(Checkbox, { props: { name: 'test', label: 'Accept terms' } });
			expect(screen.getByText('Accept terms')).toBeInTheDocument();
		});

		it('renders checkbox input', () => {
			render(Checkbox, { props: { name: 'test' } });
			expect(screen.getByRole('checkbox')).toBeInTheDocument();
		});

		it('renders with error', () => {
			render(Checkbox, { props: { name: 'test', error: 'Must accept' } });
			expect(screen.getByText('Must accept')).toBeInTheDocument();
		});

		// Property 3: Form component error display
		it('property: error prop always displays error message', () => {
			fc.assert(
				fc.property(fc.string({ minLength: 1, maxLength: 100 }), (errorMsg) => {
					const { container } = render(Checkbox, { props: { name: 'test', error: errorMsg } });
					const errorElement = container.querySelector('.text-error');
					expect(errorElement?.textContent).toBe(errorMsg);
				}),
				{ numRuns: 20 }
			);
		});
	});

	describe('Radio', () => {
		const options = [
			{ value: 'yes', label: 'Yes' },
			{ value: 'no', label: 'No' }
		];

		it('renders with options', () => {
			render(Radio, { props: { name: 'test', options } });
			expect(screen.getAllByRole('radio')).toHaveLength(2);
		});

		it('renders with label', () => {
			render(Radio, { props: { name: 'test', options, label: 'Choose one' } });
			expect(screen.getByText('Choose one')).toBeInTheDocument();
		});

		it('renders with error', () => {
			render(Radio, { props: { name: 'test', options, error: 'Selection required' } });
			expect(screen.getByText('Selection required')).toBeInTheDocument();
		});

		// Property 3: Form component error display
		it('property: error prop always displays error message', () => {
			fc.assert(
				fc.property(fc.string({ minLength: 1, maxLength: 100 }), (errorMsg) => {
					const { container } = render(Radio, { props: { name: 'test', options, error: errorMsg } });
					const errorElement = container.querySelector('.text-error');
					expect(errorElement?.textContent).toBe(errorMsg);
				}),
				{ numRuns: 20 }
			);
		});
	});

	describe('Textarea', () => {
		it('renders with label', () => {
			render(Textarea, { props: { name: 'test', label: 'Description' } });
			expect(screen.getByText('Description')).toBeInTheDocument();
		});

		it('renders textarea element', () => {
			render(Textarea, { props: { name: 'test' } });
			expect(screen.getByRole('textbox')).toBeInTheDocument();
		});

		it('shows character count when enabled', () => {
			render(Textarea, { props: { name: 'test', showCount: true, maxlength: 100, value: 'Hello' } });
			expect(screen.getByText('5/100')).toBeInTheDocument();
		});

		it('renders with error', () => {
			render(Textarea, { props: { name: 'test', error: 'Too short' } });
			expect(screen.getByText('Too short')).toBeInTheDocument();
		});

		// Property 3: Form component error display
		it('property: error prop always displays error message', () => {
			fc.assert(
				fc.property(fc.string({ minLength: 1, maxLength: 100 }), (errorMsg) => {
					const { container } = render(Textarea, { props: { name: 'test', error: errorMsg } });
					const errorElement = container.querySelector('.text-error');
					expect(errorElement?.textContent).toBe(errorMsg);
				}),
				{ numRuns: 20 }
			);
		});
	});

	describe('DatePicker', () => {
		it('renders with label', () => {
			render(DatePicker, { props: { name: 'test', label: 'Birth Date' } });
			expect(screen.getByText('Birth Date')).toBeInTheDocument();
		});

		it('renders date input', () => {
			const { container } = render(DatePicker, { props: { name: 'test' } });
			const input = container.querySelector('input[type="date"]');
			expect(input).toBeInTheDocument();
		});

		it('renders with error', () => {
			render(DatePicker, { props: { name: 'test', error: 'Invalid date' } });
			expect(screen.getByText('Invalid date')).toBeInTheDocument();
		});

		// Property 3: Form component error display
		it('property: error prop always displays error message', () => {
			fc.assert(
				fc.property(fc.string({ minLength: 1, maxLength: 100 }), (errorMsg) => {
					const { container } = render(DatePicker, { props: { name: 'test', error: errorMsg } });
					const errorElement = container.querySelector('.text-error');
					expect(errorElement?.textContent).toBe(errorMsg);
				}),
				{ numRuns: 20 }
			);
		});
	});

	describe('FileInput', () => {
		it('renders with label', () => {
			render(FileInput, { props: { name: 'test', label: 'Upload File' } });
			expect(screen.getByText('Upload File')).toBeInTheDocument();
		});

		it('renders drop zone', () => {
			render(FileInput, { props: { name: 'test' } });
			expect(screen.getByText(/Drag and drop files here/)).toBeInTheDocument();
		});

		it('shows max size when specified', () => {
			render(FileInput, { props: { name: 'test', maxSize: 5 * 1024 * 1024 } });
			expect(screen.getByText('Max size: 5.0 MB')).toBeInTheDocument();
		});

		it('renders with error', () => {
			render(FileInput, { props: { name: 'test', error: 'File too large' } });
			expect(screen.getByText('File too large')).toBeInTheDocument();
		});

		// Property 3: Form component error display
		it('property: error prop always displays error message', () => {
			fc.assert(
				fc.property(fc.string({ minLength: 1, maxLength: 100 }), (errorMsg) => {
					const { container } = render(FileInput, { props: { name: 'test', error: errorMsg } });
					const errorElement = container.querySelector('.text-error');
					expect(errorElement?.textContent).toBe(errorMsg);
				}),
				{ numRuns: 20 }
			);
		});
	});

	// Property 4: Form validation consistency - all components with required
	describe('Property: Required validation consistency', () => {
		it('Input with required has required attribute', () => {
			render(Input, { props: { name: 'test', required: true } });
			const input = screen.getByRole('textbox');
			expect(input).toHaveAttribute('required');
		});

		it('Select with required has required attribute', () => {
			render(Select, { props: { name: 'test', options: [{ value: 'a', label: 'A' }], required: true } });
			const select = screen.getByRole('combobox');
			expect(select).toHaveAttribute('required');
		});

		it('Textarea with required has required attribute', () => {
			render(Textarea, { props: { name: 'test', required: true } });
			const textarea = screen.getByRole('textbox');
			expect(textarea).toHaveAttribute('required');
		});
	});
});
