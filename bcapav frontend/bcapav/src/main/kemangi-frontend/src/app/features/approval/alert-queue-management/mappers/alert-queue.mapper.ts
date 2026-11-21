import { AlertQueueApprovalQuery } from '../domain/alert-queue.model';
import { AlertQueueApprovalQueryApi } from '../api/models/alert-queue.model';

export function mapAlertQueueApprovalQueryDomainToApi(
  domain: AlertQueueApprovalQuery,
): AlertQueueApprovalQueryApi {
  return {
    limit: domain.limit ?? null,
    page: domain.page ?? null,
    sort: domain.sort ?? null,
    sort_dir: domain.sortDir ?? null,
    name: domain.name ?? null,
    description: domain.description ?? null,
    active_status: domain.activeStatus ?? null,
    approval_status: domain.approvalStatus ?? null,
    request_type: domain.requestType ?? null,
    task_list: domain.taskList ?? null,
    assign_to: domain.assignTo ?? null,
    requester_id: domain.requesterId ?? null,
    approver1_id: domain.approver1Id ?? null,
    approver2_id: domain.approver2Id ?? null,
    request_date_from: domain.requestDateFrom || null,
    request_date_to: domain.requestDateTo || domain.requestDateFrom || null,
    approval1_date_from: domain.approval1DateFrom || null,
    approval1_date_to:
      domain.approval1DateTo || domain.approval1DateFrom || null,
    approval2_date_from: domain.approval2DateFrom || null,
    approval2_date_to:
      domain.approval2DateTo || domain.approval2DateFrom || null,
    reviewer1_done: domain.reviewer1Done ?? null,
  };
}
