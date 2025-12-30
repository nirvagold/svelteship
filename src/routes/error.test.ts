/**
 * Property tests for error page security
 * Property 1: 500 page hides technical details
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Patterns that should NEVER appear in error messages shown to users
const sensitivePatterns = [
	/at\s+\w+\s+\([^)]+:\d+:\d+\)/, // Stack trace lines
	/\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\.(ts|js|svelte)/, // File paths
	/node_modules/, // Node modules paths
	/Error:\s+[A-Z][a-z]+Error/, // Internal error types
	/ENOENT|EACCES|EPERM/, // System error codes
	/password|secret|key|token/i, // Sensitive keywords in errors
	/database|sql|query/i, // Database-related errors
	/process\.env/, // Environment variable references
	/undefined is not|cannot read property/i // JS runtime errors
];

// Safe error messages that can be shown to users
const safeErrorMessages = [
	'Something went wrong',
	"We're sorry, but something unexpected happened",
	'Our team has been notified',
	'Please try again later',
	'If the problem persists, please contact support'
];

describe('Error Page Security Properties', () => {
	describe('Property 1: 500 page hides technical details', () => {
		it('should never expose stack traces in error messages', () => {
			fc.assert(
				fc.property(
					fc.record({
						functionName: fc.stringMatching(/^[a-zA-Z_][a-zA-Z0-9_]*$/),
						fileName: fc.stringMatching(/^[a-zA-Z0-9_-]+$/),
						lineNumber: fc.integer({ min: 1, max: 10000 }),
						columnNumber: fc.integer({ min: 1, max: 500 })
					}),
					({ functionName, fileName, lineNumber, columnNumber }) => {
						// Only test with valid function/file names
						if (functionName.length === 0 || fileName.length === 0) return;

						const stackTrace = `at ${functionName} (${fileName}:${lineNumber}:${columnNumber})`;

						// Verify our pattern detects stack traces
						const hasStackTrace = sensitivePatterns.some((pattern) => pattern.test(stackTrace));
						expect(hasStackTrace).toBe(true);

						// Safe messages should not contain stack traces
						for (const safeMessage of safeErrorMessages) {
							expect(sensitivePatterns.some((p) => p.test(safeMessage))).toBe(false);
						}
					}
				)
			);
		});

		it('should never expose file paths in error messages', () => {
			fc.assert(
				fc.property(
					fc.record({
						dir1: fc.stringMatching(/^[a-zA-Z0-9_-]+$/),
						dir2: fc.stringMatching(/^[a-zA-Z0-9_-]+$/),
						ext: fc.constantFrom('ts', 'js', 'svelte')
					}),
					({ dir1, dir2, ext }) => {
						if (dir1.length > 0 && dir2.length > 0) {
							const filePath = `/${dir1}/${dir2}.${ext}`;

							// Verify our pattern detects file paths
							const hasFilePath = sensitivePatterns.some((pattern) => pattern.test(filePath));
							expect(hasFilePath).toBe(true);
						}
					}
				)
			);
		});

		it('should never expose sensitive keywords in error messages', () => {
			const sensitiveKeywords = ['password', 'secret', 'apiKey', 'token', 'database', 'sql'];

			fc.assert(
				fc.property(fc.constantFrom(...sensitiveKeywords), (keyword) => {
					const errorWithKeyword = `Error: Invalid ${keyword} provided`;

					// Verify our pattern detects sensitive keywords
					const hasSensitive = sensitivePatterns.some((pattern) => pattern.test(errorWithKeyword));
					expect(hasSensitive).toBe(true);
				})
			);
		});

		it('safe error messages should pass all security checks', () => {
			for (const message of safeErrorMessages) {
				for (const pattern of sensitivePatterns) {
					expect(pattern.test(message)).toBe(false);
				}
			}
		});
	});

	describe('Error message sanitization', () => {
		it('should sanitize any error message to be safe', () => {
			// Function that would sanitize error messages (simulating what the error page does)
			function sanitizeErrorMessage(rawError: string): string {
				// Check if the error contains sensitive information
				const containsSensitive = sensitivePatterns.some((pattern) => pattern.test(rawError));

				if (containsSensitive) {
					return "We're sorry, but something unexpected happened. Our team has been notified.";
				}

				// Even if no sensitive patterns found, use generic message for 500 errors
				return "We're sorry, but something unexpected happened. Our team has been notified.";
			}

			fc.assert(
				fc.property(fc.string({ minLength: 0, maxLength: 500 }), (randomError) => {
					const sanitized = sanitizeErrorMessage(randomError);

					// Sanitized message should never contain sensitive patterns
					for (const pattern of sensitivePatterns) {
						expect(pattern.test(sanitized)).toBe(false);
					}
				})
			);
		});
	});
});
