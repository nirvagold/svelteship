<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		themes?: string[];
		showLabel?: boolean;
		size?: 'xs' | 'sm' | 'md' | 'lg';
	}

	let {
		themes = [
			'light',
			'dark',
			'cupcake',
			'bumblebee',
			'emerald',
			'corporate',
			'synthwave',
			'retro',
			'cyberpunk',
			'valentine',
			'halloween',
			'garden',
			'forest',
			'aqua',
			'lofi',
			'pastel',
			'fantasy',
			'wireframe',
			'black',
			'luxury',
			'dracula',
			'cmyk',
			'autumn',
			'business',
			'acid',
			'lemonade',
			'night',
			'coffee',
			'winter',
			'dim',
			'nord',
			'sunset'
		],
		showLabel = false,
		size = 'sm'
	}: Props = $props();

	let currentTheme = $state('light');
	let dropdownOpen = $state(false);

	const sizeClasses = {
		xs: 'btn-xs',
		sm: 'btn-sm',
		md: '',
		lg: 'btn-lg'
	};

	onMount(() => {
		const stored = localStorage.getItem('theme');
		if (stored && themes.includes(stored)) {
			currentTheme = stored;
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			currentTheme = 'dark';
		}
		document.documentElement.setAttribute('data-theme', currentTheme);
	});

	function setTheme(theme: string) {
		currentTheme = theme;
		localStorage.setItem('theme', theme);
		document.documentElement.setAttribute('data-theme', theme);
		dropdownOpen = false;
	}

	function capitalizeFirst(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
</script>

<div class="dropdown dropdown-end">
	<button
		type="button"
		class="btn btn-ghost {sizeClasses[size]} gap-1"
		onclick={() => (dropdownOpen = !dropdownOpen)}
		aria-label="Select theme"
		aria-expanded={dropdownOpen}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-4 h-4"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z"
			/>
		</svg>
		{#if showLabel}
			<span class="hidden sm:inline">{capitalizeFirst(currentTheme)}</span>
		{/if}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-3 h-3"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
		</svg>
	</button>

	{#if dropdownOpen}
		<div
			class="dropdown-content bg-base-200 rounded-box shadow-xl mt-2 p-2 w-56 max-h-80 overflow-y-auto z-50"
		>
			<div class="grid grid-cols-1 gap-1">
				{#each themes as theme (theme)}
					<button
						type="button"
						class="btn btn-sm btn-ghost justify-start gap-2 {currentTheme === theme
							? 'btn-active'
							: ''}"
						onclick={() => setTheme(theme)}
					>
						<div class="flex gap-1" data-theme={theme}>
							<div class="w-2 h-4 rounded bg-primary"></div>
							<div class="w-2 h-4 rounded bg-secondary"></div>
							<div class="w-2 h-4 rounded bg-accent"></div>
							<div class="w-2 h-4 rounded bg-neutral"></div>
						</div>
						<span class="flex-1 text-left">{capitalizeFirst(theme)}</span>
						{#if currentTheme === theme}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								class="w-4 h-4 text-success"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<!-- Click outside to close -->
{#if dropdownOpen}
	<button
		type="button"
		class="fixed inset-0 z-40 cursor-default"
		onclick={() => (dropdownOpen = false)}
		aria-label="Close theme selector"
	></button>
{/if}
