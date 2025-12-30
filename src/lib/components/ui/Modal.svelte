<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		showCloseButton?: boolean;
		children?: Snippet;
		footer?: Snippet;
		onclose?: () => void;
	}

	let {
		open = $bindable(false),
		title,
		size = 'md',
		closeOnBackdrop = true,
		closeOnEscape = true,
		showCloseButton = true,
		children,
		footer,
		onclose
	}: Props = $props();

	const sizeClasses: Record<string, string> = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl'
	};

	function handleClose() {
		open = false;
		onclose?.();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (closeOnBackdrop && e.target === e.currentTarget) {
			handleClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (closeOnEscape && e.key === 'Escape') {
			handleClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		class="modal modal-open"
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'modal-title' : undefined}
		onclick={handleBackdropClick}
	>
		<div class="modal-box {sizeClasses[size]}">
			{#if title || showCloseButton}
				<div class="flex items-center justify-between mb-4">
					{#if title}
						<h3 id="modal-title" class="font-bold text-lg">{title}</h3>
					{/if}
					{#if showCloseButton}
						<button
							class="btn btn-sm btn-circle btn-ghost ml-auto"
							onclick={handleClose}
							aria-label="Close modal"
						>
							✕
						</button>
					{/if}
				</div>
			{/if}

			<div class="modal-content">
				{#if children}
					{@render children()}
				{/if}
			</div>

			{#if footer}
				<div class="modal-action">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
