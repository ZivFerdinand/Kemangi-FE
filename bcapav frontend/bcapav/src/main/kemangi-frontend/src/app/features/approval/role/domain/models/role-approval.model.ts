import { TableQuery } from '../../../../../shared';

export interface RoleApproval {
  apprRoleId: number;
  roleId: string | null;
  roleGroup: string | null;
  roleName: string | null;
  roleDescription: string | null;
  requestType: string | null;
  approvalStatus: string | null;
  rejectionNote: string | null;
  createdBy: string | null;
  createdDt: string | null;
  requesterId: string | null;
  requesterName: string | null;
  approverId: string | null;
  approverName: string | null;
  approvalDate: string | null;
}

export interface RoleApprovalPayload {
  apprId: number | null;
  approvalStatus: string;
  note: string;
}

export interface RoleApprovalQuery extends TableQuery {
  name: string;
  roleId: string[];
  description: string;
  taskList: boolean;
  requestType: string;
  approvalStatus: string;
  requesterId: string[];
  approverId: string[];
  requestDateFrom: string;
  requestDateTo: string;
  approvalDateFrom: string;
  approvalDateTo: string;
}

export interface RoleApprovalQueryFilter {
  roleId: string[];
  description: string;
  requestType: string;
  approvalStatus: string;
  requesterId: string[];
  approverId: string[];
  requestDateFrom: string;
  requestDateTo: string;
  approvalDateFrom: string;
  approvalDateTo: string;
}

export interface RoleApprovalQueryFilterDisplayTemp {
  roleId: string;
  description: string;
  requestedBy: string;
  approvedBy: string;
  requestDateFrom: string;
  requestDateTo: string;
  approvalDateFrom: string;
  approvalDateTo: string;
  requestType: string;
  approvalStatus: string;
}

export interface RoleApprovalDetails {
  roleId: string;
  roleName: string;
  roleGroup: string;
  roleDescription: string;
  isReviewer: boolean;
  activeStatus: boolean;
  menuIds: number[];
  apprRoleId: number;
  lastApprRoleId: number;
  requestType: string;
  approvalStatus: string;
  requesterId: string;
  requesterName: string;
  requestDate: string;
  approverId: string;
  approverName: string;
  approvalDate: string;
  rejectionNote: string;
}
