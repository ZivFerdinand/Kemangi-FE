import { TableParams, TableQuery } from '../../../../shared';

export interface Threshold {
  id: number;
  modelId: string | null;
  modelName: string | null;
  modelDescription: string | null;
  productType: string | null;
  roleGroup: string | null;
  afrisType: string | null;
  eventType: string | null;
  detectionType: string | null;
  createdByName: string | null;
  lastUpdatedByName: string | null;
  attachment: any[];
  lastUpdatedDt: string | null;
  createdDt: string | null;
  lastApproval1Name: string | null;
  lastApproval2Name: string | null;
  lastApproval1Dt: string | null;
  lastApproval2Dt: string | null;
  activeStatus: boolean;
  hasPendingRequest: boolean;
  thresholdDetails: ThresholdDetails[];
}

export interface ThresholdApproval {
  id: number;
  modelId: string | null;
  modelName: string | null;
  modelDescription: string | null;
  productType: string | null;
  detectionType: string | null;
  approvalStatus: string | null;
  activeStatus: string | null;
  rejectionNote: string | null;
  requestType: string | null;
  requesterName: string | null;
  approval1Name: string | null;
  requesterDate: string | null;
  approval1Date: string | null;
  approval2Date: string | null;
  thresholdDetails: ThresholdDetails[];
}

export interface ThresholdQuery extends TableQuery {
  name: string;
  description: string;
  product_type: string;
  reviewer_2_date_from: string | null;
  reviewer_2_date_to: string | null;
  active_status: boolean | null;
}

export interface ThresholdApprovalQuery extends TableQuery {
  name: string;
  description: string;
  product_type: string;
  approval_status: string;
  rejection_notes: string;
  task_list: boolean | null;
  reviewer_2_date_from: string | null;
  reviewer_2_date_to: string | null;
  reviewer_1_date_from: string | null;
  reviewer_1_date_to: string | null;
  active_status: boolean | null;
  reviewer1_done: boolean | null;
}

export interface ThresholdDetails {
  id: string | null;
  modelId: string | null;
  thresholdId: string | null;
  thresholdName: string | null;
  thresholdScore: string | null;
  thresholdDescription: string | null;
  alert: boolean;
  activeStatus: boolean;
}

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
  name: string;
  description: string;
  active_status: boolean | null;
  requester_id: Array<string>;
  approver_id: Array<string>;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}
export interface EditedThresholdIdData {
  id: string;
  active_status: boolean;
  threshold_score: number;
  alert: boolean;
}

export interface ThresholdCurrentListParams extends TableParams {
  name: string;
  description: string;
  product_type: string;
  reviewer_2_date_from: string | null;
  reviewer_2_date_to: string | null;
  active_status: boolean | null;
}
export interface ThresholdRequestedListParams extends TableParams {
  name: string;
  description: string;
  product_type: string;
  approval_status: string;
  rejection_notes: string;
  task_list: boolean | null;
  reviewer_2_date_from: string | null;
  reviewer_2_date_to: string | null;
  reviewer_1_date_from: string | null;
  reviewer_1_date_to: string | null;
  active_status: boolean | null;
  reviewer1_done: boolean | null;
}
export interface ThresholdIdDetailParams extends TableParams {
  id: string;
  model_id: string;
}

export interface ThresholdCurrentListFilterParams {
  model_name: string;
  model_description: string;
  product_type: string;
  active_status: boolean | null;
  reviewer_2_date_from: string | null;
  reviewer_2_date_to: string | null;
}

export interface ThresholdRequestedListFilterParams {
  model_name: string;
  model_description: string;
  product_type: string;
  approval_status: string;
  request_type: string;
  rejection_notes: string;
  requester_id: string[];
  reviewer_1_id: string[];
  reviewer_2_date_from: string | null;
  reviewer_2_date_to: string | null;
  reviewer_1_date_from: string | null;
  reviewer_1_date_to: string | null;
}

export interface RoleApprovalDetails {
  active_status: boolean;
  appr_role_id: number;
  approval_date: string | null;
  approval_status: string;
  approver_id: number | null;
  approver_name: string | null;
  is_reviewer: boolean;
  last_appr_role_id: number;
  menu_ids: Array<number>;
  rejection_note: string | null;
  request_date: string;
  request_type: string;
  requester_id: string;
  requester_name: string;
  role_description: string;
  role_group: string;
  role_id: string;
  role_name: string;
  old_data: OldRoleApprovalDetails;
}

export interface OldRoleApprovalDetails {
  active_status: boolean;
  appr_role_id: number;
  approval_date: string | null;
  approval_status: string;
  approver_id: number | null;
  approver_name: string | null;
  is_reviewer: boolean;
  last_appr_role_id: number;
  menu_ids: Array<number>;
  rejection_note: string | null;
  request_date: string;
  request_type: string;
  requester_id: string;
  requester_name: string;
  role_description: string;
  role_group: string;
  role_id: string;
  role_name: string;
}

export interface DataGroupListFilterParams {
  name: string;
  description: string;
  active_status: boolean | null;
  requester_id: Array<string>;
  approver_id: Array<string>;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface DataGroupDraftRequestedListParams extends TableParams {
  data_group_id: Array<string>;
  name: string;
  description: string;
  active_status: boolean | null;
  draft: boolean | null;
  request_type: string;
  approval_status: string;
  requester_id: Array<string>;
  approver_id: Array<string>;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface DataGroupDraftListFilterParams {
  name: string;
  data_group_id: Array<string>;
  description: string;
  active_status: boolean | null;
  approval_status: string;
  approver_id: Array<string>;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface DataGroupDraftRequestedListFilterParams {
  data_group_id: Array<string>;
  name: string;
  description: string;
  active_status: boolean | null;
  draft: boolean | null;
  request_type: string;
  approval_status: string;
  requester_id: Array<string>;
  approver_id: Array<string>;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}
