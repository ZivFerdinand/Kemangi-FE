export const ALERT_DETAILS_INIT = {
  name: null,
  description: null,
  activeStatus: false,
  approvalStatus: null,
  rejectionNote: null,
  createdName: null,
  createdDate: null,
  requesterName: null,
  requestDate: null,
  approver1Name: null,
  approval1Date: null,
  approver2Name: null,
  approval2Date: null,
  assignTo: null,
};

export const ALERT_QUEUE_TABLE_QUERY_INIT = {
  limit: 10,
  page: 1,
  sort: 'lastApproval2Dt',
  sortDir: 'desc',
  name: null,
  description: null,
  activeStatus: null,
  assignTo: [],
  requesterId: [],
  approver1Id: [],
  approver2Id: [],
  requestDateFrom: null,
  requestDateTo: null,
  approval1DateFrom: null,
  approval1DateTo: null,
  approval2DateFrom: null,
  approval2DateTo: null,
};

export const ALERT_QUEUE_TABLE_QUERY_FILTER_INIT = {
  name: null,
  description: null,
  activeStatus: null,
  assignTo: [],
  requesterId: [],
  approver1Id: [],
  approver2Id: [],
  requestDateFrom: null,
  requestDateTo: null,
  approval1DateFrom: null,
  approval1DateTo: null,
  approval2DateFrom: null,
  approval2DateTo: null,
};

export const ALERT_QUEUE_FILTER_DISPLAY_TEMP_INIT = {
  name: '',
  description: '',
  assignTo: '',
  requestedBy: '',
  requestDateFrom: '',
  requestDateTo: '',
  status: '',
  approval1DateFrom: '',
  approval1DateTo: '',
  approved1By: '',
  approval2DateFrom: '',
  approval2DateTo: '',
  approved2By: '',
};

export const ALERT_QUEUE_FILTER_DISPLAY_INIT = [
  { label: 'Queue Name', value: null },
  { label: 'Queue Description', value: null },
  { label: 'Assign To', value: null },
  { label: 'On/Off', value: null },
  { label: 'Requested By', value: null },
  { label: 'Requested Date', value: null },
  { label: 'Review 1 By', value: null },
  { label: 'Review 1 Date', value: null },
  { label: 'Review 2 By', value: null },
  { label: 'Review 2 Date', value: null },
];

export const ASSIGN_TO_TABLE_QUERY_INIT = {
  limit: 10,
  page: 1,
  sort: '',
  sortDir: '',
  userId: null,
  userName: null,
  roleName: null,
};

export const ALERT_QUEQUE_DETAILS_INIT = {
  queueId: null,
  id: null,
  apprId: null,
  lastApprId: null,
  name: null,
  description: null,
  activeStatus: false,
  requestType: null,
  approvalStatus: null,
  createdBy: null,
  createdByName: null,
  createdDt: null,
  requesterId: null,
  requesterName: null,
  requestDate: null,
  approver1Id: null,
  approver1Name: null,
  approval1Date: null,
  approver2Id: null,
  approver2Name: null,
  approval2Date: null,
  rejectionNote: null,
  assignTo: [],
  details: [],
};

export const ALERT_QUEQUE_DETAILS_INIT_2 = {
  queueId: null,
  id: null,
  name: null,
  description: null,
  activeStatus: false,
  createdBy: null,
  createdByName: null,
  createdDt: null,
  lastUpdatedBy: null,
  lastUpdatedByName: null,
  lastUpdatedDt: null,
  lastApproval1By: null,
  lastApproval1Name: null,
  lastApproval1Dt: null,
  lastApproval2By: null,
  lastApproval2Name: null,
  lastApproval2Dt: null,
  assignTo: [],
  details: [],
};

export const USER_MASTER_DATA_QUERY_INIT = {
  userId: null,
  userName: null,
  roleName: null,
};

export const MODEL_PRIORITY_BOX_INIT = [
  {
    priority: 1,
    name: 'High Priority',
    levels: [],
  },
  {
    priority: 2,
    name: 'Medium Priority',
    levels: [],
  },
  {
    priority: 3,
    name: 'Low Priority',
    levels: [],
  },
];
