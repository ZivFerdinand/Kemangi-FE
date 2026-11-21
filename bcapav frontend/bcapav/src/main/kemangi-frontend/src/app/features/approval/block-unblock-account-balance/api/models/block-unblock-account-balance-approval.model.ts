import { TableQueryApi } from '../../../../../shared';

export interface BlockUnblockAccountBalanceDownloadFileParamsApi {
  valid_status: boolean | null;
  process_status: boolean | null;
}
export interface BlockUnblockAccountBalanceApprovalQueryApi extends TableQueryApi {
  action: string | null;
  account_type: string | null;
  task_list: boolean | null;
  approval_status: string | null;
  process_status: string | null;
  retry_flag: boolean | null;
  requester_id: string[] | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approver_id: string[] | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}
