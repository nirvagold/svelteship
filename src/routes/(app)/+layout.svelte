<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { page } from '$app/stores';

	let { data, children } = $props();

	let sidebarOpen = $state(false);

	function closeSidebar() {
		sidebarOpen = false;
	}

	function isActive(path: string): boolean {
		return $page.url.pathname === path;
	}
</script>

<div class="drawer lg:drawer-open">
	<input id="app-drawer" type="checkbox" class="drawer-toggle" bind:checked={sidebarOpen} />

	<!-- Main Content -->
	<div class="drawer-content flex flex-col bg-base-200 min-h-screen">
		<!-- Mobile Navbar (Sticky) -->
		<div
			class="navbar bg-base-100 lg:hidden border-b border-base-300 min-h-0 px-2 py-1 sticky top-0 z-30"
		>
			<div class="flex-none">
				<label for="app-drawer" class="btn btn-ghost btn-sm btn-square" aria-label="Open menu">
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
				<a href="/dashboard" class="btn btn-ghost btn-sm text-base">🚀 Svelteship</a>
			</div>
			<div class="flex-none flex items-center gap-1">
				<ThemeToggle />
			</div>
		</div>

		<!-- Page Content -->
		<main class="flex-1 p-4 lg:p-6 overflow-y-auto">
			{@render children()}
		</main>
	</div>

	<!-- Sidebar -->
	<div class="drawer-side z-40">
		<label for="app-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
		<aside class="bg-base-100 w-64 min-h-full flex flex-col border-r border-base-300">
			<!-- Logo -->
			<div class="p-3 border-b border-base-300">
				<a href="/dashboard" class="text-lg font-bold">🚀 Svelteship</a>
			</div>

			<!-- Menu -->
			<ul class="menu p-2 gap-1 flex-1 w-full">
				<li class="w-full">
					<a
						href="/dashboard"
						onclick={closeSidebar}
						class="w-full {isActive('/dashboard')
							? 'active bg-primary text-primary-content'
							: ''}"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
							/>
						</svg>
						Dashboard
					</a>
				</li>
				<li class="w-full">
					<a
						href="/profile"
						onclick={closeSidebar}
						class="w-full {isActive('/profile')
							? 'active bg-primary text-primary-content'
							: ''}"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
							/>
						</svg>
						Profile
					</a>
				</li>
			</ul>

			<!-- User Section -->
			<div class="p-3 border-t border-base-300">
				<div class="flex items-center gap-2">
					<div class="avatar placeholder">
						<div
							class="bg-primary text-primary-content w-8 h-8 rounded-full text-xs flex items-center justify-center"
						>
							{#if data.user.avatarUrl}
								<img
									src={data.user.avatarUrl}
									alt="Profile"
									class="w-full h-full rounded-full object-cover"
								/>
							{:else}
								<span
									>{data.user.name?.[0]?.toUpperCase() || data.user.email[0].toUpperCase()}</span
								>
							{/if}
						</div>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-xs font-medium truncate">{data.user.name || 'User'}</p>
						<p class="text-xs text-base-content/50 truncate">{data.user.email}</p>
					</div>
					<ThemeToggle />
					<form action="/logout" method="POST">
						<button type="submit" class="btn btn-ghost btn-xs btn-square" aria-label="Logout">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-4 h-4"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
								/>
							</svg>
						</button>
					</form>
				</div>
			</div>
		</aside>
	</div>
</div>
