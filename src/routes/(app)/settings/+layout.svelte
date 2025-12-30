<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const tabs = [
		{ href: '/settings', label: 'General', icon: '⚙️' },
		{ href: '/settings/security', label: 'Security', icon: '🔒' },
		{ href: '/settings/sessions', label: 'Sessions', icon: '📱' }
	];

	function isActive(href: string, currentPath: string): boolean {
		if (href === '/settings') {
			return currentPath === '/settings';
		}
		return currentPath.startsWith(href);
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<h1 class="text-3xl font-bold mb-6">Settings</h1>

	<!-- Tabs Navigation -->
	<div class="tabs tabs-boxed mb-6">
		{#each tabs as tab (tab.href)}
			<a
				href={tab.href}
				class="tab gap-2"
				class:tab-active={isActive(tab.href, $page.url.pathname)}
			>
				<span>{tab.icon}</span>
				{tab.label}
			</a>
		{/each}
	</div>

	<!-- Tab Content -->
	<div class="card bg-base-100 shadow-md">
		<div class="card-body">
			{@render children()}
		</div>
	</div>
</div>
