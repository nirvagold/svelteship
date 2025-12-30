<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		ratio?: '1:1' | '1:2' | '2:1' | '1:3' | '3:1';
		reverse?: boolean;
		gap?: 'none' | 'sm' | 'md' | 'lg';
		left?: Snippet;
		right?: Snippet;
	}

	let { ratio = '1:1', reverse = false, gap = 'md', left, right }: Props = $props();

	const ratioClasses = {
		'1:1': { left: 'lg:w-1/2', right: 'lg:w-1/2' },
		'1:2': { left: 'lg:w-1/3', right: 'lg:w-2/3' },
		'2:1': { left: 'lg:w-2/3', right: 'lg:w-1/3' },
		'1:3': { left: 'lg:w-1/4', right: 'lg:w-3/4' },
		'3:1': { left: 'lg:w-3/4', right: 'lg:w-1/4' }
	};

	const gapClasses = {
		none: 'gap-0',
		sm: 'gap-2 lg:gap-4',
		md: 'gap-4 lg:gap-6',
		lg: 'gap-6 lg:gap-8'
	};
</script>

<div
	class="min-h-screen flex flex-col lg:flex-row {gapClasses[gap]} {reverse
		? 'flex-col-reverse lg:flex-row-reverse'
		: ''}"
>
	<div class="w-full {ratioClasses[ratio].left}">
		{@render left?.()}
	</div>
	<div class="w-full {ratioClasses[ratio].right}">
		{@render right?.()}
	</div>
</div>
