import { TableParams } from '../../../../shared';

export interface RoleApprovalPayload {
  appr_role_id: number;
  approval_status: string;
  note: string;
}

export interface RolesApprovalParams extends TableParams {
  role_id: Array<string> | null;
  task_list: boolean;
  name: string | null;
  description: string | null;
  requester_id: Array<string> | null;
  request_date_from: string | null;
  request_date_to: string | null;
  request_type: string | null;
  approval_status: string | null;
  approver_id: Array<string> | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
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

export interface RoleApprovalDefaultFilter {
  role_id: Array<string> | null;
  name: string | null;
  description: string | null;
  requester_id: Array<string> | null;
  approver_id: Array<string> | null;
  request_date_from: any | null;
  request_date_to: any | null;
  approval_date_from: any | null;
  approval_date_to: any | null;
  request_type: string | null;
  approval_status: string | null;
}

export interface RoleApprovalDisplayFilter {
  role_id_name: Array<string> | null;
  description: string | null;
  requested_by: Array<string> | null;
  approved_by: Array<string> | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
  type: string | null;
  status: string | null;
}

export interface RoleRequestedFilterDisplayTempStruct {
  role_id_name: Array<string> | null;
  description: string | null;
  requested_by: Array<string> | null;
  approved_by: Array<string> | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
  request_type: string | null;
  approval_status: string | null;
}
