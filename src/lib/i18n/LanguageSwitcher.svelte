<script lang="ts">
	import { getLocale, setLocale, getAvailableLocales, type Locale } from './index';

	let { onchange }: { onchange?: (locale: Locale) => void } = $props();

	const locales = getAvailableLocales();
	let currentLocale = $state(getLocale());

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newLocale = target.value as Locale;
		setLocale(newLocale);
		currentLocale = newLocale;
		onchange?.(newLocale);
	}
</script>

<select class="select select-bordered select-sm" value={currentLocale} onchange={handleChange}>
	{#each locales as locale (locale.code)}
		<option value={locale.code}>{locale.nativeName}</option>
	{/each}
</select>
