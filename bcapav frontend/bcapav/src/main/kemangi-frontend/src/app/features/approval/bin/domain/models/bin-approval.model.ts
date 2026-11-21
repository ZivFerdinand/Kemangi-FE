import { TableQuery } from '../../../../../shared';

export interface BinApproval {
  apprId: number;
  binNumberId: number | null;
  binNumber: string | null;
  binDescription: string | null;
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

export interface BinApprovalQuery extends TableQuery {
  binNumberId: string[];
  binNumber: string;
  description: string;
  activeStatus: boolean | null;
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

export interface BinApprovalQueryFilter {
  binNumber: string;
  description: string;
  requestType: string;
  requesterId: string[];
  requestDateFrom: string;
  requestDateTo: string;
  approvalStatus: string;
  approverId: string[];
  approvalDateFrom: string;
  approvalDateTo: string;
}

export interface BinApprovalQueryFilterDisplayTemp {
  binNumber: string;
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

export interface BinApprovalDetails {
  apprId: number;
  lastApprId: string;
  binNumberId: number;
  binNumber: string;
  binDescription: string;
  activeStatus: boolean;
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
