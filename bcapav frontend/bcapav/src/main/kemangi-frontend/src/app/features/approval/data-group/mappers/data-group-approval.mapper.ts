import {
  DataGroupApprovalDetailsApi,
  DataGroupApprovalQueryApi,
  DataGroupApprovalPayloadApi,
} from '../api/models/data-group-approval.model';

import {
  DataGroupApprovalDetails,
  DataGroupApprovalQuery,
  DataGroupApprovalPayload,
} from '../domain/models/data-group-approval.model';

export function mapDataGroupApprovalQueryDomainToApi(
  domain: DataGroupApprovalQuery,
): DataGroupApprovalQueryApi {
  return {
    limit: Number(domain.limit),
    page: Number(domain.page),
    sort: domain.sort || null,
    sort_dir: domain.sortDir ?? null,
    name: domain.name || null,
    data_group_id: domain.dataGroupId.length === 0 ? null : domain.dataGroupId,
    description: domain.description || null,
    active_status: domain.activeStatus ?? null,
    reviewer1_done: domain.reviewer1Done ?? null,
    draft: domain.draft ?? null,
    task_list: domain.taskList ?? null,
    request_type: domain.requestType ?? null,
    approval_status: domain.approvalStatus ?? null,
    dynamic_watch_list: domain.dynamicWatchList ?? null,
    requester_id: domain.requesterId.length === 0 ? null : domain.requesterId,
    approver1_id: domain.approver1Id.length === 0 ? null : domain.approver1Id,
    approver2_id: domain.approver2Id.length === 0 ? null : domain.approver2Id,
    request_date_from: domain.requestDateFrom || null,
    request_date_to: domain.requestDateTo || domain.requestDateFrom || null,
    approval1_date_from: domain.approval1DateFrom || null,
    approval1_date_to:
      domain.approval1DateTo || domain.approval1DateFrom || null,
    approval2_date_from: domain.approval2DateFrom || null,
    approval2_date_to:
      domain.approval2DateTo || domain.approval2DateFrom || null,
  };
}

export function mapDataGroupDetailsApprovalApiToDomain(
  api: DataGroupApprovalDetailsApi,
): DataGroupApprovalDetails {
  return {
    apprId: api.appr_id,
    lastApprId: api.last_appr_id?.toString() ?? '',
    dataGroupId: api.data_group_id ?? '',
    name: api.name ?? '',
    description: api.description ?? '',
    dynamicWatchList: api.dynamic_watch_list,
    detailValues: api.detail_values ?? [],
    activeStatus: api.active_status,
    requestType: api.request_type ?? '',
    approvalStatus: api.approval_status ?? '',
    requesterId: api.requester_id ?? '',
    requesterName: api.requester_name ?? '',
    requestDate: api.request_date ?? '',
    approver1id: api.approver1_id ?? '',
    approver1name: api.approver1_name ?? '',
    approval1date: api.approval1_date ?? '',
    approver2id: api.approver2_id ?? '',
    approver2name: api.approver2_name ?? '',
    approval2date: api.approval2_date ?? '',
    rejectionNote: api.rejection_note ?? '',
    listFiles: api.list_files.map((x) => ({
      extension: x.extension,
      generatedName: x.generated_name,
      originalName: x.original_name,
      url: x.url,
    })),
  };
}

export function mapDataGroupApprovalPayloadDomainToApi(
  domain: DataGroupApprovalPayload,
): DataGroupApprovalPayloadApi {
  return {
    appr_id: domain.apprId,
    approval_status: domain.approvalStatus,
    note: domain.note ?? '-',
  };
}
