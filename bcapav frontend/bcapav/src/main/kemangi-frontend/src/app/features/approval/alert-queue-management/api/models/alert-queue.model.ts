import { FilePropsApi, TableQueryApi } from '../../../../../shared/interfaces';

export interface AlertQueueApprovalQueryApi extends TableQueryApi {
  name: string | null;
  description: string | null;
  active_status: boolean | null;
  approval_status: string | null;
  request_type: string | null;
  task_list: boolean | null;
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
  reviewer1_done: boolean | null;
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
  details: RuleModelApi[];
}

export interface RuleModelApi {
  priority_type: number;
  priority_level: number;
  priority_seq: number;
  product_type: string;
  item_type: string;
  item_id: string;
  item_name: string;
}

export interface AssignToQueryApi extends TableQueryApi {
  user_id: string | null;
  user_name: string | null;
  role_name: string | null;
}
