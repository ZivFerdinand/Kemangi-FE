import { TableQuery } from '../../../../../shared';

export interface SMCRequestPayload {
  apprId: number;
  approvalStatus: string;
  note: string;
}

export interface SMCDetails {
  id: number;
  fileName: string;
  totalData: number;
  totalValidData: number;
  totalInvalidData: number;
  totalFailedData: number | null;
  totalSuccessData: number | null;
  approvalStatus: string;
  processStatus: string | null;
  rejectionNote: string;
  retryFlag: boolean | null;
  requesterId: string;
  requesterName: string;
  requestDate: string;
  approverId: string | null;
  approverName: string | null;
  approvalDate: string | null;
}

export interface SMCDetailsListTableQuery extends TableQuery {
  query: string | null;
  validStatus: boolean | null;
  processStatus: boolean | null;
  retryFlag: boolean | null;
}

export interface SMCDownloadFileParams {
  validStatus: boolean | null;
  processStatus: boolean | null;
}
