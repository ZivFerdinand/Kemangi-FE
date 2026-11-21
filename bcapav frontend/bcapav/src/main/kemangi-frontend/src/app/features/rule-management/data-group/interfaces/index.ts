import { TableParams } from '../../../../shared';

export interface DataGroupCurrentTableParams extends TableParams {
  name: string;
  description: string;
  active_status: boolean | null;
  requester_id: string;
  approver_id: string;
  request_date_from: string;
  request_date_to: string;
  approval_date_from: string;
  approval_date_to: string;
}

export interface DataGroupDraftTableParams extends TableParams {
  name: string;
  description: string;
  active_status: boolean | null;
  draft: boolean | null;
  request_type: string;
  approval_status: string;
  requester_id: string;
  approver_id: string;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface DataGroupRequestedTableParams extends TableParams {
  name: string;
  description: string;
  active_status: boolean | null;
  draft: boolean | null;
  request_type: string;
  approval_status: string;
  requester_id: string;
  approver_id: string;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface DataGroupCurrentTable {
  data_group_id: number;
  data_group_name: string;
  data_group_description: string;
  rule_relation: number;
  dynamic_watch_list: boolean;
  requester_id: string;
  request_date: string;
  review_id: string;
  review_date: string;
  active_status: boolean;
  has_pending_request: boolean;
  has_user_relation: boolean;
}

export interface DataGroupCurrentTableFilter {
  name: string;
  description: string;
  active_status: boolean;
  requester_id: string;
  approver_id: string;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface DataGroupDraftTableFilter {
  name: string;
  description: string;
  active_status: boolean | null;
  draft: boolean | null;
  request_type: string;
  approval_status: string;
  requester_id: string;
  approver_id: string;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface DataGroupRequestedTableFilter {
  name: string;
  description: string;
  active_status: boolean | null;
  draft: boolean | null;
  request_type: string;
  approval_status: string;
  requester_id: string;
  approver_id: string;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface DataGroupDraftTable {
  data_group_id: number;
  data_group_name: string;
  data_group_description: string;
  rule_relation: number;
  dynamic_watch_list: boolean;
  requester_id: string;
  request_date: string;
  review_id: string;
  review_date: string;
  active_status: boolean;
  has_pending_request: boolean;
  has_user_relation: boolean;
  approval_status: string;
}

export interface DataGroupRequestedTable {
  id: number;
  data_group_id: string;
  data_group_name: string;
  data_group_description: string;
  rule_relation: number;
  dynamic_watch_list: boolean;
  requester_id: string;
  request_date: string;
  review_id: string;
  review_date: string;
  active_status: boolean;
  approval_status: string;
  rejects_notes: string;
  request_type: string;
}

export interface DataGroupListParams extends TableParams {
  data_group_id: Array<string> | null;
  name: string | null;
  description: string | null;
  active_status: boolean | null;
  dynamic_watch_list: boolean | null;
  requester_id: Array<string> | null;
  approver1_id: Array<string> | null;
  approver2_id: Array<string> | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval1_date_from: string | null;
  approval1_date_to: string | null;
  approval2_date_from: string | null;
  approval2_date_to: string | null;
}

export interface DataGroupListFilterParams {
  data_group_id: Array<string> | null;
  name: string | null;
  description: string | null;
  active_status: boolean | null;
  requester_id: Array<string> | null;
  approver1_id: Array<string> | null;
  approver2_id: Array<string> | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval1_date_from: string | null;
  approval1_date_to: string | null;
  approval2_date_from: string | null;
  approval2_date_to: string | null;
}

export interface DataGroupDraftRequestedListParams extends TableParams {
  data_group_id: Array<string> | null;
  name: string | null;
  description: string | null;
  active_status: boolean | null;
  draft: boolean | null;
  request_type: string | null;
  approval_status: string | null;
  requester_id: Array<string> | null;
  approver_id: Array<string> | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface DataGroupDraftListFilterParams {
  name: string | null;
  description: string | null;
  active_status: boolean | null;
  approval_status: string | null;
  approver_id: Array<string> | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface DataGroupRequestedListFilterParams {
  data_group_id: Array<string> | null;
  name: string | null;
  description: string | null;
  active_status: boolean | null;
  request_type: string | null;
  approval_status: string | null;
  requester_id: Array<string> | null;
  approver_id: Array<string> | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface DataGroupDetailsProps {
  id?: number;
  appr_id?: number;
  last_appr_id: number | null;
  data_group_id: string | null;
  name: string | null;
  description: string | null;
  dynamic_watch_list: boolean;
  active_status: boolean;
  detail_values: any[] | null;
  request_type: string | null;
  approval_status: string | null;
  requester_id: string | null;
  requester_name: string | null;
  request_date: string | null;
  approver_id: string | null;
  approver_name: string | null;
  approval_date: string | null;
  rejection_note: string | null;
}

export interface DataGroupFilterDisplayTempStruct {
  data_group_name: string | null;
  description: string | null;
  requested_by: string | null;
  reviewed_by: string | null;
  request_date_from: string | null;
  request_date_to: string | null;
  reviewed_date_from: string | null;
  reviewed_date_to: string | null;
  status: string | null;
}

export interface DataGroupDraftFilterDisplayTempStruct {
  data_group_name: string | null;
  description: string | null;
  reviewed_by: string | null;
  request_date_from: string | null;
  request_date_to: string | null;
  reviewed_date_from: string | null;
  reviewed_date_to: string | null;
  active_status: string | null;
  approval_status: string | null;
}

export interface DataGroupRequestedFilterDisplayTempStruct {
  data_group_id: string | null;
  data_group_name: string | null;
  description: string | null;
  requested_by: string | null;
  reviewed_by: string | null;
  request_date_from: string | null;
  request_date_to: string | null;
  reviewed_date_from: string | null;
  reviewed_date_to: string | null;
  active_status: string | null;
  approval_status: string | null;
  action_type: string | null;
}

export interface DataGroupFiltersDisplayStruct {
  label: string;
  value: string | null;
}
