import { FilePropsApi } from '../../../../../shared';

export interface DataGroupTableApi {
  id: number;
  data_group_Id: string | null;
  name: string | null;
  description: string | null;
  dynamic_watch_list: boolean;
  rule_relation: number;
  created_by: string | null;
  created_by_name: string | null;
  created_dt: string | null;
  last_updated_by: string | null;
  last_updated_by_name: string | null;
  last_updated_dt: string | null;
  last_approval_id: string | null;
  last_approval_name: string | null;
  last_approval_dt: string | null;
  active_status: boolean;
  has_pending_draft: boolean;
  has_pending_Request: boolean;
}

export interface DataGroupApprovalTableApi {
  appr_id: number;
  data_group_id: string;
  name: string;
  description: string;
  dynamic_watch_list: boolean;
  active_status: boolean;
  rule_relation: number;
  request_type: string;
  approval_status: string;
  rejection_note: string;
  created_by: string;
  created_dt: string;
  requester_id: string;
  requester_name: string;
  request_date: string;
  approver_id: string;
  approver_name: string;
  approval_date: string;
}

export interface DataGroupDetailsApi {
  id: number;
  data_group_id: string | null;
  name: string | null;
  description: string | null;
  dynamic_watch_list: boolean;
  active_status: boolean;
  detail_values: string[] | null;
  has_active_rule_relation: boolean;
  has_rule_relation: boolean;
  created_by: string | null;
  created_by_name: string | null;
  created_dt: string | null;
  last_updated_by: string | null;
  last_updated_by_name: string | null;
  last_updated_dt: string | null;
  last_approval1_by: string | null;
  last_approval1_dt: string | null;
  last_approval1_name: string | null;
  last_approval2_by: string | null;
  last_approval2_dt: string | null;
  last_approval2_name: string | null;
  last_appr_files: FilePropsApi[];
}

export interface DataGroupApprovalDetailsApi {
  appr_id: number;
  last_appr_id: number | null;
  data_group_id: string | null;
  name: string | null;
  description: string | null;
  dynamic_watch_list: boolean;
  active_status: boolean;
  detail_values: string[] | null;
  request_type: string | null;
  approval_status: string | null;
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
}

export interface ResponseDataGroupUploadFileApi {
  status: true;
  original_name: string;
  extension: string;
  generated_name: string;
  msg: string;
  url: string;
}

export interface DataGroupUploadFileApi {
  original_name: string;
  extension: string;
  generated_name: string;
}

export interface DataGroupDeletePayloadApi {
  data_group_id: string;
  list_files: DataGroupUploadFileApi[];
}
