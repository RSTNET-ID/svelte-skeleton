<script lang="ts">
  import { page } from '$app/state';
  import { translate } from '#lib/i18n/index.ts';
  import { Button } from './index.ts';
  export type UploadTicket = { uploadUrl: string; method?: 'PUT'; headers?: Record<string,string>; objectKey: string };
  interface Props {
    label: string;
    requestTicket: (file: File, signal: AbortSignal) => Promise<UploadTicket>;
    complete?: (ticket: UploadTicket, file: File, signal: AbortSignal) => Promise<void>;
    maxBytes?: number;
    accept?: string;
    disabled?: boolean;
    onuploaded?: (objectKey: string) => void;
  }
  let { label, requestTicket, complete, maxBytes = 10 * 1024 * 1024, accept, disabled = false, onuploaded }: Props = $props();
  const locale = $derived(page.data.locale ?? 'id');
  const id = $props.id();
  let input: HTMLInputElement;
  let busy = $state(false);
  let progress = $state(0);
  let errorText = $state('');
  let aborter: AbortController | undefined;
  function choose() { input.click(); }
  async function upload(event: Event) {
    const file = (event.currentTarget as HTMLInputElement).files?.[0];
    if (!file || busy) return;
    if (file.size > maxBytes) { errorText = translate(locale, 'upload.tooLarge'); input.value = ''; return; }
    busy = true; progress = 0; errorText = '';
    const controller = new AbortController(); aborter = controller;
    try {
      const ticket = await requestTicket(file, controller.signal);
      const url = new URL(ticket.uploadUrl);
      if (url.protocol !== 'https:' && !(url.hostname === 'localhost' || url.hostname === '127.0.0.1')) throw new Error('Untrusted upload URL');
      if (!ticket.objectKey) throw new Error('Missing object key');
      const response = await fetch(ticket.uploadUrl, { method: 'PUT', body: file, headers: ticket.headers, signal: controller.signal, credentials: 'omit' });
      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
      progress = 100;
      if (complete) await complete(ticket, file, controller.signal);
      onuploaded?.(ticket.objectKey);
    } catch (reason) {
      if (!controller.signal.aborted) errorText = reason instanceof Error ? reason.message : translate(locale, 'upload.failed');
    } finally {
      busy = false;
      input.value = '';
      aborter = undefined;
    }
  }
  function cancel() { aborter?.abort(); busy = false; }
</script>

<div class="space-y-2">
  <label for={id} class="block text-sm font-medium">{label}</label>
  <input bind:this={input} id={id} type="file" {accept} {disabled} class="sr-only" onchange={upload} />
  <div class="flex items-center gap-3">
    <Button variant="outline" disabled={disabled || busy} onclick={choose}>{translate(locale, 'upload.choose')}</Button>
    {#if busy}<Button variant="ghost" onclick={cancel}>{translate(locale, 'common.cancel')}</Button>{/if}
  </div>
  {#if busy}<p role="status" class="text-sm">{translate(locale, 'upload.inProgress')}</p>{/if}
  {#if progress === 100 && !busy}<p role="status" class="text-sm text-emerald-600">{translate(locale, 'upload.complete')}</p>{/if}
  {#if errorText}<p role="alert" class="text-sm text-rose-600">{errorText}</p>{/if}
</div>
