import {
  BinApprovalQuery,
  BinApprovalDetails,
} from '../domain/models/bin-approval.model';

import {
  BinApprovalQueryApi,
  BinApprovalDetailsApi,
} from '../api/models/bin-approval.model';

export function mapBinApprovalQueryDomainToApi(
  domain: BinApprovalQuery,
): BinApprovalQueryApi {
  return {
    limit: Number(domain.limit),
    page: Number(domain.page),
    sort: domain.sort || null,
    sort_dir: domain.sortDir || null,
    bin_number: domain.binNumber || null,
    bin_number_id: domain.binNumberId.length === 0 ? null : domain.binNumberId,
    active_status: domain.activeStatus ?? null,
    task_list: domain.taskList || null,
    request_type: domain.requestType || null,
    approval_status: domain.approvalStatus || null,
    requester_id: domain.requesterId.length === 0 ? null : domain.requesterId,
    approver_id: domain.approverId.length === 0 ? null : domain.approverId,
    request_date_from: domain.requestDateFrom ?? null,
    request_date_to: domain.requestDateTo || domain.requestDateFrom || null,
    approval_date_from: domain.approvalDateFrom || null,
    approval_date_to: domain.approvalDateTo || domain.approvalDateFrom || null,
    description: domain.description || null,
  };
}

export function mapBinDetailsApprovalApiToDomain(
  api: BinApprovalDetailsApi,
): BinApprovalDetails {
  return {
    apprId: api.appr_id,
    lastApprId: api.last_appr_id ?? '',
    binNumberId: api.bin_number_id ?? '',
    binNumber: api.bin_number ?? '',
    binDescription: api.bin_description ?? '',
    activeStatus: api.active_status,
    requestType: api.request_type ?? '',
    approvalStatus: api.approval_status ?? '',
    requesterId: api.requester_id ?? '',
    requesterName: api.requester_name ?? '',
    requestDate: api.request_date ?? '',
    approverId: api.approver_id ?? '',
    approverName: api.approver_name ?? '',
    approvalDate: api.approval_date ?? '',
    rejectionNote: api.rejection_note ?? '',
  };
}
