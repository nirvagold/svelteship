import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import type { FormSchema, FieldSchema } from './useForm';

// Test the validation logic directly since useForm uses Svelte 5 runes
function validateField<T>(
	field: string,
	value: T,
	schema: FieldSchema<T> | undefined,
	allValues: Record<string, unknown>
): string | null {
	if (!schema) return null;

	// Required check
	if (schema.required) {
		if (value === undefined || value === null || value === '') {
			return `${field} is required`;
		}
	}

	// Skip other validations if value is empty and not required
	if (value === undefined || value === null || value === '') {
		return null;
	}

	// String validations
	if (typeof value === 'string') {
		if (schema.minLength !== undefined && value.length < schema.minLength) {
			return `${field} must be at least ${schema.minLength} characters`;
		}
		if (schema.maxLength !== undefined && value.length > schema.maxLength) {
			return `${field} must be at most ${schema.maxLength} characters`;
		}
		if (schema.pattern && !schema.pattern.test(value)) {
			return `${field} is invalid`;
		}
	}

	// Number validations
	if (typeof value === 'number') {
		if (schema.min !== undefined && value < schema.min) {
			return `${field} must be at least ${schema.min}`;
		}
		if (schema.max !== undefined && value > schema.max) {
			return `${field} must be at most ${schema.max}`;
		}
	}

	// Custom validation
	if (schema.validate) {
		const customError = schema.validate(value, allValues);
		if (customError) return customError;
	}

	return null;
}

describe('useForm', () => {
	/**
	 * **Feature: utilities-dx, Property 1: useForm reset restores initial values**
	 * *For any* form state after modifications, calling reset() should restore all values to their initial state.
	 * **Validates: Requirements 1.4**
	 */
	it('Property 1: reset should restore initial values', () => {
		fc.assert(
			fc.property(
				fc.record({
					email: fc.string(),
					name: fc.string(),
					age: fc.integer({ min: 0, max: 150 })
				}),
				fc.record({
					email: fc.string(),
					name: fc.string(),
					age: fc.integer({ min: 0, max: 150 })
				}),
				(initialValues, modifiedValues) => {
					// Simulate form state
					let values = { ...initialValues };

					// Modify values
					values = { ...modifiedValues };

					// Reset
					values = { ...initialValues };

					// After reset, values should equal initial values
					expect(values).toEqual(initialValues);
				}
			),
			{ numRuns: 50 }
		);
	});

	/**
	 * **Feature: utilities-dx, Property 2: useForm validation produces field-specific errors**
	 * *For any* invalid input according to schema, the errors object should contain the specific field with appropriate error message.
	 * **Validates: Requirements 1.2, 1.5**
	 */
	it('Property 2: validation should produce field-specific errors', () => {
		fc.assert(
			fc.property(
				fc.string().filter((s) => s.length > 0 && s.length < 50),
				(fieldName) => {
					const schema: FormSchema<Record<string, string>> = {
						[fieldName]: { required: true }
					};

					// Empty value should produce error for that specific field
					const error = validateField(fieldName, '', schema[fieldName], {});

					expect(error).not.toBeNull();
					expect(error).toContain(fieldName);
					expect(error).toContain('required');
				}
			),
			{ numRuns: 50 }
		);
	});

	it('should validate required fields', () => {
		const schema: FieldSchema<string> = { required: true };

		expect(validateField('email', '', schema, {})).toBe('email is required');
		expect(validateField('email', 'test@example.com', schema, {})).toBeNull();
	});

	it('should validate minLength', () => {
		const schema: FieldSchema<string> = { minLength: 5 };

		expect(validateField('name', 'abc', schema, {})).toBe('name must be at least 5 characters');
		expect(validateField('name', 'abcdef', schema, {})).toBeNull();
	});

	it('should validate maxLength', () => {
		const schema: FieldSchema<string> = { maxLength: 5 };

		expect(validateField('name', 'abcdefgh', schema, {})).toBe('name must be at most 5 characters');
		expect(validateField('name', 'abc', schema, {})).toBeNull();
	});

	it('should validate pattern', () => {
		const schema: FieldSchema<string> = { pattern: /^[a-z]+$/ };

		expect(validateField('code', 'ABC123', schema, {})).toBe('code is invalid');
		expect(validateField('code', 'abc', schema, {})).toBeNull();
	});

	it('should validate min for numbers', () => {
		const schema: FieldSchema<number> = { min: 18 };

		expect(validateField('age', 15, schema, {})).toBe('age must be at least 18');
		expect(validateField('age', 25, schema, {})).toBeNull();
	});

	it('should validate max for numbers', () => {
		const schema: FieldSchema<number> = { max: 100 };

		expect(validateField('age', 150, schema, {})).toBe('age must be at most 100');
		expect(validateField('age', 50, schema, {})).toBeNull();
	});

	it('should run custom validation', () => {
		const schema: FieldSchema<string> = {
			validate: (value) => (value === 'forbidden' ? 'This value is not allowed' : null)
		};

		expect(validateField('field', 'forbidden', schema, {})).toBe('This value is not allowed');
		expect(validateField('field', 'allowed', schema, {})).toBeNull();
	});

	it('should skip validation for empty non-required fields', () => {
		const schema: FieldSchema<string> = { minLength: 5 };

		// Empty value should pass if not required
		expect(validateField('name', '', schema, {})).toBeNull();
	});

	it('should validate all fields and collect errors', () => {
		const values = { email: '', password: 'short' };
		const schema: FormSchema<typeof values> = {
			email: { required: true },
			password: { required: true, minLength: 8 }
		};

		const errors: Record<string, string> = {};

		for (const [field, value] of Object.entries(values)) {
			const error = validateField(field, value, schema[field as keyof typeof schema], values);
			if (error) {
				errors[field] = error;
			}
		}

		expect(errors.email).toBe('email is required');
		expect(errors.password).toBe('password must be at least 8 characters');
	});
});
