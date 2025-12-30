<!-- eslint-disable svelte/no-at-html-tags -->
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

	// Sidebar navigation
	const sections = [
		{ id: 'buttons', label: 'Button', icon: '🔘' },
		{ id: 'input', label: 'Input', icon: '📝' },
		{ id: 'badges', label: 'Badge', icon: '🏷️' },
		{ id: 'spinners', label: 'Spinner', icon: '⏳' },
		{ id: 'avatar', label: 'Avatar', icon: '👤' },
		{ id: 'progress', label: 'Progress', icon: '📊' },
		{ id: 'skeleton', label: 'Skeleton', icon: '💀' },
		{ id: 'dropdown', label: 'Dropdown', icon: '📋' },
		{ id: 'tabs', label: 'Tabs', icon: '📑' },
		{ id: 'table', label: 'Table', icon: '📋' },
		{ id: 'pagination', label: 'Pagination', icon: '📄' },
		{ id: 'tooltip', label: 'Tooltip', icon: '💬' },
		{ id: 'modal', label: 'Modal', icon: '🪟' },
		{ id: 'toast', label: 'Toast', icon: '🍞' },
		{ id: 'confirm', label: 'Confirm Dialog', icon: '❓' },
		{ id: 'empty', label: 'Empty State', icon: '📭' }
	];

	let activeSection = $state('buttons');

	function scrollToSection(id: string) {
		activeSection = id;
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

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

	// Code snippets stored as plain strings to avoid ESLint parsing issues
	const codeSnippets = {
		button: `&lt;script&gt;
  import { Button } from '$lib/components/ui';
&lt;/script&gt;

&lt;Button variant="primary"&gt;Click me&lt;/Button&gt;
&lt;Button variant="danger" onclick={() =&gt; handleDelete()}&gt;Delete&lt;/Button&gt;
&lt;Button loading&gt;Saving...&lt;/Button&gt;`,

		input: `&lt;script&gt;
  import { Input } from '$lib/components/ui';
  let email = $state('');
&lt;/script&gt;

&lt;Input label="Email" type="email" bind:value={email} /&gt;
&lt;Input label="Password" type="password" error={errors.password} /&gt;`,

		badge: `&lt;script&gt;
  import { Badge } from '$lib/components/ui';
&lt;/script&gt;

&lt;Badge variant="success"&gt;Active&lt;/Badge&gt;
&lt;Badge variant="error"&gt;Expired&lt;/Badge&gt;
&lt;Badge variant="warning" size="lg"&gt;Pending&lt;/Badge&gt;`,

		spinner: `&lt;script&gt;
  import { Spinner } from '$lib/components/ui';
&lt;/script&gt;

{#if loading}
  &lt;Spinner size="lg" /&gt;
{/if}`,

		avatar: `&lt;script&gt;
  import { Avatar } from '$lib/components/ui';
&lt;/script&gt;

&lt;Avatar name="John Doe" /&gt;
&lt;Avatar src={user.avatarUrl} name={user.name} size="lg" /&gt;
&lt;Avatar name="Active User" status="online" /&gt;`,

		progress: `&lt;script&gt;
  import { Progress } from '$lib/components/ui';
  let progress = $state(0);
&lt;/script&gt;

&lt;Progress value={progress} max={100} showLabel /&gt;
&lt;Progress value={75} variant="success" /&gt;`,

		skeleton: `&lt;script&gt;
  import { Skeleton } from '$lib/components/ui';
&lt;/script&gt;

{#if loading}
  &lt;Skeleton variant="text" count={3} /&gt;
  &lt;Skeleton variant="circle" width="64px" height="64px" /&gt;
{:else}
  &lt;ActualContent /&gt;
{/if}`,

		dropdown: `&lt;script&gt;
  import { Dropdown } from '$lib/components/ui';
  let selected = $state('');
  
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' }
  ];
&lt;/script&gt;

&lt;Dropdown 
  label="Select fruit"
  options={options}
  bind:value={selected}
/&gt;`,

		tabs: `&lt;script&gt;
  import { Tabs } from '$lib/components/ui';
  let activeTab = $state('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' }
  ];
&lt;/script&gt;

&lt;Tabs tabs={tabs} bind:activeTab&gt;
  {#if activeTab === 'overview'}
    &lt;OverviewContent /&gt;
  {/if}
&lt;/Tabs&gt;`,

		table: `&lt;script&gt;
  import { Table } from '$lib/components/ui';
  
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' }
  ];
  
  const data = [
    { name: 'John', email: 'john@example.com' }
  ];
&lt;/script&gt;

&lt;Table columns={columns} data={data} /&gt;`,

		pagination: `&lt;script&gt;
  import { Pagination } from '$lib/components/ui';
  let currentPage = $state(1);
&lt;/script&gt;

&lt;Pagination 
  totalPages={10} 
  bind:currentPage 
  onchange={(page) =&gt; fetchData(page)}
/&gt;`,

		tooltip: `&lt;script&gt;
  import { Tooltip, Button } from '$lib/components/ui';
&lt;/script&gt;

&lt;Tooltip content="Click to save" position="top"&gt;
  &lt;Button&gt;Save&lt;/Button&gt;
&lt;/Tooltip&gt;`,

		modal: `&lt;script&gt;
  import { Modal, Button } from '$lib/components/ui';
  let open = $state(false);
&lt;/script&gt;

&lt;Button onclick={() =&gt; (open = true)}&gt;Open&lt;/Button&gt;

&lt;Modal bind:open title="Confirm Action" showCloseButton&gt;
  &lt;p&gt;Are you sure?&lt;/p&gt;
  
  {#snippet footer()}
    &lt;Button variant="ghost" onclick={() =&gt; (open = false)}&gt;Cancel&lt;/Button&gt;
    &lt;Button variant="primary"&gt;Confirm&lt;/Button&gt;
  {/snippet}
&lt;/Modal&gt;`,

		toast: `&lt;script&gt;
  import { toast } from '$lib/components/ui/stores/toast';
&lt;/script&gt;

// Toast methods:
toast.success('Success message');
toast.error('Error message');
toast.warning('Warning message');
toast.info('Info message');`,

		confirm: `&lt;script&gt;
  import { confirm } from '$lib/components/ui/stores/confirm';
  import { toast } from '$lib/components/ui/stores/toast';
  
  async function handleDelete() {
    const confirmed = await confirm({
      title: 'Delete Item',
      message: 'Are you sure?',
      confirmLabel: 'Delete',
      variant: 'danger'
    });
    
    if (confirmed) {
      toast.success('Item deleted!');
    }
  }
&lt;/script&gt;`,

		empty: `&lt;script&gt;
  import { EmptyState, Button } from '$lib/components/ui';
&lt;/script&gt;

{#if items.length === 0}
  &lt;EmptyState
    title="No items found"
    description="Get started by creating your first item."
  &gt;
    {#snippet action()}
      &lt;Button variant="primary"&gt;Create Item&lt;/Button&gt;
    {/snippet}
  &lt;/EmptyState&gt;
{:else}
  &lt;ItemsList {items} /&gt;
{/if}`
	};
</script>

<svelte:head>
	<title>UI Components | Svelteship</title>
</svelte:head>

<div class="drawer lg:drawer-open">
	<input id="components-drawer" type="checkbox" class="drawer-toggle" />

	<!-- Main Content -->
	<div class="drawer-content">
		<!-- Mobile header -->
		<div class="navbar bg-base-100 lg:hidden sticky top-0 z-10 border-b border-base-300">
			<label for="components-drawer" class="btn btn-ghost btn-square">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</label>
			<span class="font-bold">UI Components</span>
		</div>

		<div class="p-6 lg:p-8 max-w-4xl">
			<Breadcrumb items={breadcrumbItems} />

			<div class="mt-4 mb-8">
				<h1 class="text-4xl font-bold">UI Components</h1>
				<p class="text-base-content/70 mt-2">
					Ready-to-use components for your Svelteship project. Click on any component to see usage examples.
				</p>
			</div>

			<!-- Button -->
			<section id="buttons" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Button</h2>
					<p class="text-base-content/70 mt-1">Trigger actions with customizable button styles.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
						<div class="flex flex-wrap gap-3">
							<Button variant="primary">Primary</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="danger">Danger</Button>
							<Button variant="ghost">Ghost</Button>
							<Button loading>Loading</Button>
							<Button disabled>Disabled</Button>
						</div>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.button}</code></pre>
						</div>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Props</p>
						<div class="overflow-x-auto">
							<table class="table table-sm">
								<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
								<tbody>
									<tr><td><code>variant</code></td><td><code>'primary' | 'secondary' | 'danger' | 'ghost'</code></td><td><code>'primary'</code></td><td>Button style variant</td></tr>
									<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Button size</td></tr>
									<tr><td><code>loading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show loading spinner</td></tr>
									<tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disable button</td></tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>

			<!-- Input -->
			<section id="input" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Input</h2>
					<p class="text-base-content/70 mt-1">Text input with label and error state support.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
							<Input label="Email" type="email" placeholder="you@example.com" />
							<Input label="Password" type="password" placeholder="••••••••" />
							<Input label="With Error" error="This field is required" />
							<Input label="Disabled" disabled value="Cannot edit" />
						</div>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.input}</code></pre>
						</div>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Props</p>
						<div class="overflow-x-auto">
							<table class="table table-sm">
								<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
								<tbody>
									<tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>Input label</td></tr>
									<tr><td><code>type</code></td><td><code>'text' | 'email' | 'password' | ...</code></td><td><code>'text'</code></td><td>Input type</td></tr>
									<tr><td><code>value</code></td><td><code>string</code></td><td><code>''</code></td><td>Input value (bindable)</td></tr>
									<tr><td><code>error</code></td><td><code>string</code></td><td>-</td><td>Error message</td></tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>

			<!-- Badge -->
			<section id="badges" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Badge</h2>
					<p class="text-base-content/70 mt-1">Small status indicators and labels.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
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

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.badge}</code></pre>
						</div>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Props</p>
						<div class="overflow-x-auto">
							<table class="table table-sm">
								<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
								<tbody>
									<tr><td><code>variant</code></td><td><code>'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'</code></td><td><code>'primary'</code></td><td>Badge color</td></tr>
									<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>Badge size</td></tr>
									<tr><td><code>outline</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Outline style</td></tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>

			<!-- Spinner -->
			<section id="spinners" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Spinner</h2>
					<p class="text-base-content/70 mt-1">Loading indicator for async operations.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
						<div class="flex items-center gap-6">
							<Spinner size="sm" />
							<Spinner size="md" />
							<Spinner size="lg" />
							<Spinner variant="primary" />
							<Spinner variant="secondary" />
						</div>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.spinner}</code></pre>
						</div>
					</div>
				</div>
			</section>

			<!-- Avatar -->
			<section id="avatar" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Avatar</h2>
					<p class="text-base-content/70 mt-1">User profile image with fallback initials.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
						<div class="flex items-center gap-4">
							<Avatar name="John Doe" size="sm" />
							<Avatar name="Jane Smith" size="md" />
							<Avatar name="Bob Wilson" size="lg" />
							<Avatar name="Online" status="online" />
							<Avatar name="Offline" status="offline" />
						</div>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.avatar}</code></pre>
						</div>
					</div>
				</div>
			</section>

			<!-- Progress -->
			<section id="progress" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Progress</h2>
					<p class="text-base-content/70 mt-1">Visual progress indicator bar.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
						<div class="space-y-4 max-w-md">
							<Progress value={25} showLabel />
							<Progress value={50} variant="primary" showLabel />
							<Progress value={75} variant="success" showLabel />
						</div>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.progress}</code></pre>
						</div>
					</div>
				</div>
			</section>

			<!-- Skeleton -->
			<section id="skeleton" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Skeleton</h2>
					<p class="text-base-content/70 mt-1">Placeholder loading state for content.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
						<div class="space-y-4 max-w-md">
							<Skeleton variant="text" count={3} />
							<div class="flex gap-4">
								<Skeleton variant="circle" width="48px" height="48px" />
								<div class="flex-1"><Skeleton variant="text" count={2} /></div>
							</div>
						</div>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.skeleton}</code></pre>
						</div>
					</div>
				</div>
			</section>

			<!-- Dropdown -->
			<section id="dropdown" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Dropdown</h2>
					<p class="text-base-content/70 mt-1">Select input with searchable options.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
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

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.dropdown}</code></pre>
						</div>
					</div>
				</div>
			</section>

			<!-- Tabs -->
			<section id="tabs" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Tabs</h2>
					<p class="text-base-content/70 mt-1">Tabbed navigation for content sections.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
						<Tabs tabs={tabItems} bind:activeTab>
							{#if activeTab === 'tab1'}
								<p>Overview content goes here.</p>
							{:else if activeTab === 'tab2'}
								<p>Features content goes here.</p>
							{/if}
						</Tabs>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.tabs}</code></pre>
						</div>
					</div>
				</div>
			</section>

			<!-- Table -->
			<section id="table" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Table</h2>
					<p class="text-base-content/70 mt-1">Data table with sorting support.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
						<Table columns={tableColumns} data={tableData} />
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.table}</code></pre>
						</div>
					</div>
				</div>
			</section>

			<!-- Pagination -->
			<section id="pagination" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Pagination</h2>
					<p class="text-base-content/70 mt-1">Page navigation for large datasets.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
						<Pagination totalPages={10} bind:currentPage />
						<p class="mt-2 text-sm">Current: Page {currentPage}</p>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.pagination}</code></pre>
						</div>
					</div>
				</div>
			</section>

			<!-- Tooltip -->
			<section id="tooltip" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Tooltip</h2>
					<p class="text-base-content/70 mt-1">Contextual information on hover.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
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

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.tooltip}</code></pre>
						</div>
					</div>
				</div>
			</section>

			<!-- Modal -->
			<section id="modal" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Modal</h2>
					<p class="text-base-content/70 mt-1">Dialog overlay for focused interactions.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
						<Button onclick={() => (modalOpen = true)}>Open Modal</Button>
						<Modal bind:open={modalOpen} title="Example Modal" showCloseButton>
							<p>Modal content goes here. You can add forms, text, or any content.</p>
							{#snippet footer()}
								<Button variant="ghost" onclick={() => (modalOpen = false)}>Cancel</Button>
								<Button variant="primary" onclick={() => (modalOpen = false)}>Confirm</Button>
							{/snippet}
						</Modal>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.modal}</code></pre>
						</div>
					</div>
				</div>
			</section>

			<!-- Toast -->
			<section id="toast" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Toast</h2>
					<p class="text-base-content/70 mt-1">Notification messages for user feedback.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
						<div class="flex gap-3">
							<Button variant="primary" onclick={() => toast.success('Success message!')}>Success</Button>
							<Button variant="danger" onclick={() => toast.error('Error message!')}>Error</Button>
							<Button variant="ghost" onclick={() => toast.info('Info message!')}>Info</Button>
						</div>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.toast}</code></pre>
						</div>
					</div>

					<div class="bg-base-300/50 rounded-lg p-4">
						<p class="text-sm"><strong>Note:</strong> Make sure <code>&lt;ToastContainer /&gt;</code> is in your root layout.</p>
					</div>
				</div>
			</section>

			<!-- Confirm Dialog -->
			<section id="confirm" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Confirm Dialog</h2>
					<p class="text-base-content/70 mt-1">Promise-based confirmation dialog.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
						<Button variant="danger" onclick={handleConfirm}>Delete Item</Button>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.confirm}</code></pre>
						</div>
					</div>

					<div class="bg-base-300/50 rounded-lg p-4">
						<p class="text-sm"><strong>Note:</strong> Make sure <code>&lt;ConfirmDialog /&gt;</code> is in your root layout.</p>
					</div>
				</div>
			</section>

			<!-- Empty State -->
			<section id="empty" class="mb-16 scroll-mt-20">
				<div class="border-b border-base-300 pb-4 mb-6">
					<h2 class="text-2xl font-bold">Empty State</h2>
					<p class="text-base-content/70 mt-1">Placeholder for empty content areas.</p>
				</div>

				<div class="space-y-6">
					<div class="bg-base-200 rounded-lg p-6">
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-4">Preview</p>
						<EmptyState
							title="No items found"
							description="Get started by creating your first item."
						>
							{#snippet action()}
								<Button variant="primary" onclick={() => toast.info('Create clicked!')}>Create Item</Button>
							{/snippet}
						</EmptyState>
					</div>

					<div>
						<p class="text-xs font-semibold text-base-content/50 uppercase mb-2">Usage</p>
						<div class="mockup-code text-sm">
							<pre><code>{@html codeSnippets.empty}</code></pre>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>

	<!-- Sidebar -->
	<div class="drawer-side z-20">
		<label for="components-drawer" class="drawer-overlay"></label>
		<aside class="bg-base-100 w-64 min-h-screen border-r border-base-300 flex flex-col">
			<div class="p-4 border-b border-base-300">
				<a href="/" class="flex items-center gap-2 font-bold text-lg">
					<span>🚀</span> Svelteship
				</a>
			</div>
			<nav class="p-4 flex-1 overflow-y-auto">
				<p class="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-3">Components</p>
				<ul class="menu menu-sm gap-0.5">
					{#each sections as section (section.id)}
						<li>
							<button
								class="flex items-center gap-2 text-sm"
								class:active={activeSection === section.id}
								onclick={() => scrollToSection(section.id)}
							>
								<span class="text-base">{section.icon}</span>
								{section.label}
							</button>
						</li>
					{/each}
				</ul>
			</nav>
			<div class="p-4 border-t border-base-300">
				<a href="/" class="btn btn-ghost btn-sm w-full justify-start gap-2">
					← Back to Home
				</a>
			</div>
		</aside>
	</div>
</div>
