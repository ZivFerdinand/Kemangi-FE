import { RoleApprovalDetails } from '../domain/models/role.model';
import { RoleApprovalDetailsApi } from '../api/models/role.model';

export function mapRoleApprovalDetailsApiToDomain(
  api: RoleApprovalDetailsApi,
): RoleApprovalDetails {
  return {
    roleId: api.role_id ?? '',
    roleName: api.role_name ?? '',
    roleGroup: api.role_group ?? '',
    roleDescription: api.role_description ?? '',
    isReviewer: api.is_reviewer,
    activeStatus: api.active_status,
    menuIds: api.menu_ids ?? [],
    apprRoleId: api.appr_role_id ?? 0,
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
