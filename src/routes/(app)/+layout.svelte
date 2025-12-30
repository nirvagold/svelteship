<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { page } from '$app/stores';

	let { data, children } = $props();

	let sidebarOpen = $state(false);

	function closeSidebar() {
		sidebarOpen = false;
	}

	function isActive(path: string): boolean {
		return $page.url.pathname === path || $page.url.pathname.startsWith(path + '/');
	}

	function isExactActive(path: string): boolean {
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
						class="w-full {isExactActive('/dashboard')
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
						href="/notifications"
						onclick={closeSidebar}
						class="w-full {isExactActive('/notifications')
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
								d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
							/>
						</svg>
						Notifications
						{#if data.unreadNotificationsCount > 0}
							<span class="badge badge-sm badge-error">{data.unreadNotificationsCount}</span>
						{/if}
					</a>
				</li>
				<li class="w-full">
					<a
						href="/profile"
						onclick={closeSidebar}
						class="w-full {isExactActive('/profile')
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
				<li class="w-full">
					<a
						href="/settings"
						onclick={closeSidebar}
						class="w-full {isActive('/settings')
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
								d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
						</svg>
						Settings
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
