<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';

	interface Props {
		data: {
			user: {
				email: string;
				emailVerified: boolean;
			};
		};
		form: {
			success?: boolean;
			error?: string;
			action?: 'password' | 'delete';
		} | null;
	}

	let { data, form }: Props = $props();

	let passwordLoading = $state(false);
	let deleteLoading = $state(false);
	let showDeleteModal = $state(false);

	// Password form
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	// Delete form
	let deletePassword = $state('');
	let deleteConfirmText = $state('');

	const passwordsMatch = $derived(newPassword === confirmPassword);
	const passwordValid = $derived(newPassword.length >= 8);
	const canDelete = $derived(deleteConfirmText === 'DELETE' && deletePassword.length > 0);

	function resetPasswordForm() {
		currentPassword = '';
		newPassword = '';
		confirmPassword = '';
	}

	function resetDeleteForm() {
		deletePassword = '';
		deleteConfirmText = '';
		showDeleteModal = false;
	}
</script>

<svelte:head>
	<title>Security Settings - Svelteship</title>
</svelte:head>

<h2 class="text-xl font-semibold mb-4">Security Settings</h2>

<!-- Email Verification Status -->
<div class="mb-8">
	<h3 class="text-lg font-medium mb-4">Email Verification</h3>
	<div class="flex items-center gap-3">
		{#if data.user.emailVerified}
			<span class="badge badge-success gap-1">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
				Verified
			</span>
			<span class="text-base-content/70">{data.user.email}</span>
		{:else}
			<span class="badge badge-warning gap-1">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
				Not Verified
			</span>
			<a href="/verify-email" class="link link-primary text-sm">Verify now</a>
		{/if}
	</div>
</div>

<div class="divider"></div>

<!-- Change Password Section -->
<div class="mb-8">
	<h3 class="text-lg font-medium mb-4">Change Password</h3>

	{#if form?.success && form?.action === 'password'}
		<div class="alert alert-success mb-4">
			<span>Password changed successfully! All other sessions have been logged out.</span>
		</div>
	{/if}

	{#if form?.error && form?.action === 'password'}
		<div class="alert alert-error mb-4">
			<span>{form.error}</span>
		</div>
	{/if}

	<form
		method="POST"
		action="?/changePassword"
		use:enhance={() => {
			passwordLoading = true;
			return async ({ update, result }) => {
				await update();
				passwordLoading = false;
				if (result.type === 'success') {
					resetPasswordForm();
				}
			};
		}}
	>
		<div class="grid gap-4 max-w-md">
			<Input
				type="password"
				name="currentPassword"
				label="Current Password"
				placeholder="Enter current password"
				bind:value={currentPassword}
				required
			/>

			<Input
				type="password"
				name="newPassword"
				label="New Password"
				placeholder="Enter new password"
				bind:value={newPassword}
				required
				minlength={8}
				error={newPassword && !passwordValid ? 'Password must be at least 8 characters' : ''}
			/>

			<Input
				type="password"
				name="confirmPassword"
				label="Confirm New Password"
				placeholder="Confirm new password"
				bind:value={confirmPassword}
				required
				error={confirmPassword && !passwordsMatch ? 'Passwords do not match' : ''}
			/>

			<div>
				<Button
					type="submit"
					variant="primary"
					disabled={passwordLoading || !passwordValid || !passwordsMatch || !currentPassword}
				>
					{#if passwordLoading}
						<span class="loading loading-spinner loading-sm"></span>
						Changing...
					{:else}
						Change Password
					{/if}
				</Button>
			</div>
		</div>
	</form>
</div>

<div class="divider"></div>

<!-- Delete Account Section -->
<div>
	<h3 class="text-lg font-medium mb-2 text-error">Danger Zone</h3>
	<p class="text-base-content/70 mb-4">
		Once you delete your account, there is no going back. Please be certain.
	</p>

	<Button variant="danger" onclick={() => (showDeleteModal = true)}>
		Delete Account
	</Button>
</div>

<!-- Delete Account Modal -->
<Modal
	open={showDeleteModal}
	title="Delete Account"
	onclose={() => resetDeleteForm()}
>
	<div class="py-2">
		<div class="alert alert-warning mb-4">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
			<span>This action cannot be undone. All your data will be permanently deleted.</span>
		</div>

		{#if form?.error && form?.action === 'delete'}
			<div class="alert alert-error mb-4">
				<span>{form.error}</span>
			</div>
		{/if}

		<form
			method="POST"
			action="?/deleteAccount"
			use:enhance={() => {
				deleteLoading = true;
				return async ({ update }) => {
					await update();
					deleteLoading = false;
				};
			}}
		>
			<div class="grid gap-4">
				<Input
					type="password"
					name="password"
					label="Enter your password to confirm"
					placeholder="Your password"
					bind:value={deletePassword}
					required
				/>

				<div class="form-control">
					<label class="label" for="confirmDelete">
						<span class="label-text">Type <strong>DELETE</strong> to confirm</span>
					</label>
					<input
						type="text"
						id="confirmDelete"
						name="confirmText"
						class="input input-bordered"
						placeholder="DELETE"
						bind:value={deleteConfirmText}
						required
					/>
				</div>

				<div class="flex gap-2 justify-end">
					<Button variant="ghost" onclick={() => resetDeleteForm()}>
						Cancel
					</Button>
					<Button type="submit" variant="danger" disabled={deleteLoading || !canDelete}>
						{#if deleteLoading}
							<span class="loading loading-spinner loading-sm"></span>
							Deleting...
						{:else}
							Delete My Account
						{/if}
					</Button>
				</div>
			</div>
		</form>
	</div>
</Modal>
