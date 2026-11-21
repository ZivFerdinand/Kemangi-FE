import {
  BlockUnblockApprovalQuery,
  BlockUnblockDownloadFileParams,
} from '../domain/models/block-unblock-approval.model';
import {
  BlockUnblockApprovalQueryApi,
  BlockUnblockDownloadFileParamsApi,
} from '../api/models/block-unblock-approval.model';

export function mapBlockUnblockApprovalQueryDomainToApi(
  domain: BlockUnblockApprovalQuery,
): BlockUnblockApprovalQueryApi {
  return {
    limit: Number(domain.limit),
    page: Number(domain.page),
    sort: domain.sort || null,
    sort_dir: domain.sortDir || null,
    action: domain.action || null,
    task_list: domain.taskList || null,
    approval_status: domain.approvalStatus || null,
    process_status: domain.processStatus || null,
    requester_id: domain.requesterId.length === 0 ? null : domain.requesterId,
    request_date_from: domain.requestDateFrom ?? null,
    request_date_to: domain.requestDateTo || domain.requestDateFrom || null,
    approver_id: domain.approverId.length === 0 ? null : domain.approverId,
    approval_date_from: domain.approvalDateFrom || null,
    approval_date_to: domain.approvalDateTo || domain.approvalDateFrom || null,
  };
}

export function mapBlockUnblockDownloadFileParamsDomainToApi(
  domain: BlockUnblockDownloadFileParams,
): BlockUnblockDownloadFileParamsApi {
  return {
    valid_status: domain.validStatus,
    process_status: domain.processStatus,
  };
}
