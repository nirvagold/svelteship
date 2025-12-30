import { writable } from 'svelte/store';

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

function createBreadcrumbStore() {
	const { subscribe, set, update } = writable<BreadcrumbItem[]>([]);

	return {
		subscribe,
		set: (items: BreadcrumbItem[]) => set(items),
		reset: () => set([]),
		push: (item: BreadcrumbItem) => update((items) => [...items, item]),
		pop: () => update((items) => items.slice(0, -1))
	};
}

export const breadcrumbs = createBreadcrumbStore();
