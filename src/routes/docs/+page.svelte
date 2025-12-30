<script lang="ts">
	import { Button } from '$lib/components/ui';
	import { copyToClipboard } from '$lib/utils';

	let copiedId = $state<string | null>(null);

	async function copyCode(code: string, id: string) {
		const success = await copyToClipboard(code);
		if (success) {
			copiedId = id;
			setTimeout(() => {
				copiedId = null;
			}, 2000);
		}
	}

	const scriptEnd = '<' + '/script>';
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<h1 class="text-3xl font-bold mb-2">Utilities & Hooks Documentation</h1>
	<p class="text-base-content/70 mb-8">Helper functions and hooks for building applications faster.</p>

	<!-- Navigation -->
	<div class="flex flex-wrap gap-2 mb-8">
		<a href="#hooks" class="btn btn-sm btn-outline">Hooks</a>
		<a href="#date" class="btn btn-sm btn-outline">Date</a>
		<a href="#currency" class="btn btn-sm btn-outline">Currency</a>
		<a href="#id" class="btn btn-sm btn-outline">ID</a>
		<a href="#slug" class="btn btn-sm btn-outline">Slug</a>
		<a href="#clipboard" class="btn btn-sm btn-outline">Clipboard</a>
		<a href="#csv" class="btn btn-sm btn-outline">CSV</a>
	</div>

	<!-- Hooks Section -->
	<section id="hooks" class="mb-12">
		<h2 class="text-2xl font-bold mb-4 border-b pb-2">Hooks</h2>

		<!-- useDebounce -->
		<div class="card bg-base-200 mb-6">
			<div class="card-body">
				<h3 class="card-title">useDebounce</h3>
				<p class="text-base-content/70">Debounce a value with configurable delay.</p>
				<div class="mockup-code mt-4 text-sm">
					<pre><code>{`<script lang="ts">
  import { useDebounce } from '$lib/hooks';

  let search = $state('');
  const debounced = useDebounce(() => search, 300);

  $effect(() => {
    // This runs 300ms after search stops changing
    console.log('Search:', debounced.value);
  });
${scriptEnd}`}</code></pre>
				</div>
				<Button
					size="sm"
					variant="ghost"
					onclick={() => copyCode(`import { useDebounce } from '$lib/hooks';

let search = $state('');
const debounced = useDebounce(() => search, 300);`, 'debounce')}
				>
					{copiedId === 'debounce' ? '✓ Copied!' : 'Copy'}
				</Button>
			</div>
		</div>

		<!-- useLocalStorage -->
		<div class="card bg-base-200 mb-6">
			<div class="card-body">
				<h3 class="card-title">useLocalStorage</h3>
				<p class="text-base-content/70">Sync state with localStorage, with SSR fallback.</p>
				<div class="mockup-code mt-4 text-sm">
					<pre><code>{`<script lang="ts">
  import { useLocalStorage } from '$lib/hooks';

  const theme = useLocalStorage('theme', 'light');

  function toggleTheme() {
    theme.setValue(theme.value === 'light' ? 'dark' : 'light');
  }
${scriptEnd}`}</code></pre>
				</div>
				<Button
					size="sm"
					variant="ghost"
					onclick={() => copyCode(`import { useLocalStorage } from '$lib/hooks';

const theme = useLocalStorage('theme', 'light');
theme.setValue('dark');`, 'localStorage')}
				>
					{copiedId === 'localStorage' ? '✓ Copied!' : 'Copy'}
				</Button>
			</div>
		</div>

		<!-- useForm -->
		<div class="card bg-base-200 mb-6">
			<div class="card-body">
				<h3 class="card-title">useForm</h3>
				<p class="text-base-content/70">Form state management with validation.</p>
				<div class="mockup-code mt-4 text-sm">
					<pre><code>{`<script lang="ts">
  import { useForm } from '$lib/hooks';

  const form = useForm(
    { email: '', password: '' },
    {
      email: { required: true, pattern: /^[^@]+@[^@]+$/ },
      password: { required: true, minLength: 8 }
    }
  );
${scriptEnd}

<input bind:value={form.values.email} onblur={() => form.handleBlur('email')} />
{#if form.errors.email}<span class="text-error">{form.errors.email}</span>{/if}`}</code></pre>
				</div>
				<Button
					size="sm"
					variant="ghost"
					onclick={() => copyCode(`import { useForm } from '$lib/hooks';

const form = useForm(
  { email: '', password: '' },
  {
    email: { required: true },
    password: { required: true, minLength: 8 }
  }
);`, 'form')}
				>
					{copiedId === 'form' ? '✓ Copied!' : 'Copy'}
				</Button>
			</div>
		</div>
	</section>

	<!-- Date Utilities -->
	<section id="date" class="mb-12">
		<h2 class="text-2xl font-bold mb-4 border-b pb-2">Date Utilities</h2>

		<div class="card bg-base-200">
			<div class="card-body">
				<h3 class="card-title">formatDate, formatRelative, parseDate</h3>
				<div class="mockup-code mt-4 text-sm">
					<pre><code>{`import { formatDate, formatRelative, parseDate } from '$lib/utils';

// Format date
formatDate(new Date()); // "Dec 30, 2024"
formatDate(new Date(), { format: 'long' }); // "December 30, 2024"
formatDate(new Date(), { format: 'full' }); // "Monday, December 30, 2024"

// Relative time
formatRelative(new Date(Date.now() - 3600000)); // "1 hour ago"
formatRelative(new Date(Date.now() + 86400000)); // "in 1 day"

// Parse date
parseDate('2024-12-30'); // Date object or null`}</code></pre>
				</div>
				<Button
					size="sm"
					variant="ghost"
					onclick={() => copyCode(`import { formatDate, formatRelative } from '$lib/utils';

formatDate(new Date());
formatRelative(new Date(Date.now() - 3600000));`, 'date')}
				>
					{copiedId === 'date' ? '✓ Copied!' : 'Copy'}
				</Button>
			</div>
		</div>
	</section>

	<!-- Currency Utilities -->
	<section id="currency" class="mb-12">
		<h2 class="text-2xl font-bold mb-4 border-b pb-2">Currency Utilities</h2>

		<div class="card bg-base-200">
			<div class="card-body">
				<h3 class="card-title">formatCurrency, parseCurrency</h3>
				<div class="mockup-code mt-4 text-sm">
					<pre><code>{`import { formatCurrency, parseCurrency } from '$lib/utils';

// Format currency
formatCurrency(1234.56); // "$1,234.56"
formatCurrency(1234.56, { currency: 'EUR', locale: 'de-DE' }); // "1.234,56 €"
formatCurrency(1500000, { currency: 'IDR', locale: 'id-ID' }); // "Rp 1.500.000"

// Parse currency string
parseCurrency('$1,234.56'); // 1234.56`}</code></pre>
				</div>
				<Button
					size="sm"
					variant="ghost"
					onclick={() => copyCode(`import { formatCurrency } from '$lib/utils';

formatCurrency(1234.56);
formatCurrency(1234.56, { currency: 'EUR', locale: 'de-DE' });`, 'currency')}
				>
					{copiedId === 'currency' ? '✓ Copied!' : 'Copy'}
				</Button>
			</div>
		</div>
	</section>

	<!-- ID Utilities -->
	<section id="id" class="mb-12">
		<h2 class="text-2xl font-bold mb-4 border-b pb-2">ID Utilities</h2>

		<div class="card bg-base-200">
			<div class="card-body">
				<h3 class="card-title">generateId, generateUUID</h3>
				<div class="mockup-code mt-4 text-sm">
					<pre><code>{`import { generateId, generateUUID } from '$lib/utils';

// Generate random ID
generateId(); // "aB3xY9kLmN2p"
generateId({ length: 8 }); // "aB3xY9kL"
generateId({ prefix: 'user_' }); // "user_aB3xY9kLmN2p"
generateId({ alphabet: '0123456789' }); // "847291635028"

// Generate UUID v4
generateUUID(); // "550e8400-e29b-41d4-a716-446655440000"`}</code></pre>
				</div>
				<Button
					size="sm"
					variant="ghost"
					onclick={() => copyCode(`import { generateId, generateUUID } from '$lib/utils';

generateId();
generateId({ prefix: 'user_', length: 8 });
generateUUID();`, 'id')}
				>
					{copiedId === 'id' ? '✓ Copied!' : 'Copy'}
				</Button>
			</div>
		</div>
	</section>

	<!-- Slug Utilities -->
	<section id="slug" class="mb-12">
		<h2 class="text-2xl font-bold mb-4 border-b pb-2">Slug Utilities</h2>

		<div class="card bg-base-200">
			<div class="card-body">
				<h3 class="card-title">slugify, uniqueSlug</h3>
				<div class="mockup-code mt-4 text-sm">
					<pre><code>{`import { slugify, uniqueSlug } from '$lib/utils';

// Create URL-safe slug
slugify('Hello World!'); // "hello-world"
slugify('Café Résumé'); // "cafe-resume"
slugify('Hello World', { separator: '_' }); // "hello_world"
slugify('Very Long Title Here', { maxLength: 10 }); // "very-long"

// Generate unique slug
uniqueSlug('Hello', ['hello']); // "hello-1"
uniqueSlug('Hello', ['hello', 'hello-1']); // "hello-2"`}</code></pre>
				</div>
				<Button
					size="sm"
					variant="ghost"
					onclick={() => copyCode(`import { slugify, uniqueSlug } from '$lib/utils';

slugify('Hello World!');
uniqueSlug('Hello', existingSlugs);`, 'slug')}
				>
					{copiedId === 'slug' ? '✓ Copied!' : 'Copy'}
				</Button>
			</div>
		</div>
	</section>

	<!-- Clipboard Utilities -->
	<section id="clipboard" class="mb-12">
		<h2 class="text-2xl font-bold mb-4 border-b pb-2">Clipboard Utilities</h2>

		<div class="card bg-base-200">
			<div class="card-body">
				<h3 class="card-title">copyToClipboard, readFromClipboard</h3>
				<div class="mockup-code mt-4 text-sm">
					<pre><code>{`import { copyToClipboard, readFromClipboard } from '$lib/utils';

// Copy text to clipboard
const success = await copyToClipboard('Hello World');
if (success) {
  console.log('Copied!');
}

// Read from clipboard (requires permission)
const text = await readFromClipboard();`}</code></pre>
				</div>
				<Button
					size="sm"
					variant="ghost"
					onclick={() => copyCode(`import { copyToClipboard } from '$lib/utils';

await copyToClipboard('Hello World');`, 'clipboard')}
				>
					{copiedId === 'clipboard' ? '✓ Copied!' : 'Copy'}
				</Button>
			</div>
		</div>
	</section>

	<!-- CSV Utilities -->
	<section id="csv" class="mb-12">
		<h2 class="text-2xl font-bold mb-4 border-b pb-2">CSV Utilities</h2>

		<div class="card bg-base-200">
			<div class="card-body">
				<h3 class="card-title">exportToCsv, downloadCsv, parseCsv</h3>
				<div class="mockup-code mt-4 text-sm">
					<pre><code>{`import { exportToCsv, downloadCsv, parseCsv } from '$lib/utils';

const data = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
];

// Export to CSV string
const csv = exportToCsv(data);
// "name,age\\nJohn,30\\nJane,25"

// With custom headers
const csv2 = exportToCsv(data, [
  { key: 'name', header: 'Full Name' },
  { key: 'age', header: 'Age (years)' }
]);

// Download as file
downloadCsv(csv, 'users.csv');

// Parse CSV string
const parsed = parseCsv(csv);`}</code></pre>
				</div>
				<Button
					size="sm"
					variant="ghost"
					onclick={() => copyCode(`import { exportToCsv, downloadCsv } from '$lib/utils';

const csv = exportToCsv(data);
downloadCsv(csv, 'export.csv');`, 'csv')}
				>
					{copiedId === 'csv' ? '✓ Copied!' : 'Copy'}
				</Button>
			</div>
		</div>
	</section>

	<!-- Server Utilities -->
	<section id="server" class="mb-12">
		<h2 class="text-2xl font-bold mb-4 border-b pb-2">Server Utilities</h2>

		<div class="card bg-base-200 mb-6">
			<div class="card-body">
				<h3 class="card-title">Rate Limiter</h3>
				<p class="text-base-content/70">In-memory rate limiting for API routes.</p>
				<div class="mockup-code mt-4 text-sm">
					<pre><code>{`// src/hooks.server.ts
import { rateLimit } from '$lib/server/rateLimit';

export const handle = rateLimit({
  limit: 100,        // Max requests
  windowMs: 60000,   // Per minute
  message: 'Too many requests'
});`}</code></pre>
				</div>
			</div>
		</div>

		<div class="card bg-base-200">
			<div class="card-body">
				<h3 class="card-title">File Upload Handler</h3>
				<p class="text-base-content/70">Validate file uploads by size and type.</p>
				<div class="mockup-code mt-4 text-sm">
					<pre><code>{`import { handleUpload, FILE_TYPE_PRESETS } from '$lib/server/upload';

const result = await handleUpload(file, {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: FILE_TYPE_PRESETS.images
});

if (result.success) {
  console.log('Uploaded:', result.filename);
} else {
  console.error('Error:', result.error);
}`}</code></pre>
				</div>
			</div>
		</div>
	</section>

	<!-- Components -->
	<section id="components" class="mb-12">
		<h2 class="text-2xl font-bold mb-4 border-b pb-2">Components</h2>

		<div class="card bg-base-200 mb-6">
			<div class="card-body">
				<h3 class="card-title">SearchInput</h3>
				<p class="text-base-content/70">Search input with built-in debounce.</p>
				<div class="mockup-code mt-4 text-sm">
					<pre><code>{`<script lang="ts">
  import SearchInput from '$lib/components/SearchInput.svelte';

  let query = $state('');

  function handleSearch(value: string) {
    console.log('Search:', value);
  }
${scriptEnd}

<SearchInput
  bind:value={query}
  placeholder="Search..."
  debounce={300}
  onchange={handleSearch}
/>`}</code></pre>
				</div>
			</div>
		</div>

		<div class="card bg-base-200">
			<div class="card-body">
				<h3 class="card-title">SEO</h3>
				<p class="text-base-content/70">Set meta tags for SEO and social sharing.</p>
				<div class="mockup-code mt-4 text-sm">
					<pre><code>{`<script lang="ts">
  import SEO from '$lib/components/SEO.svelte';
${scriptEnd}

<SEO
  title="Page Title"
  description="Page description for search engines"
  image="/og-image.png"
  url="https://example.com/page"
/>`}</code></pre>
				</div>
			</div>
		</div>
	</section>

	<div class="text-center text-base-content/50 mt-8">
		<p>See also: <a href="/components" class="link">UI Components</a></p>
	</div>
</div>
