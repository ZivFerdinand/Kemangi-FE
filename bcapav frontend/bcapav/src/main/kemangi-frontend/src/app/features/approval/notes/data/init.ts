import { NoteApprovalTempFilter } from '../domain/models/params.model';

export const NOTES_TASK_LIST_PAGE_QUERY_INIT = {
  limit: 10,
  page: 1,
  sort: 'requestDate',
  sortDir: 'asc',
  taskList: true,
  fraudType: '',
  description: '',
  requesterId: [],
  requestDateFrom: '',
  requestDateTo: '',
  requestType: '',
  approvalStatus: 'PENDING',
  approverId: [],
  approvalDateFrom: '',
  approvalDateTo: '',
  noteId: [],
  note: '',
  activeStatus: null,
};

export const NOTE_REQUESTED_LIST_DEFAULT = {
  limit: 10,
  page: 1,
  sort: '',
  sortDir: 'asc',
  taskList: false,
  noteId: null,
  note: null,
  description: null,
  requesterId: null,
  requestDateFrom: null,
  requestDateTo: null,
  requestType: null,
  approvalStatus: '',
  approverId: null,
  approvalDateFrom: null,
  approvalDateTo: null,
  activeStatus: null,
} as const;

export const NOTE_APPROVAL_LIST_DISPLAY_STRUCT = [
  { label: 'Notes', value: null },
  { label: 'Description', value: null },
  { label: 'Requested By', value: null },
  { label: 'Requested Date', value: null },
  { label: 'Reviewed By', value: null },
  { label: 'Reviewed Date', value: null },
  { label: 'Action Type', value: null },
  { label: 'Approval Status', value: null },
];

export const NOTE_APPROVAL_LIST_FILTER_DEFAULT = {
  note: '',
  description: '',
  requesterId: null,
  approverId: null,
  requestDateFrom: '',
  requestDateTo: '',
  approvalDateFrom: '',
  approvalDateTo: '',
  requestType: '',
  approvalStatus: '',
};

export const NOTE_APPROVAL_LIST_FILTER_DISPLAY_TEMP_STRUCT: NoteApprovalTempFilter =
  {
    note: null,
    description: null,
    requestedBy: null,
    approvedBy: null,
    requestDateFrom: null,
    requestDateTo: null,
    approvalDateFrom: null,
    approvalDateTo: null,
    approvalStatus: null,
    requestType: null,
  };

export const NOTE_APPROVAL_DETAILS_DEFAULT = {
  activeStatus: false,
  apprId: '',
  approvalDate: '',
  approvalStatus: '',
  approverId: '',
  approverName: '',
  description: '',
  note: '',
  noteId: '',
  lastApprId: '',
  rejectionNote: '',
  requestDate: '',
  requestType: '',
  requesterId: '',
  requesterName: '',
};

export const NOTES_APPROVAL_PAGE_QUERY_FILTER_INIT = {
  note: '',
  description: '',
  requesterId: [],
  approverId: [],
  requestDateFrom: '',
  requestDateTo: '',
  approvalDateFrom: '',
  approvalDateTo: '',
  requestType: '',
  approvalStatus: '',
};

export const NOTES_APPROVAL_LIST_FILTER_DISPLAY_TEMP_INIT = {
  note: null,
  description: null,
  requestedBy: null,
  approvedBy: null,
  requestDateFrom: null,
  requestDateTo: null,
  approvalDateFrom: null,
  approvalDateTo: null,
  approvalStatus: null,
  requestType: null,
};

export const NOTES_REQUESTED_LIST_PAGE_QUERY_INIT = {
  limit: 10,
  page: 1,
  sort: '',
  sortDir: '',
  taskList: false,
  fraudType: '',
  description: '',
  requesterId: [],
  requestDateFrom: '',
  requestDateTo: '',
  requestType: '',
  approvalStatus: '',
  approverId: [],
  approvalDateFrom: '',
  approvalDateTo: '',
  noteId: [],
  note: '',
  activeStatus: null,
};
