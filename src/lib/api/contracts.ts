/** Shared transport DTOs. Opt in only when the Bun endpoint uses these shapes. */
export interface ApiResponse<TData> {
	data: TData;
	success: boolean;
	message?: string;
	code?: string;
}

export interface PaginatedResponse<TItem> {
	items: TItem[];
	total: number;
	page: number;
	pageSize: number;
}

export interface ApiFieldErrors {
	fields?: Record<string, string[]>;
	errors?: Record<string, string | string[]>;
}

export type ApiSortDirection = 'asc' | 'desc';

export interface ApiPageQuery {
	page: number;
	pageSize: number;
	search?: string;
	sortBy?: string;
	sortDir?: ApiSortDirection;
}
