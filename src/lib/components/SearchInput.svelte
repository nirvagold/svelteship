<script lang="ts">
	import { useDebounce } from '$lib/hooks';

	interface Props {
		value?: string;
		placeholder?: string;
		debounce?: number;
		disabled?: boolean;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Search...',
		debounce: debounceMs = 300,
		disabled = false,
		class: className = '',
		onchange
	}: Props = $props();

	// Create debounced value
	const debouncedValue = useDebounce(() => value, debounceMs);

	// Track previous debounced value to detect changes
	let prevDebouncedValue = $state('');

	$effect(() => {
		const current = debouncedValue.value;
		if (current !== prevDebouncedValue) {
			prevDebouncedValue = current;
			onchange?.(current);
		}
	});

	function handleClear() {
		value = '';
		onchange?.('');
	}
</script>

<div class="relative {className}">
	<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
		<svg
			class="w-4 h-4 text-base-content/50"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
	</div>

	<input
		type="search"
		bind:value
		{placeholder}
		{disabled}
		class="input input-bordered w-full pl-10 pr-10"
		aria-label={placeholder}
	/>

	{#if value}
		<button
			type="button"
			class="absolute inset-y-0 right-0 flex items-center pr-3"
			onclick={handleClear}
			aria-label="Clear search"
		>
			<svg class="w-4 h-4 text-base-content/50 hover:text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	{/if}
</div>
