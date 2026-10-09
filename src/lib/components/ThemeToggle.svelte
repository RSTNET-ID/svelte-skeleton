<script lang="ts">
	import { onMount } from 'svelte';

	let dark = $state(false);

	function applyTheme(value: boolean) {
		dark = value;
		document.documentElement.classList.toggle('dark', value);
		localStorage.setItem('theme', value ? 'dark' : 'light');
	}

	onMount(() => {
		const stored = localStorage.getItem('theme');
		const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
		dark = stored ? stored === 'dark' : preferred;
		document.documentElement.classList.toggle('dark', dark);
	});
</script>

<button
	type="button"
	class="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
	onclick={() => applyTheme(!dark)}
	aria-label={dark ? 'Use light theme' : 'Use dark theme'}
	title={dark ? 'Use light theme' : 'Use dark theme'}
>
	{#if dark}
		<svg viewBox="0 0 24 24" aria-hidden="true" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8">
			<circle cx="12" cy="12" r="4"></circle>
			<path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"></path>
		</svg>
	{:else}
		<svg viewBox="0 0 24 24" aria-hidden="true" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8">
			<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"></path>
		</svg>
	{/if}
</button>
