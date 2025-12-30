import { writable } from 'svelte/store';

export interface ToastMessage {
	id: string;
	message: string;
	variant: 'success' | 'error' | 'warning' | 'info';
	duration: number;
}

function createToastStore() {
	const { subscribe, update } = writable<ToastMessage[]>([]);

	function addToast(message: string, variant: ToastMessage['variant'] = 'info', duration = 3000) {
		const id = crypto.randomUUID();
		const toast: ToastMessage = { id, message, variant, duration };

		update((toasts) => [...toasts, toast]);

		if (duration > 0) {
			setTimeout(() => dismiss(id), duration);
		}

		return id;
	}

	function dismiss(id: string) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	return {
		subscribe,
		success: (message: string, duration?: number) => addToast(message, 'success', duration),
		error: (message: string, duration?: number) => addToast(message, 'error', duration),
		warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
		info: (message: string, duration?: number) => addToast(message, 'info', duration),
		dismiss
	};
}

export const toast = createToastStore();
