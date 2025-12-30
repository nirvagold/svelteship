<script lang="ts">
	import { enhance } from '$app/forms';
	import { validateEmail } from '$lib/utils/validation';

	let { form } = $props();

	let email = $state('');
	let password = $state('');
	let loading = $state(false);

	let emailError = $derived.by(() => {
		if (!email) return '';
		const result = validateEmail(email);
		return result.valid ? '' : result.error ?? '';
	});

	let isFormValid = $derived(email && password && !emailError);
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h1 class="card-title text-2xl font-bold justify-center mb-2">Welcome Back</h1>
		<p class="text-center text-base-content/70 mb-4">Sign in to your Svelteship account</p>

		{#if form?.error}
			<div class="alert alert-error mb-4">
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
			<div class="form-control mb-4">
				<label class="label" for="email">
					<span class="label-text">Email</span>
				</label>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={email}
					placeholder="you@example.com"
					class="input input-bordered w-full"
					class:input-error={emailError}
					required
				/>
				{#if emailError}
					<div class="label">
						<span class="label-text-alt text-error">{emailError}</span>
					</div>
				{/if}
			</div>

			<div class="form-control mb-6">
				<label class="label" for="password">
					<span class="label-text">Password</span>
				</label>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={password}
					placeholder="Enter your password"
					class="input input-bordered w-full"
					required
				/>
				<label class="label" for="password">
					<a href="/forgot-password" class="label-text-alt link link-hover">Forgot password?</a>
				</label>
			</div>

			<button
				type="submit"
				class="btn btn-primary w-full"
				disabled={!isFormValid || loading}
			>
				{#if loading}
					<span class="loading loading-spinner loading-sm"></span>
					Signing in...
				{:else}
					Sign In
				{/if}
			</button>
		</form>

		<div class="divider">OR</div>

		<p class="text-center text-sm">
			Don't have an account?
			<a href="/register" class="link link-primary">Create one</a>
		</p>
	</div>
</div>
