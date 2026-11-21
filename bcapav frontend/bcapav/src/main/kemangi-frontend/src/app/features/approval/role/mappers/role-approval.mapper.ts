import {
  RoleApprovalQuery,
  RoleApprovalDetails,
  RoleApprovalPayload,
} from '../domain/models/role-approval.model';

import {
  RoleApprovalQueryApi,
  RoleApprovalDetailsApi,
  RoleApprovalPayloadApi,
} from '../api/models/role-approval.model';

export function mapRoleApprovalQueryDomainToApi(
  domain: RoleApprovalQuery,
): RoleApprovalQueryApi {
  return {
    limit: Number(domain.limit),
    page: Number(domain.page),
    sort: domain.sort || null,
    sort_dir: domain.sortDir || null,
    task_list: domain.taskList ?? null,
    approval_status: domain.approvalStatus || null,
    role_id: domain.roleId.length === 0 ? null : domain.roleId,
    name: domain.name || null,
    description: domain.description || null,
    request_type: domain.requestType || null,
    requester_id: domain.requesterId.length === 0 ? null : domain.requesterId,
    approver_id: domain.approverId.length === 0 ? null : domain.approverId,
    request_date_from: domain.requestDateFrom || null,
    request_date_to: domain.requestDateTo || domain.requestDateFrom || null,
    approval_date_from: domain.approvalDateFrom || null,
    approval_date_to: domain.approvalDateTo || domain.approvalDateFrom || null,
  };
}

export function mapRoleDetailsApprovalApiToDomain(
  api: RoleApprovalDetailsApi,
): RoleApprovalDetails {
  return {
    roleId: api.role_id ?? '',
    roleName: api.role_name ?? '',
    roleGroup: api.role_group ?? '',
    roleDescription: api.role_description ?? '',
    isReviewer: api.is_reviewer,
    activeStatus: api.active_status,
    menuIds: api.menu_ids?.length > 0 ? api.menu_ids : [],
    apprRoleId: api.appr_role_id,
    lastApprRoleId: api.last_appr_role_id ?? 0,
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

export function mapRoleApprovalPayloadDomainToApi(
  domain: RoleApprovalPayload,
): RoleApprovalPayloadApi {
  return {
    appr_id: domain.apprId,
    approval_status: domain.approvalStatus,
    note: domain.note ?? '-',
  };
}
