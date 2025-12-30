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

	// Component states
	let modalOpen = $state(false);
	let selectedFruit = $state('');
	let activeTab = $state('tab1');
	let currentPage = $state(1);

	const fruitOptions = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'orange', label: 'Orange' }
	];

	const tabItems = [
		{ id: 'tab1', label: 'Overview' },
		{ id: 'tab2', label: 'Features' },
		{ id: 'tab3', label: 'Pricing', disabled: true }
	];

	const tableColumns = [
		{ key: 'name' as const, label: 'Name', sortable: true },
		{ key: 'email' as const, label: 'Email' },
		{ key: 'role' as const, label: 'Role' }
	];

	const tableData = [
		{ name: 'John Doe', email: 'john@example.com', role: 'Admin' },
		{ name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
	];

	const breadcrumbItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Components' }
	];

	async function handleConfirm() {
		const result = await confirm({
			title: 'Delete Item',
			message: 'Are you sure? This cannot be undone.',
			confirmLabel: 'Delete',
			variant: 'danger'
		});
		if (result) toast.success('Item deleted!');
	}
</script>

<svelte:head>
	<title>UI Components | Svelteship</title>
</svelte:head>

<div class="min-h-screen bg-base-100">
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		<Breadcrumb items={breadcrumbItems} />

		<div class="mt-4 mb-8">
			<h1 class="text-4xl font-bold">UI Components</h1>
			<p class="text-base-content/70 mt-2">
				Ready-to-use components for your Svelteship project.
			</p>
		</div>

		<!-- Button -->
		<section id="buttons" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Button</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<div class="flex flex-wrap gap-3">
					<Button variant="primary">Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="danger">Danger</Button>
					<Button variant="ghost">Ghost</Button>
					<Button loading>Loading</Button>
					<Button disabled>Disabled</Button>
				</div>
			</div>
		</section>

		<!-- Input -->
		<section id="input" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Input</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
					<Input label="Email" type="email" placeholder="you@example.com" />
					<Input label="Password" type="password" placeholder="••••••••" />
					<Input label="With Error" error="This field is required" />
					<Input label="Disabled" disabled value="Cannot edit" />
				</div>
			</div>
		</section>

		<!-- Badge -->
		<section id="badges" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Badge</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<div class="flex flex-wrap gap-3">
					<Badge variant="primary">Primary</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="success">Success</Badge>
					<Badge variant="warning">Warning</Badge>
					<Badge variant="error">Error</Badge>
					<Badge variant="info">Info</Badge>
					<Badge outline>Outline</Badge>
				</div>
			</div>
		</section>

		<!-- Spinner -->
		<section id="spinners" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Spinner</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<div class="flex items-center gap-6">
					<Spinner size="sm" />
					<Spinner size="md" />
					<Spinner size="lg" />
					<Spinner variant="primary" />
					<Spinner variant="secondary" />
				</div>
			</div>
		</section>

		<!-- Avatar -->
		<section id="avatar" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Avatar</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<div class="flex items-center gap-4">
					<Avatar name="John Doe" size="sm" />
					<Avatar name="Jane Smith" size="md" />
					<Avatar name="Bob Wilson" size="lg" />
					<Avatar name="Online" status="online" />
					<Avatar name="Offline" status="offline" />
				</div>
			</div>
		</section>

		<!-- Progress -->
		<section id="progress" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Progress</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<div class="space-y-4 max-w-md">
					<Progress value={25} showLabel />
					<Progress value={50} variant="primary" showLabel />
					<Progress value={75} variant="success" showLabel />
				</div>
			</div>
		</section>

		<!-- Skeleton -->
		<section id="skeleton" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Skeleton</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<div class="space-y-4 max-w-md">
					<Skeleton variant="text" count={3} />
					<div class="flex gap-4">
						<Skeleton variant="circle" width="48px" height="48px" />
						<div class="flex-1"><Skeleton variant="text" count={2} /></div>
					</div>
				</div>
			</div>
		</section>

		<!-- Dropdown -->
		<section id="dropdown" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Dropdown</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<div class="max-w-xs">
					<Dropdown
						label="Select fruit"
						options={fruitOptions}
						bind:value={selectedFruit}
						placeholder="Choose..."
					/>
					{#if selectedFruit}<p class="mt-2 text-sm">Selected: {selectedFruit}</p>{/if}
				</div>
			</div>
		</section>

		<!-- Tabs -->
		<section id="tabs" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Tabs</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<Tabs tabs={tabItems} bind:activeTab>
					{#if activeTab === 'tab1'}
						<p>Overview content goes here.</p>
					{:else if activeTab === 'tab2'}
						<p>Features content goes here.</p>
					{/if}
				</Tabs>
			</div>
		</section>

		<!-- Table -->
		<section id="table" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Table</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<Table columns={tableColumns} data={tableData} />
			</div>
		</section>

		<!-- Pagination -->
		<section id="pagination" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Pagination</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<Pagination totalPages={10} bind:currentPage />
				<p class="mt-2 text-sm">Current: Page {currentPage}</p>
			</div>
		</section>

		<!-- Tooltip -->
		<section id="tooltip" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Tooltip</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<div class="flex gap-4">
					<Tooltip content="Top tooltip" position="top">
						<Button variant="ghost">Top</Button>
					</Tooltip>
					<Tooltip content="Bottom tooltip" position="bottom">
						<Button variant="ghost">Bottom</Button>
					</Tooltip>
					<Tooltip content="Left tooltip" position="left">
						<Button variant="ghost">Left</Button>
					</Tooltip>
					<Tooltip content="Right tooltip" position="right">
						<Button variant="ghost">Right</Button>
					</Tooltip>
				</div>
			</div>
		</section>

		<!-- Modal -->
		<section id="modal" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Modal</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<Button onclick={() => (modalOpen = true)}>Open Modal</Button>
				<Modal bind:open={modalOpen} title="Example Modal" showCloseButton>
					<p>Modal content goes here.</p>
					{#snippet footer()}
						<Button variant="ghost" onclick={() => (modalOpen = false)}>Cancel</Button>
						<Button variant="primary" onclick={() => (modalOpen = false)}>Confirm</Button>
					{/snippet}
				</Modal>
			</div>
		</section>

		<!-- Toast -->
		<section id="toast" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Toast</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<div class="flex gap-3">
					<Button variant="primary" onclick={() => toast.success('Success!')}>Success</Button>
					<Button variant="danger" onclick={() => toast.error('Error!')}>Error</Button>
					<Button variant="ghost" onclick={() => toast.info('Info!')}>Info</Button>
				</div>
			</div>
		</section>

		<!-- Confirm Dialog -->
		<section id="confirm" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Confirm Dialog</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<Button variant="danger" onclick={handleConfirm}>Delete Item</Button>
			</div>
		</section>

		<!-- Empty State -->
		<section id="empty" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Empty State</h2>
			<div class="bg-base-200 rounded-lg p-6">
				<EmptyState
					title="No items found"
					description="Get started by creating your first item."
				>
					{#snippet action()}
						<Button variant="primary" onclick={() => toast.info('Create clicked!')}>Create Item</Button>
					{/snippet}
				</EmptyState>
			</div>
		</section>
	</div>
</div>
