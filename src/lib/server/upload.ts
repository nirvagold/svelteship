/**
 * File upload handler utilities
 */

export interface UploadConfig {
	maxSize: number; // bytes
	allowedTypes: string[];
}

export interface UploadResult {
	success: boolean;
	filename?: string;
	size?: number;
	type?: string;
	error?: string;
}

/**
 * Validate and process a file upload
 */
export async function handleUpload(file: File, config: UploadConfig): Promise<UploadResult> {
	const { maxSize, allowedTypes } = config;

	// Validate file exists
	if (!file) {
		return { success: false, error: 'No file provided' };
	}

	// Validate file size
	if (file.size > maxSize) {
		return {
			success: false,
			error: `File size ${formatBytes(file.size)} exceeds maximum ${formatBytes(maxSize)}`
		};
	}

	// Validate file type
	if (allowedTypes.length > 0 && !isAllowedType(file.type, allowedTypes)) {
		return {
			success: false,
			error: `File type "${file.type}" is not allowed. Allowed types: ${allowedTypes.join(', ')}`
		};
	}

	return {
		success: true,
		filename: file.name,
		size: file.size,
		type: file.type
	};
}

/**
 * Check if file type is allowed
 */
function isAllowedType(fileType: string, allowedTypes: string[]): boolean {
	return allowedTypes.some((allowed) => {
		// Exact match
		if (allowed === fileType) return true;

		// Wildcard match (e.g., "image/*")
		if (allowed.endsWith('/*')) {
			const category = allowed.slice(0, -2);
			return fileType.startsWith(category + '/');
		}

		return false;
	});
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
	const lastDot = filename.lastIndexOf('.');
	return lastDot === -1 ? '' : filename.slice(lastDot + 1).toLowerCase();
}

/**
 * Generate a safe filename
 */
export function sanitizeFilename(filename: string): string {
	// Remove path separators and null bytes
	let safe = filename.replace(/[/\\:\0]/g, '');

	// Replace spaces with underscores
	safe = safe.replace(/\s+/g, '_');

	// Remove any remaining unsafe characters (including dots at start)
	safe = safe.replace(/[^a-zA-Z0-9._-]/g, '');

	// Remove leading dots to prevent hidden files or path traversal
	safe = safe.replace(/^\.+/, '');

	// Ensure filename is not empty
	if (!safe || safe === '.' || safe === '..') {
		safe = 'file';
	}

	return safe;
}

/**
 * Common MIME type mappings
 */
export const MIME_TYPES = {
	// Images
	'image/jpeg': ['.jpg', '.jpeg'],
	'image/png': ['.png'],
	'image/gif': ['.gif'],
	'image/webp': ['.webp'],
	'image/svg+xml': ['.svg'],

	// Documents
	'application/pdf': ['.pdf'],
	'application/msword': ['.doc'],
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
	'application/vnd.ms-excel': ['.xls'],
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],

	// Text
	'text/plain': ['.txt'],
	'text/csv': ['.csv'],
	'application/json': ['.json'],

	// Archives
	'application/zip': ['.zip'],
	'application/gzip': ['.gz']
} as const;

/**
 * Common file type presets
 */
export const FILE_TYPE_PRESETS = {
	images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
	documents: [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	],
	spreadsheets: [
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'text/csv'
	],
	all_images: ['image/*'],
	all_documents: ['application/pdf', 'application/msword', 'application/*']
} as const;
