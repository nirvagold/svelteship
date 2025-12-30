import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { handleUpload, getFileExtension, sanitizeFilename } from './upload';

// Helper to create mock File
function createMockFile(name: string, size: number, type: string): File {
	const content = new Array(size).fill('a').join('');
	return new File([content], name, { type });
}

describe('handleUpload', () => {
	it('accepts valid file', async () => {
		const file = createMockFile('test.jpg', 1000, 'image/jpeg');
		const result = await handleUpload(file, {
			maxSize: 5000,
			allowedTypes: ['image/jpeg', 'image/png']
		});

		expect(result.success).toBe(true);
		expect(result.filename).toBe('test.jpg');
		expect(result.size).toBe(1000);
		expect(result.type).toBe('image/jpeg');
	});

	it('rejects file exceeding max size', async () => {
		const file = createMockFile('large.jpg', 10000, 'image/jpeg');
		const result = await handleUpload(file, {
			maxSize: 5000,
			allowedTypes: ['image/jpeg']
		});

		expect(result.success).toBe(false);
		expect(result.error).toContain('exceeds maximum');
	});

	it('rejects file with disallowed type', async () => {
		const file = createMockFile('script.js', 1000, 'application/javascript');
		const result = await handleUpload(file, {
			maxSize: 5000,
			allowedTypes: ['image/jpeg', 'image/png']
		});

		expect(result.success).toBe(false);
		expect(result.error).toContain('not allowed');
	});

	it('accepts wildcard type match', async () => {
		const file = createMockFile('photo.webp', 1000, 'image/webp');
		const result = await handleUpload(file, {
			maxSize: 5000,
			allowedTypes: ['image/*']
		});

		expect(result.success).toBe(true);
	});

	it('accepts any type when allowedTypes is empty', async () => {
		const file = createMockFile('anything.xyz', 1000, 'application/octet-stream');
		const result = await handleUpload(file, {
			maxSize: 5000,
			allowedTypes: []
		});

		expect(result.success).toBe(true);
	});

	// Property 13: File upload validates size
	it('property: rejects files exceeding maxSize', async () => {
		await fc.assert(
			fc.asyncProperty(
				fc.integer({ min: 1, max: 1000 }),
				fc.integer({ min: 1001, max: 10000 }),
				async (maxSize, fileSize) => {
					const file = createMockFile('test.txt', fileSize, 'text/plain');
					const result = await handleUpload(file, { maxSize, allowedTypes: [] });
					expect(result.success).toBe(false);
					expect(result.error).toContain('exceeds');
				}
			)
		);
	});

	// Property 14: File upload validates type
	it('property: rejects files with disallowed types', async () => {
		await fc.assert(
			fc.asyncProperty(
				fc.constantFrom('text/plain', 'application/json', 'text/html'),
				async (fileType) => {
					const file = createMockFile('test.txt', 100, fileType);
					const result = await handleUpload(file, {
						maxSize: 1000,
						allowedTypes: ['image/jpeg', 'image/png']
					});
					expect(result.success).toBe(false);
					expect(result.error).toContain('not allowed');
				}
			)
		);
	});

	// Property: accepts files within size limit
	it('property: accepts files within size limit', async () => {
		await fc.assert(
			fc.asyncProperty(fc.integer({ min: 100, max: 1000 }), async (fileSize) => {
				const file = createMockFile('test.txt', fileSize, 'text/plain');
				const result = await handleUpload(file, {
					maxSize: 2000,
					allowedTypes: ['text/plain']
				});
				expect(result.success).toBe(true);
			})
		);
	});
});

describe('getFileExtension', () => {
	it('extracts extension from filename', () => {
		expect(getFileExtension('photo.jpg')).toBe('jpg');
		expect(getFileExtension('document.pdf')).toBe('pdf');
		expect(getFileExtension('archive.tar.gz')).toBe('gz');
	});

	it('returns empty string for no extension', () => {
		expect(getFileExtension('README')).toBe('');
		expect(getFileExtension('Makefile')).toBe('');
	});

	it('handles edge cases', () => {
		expect(getFileExtension('.gitignore')).toBe('gitignore');
		expect(getFileExtension('file.')).toBe('');
	});

	it('returns lowercase extension', () => {
		expect(getFileExtension('Photo.JPG')).toBe('jpg');
		expect(getFileExtension('Document.PDF')).toBe('pdf');
	});
});

describe('sanitizeFilename', () => {
	it('removes path separators', () => {
		expect(sanitizeFilename('../../../etc/passwd')).toBe('etcpasswd');
		expect(sanitizeFilename('C:\\Windows\\System32')).toBe('CWindowsSystem32');
	});

	it('replaces spaces with underscores', () => {
		expect(sanitizeFilename('my file name.txt')).toBe('my_file_name.txt');
	});

	it('removes special characters', () => {
		expect(sanitizeFilename('file<>:"|?*.txt')).toBe('file.txt');
	});

	it('handles empty or dangerous names', () => {
		expect(sanitizeFilename('')).toBe('file');
		expect(sanitizeFilename('.')).toBe('file');
		expect(sanitizeFilename('..')).toBe('file');
	});

	it('preserves valid characters', () => {
		expect(sanitizeFilename('valid-file_name.123.txt')).toBe('valid-file_name.123.txt');
	});

	// Property: sanitized filename is always safe
	it('property: produces safe filenames', () => {
		fc.assert(
			fc.property(fc.string({ maxLength: 100 }), (input) => {
				const result = sanitizeFilename(input);
				// Should not contain path separators
				expect(result).not.toContain('/');
				expect(result).not.toContain('\\');
				expect(result).not.toContain(':');
				// Should not be empty
				expect(result.length).toBeGreaterThan(0);
				// Should only contain safe characters
				expect(result).toMatch(/^[a-zA-Z0-9._-]+$/);
			})
		);
	});
});
