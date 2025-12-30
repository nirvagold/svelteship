<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { data, children } = $props();

	let sidebarOpen = $state(false);

	function closeSidebar() {
		sidebarOpen = false;
	}
</script>

<div class="drawer lg:drawer-open">
	<input id="app-drawer" type="checkbox" class="drawer-toggle" bind:checked={sidebarOpen} />

	<!-- Main Content -->
	<div class="drawer-content flex flex-col">
		<!-- Mobile Navbar -->
		<div class="navbar bg-base-100 lg:hidden border-b border-base-300">
			<div class="flex-none">
				<label for="app-drawer" class="btn btn-square btn-ghost" aria-label="Open menu">
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
				</label>
			</div>
			<div class="flex-1">
				<a href="/dashboard" class="btn btn-ghost text-xl">Svelteship</a>
			</div>
			<div class="flex-none flex items-center gap-1">
				<ThemeToggle />
				<div class="dropdown dropdown-end">
					<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar placeholder">
						<div class="bg-neutral text-neutral-content w-10 rounded-full">
							<span class="text-sm">{data.user.name?.[0]?.toUpperCase() || data.user.email[0].toUpperCase()}</span>
						</div>
					</div>
					<ul
						role="menu"
						class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
					>
						<li class="menu-title">
							<span>{data.user.name || data.user.email}</span>
						</li>
						<li><a href="/profile">Profile</a></li>
						<li>
							<form action="/logout" method="POST">
								<button type="submit" class="w-full text-left">Logout</button>
							</form>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Page Content -->
		<main class="flex-1 p-4 lg:p-6">
			{@render children()}
		</main>
	</div>

	<!-- Sidebar -->
	<div class="drawer-side z-40">
		<button
			type="button"
			aria-label="Close menu"
			class="drawer-overlay"
			onclick={closeSidebar}
			onkeydown={(e) => e.key === 'Enter' && closeSidebar()}
		></button>
		<aside class="bg-base-100 min-h-screen w-64 border-r border-base-300">
			<!-- Sidebar Header -->
			<div class="p-4 border-b border-base-300">
				<a href="/dashboard" class="text-xl font-bold">Svelteship</a>
			</div>

			<!-- Navigation Menu -->
			<ul class="menu p-4 gap-1">
				<li>
					<a href="/dashboard" onclick={closeSidebar}>
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
				<li>
					<a href="/profile" onclick={closeSidebar}>
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

			<!-- User Section at Bottom -->
			<div class="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300">
				<div class="flex items-center gap-3">
					<div class="avatar placeholder">
						<div class="bg-neutral text-neutral-content w-10 rounded-full">
							<span class="text-sm">{data.user.name?.[0]?.toUpperCase() || data.user.email[0].toUpperCase()}</span>
						</div>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium truncate">{data.user.name || 'User'}</p>
						<p class="text-xs text-base-content/60 truncate">{data.user.email}</p>
					</div>
					<ThemeToggle />
					<form action="/logout" method="POST">
						<button type="submit" class="btn btn-ghost btn-sm btn-square" aria-label="Logout">
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
