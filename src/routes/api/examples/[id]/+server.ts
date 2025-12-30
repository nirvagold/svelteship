/**
 * Example API route demonstrating CRUD operations
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock data store (in-memory for demonstration)
const items = new Map([
	['item-1', { id: 'item-1', name: 'Item 1', category: 'electronics', price: 99.99 }],
	['item-2', { id: 'item-2', name: 'Item 2', category: 'clothing', price: 49.99 }],
	['item-3', { id: 'item-3', name: 'Item 3', category: 'books', price: 19.99 }]
]);

// GET - Retrieve single item
export const GET: RequestHandler = async ({ params }) => {
	const item = items.get(params.id);

	if (!item) {
		error(404, { message: 'Item not found' });
	}

	return json({ data: item });
};

// PUT - Update item
export const PUT: RequestHandler = async ({ params, request }) => {
	const item = items.get(params.id);

	if (!item) {
		error(404, { message: 'Item not found' });
	}

	const body = await request.json();

	// Validate input
	const errors: Record<string, string> = {};

	if (body.name !== undefined) {
		if (typeof body.name !== 'string' || body.name.length < 1) {
			errors.name = 'Name must be a non-empty string';
		}
	}

	if (body.price !== undefined) {
		if (typeof body.price !== 'number' || body.price < 0) {
			errors.price = 'Price must be a non-negative number';
		}
	}

	if (body.category !== undefined) {
		const validCategories = ['electronics', 'clothing', 'books', 'food'];
		if (!validCategories.includes(body.category)) {
			errors.category = `Category must be one of: ${validCategories.join(', ')}`;
		}
	}

	if (Object.keys(errors).length > 0) {
		return json({ error: 'Validation failed', details: errors }, { status: 400 });
	}

	// Update item
	const updated = {
		...item,
		...(body.name !== undefined && { name: body.name }),
		...(body.price !== undefined && { price: body.price }),
		...(body.category !== undefined && { category: body.category })
	};

	items.set(params.id, updated);

	return json({ data: updated });
};

// DELETE - Remove item
export const DELETE: RequestHandler = async ({ params }) => {
	const item = items.get(params.id);

	if (!item) {
		error(404, { message: 'Item not found' });
	}

	items.delete(params.id);

	return json({ success: true, message: 'Item deleted' });
};
