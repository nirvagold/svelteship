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

	// Code examples
	const scriptEnd = '<' + '/script>';
	const code = {
		button: `<script>
  import { Button } from '$lib/components/ui';
${scriptEnd}

<Button variant="primary">Click me</Button>
<Button variant="danger" onclick={() => handleDelete()}>Delete</Button>
<Button loading>Saving...</Button>`,

		input: `<script>
  import { Input } from '$lib/components/ui';
  let email = $state('');
${scriptEnd}

<Input label="Email" type="email" bind:value={email} />
<Input label="Password" type="password" error={errors.password} />`,

		badge: `<script>
  import { Badge } from '$lib/components/ui';
${scriptEnd}

<Badge variant="success">Active</Badge>
<Badge variant="error">Expired</Badge>
<Badge outline>Draft</Badge>`,

		spinner: `<script>
  import { Spinner } from '$lib/components/ui';
${scriptEnd}

{#if loading}
  <Spinner size="lg" />
{:else}
  <Content />
{/if}`,

		avatar: `<script>
  import { Avatar } from '$lib/components/ui';
${scriptEnd}

<Avatar name="John Doe" />
<Avatar src={user.avatarUrl} name={user.name} size="lg" />
<Avatar name="Active User" status="online" />`,

		progress: `<script>
  import { Progress } from '$lib/components/ui';
  let progress = $state(0);
${scriptEnd}

<Progress value={progress} max={100} showLabel />
<Progress value={75} variant="success" />`,

		skeleton: `<script>
  import { Skeleton } from '$lib/components/ui';
${scriptEnd}

{#if loading}
  <Skeleton variant="text" count={3} />
  <Skeleton variant="circle" width="64px" height="64px" />
{:else}
  <ActualContent />
{/if}`,

		dropdown: `<script>
  import { Dropdown } from '$lib/components/ui';
  let selected = $state('');
  
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' }
  ];
${scriptEnd}

<Dropdown label="Select fruit" options={options} bind:value={selected} />`,

		tabs: `<script>
  import { Tabs } from '$lib/components/ui';
  let activeTab = $state('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' }
  ];
${scriptEnd}

<Tabs tabs={tabs} bind:activeTab>
  {#if activeTab === 'overview'}
    <OverviewContent />
  {/if}
</Tabs>`,

		table: `<script>
  import { Table } from '$lib/components/ui';
  
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' }
  ];
  
  const data = [
    { name: 'John', email: 'john@example.com' }
  ];
${scriptEnd}

<Table columns={columns} data={data} />`,

		pagination: `<script>
  import { Pagination } from '$lib/components/ui';
  let currentPage = $state(1);
${scriptEnd}

<Pagination totalPages={10} bind:currentPage onchange={(page) => fetchData(page)} />`,

		tooltip: `<script>
  import { Tooltip, Button } from '$lib/components/ui';
${scriptEnd}

<Tooltip content="Click to save" position="top">
  <Button>Save</Button>
</Tooltip>`,

		modal: `<script>
  import { Modal, Button } from '$lib/components/ui';
  let open = $state(false);
${scriptEnd}

<Button onclick={() => (open = true)}>Open</Button>

<Modal bind:open title="Confirm" showCloseButton>
  <p>Are you sure?</p>
  
  {#snippet footer()}
    <Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
    <Button variant="primary">Confirm</Button>
  {/snippet}
</Modal>`,

		toast: `<script>
  import { toast } from '$lib/components/ui/stores/toast';
${scriptEnd}

// Toast methods:
toast.success('Operation completed!');
toast.error('Something went wrong');
toast.warning('Please check your input');
toast.info('New update available');

// Note: Add <ToastContainer /> in your root layout`,

		confirm: `<script>
  import { confirm } from '$lib/components/ui/stores/confirm';
  import { toast } from '$lib/components/ui/stores/toast';
  
  async function handleDelete() {
    const confirmed = await confirm({
      title: 'Delete Item',
      message: 'Are you sure? This cannot be undone.',
      confirmLabel: 'Delete',
      variant: 'danger'
    });
    
    if (confirmed) {
      toast.success('Item deleted!');
    }
  }
${scriptEnd}

// Note: Add <ConfirmDialog /> in your root layout`,

		empty: `<script>
  import { EmptyState, Button } from '$lib/components/ui';
${scriptEnd}

{#if items.length === 0}
  <EmptyState
    title="No items found"
    description="Get started by creating your first item."
  >
    {#snippet action()}
      <Button variant="primary">Create Item</Button>
    {/snippet}
  </EmptyState>
{:else}
  <ItemsList {items} />
{/if}`
	};
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
			<div class="bg-base-200 rounded-lg p-6 mb-4">
				<div class="flex flex-wrap gap-3">
					<Button variant="primary">Primary</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="danger">Danger</Button>
					<Button variant="ghost">Ghost</Button>
					<Button loading>Loading</Button>
					<Button disabled>Disabled</Button>
				</div>
			</div>
			<div class="mockup-code text-sm"><pre><code>{code.button}</code></pre></div>
		</section>

		<!-- Input -->
		<section id="input" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Input</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
					<Input label="Email" type="email" placeholder="you@example.com" />
					<Input label="Password" type="password" placeholder="••••••••" />
					<Input label="With Error" error="This field is required" />
					<Input label="Disabled" disabled value="Cannot edit" />
				</div>
			</div>
			<div class="mockup-code text-sm"><pre><code>{code.input}</code></pre></div>
		</section>

		<!-- Badge -->
		<section id="badges" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Badge</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
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
			<div class="mockup-code text-sm"><pre><code>{code.badge}</code></pre></div>
		</section>

		<!-- Spinner -->
		<section id="spinners" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Spinner</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
				<div class="flex items-center gap-6">
					<Spinner size="sm" />
					<Spinner size="md" />
					<Spinner size="lg" />
					<Spinner variant="primary" />
					<Spinner variant="secondary" />
				</div>
			</div>
			<div class="mockup-code text-sm"><pre><code>{code.spinner}</code></pre></div>
		</section>

		<!-- Avatar -->
		<section id="avatar" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Avatar</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
				<div class="flex items-center gap-4">
					<Avatar name="John Doe" size="sm" />
					<Avatar name="Jane Smith" size="md" />
					<Avatar name="Bob Wilson" size="lg" />
					<Avatar name="Online" status="online" />
					<Avatar name="Offline" status="offline" />
				</div>
			</div>
			<div class="mockup-code text-sm"><pre><code>{code.avatar}</code></pre></div>
		</section>

		<!-- Progress -->
		<section id="progress" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Progress</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
				<div class="space-y-4 max-w-md">
					<Progress value={25} showLabel />
					<Progress value={50} variant="primary" showLabel />
					<Progress value={75} variant="success" showLabel />
				</div>
			</div>
			<div class="mockup-code text-sm"><pre><code>{code.progress}</code></pre></div>
		</section>

		<!-- Skeleton -->
		<section id="skeleton" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Skeleton</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
				<div class="space-y-4 max-w-md">
					<Skeleton variant="text" count={3} />
					<div class="flex gap-4">
						<Skeleton variant="circle" width="48px" height="48px" />
						<div class="flex-1"><Skeleton variant="text" count={2} /></div>
					</div>
				</div>
			</div>
			<div class="mockup-code text-sm"><pre><code>{code.skeleton}</code></pre></div>
		</section>

		<!-- Dropdown -->
		<section id="dropdown" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Dropdown</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
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
			<div class="mockup-code text-sm"><pre><code>{code.dropdown}</code></pre></div>
		</section>

		<!-- Tabs -->
		<section id="tabs" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Tabs</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
				<Tabs tabs={tabItems} bind:activeTab>
					{#if activeTab === 'tab1'}
						<p>Overview content goes here.</p>
					{:else if activeTab === 'tab2'}
						<p>Features content goes here.</p>
					{/if}
				</Tabs>
			</div>
			<div class="mockup-code text-sm"><pre><code>{code.tabs}</code></pre></div>
		</section>

		<!-- Table -->
		<section id="table" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Table</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
				<Table columns={tableColumns} data={tableData} />
			</div>
			<div class="mockup-code text-sm"><pre><code>{code.table}</code></pre></div>
		</section>

		<!-- Pagination -->
		<section id="pagination" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Pagination</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
				<Pagination totalPages={10} bind:currentPage />
				<p class="mt-2 text-sm">Current: Page {currentPage}</p>
			</div>
			<div class="mockup-code text-sm"><pre><code>{code.pagination}</code></pre></div>
		</section>

		<!-- Tooltip -->
		<section id="tooltip" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Tooltip</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
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
			<div class="mockup-code text-sm"><pre><code>{code.tooltip}</code></pre></div>
		</section>

		<!-- Modal -->
		<section id="modal" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Modal</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
				<Button onclick={() => (modalOpen = true)}>Open Modal</Button>
				<Modal bind:open={modalOpen} title="Example Modal" showCloseButton>
					<p>Modal content goes here.</p>
					{#snippet footer()}
						<Button variant="ghost" onclick={() => (modalOpen = false)}>Cancel</Button>
						<Button variant="primary" onclick={() => (modalOpen = false)}>Confirm</Button>
					{/snippet}
				</Modal>
			</div>
			<div class="mockup-code text-sm"><pre><code>{code.modal}</code></pre></div>
		</section>

		<!-- Toast -->
		<section id="toast" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Toast</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
				<div class="flex gap-3">
					<Button variant="primary" onclick={() => toast.success('Success!')}>Success</Button>
					<Button variant="danger" onclick={() => toast.error('Error!')}>Error</Button>
					<Button variant="ghost" onclick={() => toast.info('Info!')}>Info</Button>
				</div>
			</div>
			<div class="mockup-code text-sm"><pre><code>{code.toast}</code></pre></div>
		</section>

		<!-- Confirm Dialog -->
		<section id="confirm" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Confirm Dialog</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
				<Button variant="danger" onclick={handleConfirm}>Delete Item</Button>
			</div>
			<div class="mockup-code text-sm"><pre><code>{code.confirm}</code></pre></div>
		</section>

		<!-- Empty State -->
		<section id="empty" class="mb-12">
			<h2 class="text-2xl font-bold mb-4 border-b border-base-300 pb-2">Empty State</h2>
			<div class="bg-base-200 rounded-lg p-6 mb-4">
				<EmptyState
					title="No items found"
					description="Get started by creating your first item."
				>
					{#snippet action()}
						<Button variant="primary" onclick={() => toast.info('Create clicked!')}>Create Item</Button>
					{/snippet}
				</EmptyState>
			</div>
			<div class="mockup-code text-sm"><pre><code>{code.empty}</code></pre></div>
		</section>
	</div>
</div>
