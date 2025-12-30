<script lang="ts">
	interface DropdownOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		options: DropdownOption[];
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		error?: string;
		label?: string;
		onchange?: (value: string) => void;
	}

	let {
		options,
		value = $bindable(),
		placeholder = 'Select an option',
		disabled = false,
		error,
		label,
		onchange
	}: Props = $props();

	let isOpen = $state(false);

	const selectedOption = $derived(options.find((opt) => opt.value === value));

	function handleSelect(option: DropdownOption) {
		if (option.disabled) return;
		value = option.value;
		isOpen = false;
		onchange?.(option.value);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			isOpen = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="form-control w-full">
	{#if label}
		<label class="label">
			<span class="label-text">{label}</span>
		</label>
	{/if}

	<div class="dropdown w-full" class:dropdown-open={isOpen}>
		<button
			type="button"
			class="btn btn-outline w-full justify-between"
			class:btn-error={error}
			{disabled}
			onclick={() => (isOpen = !isOpen)}
			aria-haspopup="listbox"
			aria-expanded={isOpen}
		>
			<span class={selectedOption ? 'text-base-content' : 'text-base-content/50'}>
				{selectedOption?.label ?? placeholder}
			</span>
			<svg class="w-4 h-4 transition-transform" class:rotate-180={isOpen} fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		{#if isOpen}
			<ul class="dropdown-content menu bg-base-100 rounded-box z-10 w-full p-2 shadow-lg border border-base-300" role="listbox">
				{#each options as option (option.value)}
					<li>
						<button
							type="button"
							class="w-full text-left"
							class:active={option.value === value}
							class:disabled={option.disabled}
							disabled={option.disabled}
							onclick={() => handleSelect(option)}
							role="option"
							aria-selected={option.value === value}
						>
							{option.label}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	{#if error}
		<label class="label">
			<span class="label-text-alt text-error">{error}</span>
		</label>
	{/if}
</div>
