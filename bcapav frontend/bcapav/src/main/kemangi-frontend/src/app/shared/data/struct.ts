import { TableParams } from '../interfaces';

export const PAGE_INFO_STRUCT = {
  totalElements: 0,
  totalPages: 1,
};

export const PAGE_PARAM_STRUCT: TableParams = {
  limit: 10,
  page: 1,
  sort: null,
  sort_dir: 'asc',
};
