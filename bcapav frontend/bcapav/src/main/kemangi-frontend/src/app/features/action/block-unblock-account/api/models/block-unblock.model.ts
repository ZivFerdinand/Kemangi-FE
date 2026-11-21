import { TableQueryApi } from '../../../../../shared';

export interface BlockUnblockRequestPayloadApi {
  appr_id: number;
  approval_status: string;
  note: string;
}

export interface BlockUnblockDetailsApi {
  id: number;
  file_name: string;
  total_data: number;
  total_valid_data: number;
  total_invalid_data: number;
  total_failed_data: number | null;
  total_success_data: number | null;
  action: string;
  approval_status: string;
  process_status: string;
  retry_flag: boolean | null;
  rejection_note: string;
  requester_id: string;
  requester_name: string;
  request_date: string;
  approver_id: string;
  approver_name: string;
  approval_date: string;
}

export interface BlockUnblockDetailsListTableQueryApi extends TableQueryApi {
  limit: number;
  page: number;
  sort: string | null;
  sort_dir: string | null;
  query: string | null;
  valid_status: boolean | null;
  process_status: boolean | null;
}
