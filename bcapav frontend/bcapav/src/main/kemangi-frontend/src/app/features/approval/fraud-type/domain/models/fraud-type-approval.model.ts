import { TableQuery } from '../../../../../shared';

export interface FraudTypeApproval {
  apprId: number;
  fraudTypeId: number | string | null;
  fraudType: string | null;
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
  approverId: string | null;
  approverName: string | null;
  approvalDate: string | null;
}
export interface FraudTypeApprovalQuery extends TableQuery {
  taskList: boolean;
  approvalStatus: string;
  fraudTypeId: string[];
  fraudType: string;
  description: string;
  activeStatus?: boolean | null;
  requestType: string;
  requesterId: string[];
  approverId: string[];
  requestDateFrom: string;
  requestDateTo: string;
  approvalDateFrom: string;
  approvalDateTo: string;
}

export interface FraudTypeApprovalQueryFilter {
  fraudTypeId?: string[];
  fraudType: string;
  description: string;
  activeStatus?: boolean | null;
  requestType: string;
  requesterId?: string[];
  approverId?: string[];
  requestDateFrom: string;
  requestDateTo: string;
  approvalDateFrom: string;
  approvalDateTo: string;
  approvalStatus: string;
}

export interface FraudTypeApprovalQueryFilterDisplayTemp {
  fraudType: string | null;
  description: string | null;
  requestedBy: string[] | null;
  approvedBy: string[] | null;
  requestDateFrom: string | null;
  requestDateTo: string | null;
  approvalDateFrom: string | null;
  approvalDateTo: string | null;
  approvalStatus: string | null;
  requestType: string | null;
}

export interface FraudTypeApprovalDetails {
  activeStatus: boolean;
  apprId: string;
  approvalDate: string;
  approvalStatus: string;
  approverId: string;
  approverName: string;
  description: string;
  fraudType: string;
  fraudTypeId: string;
  lastApprId: string;
  rejectionNote: string;
  requestDate: string;
  requestType: string;
  requesterId: string;
  requesterName: string;
}

export interface FraudTypeTaskListParams {
  limit: number;
  page: number;
  sort: string;
  sortDir: string;
  taskList: boolean;
  approvalStatus: string;
}
