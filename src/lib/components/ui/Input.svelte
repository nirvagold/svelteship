<script lang="ts">
	interface Props {
		type?: 'text' | 'email' | 'password';
		label?: string;
		error?: string;
		value?: string;
		name?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		oninput?: (e: Event) => void;
	}

	let {
		type = 'text',
		label = '',
		error = '',
		value = $bindable(''),
		name = '',
		placeholder = '',
		required = false,
		disabled = false,
		oninput
	}: Props = $props();

	const generatedId = `input-${Math.random().toString(36).slice(2, 9)}`;
	let inputId = $derived(name || generatedId);
</script>

<div class="form-control w-full">
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
		bind:value
		{oninput}
		class="input input-bordered w-full {error ? 'input-error' : ''}"
	/>
	{#if error}
		<label class="label" for={inputId}>
			<span class="label-text-alt text-error">{error}</span>
		</label>
	{/if}
</div>
