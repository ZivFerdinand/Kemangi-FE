import { TableQuery } from '../../../../../shared';

export interface BlockUnblockRequestPayload {
  apprId: number;
  approvalStatus: string;
  note: string;
}

export interface BlockUnblockDetails {
  id: number;
  fileName: string;
  totalData: number;
  totalValidData: number;
  totalInvalidData: number;
  totalFailedData: number | null;
  totalSuccessData: number | null;
  action: string;
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

export interface BlockUnblockDetailsListTable {
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

export interface BlockUnblockDetailsListTableQuery extends TableQuery {
  limit: number;
  page: number;
  sort: string;
  sortDir: string;
  query: string;
  validStatus: boolean | null;
  processStatus: boolean | null;
}

export interface BlockUnblockListTable {
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
