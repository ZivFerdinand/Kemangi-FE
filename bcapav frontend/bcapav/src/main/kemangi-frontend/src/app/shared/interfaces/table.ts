export interface TableParams {
  limit: number;
  page: number;
  sort: string | null;
  sort_dir: 'asc' | 'desc' | string | null;
}

export interface TableQuery {
  limit: number;
  page: number;
  sort: string;
  sortDir: 'asc' | 'desc' | string;
}

export interface TableQueryApi {
  limit: number;
  page: number;
  sort: string | null;
  sort_dir: 'asc' | 'desc' | string | null;
}

export interface DropdownListQuery {
  limit?: number;
  draft?: boolean;
  query?: string;
  taskList?: boolean;
  reviewer1Done?: boolean;
}

export interface DropdownListQueryApi {
  limit?: number;
  draft?: boolean;
  query?: string;
  task_list?: boolean;
  reviewer1_done?: boolean;
}

export type TableState<T> = T & TableQuery;

export interface PageInfo {
  totalElements: number;
  totalPages: number;
}
