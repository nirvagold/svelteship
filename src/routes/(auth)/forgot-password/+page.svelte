<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';

	interface Props {
		form: {
			success?: boolean;
			error?: string;
			email?: string;
		} | null;
	}

	let { form }: Props = $props();

	let loading = $state(false);
</script>

<svelte:head>
	<title>Forgot Password - Svelteship</title>
</svelte:head>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
	<div class="card bg-base-100 shadow-xl w-full max-w-md">
		<div class="card-body">
			<h1 class="card-title text-2xl justify-center mb-2">Forgot Password</h1>

			{#if form?.success}
				<!-- Success State -->
				<div class="text-center py-4">
					<div class="text-5xl mb-4">📧</div>
					<h2 class="text-lg font-semibold mb-2">Check Your Email</h2>
					<p class="text-base-content/70 mb-4">
						If an account exists with that email, we've sent password reset instructions.
					</p>
					<p class="text-sm text-base-content/50">
						Didn't receive the email? Check your spam folder or try again.
					</p>
				</div>
				<div class="divider"></div>
				<a href="/login" class="btn btn-outline w-full">Back to Login</a>
			{:else}
				<!-- Request Form -->
				<p class="text-base-content/70 text-center mb-6">
					Enter your email address and we'll send you a link to reset your password.
				</p>

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
					<div class="form-control mb-4">
						<Input
							type="email"
							name="email"
							placeholder="Enter your email"
							value={form?.email ?? ''}
							required
						/>
					</div>

					{#if form?.error}
						<div class="alert alert-error mb-4">
							<span>{form.error}</span>
						</div>
					{/if}

					<Button type="submit" variant="primary" class="w-full" disabled={loading}>
						{#if loading}
							<span class="loading loading-spinner loading-sm"></span>
							Sending...
						{:else}
							Send Reset Link
						{/if}
					</Button>
				</form>

				<div class="divider">or</div>

				<div class="text-center space-y-2">
					<a href="/login" class="link link-hover text-sm">Back to Login</a>
					<span class="text-base-content/30 mx-2">•</span>
					<a href="/register" class="link link-hover text-sm">Create Account</a>
				</div>
			{/if}
		</div>
	</div>
</div>
