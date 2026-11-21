import { TableQuery } from '../interfaces';

export const PAGE_QUERY_INIT: TableQuery = {
  limit: 10,
  page: 1,
  sort: '',
  sortDir: '',
};

export const PAGE_INFO_INIT = {
  totalElements: 0,
  totalPages: 0,
};
