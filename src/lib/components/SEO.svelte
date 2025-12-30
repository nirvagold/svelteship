<script lang="ts">
	interface Props {
		title: string;
		description?: string;
		image?: string;
		url?: string;
		type?: 'website' | 'article';
		twitterCard?: 'summary' | 'summary_large_image';
		siteName?: string;
		locale?: string;
	}

	let {
		title,
		description = '',
		image = '',
		url = '',
		type = 'website',
		twitterCard = 'summary_large_image',
		siteName = 'Svelteship',
		locale = 'en_US'
	}: Props = $props();

	const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	{#if description}
		<meta name="description" content={description} />
	{/if}

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	{#if description}
		<meta property="og:description" content={description} />
	{/if}
	{#if url}
		<meta property="og:url" content={url} />
	{/if}
	{#if image}
		<meta property="og:image" content={image} />
	{/if}
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content={locale} />

	<!-- Twitter -->
	<meta name="twitter:card" content={twitterCard} />
	<meta name="twitter:title" content={fullTitle} />
	{#if description}
		<meta name="twitter:description" content={description} />
	{/if}
	{#if image}
		<meta name="twitter:image" content={image} />
	{/if}

	<!-- Canonical URL -->
	{#if url}
		<link rel="canonical" href={url} />
	{/if}
</svelte:head>
