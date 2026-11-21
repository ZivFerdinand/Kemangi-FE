import { TableQueryApi } from '../../../../shared/interfaces';

export interface AlertQueueQueryApi extends TableQueryApi {
  name: string | null;
  description: string | null;
  active_status: boolean | null;
  assign_to: Array<string> | null;
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

export interface AlertQueueDetailsApi {
  queue_id: string | null;
  id: number;
  name: string | null;
  description: string | null;
  active_status: boolean;
  created_by: string | null;
  created_by_name: string | null;
  created_dt: string | null;
  last_updated_by: string | null;
  last_updated_by_name: string | null;
  last_updated_dt: string | null;
  last_approval1_by: string | null;
  last_approval1_name: string | null;
  last_approval1_dt: string | null;
  last_approval2_by: string | null;
  last_approval2_name: string | null;
  last_approval2_dt: string | null;
  assign_to: string[];
  details: RuleModelDetailApi[];
}

export interface AlertQueueDetailsApprovalApi {
  queue_id: string | null;
  appr_id: number;
  last_appr_id: number | null;
  name: string | null;
  description: string | null;
  active_status: boolean;
  request_type: string;
  approval_status: string;
  requester_id: string | null;
  requester_name: string | null;
  request_date: string | null;
  approver1_id: string | null;
  approver1_name: string | null;
  approval1_date: string | null;
  approver2_id: string | null;
  approver2_name: string | null;
  approval2_date: string | null;
  rejection_note: string | null;
  assign_to: string[];
  details: RuleModelDetailApi[];
}

export interface AssignToQueryApi extends TableQueryApi {
  user_id: string | null;
  user_name: string | null;
  role_name: string | null;
}

export interface RuleModelDetailApi {
  priority_type: number;
  priority_level: number;
  priority_seq: number;
  product_type: string;
  item_type: string;
  item_id: string;
  item_name: string;
}

export interface RuleModelPayloadApi {
  priority_type: number;
  priority_level: number;
  priority_seq: number;
  product_type: string;
  item_type: string;
  item_id: string;
}

export interface RuleModelDetail {
  priority_type: number;
  priority_level: number;
  priority_seq: number;
  product_type: string;
  item_type: string;
  item_id: string;
}

export interface AlertQueuePayloadApi {
  queue_id: string | null;
  active_status: boolean;
  name: string | null;
  description: string | null;
  details: RuleModelPayloadApi[];
  assign_to: string[];
}

export interface UserMasterDataFilterQueryApi {
  user_id: string | null;
  user_name: string | null;
  role_name: string | null;
}
