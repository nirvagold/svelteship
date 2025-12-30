<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'class' | 'type' | 'size'> {
		name: string;
		label?: string;
		checked?: boolean;
		error?: string;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let {
		name,
		label,
		checked = $bindable(false),
		error,
		disabled = false,
		size = 'md',
		class: className = '',
		...restProps
	}: Props = $props();

	const checkboxId = `checkbox-${name}-${Math.random().toString(36).slice(2, 9)}`;

	const sizeClasses = {
		sm: 'checkbox-sm',
		md: '',
		lg: 'checkbox-lg'
	};
</script>

<div class="form-control {className}">
	<label class="label cursor-pointer justify-start gap-3" for={checkboxId}>
		<input
			id={checkboxId}
			type="checkbox"
			{name}
			{disabled}
			bind:checked
			class="checkbox {sizeClasses[size]} {error ? 'checkbox-error' : ''}"
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={error ? `${checkboxId}-error` : undefined}
			{...restProps}
		/>
		{#if label}
			<span class="label-text">{label}</span>
		{/if}
	</label>
	{#if error}
		<span id="{checkboxId}-error" class="label-text-alt text-error ml-7">{error}</span>
	{/if}
</div>
