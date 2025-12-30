import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Substitute variables in template
 * Variables are in format {variableName}
 */
function substituteVariables(template: string, data: Record<string, string>): string {
	let result = template;
	for (const [key, value] of Object.entries(data)) {
		const regex = new RegExp(`\\{${key}\\}`, 'g');
		result = result.replace(regex, value);
	}
	return result;
}

describe('Email Service', () => {
	describe('substituteVariables', () => {
		it('replaces single variable', () => {
			const template = 'Hello {name}!';
			const result = substituteVariables(template, { name: 'John' });
			expect(result).toBe('Hello John!');
		});

		it('replaces multiple variables', () => {
			const template = 'Hi {name}, click {link} to verify';
			const result = substituteVariables(template, { name: 'Jane', link: 'https://example.com' });
			expect(result).toBe('Hi Jane, click https://example.com to verify');
		});

		it('replaces same variable multiple times', () => {
			const template = '{name} is {name}';
			const result = substituteVariables(template, { name: 'Bob' });
			expect(result).toBe('Bob is Bob');
		});

		it('leaves unmatched variables unchanged', () => {
			const template = 'Hello {name}, your code is {code}';
			const result = substituteVariables(template, { name: 'Alice' });
			expect(result).toBe('Hello Alice, your code is {code}');
		});

		it('handles empty data object', () => {
			const template = 'Hello {name}!';
			const result = substituteVariables(template, {});
			expect(result).toBe('Hello {name}!');
		});

		it('handles template without variables', () => {
			const template = 'Hello World!';
			const result = substituteVariables(template, { name: 'John' });
			expect(result).toBe('Hello World!');
		});

		// Property 5: Email template variable substitution
		it('property: all provided variables are substituted', () => {
			fc.assert(
				fc.property(
					fc.record({
						name: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => !s.includes('{') && !s.includes('$')),
						link: fc.webUrl()
					}),
					(data) => {
						const template = 'Hi {name}, click {link}';
						const result = substituteVariables(template, data);

						// Result should not contain the original placeholders
						expect(result).not.toContain('{name}');
						expect(result).not.toContain('{link}');

						// Result should contain the substituted values
						expect(result).toContain(data.name);
						expect(result).toContain(data.link);
					}
				),
				{ numRuns: 20 }
			);
		});

		it('property: substitution is idempotent for non-variable strings', () => {
			fc.assert(
				fc.property(
					fc.string().filter((s) => !s.includes('{') && !s.includes('}')),
					(template) => {
						const result = substituteVariables(template, { name: 'test' });
						expect(result).toBe(template);
					}
				),
				{ numRuns: 20 }
			);
		});

		it('property: output length is predictable', () => {
			fc.assert(
				fc.property(
					fc.string({ minLength: 1, maxLength: 20 }).filter((s) => !s.includes('{')),
					(name) => {
						const template = 'Hello {name}!';
						const result = substituteVariables(template, { name });

						// Output should be template length minus {name} (6 chars) plus actual name length
						const expectedLength = template.length - 6 + name.length;
						expect(result.length).toBe(expectedLength);
					}
				),
				{ numRuns: 20 }
			);
		});
	});

	describe('Email Templates', () => {
		it('verification template has required placeholders', async () => {
			const fs = await import('fs');
			const path = await import('path');
			const templatePath = path.join(process.cwd(), 'src/lib/server/email/templates/verification.html');
			const template = fs.readFileSync(templatePath, 'utf-8');
			expect(template).toContain('{name}');
			expect(template).toContain('{link}');
		});

		it('reset-password template has required placeholders', async () => {
			const fs = await import('fs');
			const path = await import('path');
			const templatePath = path.join(process.cwd(), 'src/lib/server/email/templates/reset-password.html');
			const template = fs.readFileSync(templatePath, 'utf-8');
			expect(template).toContain('{name}');
			expect(template).toContain('{link}');
		});

		it('welcome template has required placeholders', async () => {
			const fs = await import('fs');
			const path = await import('path');
			const templatePath = path.join(process.cwd(), 'src/lib/server/email/templates/welcome.html');
			const template = fs.readFileSync(templatePath, 'utf-8');
			expect(template).toContain('{name}');
			expect(template).toContain('{link}');
		});
	});
});
