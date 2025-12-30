<script lang="ts">
	import '../app.css';
	import { ToastContainer, ConfirmDialog } from '$lib/components/ui';

	let { children } = $props();
</script>

{@render children()}

<ToastContainer />
<ConfirmDialog />
