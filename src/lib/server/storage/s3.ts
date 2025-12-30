/**
 * AWS S3 storage implementation
 * Uses AWS SDK v3 compatible API
 */

import type { StorageProvider, UploadResult, FileInfo } from './index';

interface S3Config {
	bucket: string;
	region: string;
	accessKeyId: string;
	secretAccessKey: string;
	endpoint?: string; // For S3-compatible services like R2
}

export function createS3Storage(config: S3Config): StorageProvider {
	const { bucket, region, accessKeyId, secretAccessKey: _secretAccessKey, endpoint } = config;

	const baseUrl = endpoint || `https://s3.${region}.amazonaws.com`;

	async function signRequest(
		method: string,
		path: string,
		headers: Record<string, string> = {}
	): Promise<Record<string, string>> {
		// Simplified signing - in production use @aws-sdk/client-s3
		const date = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
		const dateStamp = date.slice(0, 8);

		return {
			...headers,
			'x-amz-date': date,
			'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
			Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${dateStamp}/${region}/s3/aws4_request`
		};
	}

	return {
		name: 's3',

		async upload(file: File, path?: string): Promise<UploadResult> {
			try {
				const key = path || `${Date.now()}-${file.name}`;
				const url = `${baseUrl}/${bucket}/${key}`;

				const headers = await signRequest('PUT', `/${bucket}/${key}`, {
					'Content-Type': file.type || 'application/octet-stream',
					'Content-Length': file.size.toString()
				});

				const response = await fetch(url, {
					method: 'PUT',
					headers,
					body: await file.arrayBuffer()
				});

				if (!response.ok) {
					return {
						success: false,
						error: `S3 upload failed: ${response.status} ${response.statusText}`
					};
				}

				return {
					success: true,
					path: key,
					url: `${baseUrl}/${bucket}/${key}`
				};
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Upload failed';
				return { success: false, error: message };
			}
		},

		async delete(path: string): Promise<boolean> {
			try {
				const url = `${baseUrl}/${bucket}/${path}`;
				const headers = await signRequest('DELETE', `/${bucket}/${path}`);

				const response = await fetch(url, {
					method: 'DELETE',
					headers
				});

				return response.ok;
			} catch {
				return false;
			}
		},

		async list(prefix?: string): Promise<FileInfo[]> {
			try {
				const params = new URLSearchParams();
				if (prefix) params.set('prefix', prefix);

				const url = `${baseUrl}/${bucket}?list-type=2&${params}`;
				const headers = await signRequest('GET', `/${bucket}`);

				const response = await fetch(url, { headers });

				if (!response.ok) {
					return [];
				}

				// Parse XML response (simplified)
				const text = await response.text();
				const files: FileInfo[] = [];

				// Basic XML parsing for Contents elements
				const contentMatches = text.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g);
				for (const match of contentMatches) {
					const content = match[1];
					const key = content.match(/<Key>(.*?)<\/Key>/)?.[1] || '';
					const size = parseInt(content.match(/<Size>(.*?)<\/Size>/)?.[1] || '0');
					const lastModified = new Date(
						content.match(/<LastModified>(.*?)<\/LastModified>/)?.[1] || ''
					);

					files.push({
						path: key,
						size,
						contentType: 'application/octet-stream',
						lastModified,
						url: `${baseUrl}/${bucket}/${key}`
					});
				}

				return files;
			} catch {
				return [];
			}
		},

		async getUrl(path: string): Promise<string> {
			return `${baseUrl}/${bucket}/${path}`;
		}
	};
}
