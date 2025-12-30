<script lang="ts">
	import { toast } from './stores/toast';
	import Toast from './Toast.svelte';

	interface Props {
		position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
	}

	let { position = 'top-right' }: Props = $props();

	const positionClasses: Record<string, string> = {
		'top-right': 'top-4 right-4',
		'top-left': 'top-4 left-4',
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'top-center': 'top-4 left-1/2 -translate-x-1/2',
		'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
	};
</script>

<div class="fixed z-50 flex flex-col gap-2 {positionClasses[position]}" aria-live="polite">
	{#each $toast as toastItem (toastItem.id)}
		<Toast data={toastItem} />
	{/each}
</div>
