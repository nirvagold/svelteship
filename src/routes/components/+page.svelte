<script lang="ts">
	import {
		Button,
		Input,
		Modal,
		Dropdown,
		Spinner,
		Badge,
		Avatar,
		Tabs,
		Table,
		Tooltip,
		Progress,
		Skeleton,
		Pagination,
		Breadcrumb,
		EmptyState
	} from '$lib/components/ui';
	import { toast } from '$lib/components/ui/stores/toast';
	import { confirm } from '$lib/components/ui/stores/confirm';

	// Modal state
	let modalOpen = $state(false);

	// Dropdown state
	let selectedFruit = $state('');
	const fruitOptions = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'orange', label: 'Orange' },
		{ value: 'grape', label: 'Grape' }
	];

	// Tabs state
	let activeTab = $state('tab1');
	const tabItems = [
		{ id: 'tab1', label: 'Overview' },
		{ id: 'tab2', label: 'Features' },
		{ id: 'tab3', label: 'Pricing', disabled: true }
	];

	// Table data
	const tableColumns = [
		{ key: 'name' as const, label: 'Name', sortable: true },
		{ key: 'email' as const, label: 'Email', sortable: true },
		{ key: 'role' as const, label: 'Role' }
	];
	const tableData = [
		{ name: 'John Doe', email: 'john@example.com', role: 'Admin' },
		{ name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
		{ name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor' }
	];

	// Pagination state
	let currentPage = $state(1);

	// Breadcrumb items
	const breadcrumbItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Components', href: '/components' },
		{ label: 'Showcase' }
	];

	// Toast handlers
	function showSuccessToast() {
		toast.success('Operation successful!');
	}
	function showErrorToast() {
		toast.error('Something went wrong!');
	}

	// Confirm handler
	async function handleDelete() {
		const confirmed = await confirm({
			title: 'Delete Item',
			message: 'Are you sure you want to delete this item? This action cannot be undone.',
			confirmLabel: 'Delete',
			cancelLabel: 'Cancel',
			variant: 'danger'
		});
		if (confirmed) {
			toast.success('Item deleted!');
		}
	}
</script>

<svelte:head>
	<title>UI Components | Svelteship</title>
</svelte:head>

<div class="container mx-auto p-8 max-w-6xl">
	<h1 class="text-4xl font-bold mb-2">UI Components</h1>
	<p class="text-base-content/70 mb-8">Interactive showcase of all available components.</p>

	<Breadcrumb items={breadcrumbItems} />

	<!-- Buttons -->
	<section class="mb-12 mt-8">
		<h2 class="text-2xl font-semibold mb-4">Buttons</h2>
		<div class="flex flex-wrap gap-3">
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="danger">Danger</Button>
			<Button variant="ghost">Ghost</Button>
			<Button disabled>Disabled</Button>
			<Button loading>Loading</Button>
		</div>
		<div class="flex flex-wrap gap-3 mt-4">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
	</section>

	<!-- Input -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Input</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
			<Input label="Username" placeholder="Enter username" />
			<Input label="Email" type="email" placeholder="you@example.com" />
			<Input label="Password" type="password" placeholder="••••••••" />
			<Input label="With Error" error="This field is required" />
			<Input label="Disabled" disabled value="Cannot edit" />
		</div>
	</section>

	<!-- Badges -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Badges</h2>
		<div class="flex flex-wrap gap-3">
			<Badge>Default</Badge>
			<Badge variant="primary">Primary</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge variant="accent">Accent</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="error">Error</Badge>
			<Badge variant="info">Info</Badge>
		</div>
		<div class="flex flex-wrap gap-3 mt-4">
			<Badge size="sm">Small</Badge>
			<Badge size="md">Medium</Badge>
			<Badge size="lg">Large</Badge>
			<Badge outline>Outline</Badge>
		</div>
	</section>

	<!-- Spinners -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Spinners</h2>
		<div class="flex flex-wrap items-center gap-6">
			<Spinner size="xs" />
			<Spinner size="sm" />
			<Spinner size="md" />
			<Spinner size="lg" />
			<Spinner variant="primary" />
			<Spinner variant="secondary" />
			<Spinner variant="accent" />
		</div>
	</section>

	<!-- Avatar -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Avatar</h2>
		<div class="flex flex-wrap items-center gap-4">
			<Avatar name="John Doe" size="xs" />
			<Avatar name="Jane Smith" size="sm" />
			<Avatar name="Bob Wilson" size="md" />
			<Avatar name="Alice Brown" size="lg" />
			<Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" name="Felix" />
			<Avatar name="Online User" status="online" />
			<Avatar name="Offline User" status="offline" />
		</div>
	</section>

	<!-- Progress -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Progress</h2>
		<div class="space-y-4 max-w-md">
			<Progress value={25} showLabel />
			<Progress value={50} variant="primary" showLabel />
			<Progress value={75} variant="secondary" showLabel />
			<Progress value={100} variant="success" showLabel />
		</div>
	</section>

	<!-- Skeleton -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Skeleton</h2>
		<div class="space-y-4 max-w-md">
			<Skeleton variant="text" count={3} />
			<Skeleton variant="circle" width="64px" height="64px" />
			<Skeleton variant="rectangle" height="100px" />
		</div>
	</section>

	<!-- Dropdown -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Dropdown</h2>
		<div class="max-w-xs">
			<Dropdown
				label="Select a fruit"
				options={fruitOptions}
				bind:value={selectedFruit}
				placeholder="Choose one..."
			/>
			{#if selectedFruit}
				<p class="mt-2 text-sm">Selected: {selectedFruit}</p>
			{/if}
		</div>
	</section>

	<!-- Tabs -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Tabs</h2>
		<Tabs tabs={tabItems} bind:activeTab>
			{#if activeTab === 'tab1'}
				<p>This is the overview content.</p>
			{:else if activeTab === 'tab2'}
				<p>Here are the features of Svelteship.</p>
			{:else}
				<p>Pricing information goes here.</p>
			{/if}
		</Tabs>
	</section>

	<!-- Table -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Table</h2>
		<Table columns={tableColumns} data={tableData} />
	</section>

	<!-- Pagination -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Pagination</h2>
		<Pagination totalPages={10} bind:currentPage />
		<p class="mt-2 text-sm">Current page: {currentPage}</p>
	</section>

	<!-- Tooltip -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Tooltip</h2>
		<div class="flex flex-wrap gap-4">
			<Tooltip content="Top tooltip" position="top">
				<Button variant="ghost">Hover me (top)</Button>
			</Tooltip>
			<Tooltip content="Bottom tooltip" position="bottom">
				<Button variant="ghost">Hover me (bottom)</Button>
			</Tooltip>
			<Tooltip content="Left tooltip" position="left">
				<Button variant="ghost">Hover me (left)</Button>
			</Tooltip>
			<Tooltip content="Right tooltip" position="right">
				<Button variant="ghost">Hover me (right)</Button>
			</Tooltip>
		</div>
	</section>

	<!-- Modal -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Modal</h2>
		<Button onclick={() => (modalOpen = true)}>Open Modal</Button>
		<Modal bind:open={modalOpen} title="Example Modal" showCloseButton>
			<p>This is the modal content. You can put anything here.</p>
			{#snippet footer()}
				<Button variant="ghost" onclick={() => (modalOpen = false)}>Cancel</Button>
				<Button variant="primary" onclick={() => (modalOpen = false)}>Confirm</Button>
			{/snippet}
		</Modal>
	</section>

	<!-- Toast -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Toast</h2>
		<div class="flex flex-wrap gap-3">
			<Button variant="primary" onclick={showSuccessToast}>Show Success Toast</Button>
			<Button variant="danger" onclick={showErrorToast}>Show Error Toast</Button>
		</div>
	</section>

	<!-- Confirm Dialog -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Confirm Dialog</h2>
		<Button variant="danger" onclick={handleDelete}>Delete Item (with confirm)</Button>
	</section>

	<!-- Empty State -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-4">Empty State</h2>
		<EmptyState
			title="No items found"
			description="Get started by creating your first item."
		>
			{#snippet action()}
				<Button variant="primary" onclick={() => toast.info('Create clicked!')}>Create Item</Button>
			{/snippet}
		</EmptyState>
	</section>
</div>
