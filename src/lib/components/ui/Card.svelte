<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		children?: Snippet;
		actions?: Snippet;
	}

	let { title = '', children, actions }: Props = $props();
</script>

<div class="card bg-base-100 shadow-md">
	<div class="card-body">
		{#if title}
			<h2 class="card-title">{title}</h2>
		{/if}
		{#if children}
			{@render children()}
		{/if}
		{#if actions}
			<div class="card-actions justify-end mt-4">
				{@render actions()}
			</div>
		{/if}
	</div>
</div>
