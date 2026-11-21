import {
  SMCApprovalQuery,
  SMCDownloadFileParams,
} from '../domain/models/smc-approval.model';
import {
  SMCApprovalQueryApi,
  SMCDownloadFileParamsApi,
} from '../api/models/smc-approval.model';

export function mapSmcApprovalQueryDomainToApi(
  domain: SMCApprovalQuery,
): SMCApprovalQueryApi {
  return {
    limit: Number(domain.limit),
    page: Number(domain.page),
    sort: domain.sort || null,
    sort_dir: domain.sortDir || null,
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

export function mapSmcDownloadFileParamsDomainToApi(
  domain: SMCDownloadFileParams,
): SMCDownloadFileParamsApi {
  return {
    valid_status: domain.validStatus,
    process_status: domain.processStatus,
  };
}
