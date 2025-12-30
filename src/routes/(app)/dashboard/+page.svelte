<script lang="ts">
	let { data } = $props();

	// Get display name - prefer name, fallback to email username
	let displayName = $derived(data.user.name || data.user.email.split('@')[0]);
</script>

<svelte:head>
	<title>Dashboard | Svelteship</title>
</svelte:head>

<div>
	<!-- Welcome Section -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-2">Welcome back, {displayName}!</h1>
		<p class="text-base-content/70">Here's what's happening with your account.</p>
	</div>

	<!-- Quick Stats -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
		<div class="stat bg-base-100 rounded-box shadow">
			<div class="stat-figure text-primary">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
				</svg>
			</div>
			<div class="stat-title">Account Status</div>
			<div class="stat-value text-primary text-2xl">Active</div>
			<div class="stat-desc">Your account is in good standing</div>
		</div>

		<div class="stat bg-base-100 rounded-box shadow">
			<div class="stat-figure text-secondary">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
				</svg>
			</div>
			<div class="stat-title">Security</div>
			<div class="stat-value text-secondary text-2xl">Secure</div>
			<div class="stat-desc">Session authenticated</div>
		</div>

		<div class="stat bg-base-100 rounded-box shadow">
			<div class="stat-figure text-accent">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
				</svg>
			</div>
			<div class="stat-title">Stack</div>
			<div class="stat-value text-accent text-2xl">Ready</div>
			<div class="stat-desc">SvelteKit + Lucia + Drizzle</div>
		</div>
	</div>

	<!-- Getting Started Guide -->
	<div class="card bg-base-100 shadow-lg">
		<div class="card-body">
			<h2 class="card-title mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
				</svg>
				Getting Started
			</h2>
			
			<div class="space-y-4">
				<div class="flex gap-4 items-start">
					<div class="badge badge-primary badge-lg">1</div>
					<div>
						<h3 class="font-semibold">Customize your profile</h3>
						<p class="text-base-content/70 text-sm">Add your name and personalize your account settings.</p>
						<a href="/profile" class="link link-primary text-sm">Go to Profile →</a>
					</div>
				</div>

				<div class="divider my-2"></div>

				<div class="flex gap-4 items-start">
					<div class="badge badge-primary badge-lg">2</div>
					<div>
						<h3 class="font-semibold">Explore the codebase</h3>
						<p class="text-base-content/70 text-sm">Check out the project structure and understand how everything works together.</p>
						<code class="text-xs bg-base-200 px-2 py-1 rounded">src/routes/(app)/</code>
					</div>
				</div>

				<div class="divider my-2"></div>

				<div class="flex gap-4 items-start">
					<div class="badge badge-primary badge-lg">3</div>
					<div>
						<h3 class="font-semibold">Build your features</h3>
						<p class="text-base-content/70 text-sm">Start adding your own routes, components, and business logic.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
