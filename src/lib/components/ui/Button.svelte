<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		loading?: boolean;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
	}

	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		type = 'button',
		children,
		onclick
	}: Props = $props();

	const variantClasses: Record<string, string> = {
		primary: 'btn-primary',
		secondary: 'btn-secondary',
		danger: 'btn-error',
		ghost: 'btn-ghost'
	};

	const sizeClasses: Record<string, string> = {
		sm: 'btn-sm',
		md: '',
		lg: 'btn-lg'
	};
</script>

<button
	{type}
	class="btn {variantClasses[variant]} {sizeClasses[size]}"
	disabled={disabled || loading}
	{onclick}
>
	{#if loading}
		<span class="loading loading-spinner"></span>
	{/if}
	{#if children}
		{@render children()}
	{/if}
</button>
