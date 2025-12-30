<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Dropdown from '$lib/components/ui/Dropdown.svelte';

	interface Props {
		data: {
			user: {
				email: string;
				name: string | null;
				preferences: {
					theme: 'light' | 'dark' | 'system';
					language: string;
					timezone: string;
					emailNotifications: boolean;
				} | null;
			};
		};
		form: {
			success?: boolean;
			error?: string;
		} | null;
	}

	let { data, form }: Props = $props();

	let loading = $state(false);
	let name = $state(data.user.name ?? '');
	let theme = $state(data.user.preferences?.theme ?? 'system');
	let language = $state(data.user.preferences?.language ?? 'en');
	let timezone = $state(data.user.preferences?.timezone ?? 'UTC');
	let emailNotifications = $state(data.user.preferences?.emailNotifications ?? true);

	const themeOptions = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
		{ value: 'system', label: 'System' }
	];

	const languageOptions = [
		{ value: 'en', label: 'English' },
		{ value: 'id', label: 'Bahasa Indonesia' },
		{ value: 'es', label: 'Español' },
		{ value: 'fr', label: 'Français' },
		{ value: 'de', label: 'Deutsch' }
	];

	const timezoneOptions = [
		{ value: 'UTC', label: 'UTC' },
		{ value: 'America/New_York', label: 'Eastern Time (US)' },
		{ value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
		{ value: 'Europe/London', label: 'London' },
		{ value: 'Europe/Paris', label: 'Paris' },
		{ value: 'Asia/Tokyo', label: 'Tokyo' },
		{ value: 'Asia/Jakarta', label: 'Jakarta' },
		{ value: 'Asia/Singapore', label: 'Singapore' }
	];
</script>

<svelte:head>
	<title>Settings - Svelteship</title>
</svelte:head>

<h2 class="text-xl font-semibold mb-4">General Settings</h2>

{#if form?.success}
	<div class="alert alert-success mb-4">
		<span>Settings saved successfully!</span>
	</div>
{/if}

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
			await update();
			loading = false;
		};
	}}
>
	<!-- Profile Section -->
	<div class="mb-8">
		<h3 class="text-lg font-medium mb-4">Profile</h3>

		<div class="grid gap-4">
			<div class="form-control">
				<label class="label" for="email">
					<span class="label-text">Email</span>
				</label>
				<input
					type="email"
					id="email"
					value={data.user.email}
					class="input input-bordered"
					disabled
				/>
				<label class="label" for="email">
					<span class="label-text-alt text-base-content/60">Email cannot be changed</span>
				</label>
			</div>

			<Input type="text" name="name" label="Display Name" placeholder="Your name" bind:value={name} />
		</div>
	</div>

	<!-- Preferences Section -->
	<div class="mb-8">
		<h3 class="text-lg font-medium mb-4">Preferences</h3>

		<div class="grid gap-4 sm:grid-cols-2">
			<Dropdown
				name="theme"
				label="Theme"
				options={themeOptions}
				bind:value={theme}
			/>

			<Dropdown
				name="language"
				label="Language"
				options={languageOptions}
				bind:value={language}
			/>

			<Dropdown
				name="timezone"
				label="Timezone"
				options={timezoneOptions}
				bind:value={timezone}
			/>
		</div>
	</div>

	<!-- Notifications Section -->
	<div class="mb-8">
		<h3 class="text-lg font-medium mb-4">Notifications</h3>

		<div class="form-control">
			<label class="label cursor-pointer justify-start gap-4">
				<input
					type="checkbox"
					name="emailNotifications"
					class="checkbox checkbox-primary"
					bind:checked={emailNotifications}
				/>
				<div>
					<span class="label-text font-medium">Email Notifications</span>
					<p class="text-sm text-base-content/60">Receive email notifications for important updates</p>
				</div>
			</label>
		</div>
	</div>

	<!-- Submit Button -->
	<div class="flex justify-end">
		<Button type="submit" variant="primary" disabled={loading}>
			{#if loading}
				<span class="loading loading-spinner loading-sm"></span>
				Saving...
			{:else}
				Save Changes
			{/if}
		</Button>
	</div>
</form>
