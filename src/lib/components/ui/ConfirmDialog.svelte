<script lang="ts">
	import { page } from '$app/state';
	import { translate } from '#lib/i18n/index.ts';
	import Button from './Button.svelte';

	interface Props {
		open?: boolean;
		title: string;
		description: string;
		busy?: boolean;
		destructive?: boolean;
		onconfirm: () => void | Promise<void>;
		oncancel: () => void;
	}
	let {
		open = false,
		title,
		description,
		busy = false,
		destructive = false,
		onconfirm,
		oncancel
	}: Props = $props();
	const locale = $derived(page.data.locale ?? 'id');
</script>

{#if open}
	<div class="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
		<div
			role="alertdialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="confirm-title"
			aria-describedby="confirm-description"
			class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
			onkeydown={(event) => {
				if (event.key === 'Escape' && !busy) oncancel();
			}}
		>
			<h2 id="confirm-title" class="text-lg font-bold">{title}</h2>
			<p id="confirm-description" class="mt-2 text-sm text-slate-600 dark:text-slate-300">
				{description}
			</p>
			<div class="mt-6 flex justify-end gap-2">
				<Button variant="outline" disabled={busy} onclick={oncancel}
					>{translate(locale, 'common.cancel')}</Button
				>
				<Button
					variant={destructive ? 'danger' : 'primary'}
					loading={busy}
					onclick={() => void onconfirm()}>{translate(locale, 'common.confirm')}</Button
				>
			</div>
		</div>
	</div>
{/if}
