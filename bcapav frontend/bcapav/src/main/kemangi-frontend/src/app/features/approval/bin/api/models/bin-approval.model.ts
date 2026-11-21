import { TableQueryApi } from '../../../../../shared';

export interface BinApprovalFormApi {
  appr_id: number | null;
  approval_status: string;
  note: string;
}

export interface BinApprovalQueryApi extends TableQueryApi {
  description: string | null;
  bin_number: string | null;
  bin_number_id: string[] | null;
  active_status: boolean | null;
  task_list: boolean | null;
  request_type: string | null;
  approval_status: string | null;
  requester_id: string[] | null;
  approver_id: string[] | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface BinApprovalDetailsApi {
  appr_id: number;
  last_appr_id: null;
  bin_number_id: number;
  bin_number: string | null;
  bin_description: string | null;
  active_status: boolean;
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
