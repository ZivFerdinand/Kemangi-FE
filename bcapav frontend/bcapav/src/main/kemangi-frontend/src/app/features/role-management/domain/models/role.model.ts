import { TableQuery } from '../../../../shared';

export interface Role {
  id: number;
  roleId: string | null;
  roleName: string | null;
  roleGroup: string | null;
  roleDescription: string | null;
  createdBy: string | null;
  createdByName: string | null;
  createdDt: string | null;
  lastUpdatedBy: string | null;
  lastUpdatedByName: string | null;
  lastUpdatedDt: string | null;
  lastApprovalId: string | null;
  lastApprovalName: string | null;
  lastApprovalDt: string | null;
  activeStatus: boolean;
  hasPendingRequest: boolean;
  hasUserRelation: boolean;
}

export interface RoleQuery extends TableQuery {
  query: string | null;
}

export interface RoleTable {
  id: number;
  dataGroupId: string;
  name: string;
  description: string;
  dynamicWatchList: boolean;
  ruleRelation: number;
  createdBy: string;
  createdByName: string;
  createdDt: string;
  lastUpdatedBy: string;
  lastUpdatedByName: string;
  lastUpdatedDt: string;
  lastApprovalId: string;
  lastApprovalName: string;
  lastApprovalDt: string;
  activeStatus: boolean;
  hasPendingDraft: boolean;
  hasPendingRequest: boolean;
}

export interface RoleApprovalTable {
  apprId: number;
  dataGroupId: string;
  name: string;
  description: string;
  dynamicWatchList: boolean;
  activeStatus: boolean;
  ruleRelation: number;
  requestType: string;
  approvalStatus: string;
  rejectionNote: string;
  createdBy: string;
  createdDt: string;
  requesterId: string;
  requesterName: string;
  requestDate: string;
  approverId: string;
  approverName: string;
  approvalDate: string;
}

export interface RoleDetails {
  id: number;
  dataGroupId: string;
  name: string;
  description: string;
  dynamicWatchList: true;
  activeStatus: false;
  detailValues: string[];
  createdBy: string;
  createdByName: string;
  createdDt: string;
  lastUpdatedBy: string;
  lastUpdatedByName: string;
  lastUpdatedDt: string;
  lastApprovalBy: string;
  lastApprovalName: string;
  lastApprovalDt: string;
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
