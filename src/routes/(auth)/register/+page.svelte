<script lang="ts">
	import { enhance } from '$app/forms';
	import { validateEmail, validatePassword } from '$lib/utils/validation';

	let { form } = $props();

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);

	let emailError = $derived.by(() => {
		if (!email) return '';
		const result = validateEmail(email);
		return result.valid ? '' : result.error ?? '';
	});

	let passwordError = $derived.by(() => {
		if (!password) return '';
		const result = validatePassword(password);
		return result.valid ? '' : result.error ?? '';
	});

	let confirmPasswordError = $derived.by(() => {
		if (!confirmPassword) return '';
		if (password !== confirmPassword) return 'Passwords do not match';
		return '';
	});

	let isFormValid = $derived(
		email &&
			password &&
			confirmPassword &&
			!emailError &&
			!passwordError &&
			!confirmPasswordError
	);
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h1 class="card-title text-2xl font-bold justify-center mb-2">Create Account</h1>
		<p class="text-center text-base-content/70 mb-4">Sign up to get started with Svelteship</p>

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
					<label class="label">
						<span class="label-text-alt text-error">{emailError}</span>
					</label>
				{/if}
			</div>

			<div class="form-control mb-4">
				<label class="label" for="password">
					<span class="label-text">Password</span>
				</label>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={password}
					placeholder="Minimum 8 characters"
					class="input input-bordered w-full"
					class:input-error={passwordError}
					required
				/>
				{#if passwordError}
					<label class="label">
						<span class="label-text-alt text-error">{passwordError}</span>
					</label>
				{/if}
			</div>

			<div class="form-control mb-6">
				<label class="label" for="confirmPassword">
					<span class="label-text">Confirm Password</span>
				</label>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					bind:value={confirmPassword}
					placeholder="Re-enter your password"
					class="input input-bordered w-full"
					class:input-error={confirmPasswordError}
					required
				/>
				{#if confirmPasswordError}
					<label class="label">
						<span class="label-text-alt text-error">{confirmPasswordError}</span>
					</label>
				{/if}
			</div>

			<button
				type="submit"
				class="btn btn-primary w-full"
				disabled={!isFormValid || loading}
			>
				{#if loading}
					<span class="loading loading-spinner loading-sm"></span>
					Creating account...
				{:else}
					Create Account
				{/if}
			</button>
		</form>

		<div class="divider">OR</div>

		<p class="text-center text-sm">
			Already have an account?
			<a href="/login" class="link link-primary">Sign in</a>
		</p>
	</div>
</div>
