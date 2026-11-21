import { TableQuery } from '../../../../../shared';

export interface BlockUnblockAccountBalanceRequestPayload {
  apprId: number;
  approvalStatus: string;
  note: string;
}

export interface BlockUnblockAccountBalanceDetails {
  id: number;
  fileName: string;
  totalData: number;
  totalValidData: number;
  totalInvalidData: number;
  totalFailedData: number | null;
  totalSuccessData: number | null;
  action: string;
  accountType: string;
  approvalStatus: string;
  processStatus: string;
  rejectionNote: string;
  retryFlag: boolean | null;
  requesterId: string;
  requesterName: string;
  requestDate: string;
  approverId: string;
  approverName: string;
  approvalDate: string;
}

export interface BlockUnblockAccountBalanceDetailsListTable {
  seq: 1;
  accountNumber: string;
  statusType: string;
  statusCode: string;
  statusReason: string;
  additionalInformation: string;
  validStatus: boolean;
  invalidReason: string | null;
  processStatus: string | null;
  processReason: string | null;
}

export interface BlockUnblockAccountBalanceDetailsListTableQuery extends TableQuery {
  query: string;
  validStatus: boolean | null;
  processStatus: boolean | null;
  retryFlag: boolean | null;
}

export interface BlockUnblockAccountBalanceListTable {
  id: number;
  fileName: string;
  totalData: number;
  totalValidData: number;
  totalInvalidData: number;
  action: string;
  approvalStatus: string;
  processStatus: string;
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
