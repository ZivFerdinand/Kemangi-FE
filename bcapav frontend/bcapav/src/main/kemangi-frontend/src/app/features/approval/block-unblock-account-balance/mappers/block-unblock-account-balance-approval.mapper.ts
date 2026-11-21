import {
  BlockUnblockAccountBalanceApprovalQuery,
  BlockUnblockAccountBalanceDownloadFileParams,
} from '../domain/models/block-unblock-account-balance-approval.model';
import {
  BlockUnblockAccountBalanceApprovalQueryApi,
  BlockUnblockAccountBalanceDownloadFileParamsApi,
} from '../api/models/block-unblock-account-balance-approval.model';

export function mapBlockUnblockAccountBalanceApprovalQueryDomainToApi(
  domain: BlockUnblockAccountBalanceApprovalQuery,
): BlockUnblockAccountBalanceApprovalQueryApi {
  return {
    limit: Number(domain.limit),
    page: Number(domain.page),
    sort: domain.sort || null,
    sort_dir: domain.sortDir || null,
    action: domain.action || null,
    account_type: domain.accountType || null,
    task_list: domain.taskList || null,
    approval_status: domain.approvalStatus || null,
    process_status: domain.processStatus || null,
    retry_flag: domain.retryFlag || null,
    requester_id:
      domain.requesterId && domain.requesterId.length > 0
        ? domain.requesterId
        : null,
    request_date_from: domain.requestDateFrom ?? null,
    request_date_to: domain.requestDateTo || domain.requestDateFrom || null,
    approver_id:
      domain.approverId && domain.approverId.length > 0
        ? domain.approverId
        : null,
    approval_date_from: domain.approvalDateFrom || null,
    approval_date_to: domain.approvalDateTo || domain.approvalDateFrom || null,
  };
}

export function mapBlockUnblockAccountBalanceDownloadFileParamsDomainToApi(
  domain: BlockUnblockAccountBalanceDownloadFileParams,
): BlockUnblockAccountBalanceDownloadFileParamsApi {
  return {
    valid_status: domain.validStatus,
    process_status: domain.processStatus,
  };
}
