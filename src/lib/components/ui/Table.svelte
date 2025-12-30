<script lang="ts" generics="T extends Record<string, unknown>">
	import type { Snippet } from 'svelte';

	interface TableColumn<T> {
		key: keyof T | string;
		label: string;
		sortable?: boolean;
		width?: string;
		render?: Snippet<[T]>;
	}

	interface Props {
		data: T[];
		columns: TableColumn<T>[];
		sortBy?: string;
		sortOrder?: 'asc' | 'desc';
		emptyMessage?: string;
		onrowclick?: (row: T) => void;
		onsort?: (column: string, order: 'asc' | 'desc') => void;
	}

	let {
		data,
		columns,
		sortBy = $bindable(),
		sortOrder = $bindable('asc'),
		emptyMessage = 'No data available',
		onrowclick,
		onsort
	}: Props = $props();

	function handleSort(column: TableColumn<T>) {
		if (!column.sortable) return;

		const key = String(column.key);
		if (sortBy === key) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = key;
			sortOrder = 'asc';
		}
		onsort?.(key, sortOrder);
	}

	function getCellValue(row: T, key: keyof T | string): unknown {
		return row[key as keyof T];
	}
</script>

<div class="overflow-x-auto">
	<table class="table table-zebra w-full">
		<thead>
			<tr>
				{#each columns as column, colIndex (colIndex)}
					<th
						class:cursor-pointer={column.sortable}
						class:hover:bg-base-200={column.sortable}
						style:width={column.width}
						onclick={() => handleSort(column)}
					>
						<div class="flex items-center gap-1">
							{column.label}
							{#if column.sortable}
								<span class="text-xs">
									{#if sortBy === column.key}
										{sortOrder === 'asc' ? '▲' : '▼'}
									{:else}
										<span class="opacity-30">▲▼</span>
									{/if}
								</span>
							{/if}
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if data.length === 0}
				<tr>
					<td colspan={columns.length} class="text-center py-8 text-base-content/50">
						{emptyMessage}
					</td>
				</tr>
			{:else}
				{#each data as row, index (index)}
					<tr
						class:cursor-pointer={onrowclick}
						class:hover={onrowclick}
						onclick={() => onrowclick?.(row)}
					>
						{#each columns as column, colIndex (colIndex)}
							<td>
								{#if column.render}
									{@render column.render(row)}
								{:else}
									{getCellValue(row, column.key)}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
