import { TableQuery } from '../../../../../shared';

export interface BlockUnblockAccountBalanceApproval {
  id: number;
  fileName: string;
  totalData: number | null;
  totalValidData: number | null;
  totalInvalidData: number | null;
  totalSuccessData: number | null;
  totalFailedData: number | null;
  action: string;
  accountType: string;
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

export interface BlockUnblockAccountBalanceDownloadFileParams {
  validStatus: boolean | null;
  processStatus: boolean | null;
}
export interface BlockUnblockAccountBalanceApprovalQuery extends TableQuery {
  action?: string | null;
  accountType?: string | null;
  taskList?: boolean | null;
  approvalStatus?: string;
  processStatus?: string;
  retryFlag?: boolean | null;
  requesterId?: string[];
  requestDateFrom?: string;
  requestDateTo?: string;
  approverId?: string[];
  approvalDateFrom?: string;
  approvalDateTo?: string;
}

export interface BlockUnblockAccountBalanceApprovalQueryFilter {
  accountType: string;
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

export interface BlockUnblockAccountBalanceApprovalQueryFilterDisplayTemp {
  accountType: string;
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
