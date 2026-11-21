import {
  DataGroupListParams,
  DataGroupDraftRequestedListParams,
  DataGroupDraftListFilterParams,
  DataGroupRequestedListFilterParams,
  DataGroupFilterDisplayTempStruct,
  DataGroupDraftFilterDisplayTempStruct,
  DataGroupRequestedFilterDisplayTempStruct,
} from '../interfaces';

export const dataGroupListFilterStruct = {
  name: null,
  description: null,
  active_status: null,
  requester_id: null,
  approver_id: null,
  request_date_from: null,
  request_date_to: null,
  approval_date_from: null,
  approval_date_to: null,
};

// export const DATA_GROUP_LIST_PARAMS_STRUCT: DataGroupListParams = {
//   limit: 10,
//   page: 1,
//   sort: null,
//   sort_dir: 'asc',
//   name: null,
//   description: null,
//   active_status: null,
//   requester_id: null,
//   approver1_id: null,
//   request_date_from: null,
//   request_date_to: null,
//   approval1_date_from: null,
//   approval1_date_to: null,
// };

export const DATA_GROUP_TASK_LIST_PARAMS_STRUCT: DataGroupDraftRequestedListParams =
  {
    limit: 10,
    page: 1,
    sort: null,
    sort_dir: 'asc',
    data_group_id: null,
    name: null,
    description: null,
    active_status: null,
    draft: true,
    request_type: null,
    approval_status: null,
    requester_id: null,
    approver_id: null,
    request_date_from: null,
    request_date_to: null,
    approval_date_from: null,
    approval_date_to: null,
  };

export const DATA_GROUP_REQUESTED_LIST_PARAMS_STRUCT: DataGroupDraftRequestedListParams =
  {
    limit: 10,
    page: 1,
    sort: null,
    sort_dir: 'asc',
    data_group_id: null,
    name: null,
    description: null,
    active_status: null,
    draft: null,
    request_type: null,
    approval_status: null,
    requester_id: null,
    approver_id: null,
    request_date_from: null,
    request_date_to: null,
    approval_date_from: null,
    approval_date_to: null,
  };

export const DATA_GROUP_DRAFT_FILTER_STRUCT: DataGroupDraftListFilterParams = {
  name: null,
  description: null,
  active_status: null,
  approval_status: null,
  approver_id: null,
  request_date_from: null,
  request_date_to: null,
  approval_date_from: null,
  approval_date_to: null,
};

export const DATA_GROUP_APPROVAL_FILTER_STRUCT: DataGroupRequestedListFilterParams =
  {
    name: null,
    data_group_id: null,
    description: null,
    active_status: null,
    approval_status: null,
    requester_id: null,
    approver_id: null,
    request_date_from: null,
    request_date_to: null,
    approval_date_from: null,
    approval_date_to: null,
    request_type: null,
  };

export const DATA_GROUP_FILTER_STRUCT = {
  name: null,
  description: null,
  active_status: null,
  requester_id: null,
  approver_id: null,
  request_date_from: null,
  request_date_to: null,
  approval_date_from: null,
  approval_date_to: null,
};

export const DATA_GROUP_FILTER_DISPLAY_TEMP_STRUCT: DataGroupFilterDisplayTempStruct =
  {
    data_group_name: null,
    description: null,
    requested_by: null,
    reviewed_by: null,
    request_date_from: null,
    request_date_to: null,
    reviewed_date_from: null,
    reviewed_date_to: null,
    status: null,
  };

export const DATA_GROUP_DRAFT_FILTER_DISPLAY_TEMP_STRUCT: DataGroupDraftFilterDisplayTempStruct =
  {
    data_group_name: null,
    description: null,
    reviewed_by: null,
    request_date_from: null,
    request_date_to: null,
    reviewed_date_from: null,
    reviewed_date_to: null,
    active_status: null,
    approval_status: null,
  };

export const DATA_GROUP_REQUESTED_FILTER_DISPLAY_TEMP_STRUCT: DataGroupRequestedFilterDisplayTempStruct =
  {
    data_group_id: null,
    data_group_name: null,
    description: null,
    requested_by: null,
    reviewed_by: null,
    request_date_from: null,
    request_date_to: null,
    reviewed_date_from: null,
    reviewed_date_to: null,
    active_status: null,
    approval_status: null,
    action_type: null,
  };

export const DATA_GROUP_DISPLAY_STRUCT = [
  { label: 'Data Group Name', value: null },
  { label: 'Description', value: null },
  { label: 'Requested By', value: null },
  { label: 'Reviewed By', value: null },
  { label: 'Requested Date', value: null },
  { label: 'Reviewed Date', value: null },
  { label: 'On/Off', value: null },
];

export const DATA_GROUP_DRAFT_DISPLAY_STRUCT = [
  { label: 'Data Group Name', value: null },
  { label: 'Description', value: null },
  { label: 'Reviewed By', value: null },
  { label: 'Requested Date', value: null },
  { label: 'Reviewed Date', value: null },
  { label: 'On/Off', value: null },
  { label: 'Status', value: null },
];

export const DATA_GROUP_REQUESTED_DISPLAY_STRUCT = [
  { label: 'Data Group ID', value: null },
  { label: 'Data Group Name', value: null },
  { label: 'Description', value: null },
  { label: 'Requested By', value: null },
  { label: 'Reviewed By', value: null },
  { label: 'Requested Date', value: null },
  { label: 'Reviewed Date', value: null },
  { label: 'On/Off', value: null },
  { label: 'Approval Status', value: null },
  { label: 'Action Type', value: null },
];
