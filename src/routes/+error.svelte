<script lang="ts">
	import { page } from '$app/stores';

	function goBack() {
		history.back();
	}

	function reload() {
		location.reload();
	}
</script>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
	<div class="text-center max-w-md">
		{#if $page.status === 404}
			<!-- 404 Not Found -->
			<div class="text-9xl font-bold text-primary mb-4">404</div>
			<h1 class="text-2xl font-bold mb-2">Page Not Found</h1>
			<p class="text-base-content/70 mb-6">
				Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
			</p>
			<div class="flex flex-col sm:flex-row gap-3 justify-center">
				<a href="/" class="btn btn-primary">Go Home</a>
				<button class="btn btn-outline" onclick={goBack}>Go Back</button>
			</div>

			<!-- Helpful Links -->
			<div class="mt-8 pt-6 border-t border-base-300">
				<p class="text-sm text-base-content/60 mb-3">You might be looking for:</p>
				<div class="flex flex-wrap gap-2 justify-center">
					<a href="/docs" class="link link-hover text-sm">Documentation</a>
					<span class="text-base-content/30">•</span>
					<a href="/components" class="link link-hover text-sm">Components</a>
					<span class="text-base-content/30">•</span>
					<a href="/login" class="link link-hover text-sm">Sign In</a>
				</div>
			</div>
		{:else}
			<!-- 500 or other errors -->
			<div class="text-9xl font-bold text-error mb-4">{$page.status}</div>
			<h1 class="text-2xl font-bold mb-2">Something Went Wrong</h1>
			<p class="text-base-content/70 mb-6">
				We're sorry, but something unexpected happened. Our team has been notified and is working on
				it.
			</p>
			<div class="flex flex-col sm:flex-row gap-3 justify-center">
				<a href="/" class="btn btn-primary">Go Home</a>
				<button class="btn btn-outline" onclick={reload}>Try Again</button>
			</div>

			<!-- Contact Info -->
			<div class="mt-8 pt-6 border-t border-base-300">
				<p class="text-sm text-base-content/60">
					If the problem persists, please contact support.
				</p>
			</div>
		{/if}
	</div>
</div>
