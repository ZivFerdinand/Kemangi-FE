import {
  BlockUnblockRequestPayloadApi,
  BlockUnblockDetailsApi,
  BlockUnblockDetailsListTableQueryApi,
} from '../api/models/block-unblock.model';
import {
  BlockUnblockRequestPayload,
  BlockUnblockDetails,
  BlockUnblockDetailsListTableQuery,
} from '../domain/models/block-unblock.model';

export function mapRequestBlockUnblockPayloadDomainToApi(
  domain: BlockUnblockRequestPayload,
): BlockUnblockRequestPayloadApi {
  return {
    appr_id: domain.apprId,
    approval_status: domain.approvalStatus,
    note: domain.note,
  };
}

export function mapBlockUnblockDetailsApiToDomain(
  api: BlockUnblockDetailsApi,
): BlockUnblockDetails {
  return {
    id: api.id || 0,
    fileName: api.file_name || '',
    totalData: api.total_data || 0,
    totalValidData: api.total_valid_data || 0,
    totalInvalidData: api.total_invalid_data || 0,
    totalFailedData: api.total_failed_data || null,
    totalSuccessData: api.total_success_data || null,
    action: api.action || '',
    approvalStatus: api.approval_status || '',
    processStatus: api.process_status || '',
    rejectionNote: api.rejection_note || '',
    retryFlag: api.retry_flag || null,
    requesterId: api.requester_id || '',
    requesterName: api.requester_name || '',
    requestDate: api.request_date || '',
    approverId: api.approver_id || '',
    approverName: api.approver_name || '',
    approvalDate: api.approval_date || '',
  };
}

export function mapBlockUnblockDetailsListTableQueryToApi(
  domain: BlockUnblockDetailsListTableQuery,
): BlockUnblockDetailsListTableQueryApi {
  return {
    limit: domain.limit,
    page: domain.page,
    sort: domain.sort || null,
    sort_dir: domain.sortDir || null,
    query: domain.query || null,
    valid_status: domain.validStatus ?? null,
    process_status: domain.processStatus ?? null,
  };
}

export function mapBlockUnblockRequestToApi() {}
