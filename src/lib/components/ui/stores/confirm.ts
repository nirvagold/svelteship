import { writable, get } from 'svelte/store';

export interface ConfirmOptions {
	title?: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: 'default' | 'danger';
}

interface ConfirmState {
	isOpen: boolean;
	options: ConfirmOptions | null;
	resolve: ((value: boolean) => void) | null;
}

function createConfirmStore() {
	const { subscribe, set } = writable<ConfirmState>({
		isOpen: false,
		options: null,
		resolve: null
	});

	return {
		subscribe,
		confirm(options: ConfirmOptions): Promise<boolean> {
			return new Promise((resolve) => {
				set({
					isOpen: true,
					options: {
						title: options.title ?? 'Confirm',
						message: options.message,
						confirmLabel: options.confirmLabel ?? 'Confirm',
						cancelLabel: options.cancelLabel ?? 'Cancel',
						variant: options.variant ?? 'default'
					},
					resolve
				});
			});
		},
		resolve(value: boolean) {
			const state = get({ subscribe });
			if (state.resolve) {
				state.resolve(value);
			}
			set({ isOpen: false, options: null, resolve: null });
		}
	};
}

export const confirmStore = createConfirmStore();

export function confirm(options: ConfirmOptions): Promise<boolean> {
	return confirmStore.confirm(options);
}
