//RuleApprovalQuery
import { TableQuery } from '../../../../../shared';

export interface BlockUnblockAccountApproval {
  id: number;
  fileName: string;
  totalData: number | null;
  totalValidData: number | null;
  totalInvalidData: number | null;
  totalSuccessData: number | null;
  totalFailedData: number | null;
  action: string;
  approvalStatus: string;
  processStatus: string | null;
  rejectionNote: string | null;
  retryFlag: boolean | null;
  createdBy: string | null;
  createdDt: string | null;
  requesterId: string | null;
  requesterName: string | null;
  requestDate: string | null;
  approverId: string | null;
  approverName: string | null;
  approvalDate: string | null;
}

export interface BlockUnblockDownloadFileParams {
  validStatus: boolean | null;
  processStatus: boolean | null;
}
export interface BlockUnblockApprovalQuery extends TableQuery {
  action: string;
  taskList: boolean | null;
  requesterId: string[];
  requestDateFrom: string;
  requestDateTo: string;
  processStatus: string;
  approvalStatus: string;
  approverId: string[];
  approvalDateFrom: string;
  approvalDateTo: string;
}

export interface BlockUnblockApprovalQueryFilter {
  action: string;
  requesterId: string[];
  requestDateFrom: string;
  requestDateTo: string;
  processStatus: string;
  approvalStatus: string;
  approverId: string[];
  approvalDateFrom: string;
  approvalDateTo: string;
}

export interface BlockUnblockApprovalQueryFilterDisplayTemp {
  action: string;
  processStatus: string;
  approvalStatus: string;
  requestedBy: string;
  requestDateFrom: string;
  requestDateTo: string;
  approvedBy: string;
  approvalDateFrom: string;
  approvalDateTo: string;
}
