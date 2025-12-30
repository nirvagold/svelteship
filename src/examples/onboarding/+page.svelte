<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Onboarding from './Onboarding.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Dropdown from '$lib/components/ui/Dropdown.svelte';

	interface Props {
		data: {
			user: {
				name: string | null;
				email: string;
			};
		};
		form: {
			success?: boolean;
			error?: string;
		} | null;
	}

	let { data, form: _form }: Props = $props();

	let currentStep = $state(0);
	let formRef: HTMLFormElement | null = $state(null);

	// Form data
	let name = $state(data.user.name ?? '');
	let theme = $state('system');
	let language = $state('en');
	let emailNotifications = $state(true);

	const steps = [
		{
			id: 'welcome',
			title: 'Welcome to Svelteship! 🚀',
			description: "Let's get you set up in just a few steps."
		},
		{
			id: 'profile',
			title: 'Complete Your Profile',
			description: 'Tell us a bit about yourself.'
		},
		{
			id: 'preferences',
			title: 'Set Your Preferences',
			description: 'Customize your experience.'
		},
		{
			id: 'ready',
			title: "You're All Set! 🎉",
			description: 'Your account is ready to use.'
		}
	];

	const themeOptions = [
		{ value: 'light', label: '☀️ Light' },
		{ value: 'dark', label: '🌙 Dark' },
		{ value: 'system', label: '💻 System' }
	];

	const languageOptions = [
		{ value: 'en', label: '🇺🇸 English' },
		{ value: 'id', label: '🇮🇩 Bahasa Indonesia' },
		{ value: 'es', label: '🇪🇸 Español' }
	];

	function handleComplete() {
		formRef?.requestSubmit();
	}

	function handleSkip() {
		formRef?.requestSubmit();
	}
</script>

<svelte:head>
	<title>Welcome - Svelteship</title>
</svelte:head>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
	<form
		bind:this={formRef}
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'redirect') {
					goto(result.location);
				}
			};
		}}
	>
		<input type="hidden" name="name" value={name} />
		<input type="hidden" name="theme" value={theme} />
		<input type="hidden" name="language" value={language} />
		<input type="hidden" name="emailNotifications" value={emailNotifications ? 'on' : ''} />

		<Onboarding
			{steps}
			bind:currentStep
			onComplete={handleComplete}
			onSkip={handleSkip}
		>
			{#snippet children({ step })}
				{#if step.id === 'welcome'}
					<div class="text-center py-8">
						<div class="text-6xl mb-6">👋</div>
						<p class="text-lg text-base-content/70">
							We're excited to have you here. This quick setup will help you get the most out of
							Svelteship.
						</p>
						<div class="mt-6 flex justify-center gap-4">
							<div class="badge badge-lg badge-outline">✓ Fast</div>
							<div class="badge badge-lg badge-outline">✓ Secure</div>
							<div class="badge badge-lg badge-outline">✓ Modern</div>
						</div>
					</div>
				{:else if step.id === 'profile'}
					<div class="space-y-4 max-w-sm mx-auto">
						<Input
							type="text"
							label="Display Name"
							placeholder="How should we call you?"
							bind:value={name}
						/>

						<div class="form-control">
							<label class="label" for="email-display">
								<span class="label-text">Email</span>
							</label>
							<input
								type="email"
								id="email-display"
								value={data.user.email}
								class="input input-bordered"
								disabled
							/>
							<label class="label" for="email-display">
								<span class="label-text-alt text-base-content/60">Your login email</span>
							</label>
						</div>
					</div>
				{:else if step.id === 'preferences'}
					<div class="space-y-4 max-w-sm mx-auto">
						<Dropdown
							label="Theme"
							options={themeOptions}
							bind:value={theme}
						/>

						<Dropdown
							label="Language"
							options={languageOptions}
							bind:value={language}
						/>

						<div class="form-control">
							<label class="label cursor-pointer justify-start gap-4">
								<input
									type="checkbox"
									class="checkbox checkbox-primary"
									bind:checked={emailNotifications}
								/>
								<div>
									<span class="label-text font-medium">Email Notifications</span>
									<p class="text-sm text-base-content/60">Get updates about your account</p>
								</div>
							</label>
						</div>
					</div>
				{:else if step.id === 'ready'}
					<div class="text-center py-8">
						<div class="text-6xl mb-6">🎉</div>
						<p class="text-lg text-base-content/70 mb-6">
							Your account is all set up and ready to go!
						</p>
						<div class="bg-base-200 rounded-lg p-4 text-left max-w-sm mx-auto">
							<h4 class="font-semibold mb-2">Quick tips:</h4>
							<ul class="text-sm text-base-content/70 space-y-1">
								<li>• Check out the <a href="/docs" class="link link-primary">Documentation</a></li>
								<li>• Explore <a href="/components" class="link link-primary">UI Components</a></li>
								<li>• Customize your <a href="/settings" class="link link-primary">Settings</a></li>
							</ul>
						</div>
					</div>
				{/if}
			{/snippet}
		</Onboarding>
	</form>
</div>
