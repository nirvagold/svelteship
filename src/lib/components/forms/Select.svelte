<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface Option {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props extends Omit<HTMLSelectAttributes, 'class' | 'value' | 'size'> {
		name: string;
		label?: string;
		options: Option[];
		value?: string;
		placeholder?: string;
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
		options,
		value = $bindable(''),
		placeholder,
		error,
		helper,
		required = false,
		disabled = false,
		size = 'md',
		class: className = '',
		...restProps
	}: Props = $props();

	const selectId = `select-${name}-${Math.random().toString(36).slice(2, 9)}`;

	const sizeClasses = {
		sm: 'select-sm',
		md: '',
		lg: 'select-lg'
	};
</script>

<div class="form-control w-full {className}">
	{#if label}
		<label class="label" for={selectId}>
			<span class="label-text">
				{label}
				{#if required}<span class="text-error">*</span>{/if}
			</span>
		</label>
	{/if}
	<select
		id={selectId}
		{name}
		{required}
		{disabled}
		bind:value
		class="select select-bordered w-full {sizeClasses[size]} {error ? 'select-error' : ''}"
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={error ? `${selectId}-error` : helper ? `${selectId}-helper` : undefined}
		{...restProps}
	>
		{#if placeholder}
			<option value="" disabled selected={!value}>{placeholder}</option>
		{/if}
		{#each options as option (option.value)}
			<option value={option.value} disabled={option.disabled}>{option.label}</option>
		{/each}
	</select>
	{#if error}
		<label class="label" for={selectId}>
			<span id="{selectId}-error" class="label-text-alt text-error">{error}</span>
		</label>
	{:else if helper}
		<label class="label" for={selectId}>
			<span id="{selectId}-helper" class="label-text-alt">{helper}</span>
		</label>
	{/if}
</div>
