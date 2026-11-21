import {
  RoleApprovalDefaultFilter,
  RoleApprovalDisplayFilter,
  RolesApprovalParams,
  RoleRequestedFilterDisplayTempStruct,
} from '../interfaces';

export const defaultFilter: RoleApprovalDefaultFilter = {
  role_id: [],
  name: '',
  description: '',
  requester_id: [],
  approver_id: [],
  request_date_from: '',
  request_date_to: '',
  approval_date_from: '',
  approval_date_to: '',
  request_type: '',
  approval_status: '',
};

export const roleApprovalDisplayFilter: RoleApprovalDisplayFilter = {
  role_id_name: null,
  description: null,
  requested_by: null,
  approved_by: null,
  request_date_from: null,
  request_date_to: null,
  approval_date_from: null,
  approval_date_to: null,
  type: null,
  status: null,
};

export const ROLE_APPROVAL_REQUESTED_LIST_DISPLAY_STRUCT = [
  { label: 'Role ID - Role Name', value: null },
  { label: 'Description', value: null },
  { label: 'Requested By', value: null },
  { label: 'Requested Date', value: null },
  { label: 'Approved By', value: null },
  { label: 'Approved Date', value: null },
  { label: 'Type', value: null },
  { label: 'Status', value: null },
];

export const ROLE_APPROVAL_REQUESTED_LIST_FILTER_STRUCT = {
  role_id: null,
  name: null,
  description: null,
  requester_id: null,
  approver_id: null,
  request_date_from: null,
  request_date_to: null,
  approval_date_from: null,
  approval_date_to: null,
  request_type: null,
  approval_status: null,
};

export const ROLE_APPROVAL_REQUESTED_LIST_FILTER_DISPLAY_TEMP_STRUCT: RoleRequestedFilterDisplayTempStruct =
  {
    role_id_name: null,
    description: null,
    requested_by: null,
    approved_by: null,
    request_date_from: null,
    request_date_to: null,
    approval_date_from: null,
    approval_date_to: null,
    approval_status: null,
    request_type: null,
  };

export const ROLE_APPROVAL_REQUESTED_LIST_PARAMS_STRUCT: RolesApprovalParams = {
  limit: 10,
  page: 1,
  sort: null,
  sort_dir: 'asc',
  role_id: null,
  task_list: false,
  name: null,
  description: null,
  requester_id: null,
  approver_id: null,
  request_date_from: null,
  request_date_to: null,
  approval_date_from: null,
  approval_date_to: null,
  request_type: null,
  approval_status: null,
};
