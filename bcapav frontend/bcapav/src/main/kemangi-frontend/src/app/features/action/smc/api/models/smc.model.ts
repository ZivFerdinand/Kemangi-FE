import { TableQueryApi } from '../../../../../shared';

export interface SMCRequestPayloadApi {
  appr_id: number;
  approval_status: string;
  note: string;
}

export interface SMCDetailsApi {
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
  rejection_note: string;
  retry_flag: boolean | null;
  requester_id: string;
  requester_name: string;
  request_date: string;
  approver_id: string;
  approver_name: string;
  approval_date: string;
}

export interface SMCDetailsListTableQueryApi extends TableQueryApi {
  query: string | null;
  valid_status: boolean | null;
  process_status: boolean | null;
  retry_flag: boolean | null;
}

export interface SMCDownloadFileParamsApi {
  valid_status: boolean | null;
  process_status: boolean | null;
}
