<script lang="ts">
	interface Option {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		name: string;
		label?: string;
		options: Option[];
		value?: string;
		error?: string;
		required?: boolean;
		disabled?: boolean;
		size?: 'sm' | 'md' | 'lg';
		direction?: 'horizontal' | 'vertical';
		class?: string;
	}

	let {
		name,
		label,
		options,
		value = $bindable(''),
		error,
		required = false,
		disabled = false,
		size = 'md',
		direction = 'vertical',
		class: className = ''
	}: Props = $props();

	const groupId = `radio-${name}-${Math.random().toString(36).slice(2, 9)}`;

	const sizeClasses = {
		sm: 'radio-sm',
		md: '',
		lg: 'radio-lg'
	};
</script>

<div class="form-control {className}" role="radiogroup" aria-labelledby={label ? `${groupId}-label` : undefined}>
	{#if label}
		<span id="{groupId}-label" class="label-text mb-2">
			{label}
			{#if required}<span class="text-error">*</span>{/if}
		</span>
	{/if}
	<div class="flex {direction === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-2'}">
		{#each options as option, i (option.value)}
			{@const optionId = `${groupId}-${i}`}
			<label class="label cursor-pointer justify-start gap-3" for={optionId}>
				<input
					id={optionId}
					type="radio"
					{name}
					value={option.value}
					disabled={disabled || option.disabled}
					checked={value === option.value}
					onchange={() => (value = option.value)}
					class="radio {sizeClasses[size]} {error ? 'radio-error' : ''}"
	
				/>
				<span class="label-text">{option.label}</span>
			</label>
		{/each}
	</div>
	{#if error}
		<span class="label-text-alt text-error mt-1">{error}</span>
	{/if}
</div>
