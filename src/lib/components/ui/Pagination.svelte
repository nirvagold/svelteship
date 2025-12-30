<script lang="ts">
	interface Props {
		totalPages: number;
		currentPage: number;
		maxVisible?: number;
		showPrevNext?: boolean;
		showFirstLast?: boolean;
		onchange?: (page: number) => void;
	}

	let {
		totalPages,
		currentPage = $bindable(1),
		maxVisible = 5,
		showPrevNext = true,
		showFirstLast = false,
		onchange
	}: Props = $props();

	const pages = $derived(() => {
		const result: (number | 'ellipsis')[] = [];

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				result.push(i);
			}
		} else {
			const half = Math.floor(maxVisible / 2);
			let start = Math.max(1, currentPage - half);
			let end = Math.min(totalPages, start + maxVisible - 1);

			if (end - start < maxVisible - 1) {
				start = Math.max(1, end - maxVisible + 1);
			}

			if (start > 1) {
				result.push(1);
				if (start > 2) result.push('ellipsis');
			}

			for (let i = start; i <= end; i++) {
				if (i !== 1 && i !== totalPages) {
					result.push(i);
				}
			}

			if (end < totalPages) {
				if (end < totalPages - 1) result.push('ellipsis');
				result.push(totalPages);
			}
		}

		return result;
	});

	function goToPage(page: number) {
		if (page < 1 || page > totalPages || page === currentPage) return;
		currentPage = page;
		onchange?.(page);
	}

	const canGoPrev = $derived(currentPage > 1);
	const canGoNext = $derived(currentPage < totalPages);
</script>

<div class="join" role="navigation" aria-label="Pagination">
	{#if showFirstLast}
		<button
			class="join-item btn btn-sm"
			disabled={!canGoPrev}
			onclick={() => goToPage(1)}
			aria-label="First page"
		>
			««
		</button>
	{/if}

	{#if showPrevNext}
		<button
			class="join-item btn btn-sm"
			disabled={!canGoPrev}
			onclick={() => goToPage(currentPage - 1)}
			aria-label="Previous page"
		>
			«
		</button>
	{/if}

	{#each pages() as page, index (index)}
		{#if page === 'ellipsis'}
			<span class="join-item btn btn-sm btn-disabled">…</span>
		{:else}
			<button
				class="join-item btn btn-sm"
				class:btn-active={page === currentPage}
				onclick={() => goToPage(page)}
				aria-current={page === currentPage ? 'page' : undefined}
			>
				{page}
			</button>
		{/if}
	{/each}

	{#if showPrevNext}
		<button
			class="join-item btn btn-sm"
			disabled={!canGoNext}
			onclick={() => goToPage(currentPage + 1)}
			aria-label="Next page"
		>
			»
		</button>
	{/if}

	{#if showFirstLast}
		<button
			class="join-item btn btn-sm"
			disabled={!canGoNext}
			onclick={() => goToPage(totalPages)}
			aria-label="Last page"
		>
			»»
		</button>
	{/if}
</div>
