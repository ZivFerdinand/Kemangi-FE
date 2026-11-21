import { TableQuery } from '../../../../shared/interfaces/index';

export interface AlertQueueApproval {
  apprId: number;
  queueId: string | null;
  name: string | null;
  description: string | null;
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
}

export interface AlertQueueApprovalQuery extends TableQuery {
  name: string | null;
  description: string | null;
  activeStatus: boolean | null;
  approvalStatus: string | null;
  requestType: string | null;
  taskList: boolean | null;
  assignTo: Array<string> | null;
  requesterId: Array<string> | null;
  approver1Id: Array<string> | null;
  approver2Id: Array<string> | null;
  requestDateFrom: string | null;
  requestDateTo: string | null;
  approval1DateFrom: string | null;
  approval1DateTo: string | null;
  approval2DateFrom: string | null;
  approval2DateTo: string | null;
  reviewer1Done: boolean | null;
}

export interface AlertQueueApprovalQueryFilter {
  name: string | null;
  description: string | null;
  activeStatus: boolean | null;
  approvalStatus: string | null;
  requestType: string | null;
  assignTo: Array<string>;
  requesterId: Array<string>;
  approver1Id: Array<string>;
  approver2Id: Array<string>;
  requestDateFrom: string | null;
  requestDateTo: string | null;
  approval1DateFrom: string | null;
  approval1DateTo: string | null;
  approval2DateFrom: string | null;
  approval2DateTo: string | null;
}

export interface AlertQueueApprovalFilterDisplayTemp {
  name: string;
  description: string;
  assignTo: string;
  requestedBy: string;
  requestDateFrom: string;
  requestDateTo: string;
  approved1By: string;
  approval1DateFrom: string;
  approval1DateTo: string;
  approved2By: string;
  approval2DateFrom: string;
  approval2DateTo: string;
  activeStatus: string;
  approvalStatus: string;
  requestType: string;
}
