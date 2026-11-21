export const PAYMENT_PAGE_QUERY_INIT = {
  limit: 10,
  page: 1,
  sort: '',
  sortDir: '',
  cin: null,
  paymentId: null,
  customerName: null,
  bankName: null,
  productType: null,
  requestType: null,
  actionStatus: null,
  requestDateFrom: null,
  requestDateTo: null,
  actionDateFrom: null,
  actionDateTo: null,
};

export const PAYMENT_PAGE_TASK_QUERY_INIT = {
  limit: 10,
  page: 1,
  sort: '',
  sortDir: '',
  cin: null,
  paymentId: null,
  customerName: null,
  bankName: null,
  productType: null,
  requestType: null,
  actionStatus: 'FAILED',
  requestDateFrom: null,
  requestDateTo: null,
  actionDateFrom: null,
  actionDateTo: null,
};

export const PAYMENT_ID_TASK_LIST_PAGE_QUERY_FILTER_INIT = {
  cin: null,
  paymentId: null,
  customerName: null,
  bankName: null,
  productType: null,
  requestType: null,
  actionStatus: 'FAILED',
  requestDateFrom: null,
  requestDateTo: null,
  actionDateFrom: null,
  actionDateTo: null,
};

export const PAYMENT_ID_TASK_LIST_FILTER_DISPLAY_TEMP_INIT = {
  action: null,
  customerName: null,
  requestDateFrom: null,
  requestDateTo: null,
  requestType: null,
  actionDateFrom: null,
  actionDateTo: null,
  bankName: null,
  paymentId: null,
  productType: null,
  cin: null,
};

export const PAYMENT_ID_HISTORY_LIST_PAGE_QUERY_FILTER_INIT = {
  cin: null,
  paymentId: null,
  customerName: null,
  bankName: null,
  productType: null,
  requestType: null,
  actionStatus: null,
  requestDateFrom: null,
  requestDateTo: null,
  actionDateFrom: null,
  actionDateTo: null,
};

export const PAYMENT_ID_HISTORY_LIST_FILTER_DISPLAY_TEMP_INIT = {
  action: null,
  customerName: null,
  requestDateFrom: null,
  requestDateTo: null,
  requestType: null,
  actionDateFrom: null,
  actionDateTo: null,
  bankName: null,
  paymentId: null,
  productType: null,
  cin: null,
};

export const PAYMENT_ID_TASK_LIST_DISPLAY_INIT = [
  { label: 'Request Date', value: null },
  { label: 'Request Type', value: null },
  { label: 'Last Action Date', value: null },
  { label: 'Payment ID', value: null },
  { label: 'Customer Name', value: null },
  { label: 'Bank Name', value: null },
  { label: 'Product List', value: null },
  { label: 'CIN', value: null },
  { label: 'Last Action Status', value: null },
];

export const PAYMENT_ID_DETAILS_INIT = {
  requestDate: null,
  requestType: null,
  lastActionDate: null,
  lastActionStatus: null,
  paymentId: null,
  customerName: null,
  bankName: null,
  productList: null,
  cin: null,
  id: 0,
};
