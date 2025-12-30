<script lang="ts">
	import type { Snippet } from 'svelte';

	interface NavItem {
		label: string;
		href: string;
		icon?: Snippet;
		badge?: string | number;
		active?: boolean;
	}

	interface Props {
		navItems: NavItem[];
		collapsible?: boolean;
		defaultCollapsed?: boolean;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		navItems,
		collapsible = false,
		defaultCollapsed = false,
		header,
		footer,
		children
	}: Props = $props();

	let sidebarOpen = $state(false);
	let collapsed = $state(defaultCollapsed);

	function closeSidebar() {
		sidebarOpen = false;
	}

	function toggleCollapse() {
		if (collapsible) {
			collapsed = !collapsed;
		}
	}
</script>

<div class="drawer lg:drawer-open">
	<input id="sidebar-drawer" type="checkbox" class="drawer-toggle" bind:checked={sidebarOpen} />

	<!-- Main Content -->
	<div class="drawer-content flex flex-col bg-base-200 min-h-screen">
		<!-- Mobile Navbar -->
		<div
			class="navbar bg-base-100 lg:hidden border-b border-base-300 min-h-0 px-2 py-1 sticky top-0 z-30"
		>
			<div class="flex-none">
				<label for="sidebar-drawer" class="btn btn-ghost btn-sm btn-square" aria-label="Open menu">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block h-5 w-5 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				</label>
			</div>
			<div class="flex-1">
				{#if header}
					{@render header()}
				{/if}
			</div>
		</div>

		<!-- Page Content -->
		<main class="flex-1 p-4 lg:p-6 overflow-y-auto">
			{@render children?.()}
		</main>
	</div>

	<!-- Sidebar -->
	<div class="drawer-side z-40">
		<label for="sidebar-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<aside
			class="bg-base-100 min-h-full flex flex-col border-r border-base-300 transition-all duration-300 {collapsed
				? 'w-16'
				: 'w-64'}"
		>
			<!-- Header -->
			{#if header}
				<div class="p-4 border-b border-base-300 {collapsed ? 'px-2' : ''}">
					{@render header()}
				</div>
			{/if}

			<!-- Collapse Toggle (Desktop only) -->
			{#if collapsible}
				<div class="hidden lg:flex justify-end p-2">
					<button
						type="button"
						class="btn btn-ghost btn-xs btn-square"
						onclick={toggleCollapse}
						aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-4 h-4 transition-transform {collapsed ? 'rotate-180' : ''}"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 19.5 8.25 12l7.5-7.5"
							/>
						</svg>
					</button>
				</div>
			{/if}

			<!-- Navigation -->
			<ul class="menu p-2 gap-1 flex-1 w-full {collapsed ? 'px-1' : ''}">
				{#each navItems as item (item.href)}
					<li class="w-full">
						<a
							href={item.href}
							onclick={closeSidebar}
							class="w-full {item.active ? 'active bg-primary text-primary-content' : ''} {collapsed
								? 'justify-center px-2'
								: ''}"
							title={collapsed ? item.label : undefined}
						>
							{#if item.icon}
								{@render item.icon()}
							{/if}
							{#if !collapsed}
								<span>{item.label}</span>
								{#if item.badge !== undefined}
									<span class="badge badge-sm badge-error">{item.badge}</span>
								{/if}
							{/if}
						</a>
					</li>
				{/each}
			</ul>

			<!-- Footer -->
			{#if footer}
				<div class="p-3 border-t border-base-300 {collapsed ? 'px-1' : ''}">
					{@render footer()}
				</div>
			{/if}
		</aside>
	</div>
</div>
