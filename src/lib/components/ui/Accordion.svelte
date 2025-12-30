<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';

	interface AccordionItem {
		id: string;
		title: string;
		content: Snippet;
		disabled?: boolean;
	}

	interface Props {
		items: AccordionItem[];
		multiple?: boolean;
		defaultOpen?: string[];
	}

	let { items, multiple = false, defaultOpen = [] }: Props = $props();

	let openItems = new SvelteSet<string>(defaultOpen);

	function toggleItem(id: string, disabled?: boolean) {
		if (disabled) return;

		if (openItems.has(id)) {
			openItems.delete(id);
		} else {
			if (!multiple) {
				openItems.clear();
			}
			openItems.add(id);
		}
	}

	function isOpen(id: string): boolean {
		return openItems.has(id);
	}
</script>

<div class="join join-vertical w-full">
	{#each items as item (item.id)}
		<div class="collapse collapse-arrow join-item border border-base-300" class:collapse-open={isOpen(item.id)}>
			<button
				type="button"
				class="collapse-title text-lg font-medium"
				class:opacity-50={item.disabled}
				class:cursor-not-allowed={item.disabled}
				onclick={() => toggleItem(item.id, item.disabled)}
				aria-expanded={isOpen(item.id)}
				aria-controls={`accordion-content-${item.id}`}
				disabled={item.disabled}
			>
				{item.title}
			</button>
			<div class="collapse-content" id={`accordion-content-${item.id}`} role="region">
				{@render item.content()}
			</div>
		</div>
	{/each}
</div>
