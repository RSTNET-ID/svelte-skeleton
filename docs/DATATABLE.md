# Server-side DataTable

Import `DataTable` from `#lib/components/ui/index.ts`. The generic component accepts `columns`, `rowKey`, `fetchPage`, `pageSizes`, `debounceMs` and `initialPageSize`.

`fetchPage(query, signal)` returns `{ items, total }`. Query includes `page` (1-based), `pageSize`, `search`, optional `sortBy` and `sortDir`. The callback must use AbortSignal with fetch, and the Bun API must enforce a maximum page size, allowlisted sort columns, tenant/permission filters and stable ordering.

Sorting, search and pagination execute on the server. Typing is debounced, old requests are cancelled and stale responses ignored. Generic cells support `value(row)` for display formatting. Never inject raw HTML from API data.

All captions use shared ID/EN dictionaries. The DataTable internally uses mandatory base Input/Select/Button components. Do not implement page-local table form controls.

Example:

```svelte
<script lang="ts">
  import { DataTable } from '#lib/components/ui/index.ts';
  const columns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email' }
  ];
  async function fetchPage(query, signal) {
    const url = '/api/users?' + new URLSearchParams({
      page: String(query.page),
      limit: String(query.pageSize),
      search: query.search,
      sort: query.sortBy ?? '',
      order: query.sortDir ?? 'asc'
    });
    const response = await fetch(url, { signal, credentials: 'include' });
    if (!response.ok) throw new Error('Failed to load users');
    return response.json(); // { items, total }
  }
</script>
<DataTable {columns} {fetchPage} rowKey={(row) => String(row.id)} />
```
