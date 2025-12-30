<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
		size?: 'sm' | 'md' | 'lg';
		outline?: boolean;
		children?: Snippet;
	}

	let { variant = 'primary', size = 'md', outline = false, children }: Props = $props();

	const variantClasses: Record<string, string> = {
		primary: 'badge-primary',
		secondary: 'badge-secondary',
		accent: 'badge-accent',
		success: 'badge-success',
		warning: 'badge-warning',
		error: 'badge-error',
		info: 'badge-info'
	};

	const sizeClasses: Record<string, string> = {
		sm: 'badge-sm',
		md: '',
		lg: 'badge-lg'
	};
</script>

<span class="badge {variantClasses[variant]} {sizeClasses[size]}" class:badge-outline={outline}>
	{#if children}
		{@render children()}
	{/if}
</span>
