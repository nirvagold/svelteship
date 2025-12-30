<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		data: {
			status: 'success' | 'expired' | 'invalid' | 'pending';
			email?: string;
		};
		form: {
			success?: boolean;
			error?: string;
		} | null;
	}

	let { data, form }: Props = $props();

	let loading = $state(false);
</script>

<svelte:head>
	<title>Verify Email - Svelteship</title>
</svelte:head>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
	<div class="card bg-base-100 shadow-xl w-full max-w-md">
		<div class="card-body text-center">
			{#if data.status === 'success'}
				<!-- Email Verified Successfully -->
				<div class="text-5xl mb-4">✅</div>
				<h1 class="text-2xl font-bold mb-2">Email Verified!</h1>
				<p class="text-base-content/70 mb-6">
					Your email has been successfully verified. You can now access all features.
				</p>
				<a href="/dashboard" class="btn btn-primary w-full">Go to Dashboard</a>
			{:else if data.status === 'expired'}
				<!-- Token Expired -->
				<div class="text-5xl mb-4">⏰</div>
				<h1 class="text-2xl font-bold mb-2">Link Expired</h1>
				<p class="text-base-content/70 mb-6">
					This verification link has expired. Please request a new one.
				</p>

				{#if form?.success}
					<div class="alert alert-success mb-4">
						<span>A new verification email has been sent!</span>
					</div>
				{/if}

				{#if form?.error}
					<div class="alert alert-error mb-4">
						<span>{form.error}</span>
					</div>
				{/if}

				<form
					method="POST"
					action="?/resend"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<input type="hidden" name="email" value={data.email} />
					<Button type="submit" variant="primary" class="w-full" disabled={loading}>
						{#if loading}
							<span class="loading loading-spinner loading-sm"></span>
							Sending...
						{:else}
							Resend Verification Email
						{/if}
					</Button>
				</form>
			{:else if data.status === 'invalid'}
				<!-- Invalid Token -->
				<div class="text-5xl mb-4">❌</div>
				<h1 class="text-2xl font-bold mb-2">Invalid Link</h1>
				<p class="text-base-content/70 mb-6">
					This verification link is invalid. Please check your email for the correct link or request
					a new one.
				</p>
				<a href="/login" class="btn btn-primary w-full">Go to Login</a>
			{:else}
				<!-- Pending Verification (no token provided) -->
				<div class="text-5xl mb-4">📧</div>
				<h1 class="text-2xl font-bold mb-2">Verify Your Email</h1>
				<p class="text-base-content/70 mb-6">
					We've sent a verification link to your email address. Please check your inbox and click
					the link to verify your account.
				</p>

				<div class="alert alert-info mb-4">
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
					<span>Don't forget to check your spam folder!</span>
				</div>

				{#if form?.success}
					<div class="alert alert-success mb-4">
						<span>A new verification email has been sent!</span>
					</div>
				{/if}

				{#if form?.error}
					<div class="alert alert-error mb-4">
						<span>{form.error}</span>
					</div>
				{/if}

				<form
					method="POST"
					action="?/resend"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<Button type="submit" variant="outline" class="w-full" disabled={loading}>
						{#if loading}
							<span class="loading loading-spinner loading-sm"></span>
							Sending...
						{:else}
							Resend Verification Email
						{/if}
					</Button>
				</form>
			{/if}

			<div class="divider"></div>

			<div class="text-center">
				<a href="/login" class="link link-hover text-sm">Back to Login</a>
			</div>
		</div>
	</div>
</div>
