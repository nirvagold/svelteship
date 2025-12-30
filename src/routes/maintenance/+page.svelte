<script lang="ts">
	interface Props {
		data: {
			estimatedReturn?: string;
			contactEmail?: string;
		};
	}

	let { data }: Props = $props();

	const estimatedReturn = $derived(data?.estimatedReturn || null);
	const contactEmail = $derived(data?.contactEmail || 'support@example.com');
</script>

<svelte:head>
	<title>Maintenance - Svelteship</title>
</svelte:head>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
	<div class="text-center max-w-md">
		<!-- Maintenance Icon -->
		<div class="text-8xl mb-6">🔧</div>

		<h1 class="text-3xl font-bold mb-4">Under Maintenance</h1>

		<p class="text-base-content/70 mb-6">
			We're currently performing scheduled maintenance to improve your experience. We'll be back
			shortly.
		</p>

		{#if estimatedReturn}
			<div class="alert alert-info mb-6">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="stroke-current shrink-0 w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<span>Estimated return: {estimatedReturn}</span>
			</div>
		{/if}

		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<h3 class="font-semibold mb-2">Need urgent assistance?</h3>
				<p class="text-sm text-base-content/70 mb-3">
					If you have an urgent issue, please contact us:
				</p>
				<a href="mailto:{contactEmail}" class="btn btn-primary btn-sm">
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
					{contactEmail}
				</a>
			</div>
		</div>

		<!-- Status Updates -->
		<div class="mt-8 text-sm text-base-content/50">
			<p>Follow us on social media for status updates.</p>
		</div>
	</div>
</div>
