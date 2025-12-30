<script lang="ts">
	interface Props {
		data: {
			stats: {
				totalUsers: number;
				activeUsers: number;
				newUsersToday: number;
				totalSessions: number;
			};
		};
	}

	let { data }: Props = $props();

	const statCards = [
		{ label: 'Total Users', value: data.stats.totalUsers, icon: '👥', color: 'primary' },
		{ label: 'Active Users', value: data.stats.activeUsers, icon: '✅', color: 'success' },
		{ label: 'New Today', value: data.stats.newUsersToday, icon: '🆕', color: 'info' },
		{ label: 'Active Sessions', value: data.stats.totalSessions, icon: '📱', color: 'warning' }
	];
</script>

<svelte:head>
	<title>Admin Dashboard - Svelteship</title>
</svelte:head>

<div class="space-y-6">
	<h1 class="text-2xl font-bold">Dashboard</h1>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		{#each statCards as stat (stat.label)}
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-base-content/60">{stat.label}</p>
							<p class="text-3xl font-bold">{stat.value}</p>
						</div>
						<div class="text-3xl">{stat.icon}</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Quick Actions -->
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<h2 class="card-title">Quick Actions</h2>
			<div class="flex flex-wrap gap-2 mt-2">
				<a href="/admin/users" class="btn btn-outline btn-sm">
					👥 Manage Users
				</a>
				<a href="/admin/settings" class="btn btn-outline btn-sm">
					⚙️ System Settings
				</a>
				<a href="/docs" class="btn btn-outline btn-sm">
					📚 Documentation
				</a>
			</div>
		</div>
	</div>

	<!-- Recent Activity Placeholder -->
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<h2 class="card-title">Recent Activity</h2>
			<div class="py-8 text-center text-base-content/60">
				<p>Activity log will be displayed here.</p>
				<p class="text-sm mt-2">Coming soon...</p>
			</div>
		</div>
	</div>
</div>
