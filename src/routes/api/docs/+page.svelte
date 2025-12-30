<script lang="ts">
	import { Button } from '$lib/components/ui';

	interface ApiEndpoint {
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		path: string;
		description: string;
		auth: boolean;
		requestBody?: {
			type: string;
			properties: Record<string, { type: string; required?: boolean; description?: string }>;
		};
		response?: {
			type: string;
			example?: unknown;
		};
	}

	// API endpoints documentation
	const endpoints: ApiEndpoint[] = [
		{
			method: 'GET',
			path: '/api/notifications/stream',
			description: 'Server-Sent Events stream for real-time notifications',
			auth: true,
			response: {
				type: 'text/event-stream',
				example: 'event: notification\ndata: {"type":"info","message":"Hello"}'
			}
		},
		{
			method: 'GET',
			path: '/api/examples',
			description: 'List all example resources',
			auth: false,
			response: {
				type: 'application/json',
				example: [{ id: '1', name: 'Example 1' }]
			}
		},
		{
			method: 'POST',
			path: '/api/examples',
			description: 'Create a new example resource',
			auth: true,
			requestBody: {
				type: 'application/json',
				properties: {
					name: { type: 'string', required: true, description: 'Name of the resource' },
					description: { type: 'string', required: false, description: 'Optional description' }
				}
			},
			response: {
				type: 'application/json',
				example: { id: '1', name: 'New Example', description: 'A description' }
			}
		},
		{
			method: 'GET',
			path: '/api/examples/:id',
			description: 'Get a specific example resource by ID',
			auth: false,
			response: {
				type: 'application/json',
				example: { id: '1', name: 'Example 1', description: 'Description' }
			}
		},
		{
			method: 'PUT',
			path: '/api/examples/:id',
			description: 'Update an example resource',
			auth: true,
			requestBody: {
				type: 'application/json',
				properties: {
					name: { type: 'string', required: false, description: 'Updated name' },
					description: { type: 'string', required: false, description: 'Updated description' }
				}
			},
			response: {
				type: 'application/json',
				example: { id: '1', name: 'Updated Example', description: 'Updated description' }
			}
		},
		{
			method: 'DELETE',
			path: '/api/examples/:id',
			description: 'Delete an example resource',
			auth: true,
			response: {
				type: 'application/json',
				example: { success: true }
			}
		}
	];

	const methodColors: Record<string, string> = {
		GET: 'badge-success',
		POST: 'badge-info',
		PUT: 'badge-warning',
		PATCH: 'badge-warning',
		DELETE: 'badge-error'
	};

	let selectedEndpoint = $state<ApiEndpoint | null>(null);
	let testUrl = $state('');
	let testMethod = $state<string>('GET');
	let testBody = $state('');
	let testResponse = $state<string | null>(null);
	let testLoading = $state(false);

	function selectEndpoint(endpoint: ApiEndpoint) {
		selectedEndpoint = endpoint;
		testUrl = endpoint.path;
		testMethod = endpoint.method;
		testBody = endpoint.requestBody ? JSON.stringify({ name: 'Test' }, null, 2) : '';
		testResponse = null;
	}

	async function sendTestRequest() {
		if (!testUrl) return;

		testLoading = true;
		testResponse = null;

		try {
			const options: { method: string; headers: Record<string, string>; body?: string } = {
				method: testMethod,
				headers: {
					'Content-Type': 'application/json'
				}
			};

			if (testBody && ['POST', 'PUT', 'PATCH'].includes(testMethod)) {
				options.body = testBody;
			}

			const response = await fetch(testUrl, options);
			const contentType = response.headers.get('content-type');

			if (contentType?.includes('application/json')) {
				const data = await response.json();
				testResponse = JSON.stringify(data, null, 2);
			} else {
				testResponse = await response.text();
			}

			testResponse = `Status: ${response.status} ${response.statusText}\n\n${testResponse}`;
		} catch (error) {
			testResponse = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
		} finally {
			testLoading = false;
		}
	}
</script>

<svelte:head>
	<title>API Documentation | Svelteship</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-2">API Documentation</h1>
		<p class="text-base-content/70">
			Interactive documentation for Svelteship API endpoints. Click on an endpoint to view details
			and test it.
		</p>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Endpoints List -->
		<div class="card bg-base-200">
			<div class="card-body">
				<h2 class="card-title mb-4">Endpoints</h2>

				<div class="space-y-2">
					{#each endpoints as endpoint (endpoint.path + endpoint.method)}
						<button
							class="w-full text-left p-3 rounded-lg hover:bg-base-300 transition-colors {selectedEndpoint ===
							endpoint
								? 'bg-base-300 ring-2 ring-primary'
								: ''}"
							onclick={() => selectEndpoint(endpoint)}
						>
							<div class="flex items-center gap-3">
								<span class="badge {methodColors[endpoint.method]} badge-sm font-mono">
									{endpoint.method}
								</span>
								<span class="font-mono text-sm">{endpoint.path}</span>
								{#if endpoint.auth}
									<span class="badge badge-ghost badge-xs">Auth</span>
								{/if}
							</div>
							<p class="text-sm text-base-content/60 mt-1 ml-16">{endpoint.description}</p>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Endpoint Details & Testing -->
		<div class="space-y-6">
			{#if selectedEndpoint}
				<!-- Details -->
				<div class="card bg-base-200">
					<div class="card-body">
						<h2 class="card-title">
							<span class="badge {methodColors[selectedEndpoint.method]}">
								{selectedEndpoint.method}
							</span>
							<span class="font-mono">{selectedEndpoint.path}</span>
						</h2>

						<p class="text-base-content/70">{selectedEndpoint.description}</p>

						{#if selectedEndpoint.auth}
							<div class="alert alert-warning mt-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="stroke-current shrink-0 h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
								<span>This endpoint requires authentication</span>
							</div>
						{/if}

						{#if selectedEndpoint.requestBody}
							<div class="mt-4">
								<h3 class="font-semibold mb-2">Request Body</h3>
								<div class="bg-base-300 rounded-lg p-4">
									<p class="text-sm text-base-content/60 mb-2">
										Content-Type: {selectedEndpoint.requestBody.type}
									</p>
									<table class="table table-sm">
										<thead>
											<tr>
												<th>Property</th>
												<th>Type</th>
												<th>Required</th>
												<th>Description</th>
											</tr>
										</thead>
										<tbody>
											{#each Object.entries(selectedEndpoint.requestBody.properties) as [name, prop] (name)}
												<tr>
													<td class="font-mono">{name}</td>
													<td class="font-mono text-primary">{prop.type}</td>
													<td>
														{#if prop.required}
															<span class="badge badge-error badge-xs">Yes</span>
														{:else}
															<span class="badge badge-ghost badge-xs">No</span>
														{/if}
													</td>
													<td class="text-sm">{prop.description || '-'}</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						{/if}

						{#if selectedEndpoint.response}
							<div class="mt-4">
								<h3 class="font-semibold mb-2">Response</h3>
								<div class="bg-base-300 rounded-lg p-4">
									<p class="text-sm text-base-content/60 mb-2">
										Content-Type: {selectedEndpoint.response.type}
									</p>
									{#if selectedEndpoint.response.example}
										<pre
											class="text-sm overflow-x-auto">{JSON.stringify(selectedEndpoint.response.example, null, 2)}</pre>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Test Panel -->
				<div class="card bg-base-200">
					<div class="card-body">
						<h2 class="card-title">Test Request</h2>

						<div class="form-control">
							<label class="label" for="test-url">
								<span class="label-text">URL</span>
							</label>
							<div class="flex gap-2">
								<select class="select select-bordered w-28" bind:value={testMethod}>
									<option>GET</option>
									<option>POST</option>
									<option>PUT</option>
									<option>PATCH</option>
									<option>DELETE</option>
								</select>
								<input
									id="test-url"
									type="text"
									class="input input-bordered flex-1 font-mono"
									bind:value={testUrl}
								/>
							</div>
						</div>

						{#if ['POST', 'PUT', 'PATCH'].includes(testMethod)}
							<div class="form-control mt-4">
								<label class="label" for="test-body">
									<span class="label-text">Request Body (JSON)</span>
								</label>
								<textarea
									id="test-body"
									class="textarea textarea-bordered font-mono h-32"
									bind:value={testBody}
									placeholder="Enter JSON body"
								></textarea>
							</div>
						{/if}

						<div class="mt-4">
							<Button onclick={sendTestRequest} loading={testLoading} class="btn-primary">
								Send Request
							</Button>
						</div>

						{#if testResponse}
							<div class="mt-4">
								<h3 class="font-semibold mb-2">Response</h3>
								<pre
									class="bg-base-300 rounded-lg p-4 text-sm overflow-x-auto max-h-64">{testResponse}</pre>
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class="card bg-base-200">
					<div class="card-body text-center text-base-content/60">
						<p>Select an endpoint from the list to view details and test it.</p>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Authentication Info -->
	<div class="card bg-base-200 mt-8">
		<div class="card-body">
			<h2 class="card-title">Authentication</h2>
			<p class="text-base-content/70">
				Endpoints marked with <span class="badge badge-ghost badge-sm">Auth</span> require authentication.
				Svelteship uses session-based authentication with cookies. Make sure you're logged in before
				testing authenticated endpoints.
			</p>

			<div class="mt-4">
				<h3 class="font-semibold mb-2">Session Cookie</h3>
				<p class="text-sm text-base-content/60">
					After logging in, a session cookie is automatically included in all requests. No
					additional headers are required for browser-based requests.
				</p>
			</div>
		</div>
	</div>
</div>
