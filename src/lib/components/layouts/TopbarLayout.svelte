<script lang="ts">
	import type { Snippet } from 'svelte';

	interface NavItem {
		label: string;
		href: string;
		active?: boolean;
	}

	interface Props {
		navItems: NavItem[];
		sticky?: boolean;
		logo?: Snippet;
		actions?: Snippet;
		children?: Snippet;
	}

	let { navItems, sticky = true, logo, actions, children }: Props = $props();

	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<div class="min-h-screen bg-base-200">
	<!-- Topbar -->
	<nav
		class="navbar bg-base-100 border-b border-base-300 px-4 {sticky
			? 'sticky top-0 z-30'
			: ''}"
	>
		<!-- Logo -->
		<div class="flex-none">
			{#if logo}
				{@render logo()}
			{/if}
		</div>

		<!-- Desktop Navigation -->
		<div class="flex-1 hidden lg:flex justify-center">
			<ul class="menu menu-horizontal gap-1">
				{#each navItems as item (item.href)}
					<li>
						<a
							href={item.href}
							class={item.active ? 'active bg-primary text-primary-content' : ''}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Actions -->
		<div class="flex-none hidden lg:flex">
			{#if actions}
				{@render actions()}
			{/if}
		</div>

		<!-- Mobile Menu Button -->
		<div class="flex-1 lg:hidden"></div>
		<div class="flex-none lg:hidden">
			<button
				type="button"
				class="btn btn-ghost btn-square"
				onclick={toggleMobileMenu}
				aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={mobileMenuOpen}
			>
				{#if mobileMenuOpen}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block h-6 w-6 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				{/if}
			</button>
		</div>
	</nav>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div class="lg:hidden bg-base-100 border-b border-base-300">
			<ul class="menu p-4">
				{#each navItems as item (item.href)}
					<li>
						<a
							href={item.href}
							onclick={closeMobileMenu}
							class={item.active ? 'active bg-primary text-primary-content' : ''}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
			{#if actions}
				<div class="p-4 border-t border-base-300">
					{@render actions()}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Main Content -->
	<main class="p-4 lg:p-6">
		{@render children?.()}
	</main>
</div>
