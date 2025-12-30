/**
 * Local file storage implementation
 * Stores files in static/uploads directory
 */

import { writeFile, unlink, readdir, stat, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, basename } from 'path';
import type { StorageProvider, UploadResult, FileInfo } from './index';

const UPLOAD_DIR = 'static/uploads';

export function createLocalStorage(): StorageProvider {
	return {
		name: 'local',

		async upload(file: File, path?: string): Promise<UploadResult> {
			try {
				// Ensure upload directory exists
				if (!existsSync(UPLOAD_DIR)) {
					await mkdir(UPLOAD_DIR, { recursive: true });
				}

				const filename = path || `${Date.now()}-${file.name}`;
				const filepath = join(UPLOAD_DIR, filename);

				const buffer = Buffer.from(await file.arrayBuffer());
				await writeFile(filepath, buffer);

				return {
					success: true,
					path: filename,
					url: `/uploads/${filename}`
				};
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Upload failed';
				return { success: false, error: message };
			}
		},

		async delete(path: string): Promise<boolean> {
			try {
				const filepath = join(UPLOAD_DIR, basename(path));
				await unlink(filepath);
				return true;
			} catch {
				return false;
			}
		},

		async list(prefix?: string): Promise<FileInfo[]> {
			try {
				if (!existsSync(UPLOAD_DIR)) {
					return [];
				}

				const files = await readdir(UPLOAD_DIR);
				const fileInfos: FileInfo[] = [];

				for (const filename of files) {
					if (prefix && !filename.startsWith(prefix)) continue;

					const filepath = join(UPLOAD_DIR, filename);
					const stats = await stat(filepath);

					if (stats.isFile()) {
						fileInfos.push({
							path: filename,
							size: stats.size,
							contentType: getContentType(filename),
							lastModified: stats.mtime,
							url: `/uploads/${filename}`
						});
					}
				}

				return fileInfos;
			} catch {
				return [];
			}
		},

		async getUrl(path: string): Promise<string> {
			return `/uploads/${basename(path)}`;
		}
	};
}

function getContentType(filename: string): string {
	const ext = filename.split('.').pop()?.toLowerCase();
	const mimeTypes: Record<string, string> = {
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		gif: 'image/gif',
		webp: 'image/webp',
		svg: 'image/svg+xml',
		pdf: 'application/pdf',
		doc: 'application/msword',
		docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		txt: 'text/plain',
		json: 'application/json',
		csv: 'text/csv'
	};
	return mimeTypes[ext || ''] || 'application/octet-stream';
}
