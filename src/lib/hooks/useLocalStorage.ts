import { browser } from '$app/environment';

/**
 * A hook that syncs state with localStorage, with fallback to memory storage
 * when localStorage is unavailable (SSR or private browsing).
 *
 * @param key - The localStorage key to use
 * @param initialValue - The initial value if no stored value exists
 * @returns Object with value getter/setter and remove function
 *
 * @example
 * ```svelte
 * <script>
 *   import { useLocalStorage } from '$lib/hooks';
 *   const theme = useLocalStorage('theme', 'light');
 *
 *   function toggleTheme() {
 *     theme.value = theme.value === 'light' ? 'dark' : 'light';
 *   }
 * </script>
 * ```
 */
export function useLocalStorage<T>(
	key: string,
	initialValue: T
): {
	value: T;
	setValue: (newValue: T) => void;
	removeValue: () => void;
} {
	// Memory fallback for SSR or when localStorage is unavailable
	const memoryStorage = new Map<string, string>();

	function isLocalStorageAvailable(): boolean {
		if (!browser) return false;
		try {
			const testKey = '__localStorage_test__';
			localStorage.setItem(testKey, testKey);
			localStorage.removeItem(testKey);
			return true;
		} catch {
			return false;
		}
	}

	function getStoredValue(): T {
		if (!browser) return initialValue;

		try {
			if (isLocalStorageAvailable()) {
				const item = localStorage.getItem(key);
				if (item !== null) {
					return JSON.parse(item) as T;
				}
			} else {
				const item = memoryStorage.get(key);
				if (item !== undefined) {
					return JSON.parse(item) as T;
				}
			}
		} catch {
			// If parsing fails, return initial value
		}
		return initialValue;
	}

	function setStoredValue(value: T): void {
		if (!browser) return;

		try {
			const serialized = JSON.stringify(value);
			if (isLocalStorageAvailable()) {
				localStorage.setItem(key, serialized);
			} else {
				memoryStorage.set(key, serialized);
			}
		} catch {
			// Silently fail if storage is full or serialization fails
		}
	}

	function removeStoredValue(): void {
		if (!browser) return;

		try {
			if (isLocalStorageAvailable()) {
				localStorage.removeItem(key);
			} else {
				memoryStorage.delete(key);
			}
		} catch {
			// Silently fail
		}
	}

	// Initialize with stored value or initial value
	let currentValue = $state<T>(getStoredValue());

	return {
		get value(): T {
			return currentValue;
		},
		set value(newValue: T) {
			currentValue = newValue;
			setStoredValue(newValue);
		},
		setValue(newValue: T): void {
			currentValue = newValue;
			setStoredValue(newValue);
		},
		removeValue(): void {
			currentValue = initialValue;
			removeStoredValue();
		}
	};
}
