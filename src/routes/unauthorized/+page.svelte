<script lang="ts">
	function goBack() {
		history.back();
	}
</script>

<svelte:head>
	<title>Unauthorized - Svelteship</title>
</svelte:head>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
	<div class="text-center max-w-md">
		<div class="text-9xl font-bold text-warning mb-4">403</div>
		<h1 class="text-2xl font-bold mb-2">Access Denied</h1>
		<p class="text-base-content/70 mb-6">
			Sorry, you don't have permission to access this page. Please contact an administrator if you
			believe this is an error.
		</p>
		<div class="flex flex-col sm:flex-row gap-3 justify-center">
			<a href="/" class="btn btn-primary">Go Home</a>
			<button class="btn btn-outline" onclick={goBack}>Go Back</button>
		</div>
	</div>
</div>
