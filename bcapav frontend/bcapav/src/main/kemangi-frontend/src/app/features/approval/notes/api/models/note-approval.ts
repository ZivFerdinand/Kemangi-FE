import { TableParams } from '../../../../../shared';
import { TableQueryApi } from '../../../../../shared';

export interface NotesApprovalQueryApi extends TableQueryApi {
  task_list: boolean;
  approval_status: string | null;
  note_id: string[] | null;
  note: string | null;
  description: string | null;
  active_status: boolean | null;
  request_type: string | null;
  requester_id: string[] | null;
  approver_id: string[] | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface NoteTaskListParamsApi extends TableParams {
  task_list: boolean;
  approval_status: string | null;
}

export interface NoteRequestedListParamsApi extends NoteTaskListParamsApi {
  note_id: string[] | null;
  note: string | null;
  description: string | null;
  active_status: boolean | null;
  request_type: string | null;
  requester_id: string[] | null;
  approver_id: string[] | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface NoteApprovalDetailsApi {
  active_status: boolean;
  appr_id: number;
  approval_date: string | null;
  approval_status: string | null;
  approver_id: string | null;
  approver_name: string | null;
  description: string | null;
  note: string | null;
  note_id: number;
  last_appr_id: number | null;
  rejection_note: string | null;
  request_date: string | null;
  request_type: string | null;
  requester_id: string | null;
  requester_name: string | null;
}
