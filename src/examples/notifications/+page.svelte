<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';

	interface NotificationData {
		id: string;
		title: string;
		message: string;
		type: 'info' | 'success' | 'warning' | 'error';
		read: boolean;
		link: string | null;
		createdAt: Date;
	}

	interface Props {
		data: {
			notifications: NotificationData[];
			unreadCount: number;
		};
		form: {
			success?: boolean;
			error?: string;
		} | null;
	}

	let { data, form }: Props = $props();

	let actionLoading = $state<string | null>(null);
	let markAllLoading = $state(false);

	const typeIcons: Record<string, string> = {
		info: 'ℹ️',
		success: '✅',
		warning: '⚠️',
		error: '❌'
	};

	const typeClasses: Record<string, string> = {
		info: 'border-info',
		success: 'border-success',
		warning: 'border-warning',
		error: 'border-error'
	};

	function formatDate(date: Date): string {
		const now = new Date();
		const d = new Date(date);
		const diffMs = now.getTime() - d.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;

		return d.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
		});
	}
</script>

<svelte:head>
	<title>Notifications - Svelteship</title>
</svelte:head>

<div>
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-3xl font-bold">Notifications</h1>
			{#if data.unreadCount > 0}
				<p class="text-base-content/70">{data.unreadCount} unread</p>
			{/if}
		</div>

		{#if data.notifications.length > 0 && data.unreadCount > 0}
			<form
				method="POST"
				action="?/markAllRead"
				use:enhance={() => {
					markAllLoading = true;
					return async ({ update }) => {
						await update();
						markAllLoading = false;
					};
				}}
			>
				<Button type="submit" variant="ghost" size="sm" disabled={markAllLoading}>
					{#if markAllLoading}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					Mark all as read
				</Button>
			</form>
		{/if}
	</div>

	{#if form?.success}
		<div class="alert alert-success mb-4">
			<span>Action completed successfully!</span>
		</div>
	{/if}

	{#if form?.error}
		<div class="alert alert-error mb-4">
			<span>{form.error}</span>
		</div>
	{/if}

	{#if data.notifications.length === 0}
		<div class="card bg-base-100 shadow-md">
			<div class="card-body text-center py-12">
				<div class="text-5xl mb-4">🔔</div>
				<h2 class="text-xl font-semibold mb-2">No notifications</h2>
				<p class="text-base-content/70">You're all caught up! Check back later for updates.</p>
			</div>
		</div>
	{:else}
		<div class="space-y-3">
			{#each data.notifications as notification (notification.id)}
				<div
					class="card bg-base-100 shadow-sm border-l-4 {typeClasses[notification.type]}"
					class:opacity-60={notification.read}
				>
					<div class="card-body p-4">
						<div class="flex items-start gap-3">
							<span class="text-xl">{typeIcons[notification.type]}</span>

							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2 mb-1">
									<h3 class="font-semibold" class:font-normal={notification.read}>
										{notification.title}
									</h3>
									{#if !notification.read}
										<span class="badge badge-primary badge-xs">New</span>
									{/if}
								</div>

								<p class="text-base-content/70 text-sm mb-2">{notification.message}</p>

								<div class="flex items-center gap-4 text-xs text-base-content/50">
									<span>{formatDate(notification.createdAt)}</span>

									{#if notification.link}
										<a href={notification.link} class="link link-primary">View details →</a>
									{/if}
								</div>
							</div>

							<div class="flex gap-1">
								{#if !notification.read}
									<form
										method="POST"
										action="?/markRead"
										use:enhance={() => {
											actionLoading = `read-${notification.id}`;
											return async ({ update }) => {
												await update();
												actionLoading = null;
											};
										}}
									>
										<input type="hidden" name="id" value={notification.id} />
										<button
											type="submit"
											class="btn btn-ghost btn-xs"
											title="Mark as read"
											disabled={actionLoading === `read-${notification.id}`}
										>
											{#if actionLoading === `read-${notification.id}`}
												<span class="loading loading-spinner loading-xs"></span>
											{:else}
												✓
											{/if}
										</button>
									</form>
								{/if}

								<form
									method="POST"
									action="?/delete"
									use:enhance={() => {
										actionLoading = `delete-${notification.id}`;
										return async ({ update }) => {
											await update();
											actionLoading = null;
										};
									}}
								>
									<input type="hidden" name="id" value={notification.id} />
									<button
										type="submit"
										class="btn btn-ghost btn-xs text-error"
										title="Delete"
										disabled={actionLoading === `delete-${notification.id}`}
									>
										{#if actionLoading === `delete-${notification.id}`}
											<span class="loading loading-spinner loading-xs"></span>
										{:else}
											×
										{/if}
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
