import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import { get } from 'svelte/store';
import ConfirmDialog from './ConfirmDialog.svelte';
import { confirmStore, confirm } from './stores/confirm';

describe('ConfirmDialog', () => {
	beforeEach(() => {
		// Reset store state
		confirmStore.resolve(false);
	});

	/**
	 * **Feature: ui-components, Property 15: ConfirmDialog promise resolution**
	 * For any confirm() call, clicking confirm button should resolve with true, clicking cancel should resolve with false.
	 */
	it('should resolve with true when confirm button is clicked', async () => {
		render(ConfirmDialog);

		const promise = confirm({ message: 'Are you sure?' });

		// Wait for store to update
		await new Promise((resolve) => setTimeout(resolve, 0));

		const state = get(confirmStore);
		expect(state.isOpen).toBe(true);

		// Simulate clicking confirm
		confirmStore.resolve(true);

		const result = await promise;
		expect(result).toBe(true);
	});

	it('should resolve with false when cancel button is clicked', async () => {
		render(ConfirmDialog);

		const promise = confirm({ message: 'Are you sure?' });

		// Wait for store to update
		await new Promise((resolve) => setTimeout(resolve, 0));

		// Simulate clicking cancel
		confirmStore.resolve(false);

		const result = await promise;
		expect(result).toBe(false);
	});

	it('should display custom title and message', async () => {
		const { container } = render(ConfirmDialog);

		confirm({
			title: 'Custom Title',
			message: 'Custom message here'
		});

		// Wait for store to update
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(container.textContent).toContain('Custom Title');
		expect(container.textContent).toContain('Custom message here');
	});

	it('should display custom button labels', async () => {
		const { container } = render(ConfirmDialog);

		confirm({
			message: 'Test',
			confirmLabel: 'Yes, do it',
			cancelLabel: 'No, cancel'
		});

		// Wait for store to update
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(container.textContent).toContain('Yes, do it');
		expect(container.textContent).toContain('No, cancel');
	});

	it('should apply danger variant styling', async () => {
		const { container } = render(ConfirmDialog);

		confirm({
			message: 'Delete this item?',
			variant: 'danger'
		});

		// Wait for store to update
		await new Promise((resolve) => setTimeout(resolve, 0));

		const confirmButton = container.querySelector('.btn-error');
		expect(confirmButton).toBeInTheDocument();
	});
});
