import { TableQueryApi } from '../../../../shared';

export interface RoleQueryApi extends TableQueryApi {
  query: string | null;
}

export interface RoleTableApi {
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

export interface RoleApprovalTableApi {
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

export interface RoleDetailsApi {
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

  role_id: 'Role';
  role_name: 'Operator 3';
  role_group: 'CTV';
  role_description: 'Description';
  is_reviewer: false;
  active_status: true;
  menu_ids: [1, 2, 3, 4];
  appr_role_id: 78;
  last_appr_role_id: null;
  request_type: 'CREATE';
  approval_status: 'PENDING';
  requester_id: 'FMSUAT13';
  requester_name: 'FMSUAT SPV1';
  request_date: '2025-12-30T15:03:27';
  approver_id: null;
  approver_name: null;
  approval_date: null;
  rejection_note: null;
}

export interface RoleApprovalDetailsApi {
  role_id: string | null;
  role_name: string | null;
  role_group: string | null;
  role_description: string | null;
  is_reviewer: boolean;
  active_status: boolean;
  menu_ids: number[];
  appr_role_id: number;
  last_appr_role_id: number | null;
  request_type: string | null;
  approval_status: string | null;
  requester_id: string | null;
  requester_name: string | null;
  request_date: string | null;
  approver_id: string | null;
  approver_name: string | null;
  approval_date: string | null;
  rejection_note: string | null;
}
