<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let nameValue = $derived(data.user.name || '');
	let loading = $state(false);
	let uploadLoading = $state(false);
	let activeTab = $state<'info' | 'avatar'>('info');
	let previewUrl = $state<string | null>(null);
	let selectedFile = $state<File | null>(null);
	let showEditModal = $state(false);
	let fileInputRef = $state<HTMLInputElement | null>(null);

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			selectedFile = file;
			previewUrl = URL.createObjectURL(file);
		}
	}

	function clearPreview() {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		previewUrl = null;
		selectedFile = null;
		if (fileInputRef) {
			fileInputRef.value = '';
		}
	}

	function openEditModal() {
		showEditModal = true;
	}

	function closeEditModal() {
		showEditModal = false;
		clearPreview();
	}

	function triggerFileInput() {
		fileInputRef?.click();
	}

	// Get user initials for avatar placeholder
	function getInitials(name: string | null, email: string): string {
		if (name) {
			return name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()
				.slice(0, 2);
		}
		return email[0].toUpperCase();
	}
</script>

<svelte:head>
	<title>Profile | Svelteship</title>
</svelte:head>

<div>
	<!-- Page Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-2">Profile</h1>
		<p class="text-base-content/70">Manage your account information.</p>
	</div>

	<!-- Profile Card with Avatar -->
	<div class="card bg-base-100 shadow-lg mb-6">
		<div class="card-body">
			<div class="flex flex-col sm:flex-row items-center gap-6">
				<!-- Avatar with Edit Button -->
				<div class="relative">
					<div class="avatar placeholder">
						<div
							class="bg-primary text-primary-content w-24 h-24 rounded-full flex items-center justify-center"
						>
							{#if data.user.avatarUrl}
								<img
									src={data.user.avatarUrl}
									alt="Profile"
									class="w-full h-full rounded-full object-cover"
								/>
							{:else}
								<span class="text-3xl">{getInitials(data.user.name, data.user.email)}</span>
							{/if}
						</div>
					</div>
					<!-- Edit Button Overlay -->
					<button
						type="button"
						class="absolute bottom-0 right-0 btn btn-circle btn-sm btn-primary"
						onclick={openEditModal}
						title="Edit photo"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-4 h-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
							/>
						</svg>
					</button>
				</div>
				<!-- User Info -->
				<div class="text-center sm:text-left">
					<h2 class="text-xl font-semibold">{data.user.name || 'User'}</h2>
					<p class="text-base-content/70">{data.user.email}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Tabs -->
	<div role="tablist" class="tabs tabs-boxed mb-6 w-fit">
		<button
			role="tab"
			class="tab {activeTab === 'info' ? 'tab-active' : ''}"
			onclick={() => (activeTab = 'info')}
		>
			Account Info
		</button>
		<button
			role="tab"
			class="tab {activeTab === 'avatar' ? 'tab-active' : ''}"
			onclick={() => (activeTab = 'avatar')}
		>
			Profile Photo
		</button>
	</div>

	<!-- Tab Content -->
	{#if activeTab === 'info'}
		<!-- Two Column Layout for Account Info -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- User Info Card (Left) -->
			<div class="card bg-base-100 shadow-lg h-fit">
				<div class="card-body">
					<h2 class="card-title mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
							/>
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

			<!-- Update Profile Form (Right) -->
			<div class="card bg-base-100 shadow-lg h-fit">
				<div class="card-body">
					<h2 class="card-title mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
							/>
						</svg>
						Update Profile
					</h2>

					{#if form?.success}
						<div class="alert alert-success mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Profile updated successfully!</span>
						</div>
					{/if}

					{#if form?.error}
						<div class="alert alert-error mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>{form.error}</span>
						</div>
					{/if}

					<form
						method="POST"
						action="?/updateProfile"
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
									value={nameValue}
									placeholder="Enter your name"
									class="input input-bordered w-full"
									maxlength="100"
								/>
								<p class="label">
									<span class="label-text-alt text-base-content/60">Max 100 characters</span>
								</p>
							</div>

							<div class="pt-4">
								<button type="submit" class="btn btn-primary" disabled={loading}>
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
	{:else}
		<!-- Avatar Upload Tab -->
		<div class="card bg-base-100 shadow-lg max-w-xl">
			<div class="card-body">
				<h2 class="card-title mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
						/>
					</svg>
					Profile Photo
				</h2>

				{#if form?.avatarSuccess}
					<div class="alert alert-success mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 shrink-0 stroke-current"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>Profile photo updated successfully!</span>
					</div>
				{/if}

				{#if form?.avatarError}
					<div class="alert alert-error mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 shrink-0 stroke-current"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>{form.avatarError}</span>
					</div>
				{/if}

				<!-- Current Avatar -->
				<div class="flex flex-col items-center mb-6">
					<div class="avatar placeholder mb-4">
						<div
							class="bg-primary text-primary-content w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center"
						>
							{#if data.user.avatarUrl}
								<img
									src={data.user.avatarUrl}
									alt="Profile"
									class="w-full h-full rounded-full object-cover"
								/>
							{:else}
								<span class="text-4xl">{getInitials(data.user.name, data.user.email)}</span>
							{/if}
						</div>
					</div>
					<button type="button" class="btn btn-primary btn-sm" onclick={openEditModal}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-4 h-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
							/>
						</svg>
						Change Photo
					</button>
				</div>

				{#if data.user.avatarUrl}
					<div class="flex justify-center">
						<form
							method="POST"
							action="?/removeAvatar"
							use:enhance={() => {
								uploadLoading = true;
								return async ({ update }) => {
									uploadLoading = false;
									await update();
								};
							}}
						>
							<button
								type="submit"
								class="btn btn-error btn-outline btn-sm"
								disabled={uploadLoading}
							>
								Remove Photo
							</button>
						</form>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>


<!-- Edit Photo Modal -->
{#if showEditModal}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg mb-4">Edit Profile Photo</h3>

			<!-- Preview Avatar -->
			<div class="flex justify-center mb-6">
				<div class="avatar placeholder">
					<div
						class="bg-primary text-primary-content w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center"
					>
						{#if previewUrl}
							<img
								src={previewUrl}
								alt="Preview"
								class="w-full h-full rounded-full object-cover"
							/>
						{:else if data.user.avatarUrl}
							<img
								src={data.user.avatarUrl}
								alt="Profile"
								class="w-full h-full rounded-full object-cover"
							/>
						{:else}
							<span class="text-4xl">{getInitials(data.user.name, data.user.email)}</span>
						{/if}
					</div>
				</div>
			</div>

			<form
				method="POST"
				action="?/uploadAvatar"
				enctype="multipart/form-data"
				use:enhance={() => {
					uploadLoading = true;
					return async ({ update }) => {
						uploadLoading = false;
						closeEditModal();
						await update();
					};
				}}
			>
				<!-- Hidden file input -->
				<input
					type="file"
					bind:this={fileInputRef}
					name="avatar"
					accept="image/jpeg,image/png,image/webp"
					class="hidden"
					onchange={handleFileSelect}
				/>

				<!-- Choose File Button -->
				<div class="flex flex-col items-center gap-4">
					<button type="button" class="btn btn-outline w-full" onclick={triggerFileInput}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
							/>
						</svg>
						Choose File
					</button>

					{#if selectedFile}
						<p class="text-sm text-base-content/70">
							Selected: {selectedFile.name}
						</p>
					{/if}

					<p class="text-xs text-base-content/60 text-center">
						Accepted formats: JPG, PNG, WebP. Max size: 2MB
					</p>
				</div>

				<!-- Modal Actions -->
				<div class="modal-action">
					<button type="button" class="btn btn-ghost" onclick={closeEditModal}>Cancel</button>
					<button type="submit" class="btn btn-primary" disabled={uploadLoading || !selectedFile}>
						{#if uploadLoading}
							<span class="loading loading-spinner loading-sm"></span>
						{/if}
						Save
					</button>
				</div>
			</form>
		</div>
		<button
			type="button"
			class="modal-backdrop bg-black/50"
			onclick={closeEditModal}
			aria-label="Close modal"
		></button>
	</div>
{/if}
