<script lang="ts" generics="T extends Record<string, unknown>">
  import { onMount } from 'svelte';
  import { page as currentPage } from '$app/state';
  import { translate } from '#lib/i18n/index.ts';
  import { Button, Input, Select } from '#lib/components/ui/index.ts';

  type DataColumn<T> = {
    key: string;
    title: string;
    sortable?: boolean;
    value?: (row: T) => string | number | null | undefined;
  };
  type DataPage<T> = { items: T[]; total: number };
  type DataQuery = { page: number; pageSize: number; search: string; sortBy?: string; sortDir?: 'asc' | 'desc' };
  interface Props {
    columns: DataColumn<T>[];
    fetchPage: (query: DataQuery, signal: AbortSignal) => Promise<DataPage<T>>;
    rowKey: (row: T) => string | number;
    pageSizes?: number[];
    debounceMs?: number;
    initialPageSize?: number;
  }
  let { columns, fetchPage, rowKey, pageSizes = [10, 25, 50], debounceMs = 350, initialPageSize = 10 }: Props = $props();
  const locale = $derived(currentPage.data.locale ?? 'id');
  let page = $state(1);
  let pageSize = $state(10);
  let search = $state('');
  let debouncedSearch = $state('');
  let sortBy = $state<string | undefined>(undefined);
  let sortDir = $state<'asc' | 'desc'>('asc');
  let rows = $state<T[]>([]);
  let total = $state(0);
  let loading = $state(false);
  let errorMessage = $state('');
  let refresh = $state(0);
  let mounted = $state(false);
  const totalPages = $derived(Math.max(1, Math.ceil(total / pageSize)));
  const sizeOptions = $derived(pageSizes.map((n) => ({ value: String(n), label: String(n) })));

  onMount(() => { pageSize = initialPageSize; mounted = true; return () => { mounted = false; }; });
  $effect(() => {
    const term = search;
    const timer = setTimeout(() => { debouncedSearch = term.trim(); page = 1; }, Math.max(0, debounceMs));
    return () => clearTimeout(timer);
  });
  $effect(() => {
    if (!mounted) return;
    const query: DataQuery = { page, pageSize, search: debouncedSearch, ...(sortBy ? { sortBy, sortDir } : {}) };
    const trigger = refresh;
    void trigger;
    const controller = new AbortController();
    loading = true;
    errorMessage = '';
    void fetchPage(query, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      rows = result.items;
      total = Math.max(0, result.total);
    }).catch((err: unknown) => {
      if (controller.signal.aborted) return;
      rows = [];
      total = 0;
      errorMessage = err instanceof Error ? err.message : translate(locale, 'table.error');
    }).finally(() => { if (!controller.signal.aborted) loading = false; });
    return () => controller.abort();
  });
  function toggleSort(key: string) {
    if (sortBy === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortBy = key; sortDir = 'asc'; }
    page = 1;
  }
</script>

<section class="space-y-4">
  <div class="flex flex-wrap items-end justify-between gap-3">
    <div class="w-full max-w-xs">
      <Input label={translate(locale, 'common.search')} placeholder={translate(locale, 'table.searchPlaceholder')} bind:value={search} />
    </div>
    <div class="flex items-end gap-2">
      <div class="w-28">
        <Select label={translate(locale, 'table.perPage')} options={sizeOptions} value={String(pageSize)} onchange={(event) => { pageSize = Number(event.currentTarget.value); page = 1; }} />
      </div>
      <Button variant="outline" onclick={() => (refresh += 1)}>{translate(locale, 'table.refresh')}</Button>
    </div>
  </div>
  <div class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
    <table class="w-full min-w-[420px] border-collapse text-left text-sm">
      <thead class="bg-slate-100 dark:bg-slate-900">
        <tr>
          {#each columns as column (column.key)}
            <th scope="col" class="px-4 py-3 font-semibold">
              {#if column.sortable}
                <Button variant="ghost" size="sm" aria-label={`${translate(locale, 'table.sort')} ${column.title}`} onclick={() => toggleSort(column.key)}>
                  {column.title}{sortBy === column.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                </Button>
              {:else}{column.title}{/if}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#if loading}
          <tr><td colspan={columns.length} class="px-4 py-12 text-center"><span role="status">{translate(locale, 'common.loading')}</span></td></tr>
        {:else if errorMessage}
          <tr><td colspan={columns.length} class="px-4 py-12 text-center"><div role="alert">{errorMessage}</div><div class="mt-3"><Button variant="outline" onclick={() => (refresh += 1)}>{translate(locale, 'table.retry')}</Button></div></td></tr>
        {:else if rows.length === 0}
          <tr><td colspan={columns.length} class="px-4 py-12 text-center">{translate(locale, 'common.noResults')}</td></tr>
        {:else}
          {#each rows as row (rowKey(row))}
            <tr class="border-t border-slate-200 dark:border-slate-800">
              {#each columns as column (column.key)}
                <td class="px-4 py-3">{column.value ? (column.value(row) ?? '—') : String(row[column.key] ?? '—')}</td>
              {/each}
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
  <div class="flex flex-wrap items-center justify-between gap-3 text-sm">
    <span aria-live="polite">{translate(locale, 'table.total', { total })}</span>
    <div class="flex items-center gap-3">
      <Button variant="outline" size="sm" disabled={loading || page <= 1} onclick={() => (page -= 1)}>{translate(locale, 'table.previous')}</Button>
      <span>{translate(locale, 'table.page', { page, pages: totalPages })}</span>
      <Button variant="outline" size="sm" disabled={loading || page >= totalPages} onclick={() => (page += 1)}>{translate(locale, 'table.next')}</Button>
    </div>
  </div>
</section>
