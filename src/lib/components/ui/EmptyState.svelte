<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		icon?: Snippet;
		variant?: 'default' | 'compact';
		action?: Snippet;
	}

	let { title, description, icon, variant = 'default', action }: Props = $props();

	const variantClasses: Record<string, string> = {
		default: 'py-12',
		compact: 'py-6'
	};
</script>

<div class="flex flex-col items-center justify-center text-center {variantClasses[variant]}">
	{#if icon}
		<div class="text-base-content/30 mb-4">
			{@render icon()}
		</div>
	{:else}
		<div class="text-6xl text-base-content/30 mb-4">📭</div>
	{/if}

	<h3 class="text-lg font-semibold text-base-content">{title}</h3>

	{#if description}
		<p class="text-base-content/60 mt-2 max-w-md">{description}</p>
	{/if}

	{#if action}
		<div class="mt-6">
			{@render action()}
		</div>
	{/if}
</div>
