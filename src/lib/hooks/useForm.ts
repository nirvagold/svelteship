/**
 * Schema definition for form field validation
 */
export interface FieldSchema<T> {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	min?: number;
	max?: number;
	validate?: (value: T, allValues: Record<string, unknown>) => string | null;
}

export type FormSchema<T extends Record<string, unknown>> = {
	[K in keyof T]?: FieldSchema<T[K]>;
};

export interface UseFormReturn<T extends Record<string, unknown>> {
	readonly values: T;
	readonly errors: Partial<Record<keyof T, string>>;
	readonly touched: Partial<Record<keyof T, boolean>>;
	readonly isValid: boolean;
	readonly isSubmitting: boolean;
	handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
	handleBlur: (field: keyof T) => void;
	handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => Promise<void>;
	reset: () => void;
	setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
	setFieldError: (field: keyof T, error: string) => void;
	validateField: (field: keyof T) => string | null;
	validateAll: () => boolean;
}

/**
 * A hook for managing form state, validation, and submission.
 *
 * @param initialValues - Initial form values
 * @param schema - Optional validation schema
 * @returns Form state and handlers
 *
 * @example
 * ```svelte
 * <script>
 *   import { useForm } from '$lib/hooks';
 *
 *   const form = useForm(
 *     { email: '', password: '' },
 *     {
 *       email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
 *       password: { required: true, minLength: 8 }
 *     }
 *   );
 * </script>
 *
 * <form onsubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit); }}>
 *   <input
 *     value={form.values.email}
 *     oninput={(e) => form.handleChange('email', e.currentTarget.value)}
 *     onblur={() => form.handleBlur('email')}
 *   />
 *   {#if form.errors.email}
 *     <span class="error">{form.errors.email}</span>
 *   {/if}
 * </form>
 * ```
 */
export function useForm<T extends Record<string, unknown>>(
	initialValues: T,
	schema?: FormSchema<T>
): UseFormReturn<T> {
	let values = $state<T>({ ...initialValues });
	let errors = $state<Partial<Record<keyof T, string>>>({});
	let touched = $state<Partial<Record<keyof T, boolean>>>({});
	let isSubmitting = $state(false);

	function validateField(field: keyof T): string | null {
		if (!schema || !schema[field]) return null;

		const fieldSchema = schema[field]!;
		const value = values[field];

		// Required check
		if (fieldSchema.required) {
			if (value === undefined || value === null || value === '') {
				return `${String(field)} is required`;
			}
		}

		// Skip other validations if value is empty and not required
		if (value === undefined || value === null || value === '') {
			return null;
		}

		// String validations
		if (typeof value === 'string') {
			if (fieldSchema.minLength !== undefined && value.length < fieldSchema.minLength) {
				return `${String(field)} must be at least ${fieldSchema.minLength} characters`;
			}
			if (fieldSchema.maxLength !== undefined && value.length > fieldSchema.maxLength) {
				return `${String(field)} must be at most ${fieldSchema.maxLength} characters`;
			}
			if (fieldSchema.pattern && !fieldSchema.pattern.test(value)) {
				return `${String(field)} is invalid`;
			}
		}

		// Number validations
		if (typeof value === 'number') {
			if (fieldSchema.min !== undefined && value < fieldSchema.min) {
				return `${String(field)} must be at least ${fieldSchema.min}`;
			}
			if (fieldSchema.max !== undefined && value > fieldSchema.max) {
				return `${String(field)} must be at most ${fieldSchema.max}`;
			}
		}

		// Custom validation
		if (fieldSchema.validate) {
			const customError = fieldSchema.validate(value, values as Record<string, unknown>);
			if (customError) return customError;
		}

		return null;
	}

	function validateAll(): boolean {
		const newErrors: Partial<Record<keyof T, string>> = {};
		let isValid = true;

		for (const field of Object.keys(values) as Array<keyof T>) {
			const error = validateField(field);
			if (error) {
				newErrors[field] = error;
				isValid = false;
			}
		}

		errors = newErrors;
		return isValid;
	}

	function handleChange<K extends keyof T>(field: K, value: T[K]): void {
		values = { ...values, [field]: value };

		// Validate on change if field has been touched
		if (touched[field]) {
			const error = validateField(field);
			if (error) {
				errors = { ...errors, [field]: error };
			} else {
				const newErrors = { ...errors };
				delete newErrors[field];
				errors = newErrors;
			}
		}
	}

	function handleBlur(field: keyof T): void {
		touched = { ...touched, [field]: true };

		// Validate on blur
		const error = validateField(field);
		if (error) {
			errors = { ...errors, [field]: error };
		} else {
			const newErrors = { ...errors };
			delete newErrors[field];
			errors = newErrors;
		}
	}

	async function handleSubmit(onSubmit: (values: T) => Promise<void> | void): Promise<void> {
		// Mark all fields as touched
		const allTouched: Partial<Record<keyof T, boolean>> = {};
		for (const field of Object.keys(values) as Array<keyof T>) {
			allTouched[field] = true;
		}
		touched = allTouched;

		// Validate all fields
		if (!validateAll()) {
			return;
		}

		isSubmitting = true;
		try {
			await onSubmit(values);
		} finally {
			isSubmitting = false;
		}
	}

	function reset(): void {
		values = { ...initialValues };
		errors = {};
		touched = {};
		isSubmitting = false;
	}

	function setFieldValue<K extends keyof T>(field: K, value: T[K]): void {
		values = { ...values, [field]: value };
	}

	function setFieldError(field: keyof T, error: string): void {
		errors = { ...errors, [field]: error };
	}

	return {
		get values() {
			return values;
		},
		get errors() {
			return errors;
		},
		get touched() {
			return touched;
		},
		get isValid() {
			return Object.keys(errors).length === 0;
		},
		get isSubmitting() {
			return isSubmitting;
		},
		handleChange,
		handleBlur,
		handleSubmit,
		reset,
		setFieldValue,
		setFieldError,
		validateField,
		validateAll
	};
}
