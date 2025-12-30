<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let nameValue = $state('');
	let loading = $state(false);

	// Initialize and sync nameValue when data changes
	$effect(() => {
		nameValue = data.user.name || '';
	});
</script>

<svelte:head>
	<title>Profile | Svelteship</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
	<!-- Page Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-2">Profile</h1>
		<p class="text-base-content/70">Manage your account information.</p>
	</div>

	<!-- User Info Card -->
	<div class="card bg-base-100 shadow-lg mb-6">
		<div class="card-body">
			<h2 class="card-title mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
				</svg>
				Account Information
			</h2>

			<div class="space-y-4">
				<div>
					<label class="label" for="email">
						<span class="label-text font-medium">Email</span>
					</label>
					<input
						type="email"
						id="email"
						value={data.user.email}
						class="input input-bordered w-full"
						disabled
					/>
					<p class="label">
						<span class="label-text-alt text-base-content/60">Email cannot be changed</span>
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Update Profile Form -->
	<div class="card bg-base-100 shadow-lg">
		<div class="card-body">
			<h2 class="card-title mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
				</svg>
				Update Profile
			</h2>

			{#if form?.success}
				<div class="alert alert-success mb-4">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span>Profile updated successfully!</span>
				</div>
			{/if}

			{#if form?.error}
				<div class="alert alert-error mb-4">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span>{form.error}</span>
				</div>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
			>
				<div class="space-y-4">
					<div>
						<label class="label" for="name">
							<span class="label-text font-medium">Display Name</span>
						</label>
						<input
							type="text"
							id="name"
							name="name"
							bind:value={nameValue}
							placeholder="Enter your name"
							class="input input-bordered w-full"
							maxlength="100"
						/>
						<p class="label">
							<span class="label-text-alt text-base-content/60">Max 100 characters</span>
						</p>
					</div>

					<div class="pt-4">
						<button
							type="submit"
							class="btn btn-primary"
							disabled={loading}
						>
							{#if loading}
								<span class="loading loading-spinner loading-sm"></span>
							{/if}
							Save Changes
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
