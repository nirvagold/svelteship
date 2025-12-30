#!/usr/bin/env npx tsx
/**
 * Svelteship CLI Generator
 * Generate components, routes, and API endpoints from templates
 *
 * Usage:
 *   npx tsx scripts/generate.ts
 *   npm run generate
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function prompt(question: string): Promise<string> {
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			resolve(answer.trim());
		});
	});
}

function toPascalCase(str: string): string {
	return str
		.split(/[-_\s]+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join('');
}

// Component template
function getComponentTemplate(name: string): string {
	const pascalName = toPascalCase(name);
	return `<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ${pascalName}Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className = '', children }: ${pascalName}Props = $props();
</script>

<div class="{className}">
	{#if children}
		{@render children()}
	{/if}
</div>
`;
}

// Component test template
function getComponentTestTemplate(name: string): string {
	const pascalName = toPascalCase(name);
	return `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ${pascalName} from './${pascalName}.svelte';

describe('${pascalName}', () => {
	it('should render', () => {
		render(${pascalName});
		// Add your assertions here
	});
});
`;
}

// Route page template
function getRoutePageTemplate(name: string): string {
	const pascalName = toPascalCase(name);
	return `<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>${pascalName} | Svelteship</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-4">${pascalName}</h1>
	<p class="text-base-content/70">
		This is the ${name} page.
	</p>
</div>
`;
}

// Route server template
function getRouteServerTemplate(): string {
	return `import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		// Add your data here
	};
};
`;
}

// API endpoint template
function getApiTemplate(name: string): string {
	return `import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	// TODO: Implement GET handler for ${name}
	return json({ message: 'GET ${name}' });
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json();
	// TODO: Implement POST handler for ${name}
	return json({ message: 'POST ${name}', data: body });
};
`;
}

async function generateComponent(): Promise<void> {
	const name = await prompt('Component name (e.g., MyButton): ');
	if (!name) {
		console.log('❌ Component name is required');
		return;
	}

	const pascalName = toPascalCase(name);
	const location = await prompt('Location (ui/layouts/forms) [ui]: ');
	const dir = location || 'ui';

	const componentDir = path.join('src', 'lib', 'components', dir);
	const componentPath = path.join(componentDir, `${pascalName}.svelte`);
	const testPath = path.join(componentDir, `${pascalName}.test.ts`);

	// Create directory if it doesn't exist
	if (!fs.existsSync(componentDir)) {
		fs.mkdirSync(componentDir, { recursive: true });
	}

	// Check if component already exists
	if (fs.existsSync(componentPath)) {
		console.log(`❌ Component ${pascalName} already exists at ${componentPath}`);
		return;
	}

	// Write component file
	fs.writeFileSync(componentPath, getComponentTemplate(name));
	console.log(`✅ Created ${componentPath}`);

	// Write test file
	fs.writeFileSync(testPath, getComponentTestTemplate(name));
	console.log(`✅ Created ${testPath}`);

	// Update index.ts if it exists
	const indexPath = path.join(componentDir, 'index.ts');
	if (fs.existsSync(indexPath)) {
		const indexContent = fs.readFileSync(indexPath, 'utf-8');
		const exportLine = `export { default as ${pascalName} } from './${pascalName}.svelte';`;
		if (!indexContent.includes(exportLine)) {
			fs.appendFileSync(indexPath, `\n${exportLine}\n`);
			console.log(`✅ Added export to ${indexPath}`);
		}
	}

	console.log(`\n🎉 Component ${pascalName} created successfully!`);
}

async function generateRoute(): Promise<void> {
	const name = await prompt('Route path (e.g., about, blog/[slug]): ');
	if (!name) {
		console.log('❌ Route path is required');
		return;
	}

	const routeGroup = await prompt('Route group ((app)/(auth)/none) [none]: ');
	const group = routeGroup || '';

	const routeDir = group
		? path.join('src', 'routes', group, name)
		: path.join('src', 'routes', name);

	const pagePath = path.join(routeDir, '+page.svelte');
	const serverPath = path.join(routeDir, '+page.server.ts');

	// Create directory if it doesn't exist
	if (!fs.existsSync(routeDir)) {
		fs.mkdirSync(routeDir, { recursive: true });
	}

	// Check if route already exists
	if (fs.existsSync(pagePath)) {
		console.log(`❌ Route already exists at ${pagePath}`);
		return;
	}

	// Write page file
	fs.writeFileSync(pagePath, getRoutePageTemplate(name));
	console.log(`✅ Created ${pagePath}`);

	// Ask about server file
	const addServer = await prompt('Add +page.server.ts? (y/n) [y]: ');
	if (addServer.toLowerCase() !== 'n') {
		fs.writeFileSync(serverPath, getRouteServerTemplate());
		console.log(`✅ Created ${serverPath}`);
	}

	console.log(`\n🎉 Route /${name} created successfully!`);
}

async function generateApi(): Promise<void> {
	const name = await prompt('API endpoint path (e.g., users, posts/[id]): ');
	if (!name) {
		console.log('❌ API path is required');
		return;
	}

	const apiDir = path.join('src', 'routes', 'api', name);
	const serverPath = path.join(apiDir, '+server.ts');

	// Create directory if it doesn't exist
	if (!fs.existsSync(apiDir)) {
		fs.mkdirSync(apiDir, { recursive: true });
	}

	// Check if API already exists
	if (fs.existsSync(serverPath)) {
		console.log(`❌ API endpoint already exists at ${serverPath}`);
		return;
	}

	// Write server file
	fs.writeFileSync(serverPath, getApiTemplate(name));
	console.log(`✅ Created ${serverPath}`);

	console.log(`\n🎉 API endpoint /api/${name} created successfully!`);
}

async function main(): Promise<void> {
	console.log('\n🚀 Svelteship Generator\n');
	console.log('What would you like to generate?');
	console.log('  1. Component');
	console.log('  2. Route (page)');
	console.log('  3. API endpoint');
	console.log('  4. Exit\n');

	const choice = await prompt('Enter your choice (1-4): ');

	switch (choice) {
		case '1':
			await generateComponent();
			break;
		case '2':
			await generateRoute();
			break;
		case '3':
			await generateApi();
			break;
		case '4':
			console.log('Goodbye! 👋');
			break;
		default:
			console.log('Invalid choice. Please enter 1, 2, 3, or 4.');
	}

	rl.close();
}

main().catch(console.error);
