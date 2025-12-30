<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'class' | 'value'> {
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
		label?: string;
		error?: string;
		value?: string;
		name?: string;
		id?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		minlength?: number;
		maxlength?: number;
		class?: string;
		oninput?: (e: Event) => void;
	}

	let {
		type = 'text',
		label = '',
		error = '',
		value = $bindable(''),
		name = '',
		id,
		placeholder = '',
		required = false,
		disabled = false,
		minlength,
		maxlength,
		class: className = '',
		oninput,
		...restProps
	}: Props = $props();

	const generatedId = `input-${Math.random().toString(36).slice(2, 9)}`;
	let inputId = $derived(id || name || generatedId);
</script>

<div class="form-control w-full {className}">
	{#if label}
		<label class="label" for={inputId}>
			<span class="label-text">{label}</span>
		</label>
	{/if}
	<input
		id={inputId}
		{type}
		{name}
		{placeholder}
		{required}
		{disabled}
		{minlength}
		{maxlength}
		bind:value
		{oninput}
		class="input input-bordered w-full {error ? 'input-error' : ''}"
		{...restProps}
	/>
	{#if error}
		<label class="label" for={inputId}>
			<span class="label-text-alt text-error">{error}</span>
		</label>
	{/if}
</div>
