<script lang="ts">
	import type { Snippet } from 'svelte';

	interface BreadcrumbItem {
		label: string;
		href?: string;
		icon?: Snippet;
	}

	interface Props {
		items: BreadcrumbItem[];
		separator?: string;
	}

	let { items, separator: _separator = '/' }: Props = $props();

	const isLast = (index: number) => index === items.length - 1;
</script>

<div class="breadcrumbs text-sm">
	<ul>
		{#each items as item, index (index)}
			<li>
				{#if item.icon}
					<span class="mr-1">
						{@render item.icon()}
					</span>
				{/if}
				{#if isLast(index)}
					<span class="font-medium">{item.label}</span>
				{:else if item.href}
					<a href={item.href}>{item.label}</a>
				{:else}
					<span>{item.label}</span>
				{/if}
			</li>
		{/each}
	</ul>
</div>
