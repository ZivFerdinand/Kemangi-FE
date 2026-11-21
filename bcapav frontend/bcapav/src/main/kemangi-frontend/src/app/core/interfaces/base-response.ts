export interface BaseResponse {
  statusCode: string;
  message: string;
  errorMessages: string;
  data: Content<any>;
}

interface Content<T> {
  total_recall: any;
  total_precision: any;
  content: [];
  pageable: PageAble;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  sort: Sort;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}

interface PageAble {
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: true;
  unpaged: false;
}

interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
