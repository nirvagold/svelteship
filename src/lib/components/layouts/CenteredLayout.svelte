<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		size?: 'sm' | 'md' | 'lg';
		card?: boolean;
		background?: 'none' | 'gradient' | 'pattern';
		children?: Snippet;
	}

	let { size = 'md', card = false, background = 'none', children }: Props = $props();

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg'
	};

	const backgroundClasses = {
		none: 'bg-base-200',
		gradient: 'bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10',
		pattern:
			'bg-base-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-base-200 to-base-200'
	};
</script>

<div class="min-h-screen flex items-center justify-center p-4 {backgroundClasses[background]}">
	<div class="w-full {sizeClasses[size]}">
		{#if card}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					{@render children?.()}
				</div>
			</div>
		{:else}
			{@render children?.()}
		{/if}
	</div>
</div>
