<script lang="ts">
	import type { ToastMessage } from './stores/toast';
	import { toast } from './stores/toast';

	interface Props {
		data: ToastMessage;
	}

	let { data }: Props = $props();

	const variantClasses: Record<string, string> = {
		success: 'alert-success',
		error: 'alert-error',
		warning: 'alert-warning',
		info: 'alert-info'
	};

	const icons: Record<string, string> = {
		success: '✓',
		error: '✕',
		warning: '⚠',
		info: 'ℹ'
	};
</script>

<div class="alert {variantClasses[data.variant]} shadow-lg" role="alert">
	<span class="text-lg">{icons[data.variant]}</span>
	<span>{data.message}</span>
	<button class="btn btn-sm btn-ghost" onclick={() => toast.dismiss(data.id)} aria-label="Dismiss">
		✕
	</button>
</div>
