/**
 * Clipboard utilities
 */

/**
 * Copy text to clipboard
 * Returns true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
	// Try modern Clipboard API first
	if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			// Fall through to fallback
		}
	}

	// Fallback for older browsers
	if (typeof document !== 'undefined') {
		try {
			const textarea = document.createElement('textarea');
			textarea.value = text;
			textarea.style.position = 'fixed';
			textarea.style.left = '-9999px';
			textarea.style.top = '-9999px';
			document.body.appendChild(textarea);
			textarea.focus();
			textarea.select();

			const success = document.execCommand('copy');
			document.body.removeChild(textarea);
			return success;
		} catch {
			return false;
		}
	}

	return false;
}

/**
 * Read text from clipboard
 * Returns null if not available or permission denied
 */
export async function readFromClipboard(): Promise<string | null> {
	if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
		try {
			return await navigator.clipboard.readText();
		} catch {
			return null;
		}
	}
	return null;
}
