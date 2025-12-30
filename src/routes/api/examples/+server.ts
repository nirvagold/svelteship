/**
 * Example API route demonstrating pagination and filtering
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock data for demonstration
const mockItems = Array.from({ length: 50 }, (_, i) => ({
	id: `item-${i + 1}`,
	name: `Item ${i + 1}`,
	category: ['electronics', 'clothing', 'books', 'food'][i % 4],
	price: Math.round(Math.random() * 10000) / 100,
	createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}));

export const GET: RequestHandler = async ({ url }) => {
	// Parse query parameters
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
	const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '10')));
	const search = url.searchParams.get('search')?.toLowerCase() || '';
	const category = url.searchParams.get('category') || '';
	const sortBy = url.searchParams.get('sortBy') || 'createdAt';
	const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

	// Filter items
	const filtered = mockItems.filter((item) => {
		if (search && !item.name.toLowerCase().includes(search)) {
			return false;
		}
		if (category && item.category !== category) {
			return false;
		}
		return true;
	});

	// Sort items
	const sorted = [...filtered].sort((a, b) => {
		const aVal = a[sortBy as keyof typeof a];
		const bVal = b[sortBy as keyof typeof b];

		if (typeof aVal === 'string' && typeof bVal === 'string') {
			return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
		}
		if (typeof aVal === 'number' && typeof bVal === 'number') {
			return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
		}
		return 0;
	});

	// Paginate
	const total = sorted.length;
	const totalPages = Math.ceil(total / limit);
	const offset = (page - 1) * limit;
	const items = sorted.slice(offset, offset + limit);

	return json({
		data: items,
		meta: {
			page,
			limit,
			total,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1
		}
	});
};
