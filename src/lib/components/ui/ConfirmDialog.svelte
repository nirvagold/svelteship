<script lang="ts">
	import { confirmStore } from './stores/confirm';
	import Modal from './Modal.svelte';

	const variantClasses: Record<string, string> = {
		default: 'btn-primary',
		danger: 'btn-error'
	};
</script>

{#if $confirmStore.isOpen && $confirmStore.options}
	<Modal
		open={$confirmStore.isOpen}
		title={$confirmStore.options.title}
		closeOnBackdrop={false}
		closeOnEscape={false}
		showCloseButton={false}
		size="sm"
	>
		<p class="py-4">{$confirmStore.options?.message}</p>

		{#snippet footer()}
			<button class="btn btn-ghost" onclick={() => confirmStore.resolve(false)}>
				{$confirmStore.options?.cancelLabel ?? 'Cancel'}
			</button>
			<button
				class="btn {variantClasses[$confirmStore.options?.variant ?? 'default']}"
				onclick={() => confirmStore.resolve(true)}
			>
				{$confirmStore.options?.confirmLabel ?? 'Confirm'}
			</button>
		{/snippet}
	</Modal>
{/if}
