/**
 * Cloudflare R2 storage implementation
 * Uses S3-compatible API
 */

import { createS3Storage } from './s3';
import type { StorageProvider } from './index';

interface R2Config {
	accountId: string;
	bucket: string;
	accessKeyId: string;
	secretAccessKey: string;
}

export function createR2Storage(config: R2Config): StorageProvider {
	const { accountId, bucket, accessKeyId, secretAccessKey } = config;

	// R2 uses S3-compatible API with custom endpoint
	const s3Storage = createS3Storage({
		bucket,
		region: 'auto',
		accessKeyId,
		secretAccessKey,
		endpoint: `https://${accountId}.r2.cloudflarestorage.com`
	});

	return {
		...s3Storage,
		name: 'r2'
	};
}
