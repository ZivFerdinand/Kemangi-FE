import { ApprovalPayload, ApprovalPayloadApi } from '../interfaces';
import { DropdownListQuery, DropdownListQueryApi } from './../interfaces/table';
import { TableQuery, TableQueryApi } from './../interfaces/table';

export function mapDropdownListQueryDomainToApi(
  domain: DropdownListQuery,
): DropdownListQueryApi {
  return {
    limit: domain.limit,
    draft: domain.draft,
    query: domain.query,
    task_list: domain.taskList,
    reviewer1_done: domain.reviewer1Done,
  };
}

export function mapTableQueryDomainToApi(domain: TableQuery): TableQueryApi {
  return {
    limit: domain.limit,
    page: domain.page,
    sort: domain.sort ?? null,
    sort_dir: domain.sortDir ?? null,
  };
}

export function mapApprovalPayloadDomainToApi(
  domain: ApprovalPayload,
): ApprovalPayloadApi {
  return {
    appr_id: domain.apprId,
    approval_status: domain.approvalStatus,
    note: domain.note ?? '',
  };
}
