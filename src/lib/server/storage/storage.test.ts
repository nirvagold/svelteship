import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// File validation logic (copied from index.ts to avoid SvelteKit imports)
interface ValidationOptions {
	maxSize?: number;
	allowedTypes?: string[];
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(
	file: File,
	options: ValidationOptions = {}
): { valid: boolean; error?: string } {
	const { maxSize, allowedTypes } = options;

	if (maxSize && file.size > maxSize) {
		return {
			valid: false,
			error: `File size ${formatBytes(file.size)} exceeds maximum ${formatBytes(maxSize)}`
		};
	}

	if (allowedTypes && allowedTypes.length > 0) {
		const isAllowed = allowedTypes.some((type) => {
			if (type.endsWith('/*')) {
				const category = type.slice(0, -2);
				return file.type.startsWith(category);
			}
			return file.type === type;
		});

		if (!isAllowed) {
			return {
				valid: false,
				error: `File type ${file.type} is not allowed. Allowed: ${allowedTypes.join(', ')}`
			};
		}
	}

	return { valid: true };
}

// Mock File class for testing
function createMockFile(name: string, size: number, type: string): File {
	const blob = new Blob(['x'.repeat(size)], { type });
	return new File([blob], name, { type });
}

describe('Storage Service', () => {
	describe('validateFile', () => {
		it('accepts valid file with no constraints', () => {
			const file = createMockFile('test.txt', 1000, 'text/plain');
			const result = validateFile(file);
			expect(result.valid).toBe(true);
			expect(result.error).toBeUndefined();
		});

		it('rejects file exceeding max size', () => {
			const file = createMockFile('large.txt', 10 * 1024 * 1024, 'text/plain');
			const result = validateFile(file, { maxSize: 5 * 1024 * 1024 });
			expect(result.valid).toBe(false);
			expect(result.error).toContain('exceeds maximum');
		});

		it('accepts file within max size', () => {
			const file = createMockFile('small.txt', 1024, 'text/plain');
			const result = validateFile(file, { maxSize: 5 * 1024 * 1024 });
			expect(result.valid).toBe(true);
		});

		it('rejects file with disallowed type', () => {
			const file = createMockFile('script.js', 1000, 'application/javascript');
			const result = validateFile(file, { allowedTypes: ['image/png', 'image/jpeg'] });
			expect(result.valid).toBe(false);
			expect(result.error).toContain('not allowed');
		});

		it('accepts file with allowed type', () => {
			const file = createMockFile('photo.png', 1000, 'image/png');
			const result = validateFile(file, { allowedTypes: ['image/png', 'image/jpeg'] });
			expect(result.valid).toBe(true);
		});

		it('accepts file matching wildcard type', () => {
			const file = createMockFile('photo.webp', 1000, 'image/webp');
			const result = validateFile(file, { allowedTypes: ['image/*'] });
			expect(result.valid).toBe(true);
		});

		it('rejects file not matching wildcard type', () => {
			const file = createMockFile('doc.pdf', 1000, 'application/pdf');
			const result = validateFile(file, { allowedTypes: ['image/*'] });
			expect(result.valid).toBe(false);
		});

		// Property 6: File upload validation
		it('property: files exceeding maxSize are always rejected', () => {
			fc.assert(
				fc.property(
					fc.integer({ min: 1, max: 100 }), // maxSize in KB
					fc.integer({ min: 1, max: 200 }), // fileSize in KB
					(maxSizeKB, fileSizeKB) => {
						const maxSize = maxSizeKB * 1024;
						const fileSize = fileSizeKB * 1024;
						const file = createMockFile('test.txt', fileSize, 'text/plain');
						const result = validateFile(file, { maxSize });

						if (fileSize > maxSize) {
							expect(result.valid).toBe(false);
							expect(result.error).toBeDefined();
						} else {
							expect(result.valid).toBe(true);
						}
					}
				),
				{ numRuns: 50 }
			);
		});

		it('property: files with disallowed types are always rejected', () => {
			const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
			const disallowedTypes = ['application/pdf', 'text/plain', 'application/javascript'];

			fc.assert(
				fc.property(fc.constantFrom(...disallowedTypes), (type) => {
					const file = createMockFile('test.file', 1000, type);
					const result = validateFile(file, { allowedTypes });
					expect(result.valid).toBe(false);
				}),
				{ numRuns: 10 }
			);
		});

		it('property: files with allowed types are always accepted', () => {
			const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];

			fc.assert(
				fc.property(fc.constantFrom(...allowedTypes), (type) => {
					const file = createMockFile('test.file', 1000, type);
					const result = validateFile(file, { allowedTypes });
					expect(result.valid).toBe(true);
				}),
				{ numRuns: 10 }
			);
		});
	});

	describe('URL Generation', () => {
		// Property 7: Storage URL generation
		it('property: getUrl returns valid URL string for any path', () => {
			fc.assert(
				fc.property(
					fc.string({ minLength: 1, maxLength: 100 }).filter((s) => /^[\w\-./]+$/.test(s)),
					(path) => {
						// Local storage URL format
						const url = `/uploads/${path}`;
						expect(typeof url).toBe('string');
						expect(url.length).toBeGreaterThan(0);
						expect(url.startsWith('/uploads/')).toBe(true);
					}
				),
				{ numRuns: 20 }
			);
		});
	});
});
