<script lang="ts">
	interface Props {
		variant?: 'text' | 'circle' | 'rectangle';
		width?: string;
		height?: string;
		count?: number;
	}

	let { variant = 'text', width, height, count = 1 }: Props = $props();

	const baseClasses = 'skeleton animate-pulse bg-base-300';

	const variantStyles = $derived(() => {
		switch (variant) {
			case 'circle':
				return {
					width: width ?? '3rem',
					height: height ?? '3rem',
					borderRadius: '50%'
				};
			case 'rectangle':
				return {
					width: width ?? '100%',
					height: height ?? '6rem',
					borderRadius: '0.5rem'
				};
			case 'text':
			default:
				return {
					width: width ?? '100%',
					height: height ?? '1rem',
					borderRadius: '0.25rem'
				};
		}
	});

	const items = $derived(Array.from({ length: count }, (_, i) => i));
</script>

<div class="flex flex-col gap-2">
	{#each items as item (item)}
		<div class={baseClasses} style:width={variantStyles().width} style:height={variantStyles().height} style:border-radius={variantStyles().borderRadius}></div>
	{/each}
</div>
