import { TableQuery } from '../../../../../shared';
import { FileProps } from '../../../../../shared';

export interface DataGroupApproval {
  apprId: number;
  dataGroupId: string | null;
  name: string | null;
  description: string | null;
  dynamicWatchList: boolean;
  activeStatus: boolean;
  requestType: string | null;
  approvalStatus: string | null;
  rejectionNote: string | null;
  createdBy: string | null;
  createdDt: string | null;
  requesterId: string | null;
  requesterName: string | null;
  requestDate: string | null;
  approver1Id: string | null;
  approver1Name: string | null;
  approval1Date: string | null;
  approver2Id: string | null;
  approver2Name: string | null;
  approval2Date: string | null;
  ruleCount: number | null;
  ruleCountActive: number | null;
}

export interface DataGroupApprovalPayload {
  apprId: number | null;
  approvalStatus: string;
  note: string;
}

export interface DataGroupApprovalQuery extends TableQuery {
  name: string;
  dataGroupId: string[];
  description: string;
  taskList: boolean | null;
  requestType: string;
  activeStatus: boolean | null;
  reviewer1Done: boolean | null;
  draft: boolean | null;
  approvalStatus: string;
  dynamicWatchList: boolean | null;
  requesterId: string[];
  requestDateFrom: string;
  requestDateTo: string;
  approver1Id: string[];
  approver2Id: string[];
  approval1DateFrom: string;
  approval1DateTo: string;
  approval2DateFrom: string;
  approval2DateTo: string;
}

export interface DataGroupApprovalQueryFilter {
  dataGroupId: string[];
  name: string;
  description: string;
  dynamicWatchList: boolean | null;
  requestType: string;
  activeStatus: boolean | null;
  approvalStatus: string;
  requesterId: string[];
  requestDateFrom: string;
  requestDateTo: string;
  approver1Id: string[];
  approver2Id: string[];
  approval1DateFrom: string;
  approval1DateTo: string;
  approval2DateFrom: string;
  approval2DateTo: string;
}

export interface DataGroupApprovalQueryFilterDisplayTemp {
  dataGroupId: string;
  dataGroupName: string;
  description: string;
  requestedBy: string;
  requestDateFrom: string;
  requestDateTo: string;
  requestType: string;
  status: string;
  dynamicWatchList: string;
  approvalStatus: string;
  approval1DateFrom: string;
  approval1DateTo: string;
  approved1By: string;
  approval2DateFrom: string;
  approval2DateTo: string;
  approved2By: string;
}

export interface DataGroupApprovalDetails {
  apprId: number;
  lastApprId: string;
  dataGroupId: string;
  name: string;
  description: string;
  dynamicWatchList: boolean;
  activeStatus: boolean;
  detailValues: string[];
  requestType: string;
  approvalStatus: string;
  requesterId: string;
  requesterName: string;
  requestDate: string;
  rejectionNote: string;
  approver1id: string;
  approver1name: string;
  approval1date: string;
  approver2id: string;
  approver2name: string;
  approval2date: string;
  listFiles: FileProps[];
}
