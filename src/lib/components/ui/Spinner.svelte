<script lang="ts">
	interface Props {
		size?: 'xs' | 'sm' | 'md' | 'lg';
		variant?: 'primary' | 'secondary' | 'accent';
		label?: string;
	}

	let { size = 'md', variant = 'primary', label }: Props = $props();

	const sizeClasses: Record<string, string> = {
		xs: 'loading-xs',
		sm: 'loading-sm',
		md: 'loading-md',
		lg: 'loading-lg'
	};

	const variantClasses: Record<string, string> = {
		primary: 'text-primary',
		secondary: 'text-secondary',
		accent: 'text-accent'
	};
</script>

<span
	class="loading loading-spinner {sizeClasses[size]} {variantClasses[variant]}"
	role="status"
	aria-label={label ?? 'Loading'}
></span>
{#if label}
	<span class="sr-only">{label}</span>
{/if}
