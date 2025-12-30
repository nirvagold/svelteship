<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Tab {
		id: string;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		tabs: Tab[];
		activeTab?: string;
		variant?: 'boxed' | 'lifted' | 'bordered';
		onchange?: (tabId: string) => void;
		children?: Snippet<[string]>;
	}

	let { tabs, activeTab = $bindable(), variant = 'bordered', onchange, children }: Props = $props();

	// Set default active tab if not provided
	$effect(() => {
		if (!activeTab && tabs.length > 0) {
			activeTab = tabs[0].id;
		}
	});

	const variantClasses: Record<string, string> = {
		boxed: 'tabs-boxed',
		lifted: 'tabs-lifted',
		bordered: 'tabs-bordered'
	};

	function handleTabClick(tab: Tab) {
		if (tab.disabled) return;
		activeTab = tab.id;
		onchange?.(tab.id);
	}
</script>

<div class="w-full">
	<div class="tabs {variantClasses[variant]}" role="tablist">
		{#each tabs as tab (tab.id)}
			<button
				type="button"
				class="tab"
				class:tab-active={activeTab === tab.id}
				class:tab-disabled={tab.disabled}
				disabled={tab.disabled}
				onclick={() => handleTabClick(tab)}
				role="tab"
				aria-selected={activeTab === tab.id}
				aria-controls={`tabpanel-${tab.id}`}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	{#if children && activeTab}
		<div class="p-4" role="tabpanel" id={`tabpanel-${activeTab}`}>
			{@render children(activeTab)}
		</div>
	{/if}
</div>
