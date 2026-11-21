import { TableQueryApi } from '../../../../../shared';

export interface RoleApprovalPayloadApi {
  appr_id: number | null;
  approval_status: string;
  note: string;
}

export interface RoleApprovalQueryApi extends TableQueryApi {
  task_list: boolean;
  role_id: Array<string> | null;
  name: string | null;
  description: string | null;
  requester_id: Array<string> | null;
  approver_id: Array<string> | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
  request_type: string | null;
  approval_status: string | null;
}

export interface RoleApprovalDetailsApi {
  role_id: string | null;
  role_name: string | null;
  role_group: string | null;
  role_description: string | null;
  is_reviewer: boolean;
  active_status: boolean;
  menu_ids: [1, 5, 6];
  appr_role_id: number;
  last_appr_role_id: number | null;
  request_type: string;
  approval_status: string;
  requester_id: string | null;
  requester_name: string | null;
  request_date: string | null;
  approver_id: string | null;
  approver_name: string | null;
  approval_date: string | null;
  rejection_note: string | null;
}
