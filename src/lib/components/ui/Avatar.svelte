<script lang="ts">
	interface Props {
		src?: string;
		name?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		status?: 'online' | 'offline' | 'away' | 'busy';
		rounded?: boolean;
	}

	let { src, name, size = 'md', status, rounded = true }: Props = $props();

	let imageError = $state(false);

	const sizeClasses: Record<string, string> = {
		xs: 'w-6 h-6 text-xs',
		sm: 'w-8 h-8 text-sm',
		md: 'w-12 h-12 text-base',
		lg: 'w-16 h-16 text-lg',
		xl: 'w-24 h-24 text-xl'
	};

	const statusColors: Record<string, string> = {
		online: 'bg-success',
		offline: 'bg-base-300',
		away: 'bg-warning',
		busy: 'bg-error'
	};

	function getInitials(name: string): string {
		const parts = name.trim().split(/\s+/);
		if (parts.length >= 2) {
			return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
		}
		return name.slice(0, 2).toUpperCase();
	}

	const initials = $derived(name ? getInitials(name) : '?');
	const showImage = $derived(src && !imageError);
</script>

<div class="avatar" class:online={status === 'online'} class:offline={status === 'offline'}>
	<div
		class="{sizeClasses[size]} bg-neutral text-neutral-content flex items-center justify-center"
		class:rounded-full={rounded}
		class:rounded-lg={!rounded}
	>
		{#if showImage}
			<img {src} alt={name ?? 'Avatar'} onerror={() => (imageError = true)} />
		{:else}
			<span>{initials}</span>
		{/if}
	</div>
	{#if status}
		<span
			class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 {statusColors[status]}"
		></span>
	{/if}
</div>
