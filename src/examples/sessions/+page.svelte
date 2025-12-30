<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';

	interface SessionData {
		id: string;
		userAgent: string | null;
		ipAddress: string | null;
		createdAt: Date;
		isCurrent: boolean;
	}

	interface Props {
		data: {
			sessions: SessionData[];
		};
		form: {
			success?: boolean;
			error?: string;
		} | null;
	}

	let { data, form }: Props = $props();

	let revokeLoading = $state<string | null>(null);
	let revokeAllLoading = $state(false);

	function parseUserAgent(ua: string | null): { browser: string; os: string; device: string } {
		if (!ua) return { browser: 'Unknown', os: 'Unknown', device: '💻' };

		let browser = 'Unknown';
		let os = 'Unknown';
		let device = '💻';

		// Detect browser
		if (ua.includes('Firefox')) browser = 'Firefox';
		else if (ua.includes('Edg')) browser = 'Edge';
		else if (ua.includes('Chrome')) browser = 'Chrome';
		else if (ua.includes('Safari')) browser = 'Safari';
		else if (ua.includes('Opera')) browser = 'Opera';

		// Detect OS
		if (ua.includes('Windows')) os = 'Windows';
		else if (ua.includes('Mac')) os = 'macOS';
		else if (ua.includes('Linux')) os = 'Linux';
		else if (ua.includes('Android')) {
			os = 'Android';
			device = '📱';
		} else if (ua.includes('iPhone') || ua.includes('iPad')) {
			os = 'iOS';
			device = '📱';
		}

		return { browser, os, device };
	}

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Active Sessions - Svelteship</title>
</svelte:head>

<div class="flex items-center justify-between mb-4">
	<h2 class="text-xl font-semibold">Active Sessions</h2>

	{#if data.sessions.length > 1}
		<form
			method="POST"
			action="?/revokeAll"
			use:enhance={() => {
				revokeAllLoading = true;
				return async ({ update }) => {
					await update();
					revokeAllLoading = false;
				};
			}}
		>
			<Button type="submit" variant="danger" size="sm" disabled={revokeAllLoading}>
				{#if revokeAllLoading}
					<span class="loading loading-spinner loading-sm"></span>
				{/if}
				Revoke All Other Sessions
			</Button>
		</form>
	{/if}
</div>

<p class="text-base-content/70 mb-6">
	These are the devices that are currently logged into your account. Revoke any sessions that you do
	not recognize.
</p>

{#if form?.success}
	<div class="alert alert-success mb-4">
		<span>Session(s) revoked successfully!</span>
	</div>
{/if}

{#if form?.error}
	<div class="alert alert-error mb-4">
		<span>{form.error}</span>
	</div>
{/if}

<div class="space-y-4">
	{#each data.sessions as session (session.id)}
		{@const parsed = parseUserAgent(session.userAgent)}
		<div
			class="flex items-center justify-between p-4 rounded-lg border {session.isCurrent
				? 'border-primary bg-primary/5'
				: 'border-base-300'}"
		>
			<div class="flex items-center gap-4">
				<div class="text-3xl">{parsed.device}</div>
				<div>
					<div class="font-medium flex items-center gap-2">
						{parsed.browser} on {parsed.os}
						{#if session.isCurrent}
							<span class="badge badge-primary badge-sm">Current</span>
						{/if}
					</div>
					<div class="text-sm text-base-content/60">
						{#if session.ipAddress}
							<span>IP: {session.ipAddress}</span>
							<span class="mx-2">•</span>
						{/if}
						<span>Started: {formatDate(session.createdAt)}</span>
					</div>
				</div>
			</div>

			{#if !session.isCurrent}
				<form
					method="POST"
					action="?/revoke"
					use:enhance={() => {
						revokeLoading = session.id;
						return async ({ update }) => {
							await update();
							revokeLoading = null;
						};
					}}
				>
					<input type="hidden" name="sessionId" value={session.id} />
					<Button
						type="submit"
						variant="ghost"
						size="sm"
						disabled={revokeLoading === session.id}
					>
						{#if revokeLoading === session.id}
							<span class="loading loading-spinner loading-sm"></span>
						{:else}
							Revoke
						{/if}
					</Button>
				</form>
			{/if}
		</div>
	{/each}
</div>

{#if data.sessions.length === 0}
	<div class="text-center py-8 text-base-content/60">
		<p>No active sessions found.</p>
	</div>
{/if}
