<script lang="ts">
	interface Props {
		value: number;
		max?: number;
		variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
		size?: 'xs' | 'sm' | 'md' | 'lg';
		showLabel?: boolean;
	}

	let { value, max = 100, variant = 'primary', size = 'md', showLabel = false }: Props = $props();

	const percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)));

	const variantClasses: Record<string, string> = {
		primary: 'progress-primary',
		secondary: 'progress-secondary',
		accent: 'progress-accent',
		success: 'progress-success',
		warning: 'progress-warning',
		error: 'progress-error'
	};

	const sizeClasses: Record<string, string> = {
		xs: 'h-1',
		sm: 'h-2',
		md: 'h-3',
		lg: 'h-4'
	};
</script>

<div class="flex items-center gap-2">
	<progress
		class="progress {variantClasses[variant]} {sizeClasses[size]} w-full"
		{value}
		{max}
	></progress>
	{#if showLabel}
		<span class="text-sm font-medium">{Math.round(percentage)}%</span>
	{/if}
</div>
