<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';

	interface Props {
		data: {
			user: {
				id: string;
				email: string;
				name: string | null;
				role: string;
			};
		};
		children: Snippet;
	}

	let { data, children }: Props = $props();

	const navItems = [
		{ href: '/admin-dashboard', label: 'Dashboard', icon: '📊' },
		{ href: '/admin/users', label: 'Users', icon: '👥' },
		{ href: '/admin/settings', label: 'Settings', icon: '⚙️' }
	];

	function isActive(href: string): boolean {
		return $page.url.pathname.startsWith(href);
	}
</script>

<div class="min-h-screen bg-base-200">
	<!-- Admin Header -->
	<header class="bg-base-100 border-b border-base-300 sticky top-0 z-50">
		<div class="container mx-auto px-4">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center gap-4">
					<a href="/admin-dashboard" class="text-xl font-bold flex items-center gap-2">
						<span class="text-2xl">🛡️</span>
						Admin Panel
					</a>
					<span class="badge badge-warning">Admin</span>
				</div>

				<div class="flex items-center gap-4">
					<span class="text-sm text-base-content/70">
						{data.user.name || data.user.email}
					</span>
					<a href="/dashboard" class="btn btn-ghost btn-sm">
						← Back to App
					</a>
				</div>
			</div>
		</div>
	</header>

	<div class="container mx-auto px-4 py-6">
		<div class="flex gap-6">
			<!-- Sidebar -->
			<aside class="w-64 shrink-0">
				<nav class="card bg-base-100 shadow-sm">
					<ul class="menu p-2">
						{#each navItems as item (item.href)}
							<li>
								<a
									href={item.href}
									class:active={isActive(item.href)}
								>
									<span>{item.icon}</span>
									{item.label}
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			</aside>

			<!-- Main Content -->
			<main class="flex-1 min-w-0">
				{@render children()}
			</main>
		</div>
	</div>
</div>
