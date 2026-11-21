import {
  BinApprovalQuery,
  BinApprovalDetails,
  BinApprovalQueryFilter,
} from '../domain/models/bin-approval.model';

export const BIN_TASK_LIST_PAGE_QUERY_INIT: BinApprovalQuery = {
  page: 1,
  limit: 10,
  sort: 'requestDate',
  sortDir: 'asc',
  binNumberId: [],
  binNumber: '',
  description: '',
  activeStatus: null,
  taskList: true,
  requestType: '',
  approvalStatus: 'PENDING',
  requesterId: [],
  approverId: [],
  requestDateFrom: '',
  requestDateTo: '',
  approvalDateFrom: '',
  approvalDateTo: '',
};

export const BIN_REQUESTED_LIST_PAGE_QUERY_INIT: BinApprovalQuery = {
  page: 1,
  limit: 10,
  sort: '',
  sortDir: '',
  binNumberId: [],
  binNumber: '',
  description: '',
  activeStatus: null,
  taskList: false,
  requestType: '',
  approvalStatus: '',
  requesterId: [],
  approverId: [],
  requestDateFrom: '',
  requestDateTo: '',
  approvalDateFrom: '',
  approvalDateTo: '',
};

export const BIN_APPROVAL_DETAILS_INIT: BinApprovalDetails = {
  apprId: 0,
  lastApprId: '',
  binNumberId: 0,
  binNumber: '',
  binDescription: '',
  activeStatus: false,
  requestType: '',
  approvalStatus: '',
  requesterId: '',
  requesterName: '',
  requestDate: '',
  approverId: '',
  approverName: '',
  approvalDate: '',
  rejectionNote: '',
};

export const BIN_APPROVAL_PAGE_QUERY_FILTER_INIT: BinApprovalQueryFilter = {
  binNumber: '',
  description: '',
  requestType: '',
  approvalStatus: '',
  requesterId: [],
  approverId: [],
  requestDateFrom: '',
  requestDateTo: '',
  approvalDateFrom: '',
  approvalDateTo: '',
};

export const BIN_APPROVAL_LIST_DISPLAY_INIT = [
  { label: 'BIN', value: null },
  { label: 'Description', value: null },
  { label: 'Requested By', value: null },
  { label: 'Requested Date', value: null },
  { label: 'Reviewed By', value: null },
  { label: 'Reviewed Date', value: null },
  { label: 'Action Type', value: null },
  { label: 'Approval Status', value: null },
];

export const BIN_APPROVAL_LIST_FILTER_DISPLAY_TEMP_INIT = {
  binNumber: '',
  description: '',
  requestedBy: '',
  requestDateFrom: '',
  requestDateTo: '',
  requestType: '',
  approvalStatus: '',
  approvalDateFrom: '',
  approvalDateTo: '',
  approvedBy: '',
};
