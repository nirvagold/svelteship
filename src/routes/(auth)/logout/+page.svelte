<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div class="min-h-screen flex items-center justify-center">
	<div class="card bg-base-100 shadow-xl w-full max-w-sm">
		<div class="card-body text-center">
			<h2 class="card-title justify-center">Logout</h2>
			<p class="text-base-content/70">Are you sure you want to log out?</p>
			<form method="POST" use:enhance class="mt-4">
				<button type="submit" class="btn btn-primary w-full">
					Confirm Logout
				</button>
			</form>
			<a href="/dashboard" class="btn btn-ghost mt-2">Cancel</a>
		</div>
	</div>
</div>
