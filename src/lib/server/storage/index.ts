/**
 * File storage service with multiple provider support
 */

import { env } from '$env/dynamic/private';
import { createLocalStorage } from './local';
import { createS3Storage } from './s3';
import { createR2Storage } from './r2';

export interface UploadResult {
	success: boolean;
	path?: string;
	url?: string;
	error?: string;
}

export interface FileInfo {
	path: string;
	size: number;
	contentType: string;
	lastModified: Date;
	url: string;
}

export interface StorageProvider {
	name: string;
	upload(file: File, path?: string): Promise<UploadResult>;
	delete(path: string): Promise<boolean>;
	list(prefix?: string): Promise<FileInfo[]>;
	getUrl(path: string): Promise<string>;
}

export interface StorageService {
	upload(file: File, path?: string): Promise<UploadResult>;
	delete(path: string): Promise<boolean>;
	list(prefix?: string): Promise<FileInfo[]>;
	getUrl(path: string): Promise<string>;
}

// File validation
export interface ValidationOptions {
	maxSize?: number;
	allowedTypes?: string[];
}

export function validateFile(
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
				// Match category (e.g., image/*)
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

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Create storage service with configured provider
 */
export function createStorageService(config?: {
	provider?: 's3' | 'r2' | 'local';
	bucket?: string;
	region?: string;
	accessKeyId?: string;
	secretAccessKey?: string;
	accountId?: string;
	maxSize?: number;
	allowedTypes?: string[];
}): StorageService {
	const provider = config?.provider || detectProvider();
	const maxSize = config?.maxSize;
	const allowedTypes = config?.allowedTypes;

	let storageProvider: StorageProvider;

	switch (provider) {
		case 's3':
			storageProvider = createS3Storage({
				bucket: config?.bucket || env.S3_BUCKET || '',
				region: config?.region || env.S3_REGION || 'us-east-1',
				accessKeyId: config?.accessKeyId || env.S3_ACCESS_KEY_ID || '',
				secretAccessKey: config?.secretAccessKey || env.S3_SECRET_ACCESS_KEY || ''
			});
			break;

		case 'r2':
			storageProvider = createR2Storage({
				accountId: config?.accountId || env.R2_ACCOUNT_ID || '',
				bucket: config?.bucket || env.R2_BUCKET || '',
				accessKeyId: config?.accessKeyId || env.R2_ACCESS_KEY_ID || '',
				secretAccessKey: config?.secretAccessKey || env.R2_SECRET_ACCESS_KEY || ''
			});
			break;

		default:
			storageProvider = createLocalStorage();
	}

	return {
		async upload(file: File, path?: string): Promise<UploadResult> {
			// Validate file before upload
			const validation = validateFile(file, { maxSize, allowedTypes });
			if (!validation.valid) {
				return { success: false, error: validation.error };
			}

			return storageProvider.upload(file, path);
		},

		async delete(path: string): Promise<boolean> {
			return storageProvider.delete(path);
		},

		async list(prefix?: string): Promise<FileInfo[]> {
			return storageProvider.list(prefix);
		},

		async getUrl(path: string): Promise<string> {
			return storageProvider.getUrl(path);
		}
	};
}

function detectProvider(): 's3' | 'r2' | 'local' {
	if (env.R2_ACCOUNT_ID && env.R2_BUCKET) return 'r2';
	if (env.S3_BUCKET) return 's3';
	return 'local';
}

// Default storage service instance
export const storageService = createStorageService();

// Re-export providers for direct use
export { createLocalStorage } from './local';
export { createS3Storage } from './s3';
export { createR2Storage } from './r2';
