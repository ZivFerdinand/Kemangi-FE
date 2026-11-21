import { TableQueryApi } from '../../../../../shared';

export interface DataGroupTableQueryApi extends TableQueryApi {
  data_group_id: Array<string> | null;
  name: string | null;
  description: string | null;
  dynamic_watch_list: boolean | null;
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

export interface DataGroupFilterTableQueryApi {
  name: string | null;
  description: string | null;
  active_status: boolean | null;
  requester_id: Array<string> | null;
  approver_id: Array<string> | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface DataGroupDraftTableQueryApi extends TableQueryApi {
  data_group_id: Array<string> | null;
  name: string | null;
  description: string | null;
  active_status: boolean | null;
  draft: boolean | null;
  approval_status: string | null;
  approver1_id: Array<string> | null;
  approver2_id: Array<string> | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval1_date_from: string | null;
  approval1_date_to: string | null;
  approval2_date_from: string | null;
  approval2_date_to: string | null;
}

export interface DataGroupDraftFilterTableQueryApi {
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

export interface DataGroupRequestedFilterTableQueryApi {
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

export interface DataGroupTaskListTableQueryApi extends TableQueryApi {
  data_group_id: Array<string> | null;
  name: string;
  description: string;
  active_status: boolean | null;
  request_type: string | null;
  approval_status: string | null;
  approver1_id: Array<string> | null;
  approver2_id: Array<string> | null;
  requester_id: Array<string> | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval1_date_from: string | null;
  approval1_date_to: string | null;
  approval2_date_from: string | null;
  approval2_date_to: string | null;
  dynamic_watch_list: boolean | null;
  reviewer1_done: boolean | null;
  task_list: boolean | null;
}
