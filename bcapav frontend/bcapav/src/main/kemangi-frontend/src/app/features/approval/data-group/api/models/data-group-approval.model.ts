import { FilePropsApi, TableQueryApi } from '../../../../../shared';

export interface DataGroupApprovalPayloadApi {
  appr_id: number | null;
  approval_status: string;
  note: string;
}

export interface DataGroupApprovalQueryApi extends TableQueryApi {
  data_group_id: string[] | null;
  name: string | null;
  description: string | null;
  active_status: boolean | null;
  task_list: boolean | null;
  reviewer1_done: boolean | null;
  draft: boolean | null;
  dynamic_watch_list: boolean | null;
  request_type: string | null;
  approval_status: string | null;
  requester_id: string[] | null;
  approver1_id: string[] | null;
  approver2_id: string[] | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval1_date_from: string | null;
  approval1_date_to: string | null;
  approval2_date_from: string | null;
  approval2_date_to: string | null;
}

export interface DataGroupApprovalDetailsApi {
  appr_id: number;
  last_appr_id: number | null;
  data_group_id: string;
  name: string | null;
  description: string | null;
  detail_values: string[] | null;
  dynamic_watch_list: boolean;
  active_status: boolean;
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
  list_files: FilePropsApi[];
}
