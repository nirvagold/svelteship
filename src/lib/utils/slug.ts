/**
 * Slug generation utilities
 */

export interface SlugifyOptions {
	lowercase?: boolean;
	separator?: string;
	maxLength?: number;
}

/**
 * Convert a string to URL-safe slug
 */
export function slugify(text: string | null | undefined, options: SlugifyOptions = {}): string {
	const { lowercase = true, separator = '-', maxLength } = options;

	if (!text) {
		return '';
	}

	let slug = text
		// Normalize unicode characters
		.normalize('NFD')
		// Remove diacritics
		.replace(/[\u0300-\u036f]/g, '')
		// Replace spaces and underscores with separator
		.replace(/[\s_]+/g, separator)
		// Remove non-alphanumeric characters except separator
		.replace(new RegExp(`[^a-zA-Z0-9${separator}]`, 'g'), '')
		// Collapse consecutive separators
		.replace(new RegExp(`${separator}+`, 'g'), separator)
		// Remove leading/trailing separators
		.replace(new RegExp(`^${separator}|${separator}$`, 'g'), '');

	if (lowercase) {
		slug = slug.toLowerCase();
	}

	if (maxLength && slug.length > maxLength) {
		slug = slug.slice(0, maxLength);
		// Remove trailing separator if cut off
		slug = slug.replace(new RegExp(`${separator}$`), '');
	}

	return slug;
}

/**
 * Generate a unique slug by appending a number if needed
 */
export function uniqueSlug(
	text: string,
	existingSlugs: string[],
	options: SlugifyOptions = {}
): string {
	const baseSlug = slugify(text, options);

	if (!existingSlugs.includes(baseSlug)) {
		return baseSlug;
	}

	let counter = 1;
	let newSlug = `${baseSlug}-${counter}`;

	while (existingSlugs.includes(newSlug)) {
		counter++;
		newSlug = `${baseSlug}-${counter}`;
	}

	return newSlug;
}
