import {
  RoleApprovalQuery,
  RoleApprovalDetails,
  RoleApprovalQueryFilter,
} from '../domain/models/role-approval.model';

export const ROLE_TASK_LIST_PAGE_QUERY_INIT: RoleApprovalQuery = {
  page: 1,
  limit: 10,
  sort: 'createdDt',
  sortDir: 'asc',
  roleId: [],
  name: '',
  description: '',
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

export const ROLE_REQUESTED_LIST_PAGE_QUERY_INIT: RoleApprovalQuery = {
  page: 1,
  limit: 10,
  sort: '',
  sortDir: '',
  roleId: [],
  name: '',
  description: '',
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

export const ROLE_APPROVAL_DETAILS_INIT: RoleApprovalDetails = {
  apprRoleId: 0,
  lastApprRoleId: 0,
  roleId: '',
  roleName: '',
  roleGroup: '',
  roleDescription: '',
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
  isReviewer: false,
  menuIds: [],
};

export const ROLE_APPROVAL_PAGE_QUERY_FILTER_INIT: RoleApprovalQueryFilter = {
  roleId: [],
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

export const ROLE_APPROVAL_LIST_DISPLAY_INIT = [
  { label: 'Role ID - Name', value: null },
  { label: 'Description', value: null },
  { label: 'Requested By', value: null },
  { label: 'Requested Date', value: null },
  { label: 'Reviewed By', value: null },
  { label: 'Reviewed Date', value: null },
  { label: 'Action Type', value: null },
  { label: 'Approval Status', value: null },
];

export const ROLE_APPROVAL_LIST_FILTER_DISPLAY_TEMP_INIT = {
  roleId: '',
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
