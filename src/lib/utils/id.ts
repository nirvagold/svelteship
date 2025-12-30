/**
 * ID generation utilities
 */

export interface GenerateIdOptions {
	length?: number;
	prefix?: string;
	alphabet?: string;
}

const DEFAULT_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generate a random ID
 */
export function generateId(options: GenerateIdOptions = {}): string {
	const { length = 12, prefix = '', alphabet = DEFAULT_ALPHABET } = options;

	let id = '';
	const alphabetLength = alphabet.length;

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * alphabetLength);
		id += alphabet[randomIndex];
	}

	return prefix ? `${prefix}${id}` : id;
}

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}

	// Fallback for environments without crypto.randomUUID
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}
