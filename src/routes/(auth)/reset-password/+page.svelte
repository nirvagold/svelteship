<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	interface Props {
		data: {
			token: string | null;
			valid: boolean;
		};
		form: {
			success?: boolean;
			error?: string;
		} | null;
	}

	let { data, form }: Props = $props();

	let loading = $state(false);
	let password = $state('');
	let confirmPassword = $state('');

	const passwordsMatch = $derived(password === confirmPassword);
	const passwordValid = $derived(password.length >= 8);
</script>

<svelte:head>
	<title>Reset Password - Svelteship</title>
</svelte:head>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
	<div class="card bg-base-100 shadow-xl w-full max-w-md">
		<div class="card-body">
			{#if form?.success}
				<!-- Success State -->
				<div class="text-center py-4">
					<div class="text-5xl mb-4">✅</div>
					<h2 class="text-xl font-semibold mb-2">Password Reset Successful</h2>
					<p class="text-base-content/70 mb-6">
						Your password has been reset. You can now log in with your new password.
					</p>
					<a href="/login" class="btn btn-primary w-full">Go to Login</a>
				</div>
			{:else if !data.valid}
				<!-- Invalid/Expired Token -->
				<div class="text-center py-4">
					<div class="text-5xl mb-4">⚠️</div>
					<h2 class="text-xl font-semibold mb-2">Invalid or Expired Link</h2>
					<p class="text-base-content/70 mb-6">
						This password reset link is invalid or has expired. Please request a new one.
					</p>
					<a href="/forgot-password" class="btn btn-primary w-full">Request New Link</a>
				</div>
			{:else}
				<!-- Reset Form -->
				<h1 class="card-title text-2xl justify-center mb-2">Reset Password</h1>
				<p class="text-base-content/70 text-center mb-6">Enter your new password below.</p>

				<form
					method="POST"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<input type="hidden" name="token" value={data.token} />

					<div class="form-control mb-4">
						<Input
							type="password"
							name="password"
							id="password"
							label="New Password"
							placeholder="Enter new password"
							bind:value={password}
							required
							minlength={8}
							error={password && !passwordValid ? 'Password must be at least 8 characters' : ''}
						/>
					</div>

					<div class="form-control mb-4">
						<Input
							type="password"
							name="confirmPassword"
							id="confirmPassword"
							label="Confirm Password"
							placeholder="Confirm new password"
							bind:value={confirmPassword}
							required
							error={confirmPassword && !passwordsMatch ? 'Passwords do not match' : ''}
						/>
					</div>

					{#if form?.error}
						<div class="alert alert-error mb-4">
							<span>{form.error}</span>
						</div>
					{/if}

					<Button
						type="submit"
						variant="primary"
						class="w-full"
						disabled={loading || !passwordValid || !passwordsMatch}
					>
						{#if loading}
							<span class="loading loading-spinner loading-sm"></span>
							Resetting...
						{:else}
							Reset Password
						{/if}
					</Button>
				</form>

				<div class="divider"></div>

				<div class="text-center">
					<a href="/login" class="link link-hover text-sm">Back to Login</a>
				</div>
			{/if}
		</div>
	</div>
</div>
