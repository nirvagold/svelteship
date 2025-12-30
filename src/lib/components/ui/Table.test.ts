import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import fc from 'fast-check';
import Table from './Table.svelte';

describe('Table', () => {
	/**
	 * **Feature: ui-components, Property 8: Table renders correct rows and columns**
	 * For any data array and columns configuration, the Table should render data.length rows and columns.length columns.
	 */
	it('should render correct number of rows and columns', () => {
		fc.assert(
			fc.property(
				fc.integer({ min: 0, max: 10 }),
				fc.integer({ min: 1, max: 5 }),
				(rowCount, colCount) => {
					// Create data with unique ids
					const data = Array.from({ length: rowCount }, (_, i) => ({
						id: `row-${i}`,
						name: `Item ${i}`
					}));

					const columns = Array.from({ length: colCount }, (_, i) => ({
						key: i === 0 ? 'id' : 'name',
						label: `Column ${i}`
					}));

					const { container } = render(Table, { props: { data, columns } });

					const headerCells = container.querySelectorAll('thead th');
					expect(headerCells.length).toBe(colCount);

					const bodyRows = container.querySelectorAll('tbody tr');
					if (rowCount === 0) {
						// Empty state row
						expect(bodyRows.length).toBe(1);
						expect(bodyRows[0].textContent).toContain('No data available');
					} else {
						expect(bodyRows.length).toBe(rowCount);
					}
				}
			),
			{ numRuns: 50 }
		);
	});

	it('should display cell values correctly', () => {
		const data = [
			{ id: '1', name: 'Alice' },
			{ id: '2', name: 'Bob' }
		];
		const columns = [
			{ key: 'id', label: 'ID' },
			{ key: 'name', label: 'Name' }
		];

		const { container } = render(Table, { props: { data, columns } });

		const cells = container.querySelectorAll('tbody td');
		expect(cells[0].textContent).toBe('1');
		expect(cells[1].textContent).toBe('Alice');
		expect(cells[2].textContent).toBe('2');
		expect(cells[3].textContent).toBe('Bob');
	});

	it('should show empty message when no data', () => {
		const { container } = render(Table, {
			props: {
				data: [],
				columns: [{ key: 'id', label: 'ID' }],
				emptyMessage: 'Nothing here'
			}
		});

		expect(container.textContent).toContain('Nothing here');
	});

	it('should show sort indicator for sortable columns', () => {
		const { container } = render(Table, {
			props: {
				data: [{ id: '1' }],
				columns: [{ key: 'id', label: 'ID', sortable: true }],
				sortBy: 'id',
				sortOrder: 'asc'
			}
		});

		const header = container.querySelector('th');
		expect(header?.textContent).toContain('▲');
	});

	it('should apply zebra striping', () => {
		const { container } = render(Table, {
			props: {
				data: [{ id: '1' }],
				columns: [{ key: 'id', label: 'ID' }]
			}
		});

		const table = container.querySelector('table');
		expect(table).toHaveClass('table-zebra');
	});
});
