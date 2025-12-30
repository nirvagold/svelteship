<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLTextareaAttributes, 'class' | 'value'> {
		name: string;
		label?: string;
		placeholder?: string;
		value?: string;
		error?: string;
		helper?: string;
		required?: boolean;
		disabled?: boolean;
		rows?: number;
		maxlength?: number;
		showCount?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let {
		name,
		label,
		placeholder = '',
		value = $bindable(''),
		error,
		helper,
		required = false,
		disabled = false,
		rows = 3,
		maxlength,
		showCount = false,
		size = 'md',
		class: className = '',
		...restProps
	}: Props = $props();

	const textareaId = `textarea-${name}-${Math.random().toString(36).slice(2, 9)}`;

	const sizeClasses = {
		sm: 'textarea-sm',
		md: '',
		lg: 'textarea-lg'
	};

	let charCount = $derived(value?.length ?? 0);
</script>

<div class="form-control w-full {className}">
	{#if label}
		<label class="label" for={textareaId}>
			<span class="label-text">
				{label}
				{#if required}<span class="text-error">*</span>{/if}
			</span>
		</label>
	{/if}
	<textarea
		id={textareaId}
		{name}
		{placeholder}
		{required}
		{disabled}
		{rows}
		{maxlength}
		bind:value
		class="textarea textarea-bordered w-full {sizeClasses[size]} {error ? 'textarea-error' : ''}"
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={error ? `${textareaId}-error` : helper ? `${textareaId}-helper` : undefined}
		{...restProps}
	></textarea>
	<div class="flex justify-between">
		{#if error}
			<span id="{textareaId}-error" class="label-text-alt text-error">{error}</span>
		{:else if helper}
			<span id="{textareaId}-helper" class="label-text-alt">{helper}</span>
		{:else}
			<span></span>
		{/if}
		{#if showCount}
			<span class="label-text-alt">
				{charCount}{#if maxlength}/{maxlength}{/if}
			</span>
		{/if}
	</div>
</div>
