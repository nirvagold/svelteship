<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'class' | 'value' | 'type' | 'min' | 'max' | 'size'> {
		name: string;
		label?: string;
		value?: string;
		min?: string;
		max?: string;
		error?: string;
		helper?: string;
		required?: boolean;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let {
		name,
		label,
		value = $bindable(''),
		min,
		max,
		error,
		helper,
		required = false,
		disabled = false,
		size = 'md',
		class: className = '',
		...restProps
	}: Props = $props();

	const inputId = `datepicker-${name}-${Math.random().toString(36).slice(2, 9)}`;

	const sizeClasses = {
		sm: 'input-sm',
		md: '',
		lg: 'input-lg'
	};
</script>

<div class="form-control w-full {className}">
	{#if label}
		<label class="label" for={inputId}>
			<span class="label-text">
				{label}
				{#if required}<span class="text-error">*</span>{/if}
			</span>
		</label>
	{/if}
	<input
		id={inputId}
		type="date"
		{name}
		{min}
		{max}
		{required}
		{disabled}
		bind:value
		class="input input-bordered w-full {sizeClasses[size]} {error ? 'input-error' : ''}"
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
		{...restProps}
	/>
	{#if error}
		<label class="label" for={inputId}>
			<span id="{inputId}-error" class="label-text-alt text-error">{error}</span>
		</label>
	{:else if helper}
		<label class="label" for={inputId}>
			<span id="{inputId}-helper" class="label-text-alt">{helper}</span>
		</label>
	{/if}
</div>
