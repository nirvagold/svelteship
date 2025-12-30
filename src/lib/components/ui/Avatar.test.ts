import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import fc from 'fast-check';
import Avatar from './Avatar.svelte';

describe('Avatar', () => {
	/**
	 * **Feature: ui-components, Property 6: Avatar initials generation**
	 * For any name string, the Avatar should generate correct initials
	 * (first letter of first and last name, or first two letters if single word).
	 */
	it('should generate correct initials for any name', () => {
		fc.assert(
			fc.property(
				fc.array(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'.split('')), { minLength: 2, maxLength: 30 }).map(arr => arr.join('')),
				(name) => {
					const trimmedName = name.trim();
					if (trimmedName.length < 2) return true; // Skip invalid names

					const { container } = render(Avatar, { props: { name: trimmedName } });
					const span = container.querySelector('span');

					const parts = trimmedName.split(/\s+/).filter((p) => p.length > 0);
					let expectedInitials: string;

					if (parts.length >= 2) {
						expectedInitials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
					} else {
						expectedInitials = trimmedName.slice(0, 2).toUpperCase();
					}

					expect(span?.textContent).toBe(expectedInitials);
				}
			),
			{ numRuns: 100 }
		);
	});

	it('should show initials when no src provided', () => {
		const { container } = render(Avatar, { props: { name: 'John Doe' } });
		const span = container.querySelector('span');
		expect(span?.textContent).toBe('JD');
	});

	it('should show first two letters for single word name', () => {
		const { container } = render(Avatar, { props: { name: 'Admin' } });
		const span = container.querySelector('span');
		expect(span?.textContent).toBe('AD');
	});

	it('should apply correct size class', () => {
		const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
		const sizeClasses: Record<string, string> = {
			xs: 'w-6',
			sm: 'w-8',
			md: 'w-12',
			lg: 'w-16',
			xl: 'w-24'
		};

		sizes.forEach((size) => {
			const { container } = render(Avatar, { props: { name: 'Test', size } });
			const div = container.querySelector('.avatar > div');
			expect(div).toHaveClass(sizeClasses[size]);
		});
	});

	it('should show ? when no name provided', () => {
		const { container } = render(Avatar, { props: {} });
		const span = container.querySelector('span');
		expect(span?.textContent).toBe('?');
	});
});
