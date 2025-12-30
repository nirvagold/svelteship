<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		content: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		delay?: number;
		children?: Snippet;
	}

	let { content, position = 'top', delay = 0, children }: Props = $props();

	const positionClasses: Record<string, string> = {
		top: 'tooltip-top',
		bottom: 'tooltip-bottom',
		left: 'tooltip-left',
		right: 'tooltip-right'
	};

	const delayStyle = $derived(`--tooltip-delay: ${delay}ms`);
</script>

<div
	class="tooltip {positionClasses[position]}"
	data-tip={content}
	style={delayStyle}
>
	{#if children}
		{@render children()}
	{/if}
</div>
