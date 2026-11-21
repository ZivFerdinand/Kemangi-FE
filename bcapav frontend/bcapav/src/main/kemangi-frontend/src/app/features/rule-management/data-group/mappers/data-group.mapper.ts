import {
  DataGroupTableQueryApi,
  DataGroupTaskListTableQueryApi,
} from '../api/models/data-group-query.model';
import {
  DataGroupDetailsApi,
  DataGroupApprovalDetailsApi,
  DataGroupDeletePayloadApi,
} from '../api/models/data-group.model';
import {
  DataGroupTableQuery,
  DataGroupTaskListTableQuery,
} from '../domain/models/data-group-query.model';
import {
  DataGroupApprovalDetails,
  DataGroupDeletePayload,
  DataGroupDetails,
} from '../domain/models/data-group.model';
import { DataGroupFormApi } from '../api/models/data-group-form.model';
import { DataGroupForm } from '../domain/models/data-group-form.model';
import { TableQuery, TableQueryApi } from '../../../../shared';

export function mapDataGroupTableQueryDomainToApi(
  domain: DataGroupTableQuery,
): DataGroupTableQueryApi {
  return {
    limit: domain.limit,
    page: domain.page,
    sort: domain.sort === '' ? null : domain.sort,
    sort_dir: domain.sortDir === '' ? null : domain.sortDir,
    data_group_id: domain.dataGroupId?.length === 0 ? null : domain.dataGroupId,
    name: domain.name === '' ? null : domain.name,
    description: domain.description === '' ? null : domain.description,
    active_status: domain.activeStatus,
    dynamic_watch_list:
      domain.dynamicWatchList !== null ? domain.dynamicWatchList : null,
    requester_id: domain.requesterId?.length === 0 ? null : domain.requesterId,
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

export function mapDataGroupTaskTableQueryDomainToApi(
  domain: DataGroupTaskListTableQuery,
): DataGroupTaskListTableQueryApi {
  return {
    limit: domain.limit,
    page: domain.page,
    sort: domain.sort === '' ? null : domain.sort,
    sort_dir: domain.sortDir === '' ? null : domain.sortDir,
    name: domain.name,
    description: domain.description,
    active_status: domain.activeStatus,
    dynamic_watch_list: domain.dynamicWatchList,
    approval_status:
      domain.approvalStatus === '' ? null : domain.approvalStatus,
    requester_id: domain.requesterId?.length === 0 ? null : domain.requesterId,
    approver1_id: domain.approver1Id?.length === 0 ? null : domain.approver1Id,
    approver2_id: domain.approver2Id?.length === 0 ? null : domain.approver2Id,
    data_group_id: domain.dataGroupId?.length === 0 ? null : domain.dataGroupId,
    request_date_from:
      domain.requestDateFrom === '' ? null : domain.requestDateFrom,
    request_date_to: domain.requestDateTo === '' ? null : domain.requestDateTo,
    approval1_date_from:
      domain.approval1DateFrom === '' ? null : domain.approval1DateFrom,
    approval1_date_to:
      domain.approval1DateTo === '' ? null : domain.approval1DateTo,
    approval2_date_from:
      domain.approval2DateFrom === '' ? null : domain.approval2DateFrom,
    approval2_date_to:
      domain.approval2DateTo === '' ? null : domain.approval2DateTo,
    request_type: domain.requestType ?? null,
    reviewer1_done: domain.reviewer1Done,
    task_list: domain.taskList,
  };
}

export function mapDataGroupDetailsApiToDomain(
  api: DataGroupDetailsApi,
): DataGroupDetails {
  return {
    id: api.id,
    dataGroupId: api.data_group_id ?? '-',
    name: api.name ?? '-',
    description: api.description ?? '-',
    dynamicWatchList: api.dynamic_watch_list,
    activeStatus: api.active_status,
    detailValues: api.detail_values ?? [],
    hasActiveRuleRelation: api.has_active_rule_relation,
    hasRuleRelation: api.has_rule_relation,
    createdBy: api.created_by ?? '-',
    createdByName: api.created_by_name ?? '-',
    createdDt: api.created_dt ?? '-',
    lastUpdatedBy: api.last_updated_by ?? '-',
    lastUpdatedByName: api.last_updated_by_name ?? '-',
    lastUpdatedDt: api.last_updated_dt ?? '-',
    lastApproval1By: api.last_approval1_by ?? '-',
    lastApproval1Dt: api.last_approval1_dt ?? '-',
    lastApproval1Name: api.last_approval1_name ?? '-',
    lastApproval2By: api.last_approval2_by ?? '-',
    lastApproval2Dt: api.last_approval2_dt ?? '-',
    lastApproval2Name: api.last_approval2_name ?? '-',
    lastApprFiles: api.last_appr_files.map((x) => ({
      extension: x.extension,
      generatedName: x.generated_name,
      originalName: x.original_name,
      url: x.url,
    })),
  };
}

export function mapDataGroupApprovalDetailsApiToDomain(
  api: DataGroupApprovalDetailsApi,
): DataGroupApprovalDetails {
  return {
    apprId: api.appr_id,
    lastApprId: api.last_appr_id?.toString() ?? '',
    dataGroupId: api.data_group_id ?? '-',
    name: api.name ?? '-',
    description: api.description ?? '-',
    dynamicWatchList: api.dynamic_watch_list,
    activeStatus: api.active_status ?? false,
    detailValues: api.detail_values ?? [],
    requestType: api.request_type ?? '-',
    approvalStatus: api.approval_status ?? '-',
    requesterId: api.requester_id ?? '-',
    requesterName: api.requester_name ?? '-',
    requestDate: api.request_date ?? '-',
    approver1id: api.approver1_id ?? '-',
    approver1name: api.approver1_name ?? '-',
    approval1date: api.approval1_date ?? '-',
    approver2id: api.approver2_id ?? '-',
    approver2name: api.approver2_name ?? '-',
    approval2date: api.approval2_date ?? '-',
    rejectionNote: api.rejection_note ?? '-',
  };
}

export function mapDataGroupFormDomainToApi(
  domain: DataGroupForm,
): DataGroupFormApi {
  return {
    appr_id: domain.apprId ?? null,
    data_group_id: domain.dataGroupId ?? null,
    name: domain.name ?? null,
    description: domain.description ?? null,
    dynamic_watch_list: domain.dynamicWatchList,
    active_status: domain.activeStatus,
    list_files: domain.listFiles.map((x) => ({
      original_name: x.originalName,
      extension: x.extension,
      generated_name: x.generatedName,
    })),
    detail_values: domain.detailValues,
  };
}

export function mapDataGroupDeleteDomainToApi(
  domain: DataGroupDeletePayload,
): DataGroupDeletePayloadApi {
  return {
    data_group_id: domain.dataGroupId,
    list_files: domain.listFiles.map((x) => ({
      original_name: x.originalName,
      extension: x.extension,
      generated_name: x.generatedName,
    })),
  };
}

export function mapRuleRelationDomainToApi(domain: TableQuery): TableQueryApi {
  return {
    limit: domain.limit,
    page: domain.page,
    sort: !domain.sort || domain.sort === '' ? null : domain.sort,
    sort_dir: !domain.sortDir || domain.sortDir === '' ? null : domain.sortDir,
  };
}
