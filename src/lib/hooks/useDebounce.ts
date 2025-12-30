import { untrack } from 'svelte';

/**
 * Creates a debounced version of a value that only updates after the specified delay.
 * Useful for search inputs, form validation, and other scenarios where you want to
 * delay processing until the user stops typing.
 *
 * @param getValue - Function that returns the current value to debounce
 * @param delay - Delay in milliseconds before updating the debounced value
 * @returns Object with current debounced value
 *
 * @example
 * ```svelte
 * <script>
 *   import { useDebounce } from '$lib/hooks';
 *   let searchQuery = $state('');
 *   const debounced = useDebounce(() => searchQuery, 300);
 *
 *   $effect(() => {
 *     // This runs 300ms after user stops typing
 *     console.log('Search:', debounced.value);
 *   });
 * </script>
 * ```
 */
export function useDebounce<T>(getValue: () => T, delay: number): { readonly value: T } {
	let debouncedValue = $state<T>(untrack(getValue));
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		const currentValue = getValue();

		// If delay is 0, update immediately
		if (delay <= 0) {
			debouncedValue = currentValue;
			return;
		}

		// Clear any existing timeout
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}

		// Set new timeout
		timeoutId = setTimeout(() => {
			debouncedValue = currentValue;
			timeoutId = null;
		}, delay);

		// Cleanup on effect re-run or component unmount
		return () => {
			if (timeoutId !== null) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}
		};
	});

	return {
		get value() {
			return debouncedValue;
		}
	};
}
