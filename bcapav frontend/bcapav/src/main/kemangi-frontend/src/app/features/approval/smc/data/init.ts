export const SMC_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT = {
  page: 1,
  limit: 10,
  sort: '',
  sortDir: '',
  action: '',
  accountType: '',
  taskList: null,
  requesterId: [],
  requestDateFrom: '',
  requestDateTo: '',
  retryFlag: null,
  processStatus: '',
  approvalStatus: '',
  approverId: [],
  approvalDateFrom: '',
  approvalDateTo: '',
};

export const SMC_APPROVAL_REQUESTED_LIST_DISPLAY_INIT = [
  { label: 'Account Type', value: null },
  { label: 'Action', value: null },
  { label: 'Requested By', value: null },
  { label: 'Requested Date', value: null },
  { label: 'Reviewed By', value: null },
  { label: 'Reviewed Date', value: null },
  { label: 'Process Status', value: null },
  { label: 'Approval Status', value: null },
];

export const SMC_APPROVAL_TASK_LIST_PAGE_QUERY_INIT = {
  page: 1,
  limit: 10,
  sort: 'requestDate',
  sortDir: 'asc',
  action: '',
  accountType: '',
  taskList: true,
  retryFlag: null,
  requesterId: [],
  requestDateFrom: '',
  requestDateTo: '',
  processStatus: '',
  approvalStatus: '',
  approverId: [],
  approvalDateFrom: '',
  approvalDateTo: '',
};

export const SMC_APPROVAL_TASK_LIST_DISPLAY_INIT = [
  { label: 'Account Type', value: null },
  { label: 'Action', value: null },
  { label: 'Requested By', value: null },
  { label: 'Requested Date', value: null },
];

export const SMC_APPROVAL_PAGE_QUERY_FILTER_INIT = {
  accountType: '',
  action: '',
  requesterId: [],
  requestDateFrom: '',
  requestDateTo: '',
  processStatus: '',
  approvalStatus: '',
  approverId: [],
  approvalDateFrom: '',
  approvalDateTo: '',
};

export const SMC_APPROVAL_LIST_FILTER_DISPLAY_TEMP_INIT = {
  accountType: '',
  action: '',
  requestedBy: '',
  requestDateFrom: '',
  requestDateTo: '',
  approvedBy: '',
  approvalDateFrom: '',
  approvalDateTo: '',
  processStatus: '',
  approvalStatus: '',
};
