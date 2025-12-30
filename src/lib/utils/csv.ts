/**
 * CSV export utilities
 */

export interface CsvColumn<T> {
	key: keyof T;
	header: string;
	format?: (value: T[keyof T]) => string;
}

/**
 * Escape a CSV field according to RFC 4180
 */
function escapeField(value: unknown): string {
	const str = value === null || value === undefined ? '' : String(value);

	// If contains comma, quote, or newline, wrap in quotes and escape quotes
	if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
		return `"${str.replace(/"/g, '""')}"`;
	}

	return str;
}

/**
 * Export data to CSV string
 */
export function exportToCsv<T extends Record<string, unknown>>(
	data: T[],
	columns?: CsvColumn<T>[]
): string {
	if (!data || data.length === 0) {
		return '';
	}

	// If no columns specified, use all keys from first item
	const cols: CsvColumn<T>[] =
		columns ||
		(Object.keys(data[0]) as (keyof T)[]).map((key) => ({
			key,
			header: String(key)
		}));

	// Build header row
	const headerRow = cols.map((col) => escapeField(col.header)).join(',');

	// Build data rows
	const dataRows = data.map((item) => {
		return cols
			.map((col) => {
				const value = item[col.key];
				const formatted = col.format ? col.format(value) : value;
				return escapeField(formatted);
			})
			.join(',');
	});

	return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV as file
 */
export function downloadCsv(csv: string, filename: string): void {
	if (typeof document === 'undefined') {
		return;
	}

	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
	link.style.display = 'none';

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);
}

/**
 * Parse CSV string to array of objects
 */
export function parseCsv<T extends Record<string, string>>(csv: string): T[] {
	if (!csv || !csv.trim()) {
		return [];
	}

	const lines = csv.split(/\r?\n/).filter((line) => line.trim());

	if (lines.length < 2) {
		return [];
	}

	const headers = parseRow(lines[0]);
	const result: T[] = [];

	for (let i = 1; i < lines.length; i++) {
		const values = parseRow(lines[i]);
		const obj = {} as T;

		headers.forEach((header, index) => {
			(obj as Record<string, string>)[header] = values[index] || '';
		});

		result.push(obj);
	}

	return result;
}

/**
 * Parse a single CSV row handling quoted fields
 */
function parseRow(row: string): string[] {
	const result: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < row.length; i++) {
		const char = row[i];
		const nextChar = row[i + 1];

		if (inQuotes) {
			if (char === '"' && nextChar === '"') {
				current += '"';
				i++; // Skip next quote
			} else if (char === '"') {
				inQuotes = false;
			} else {
				current += char;
			}
		} else {
			if (char === '"') {
				inQuotes = true;
			} else if (char === ',') {
				result.push(current);
				current = '';
			} else {
				current += char;
			}
		}
	}

	result.push(current);
	return result;
}
