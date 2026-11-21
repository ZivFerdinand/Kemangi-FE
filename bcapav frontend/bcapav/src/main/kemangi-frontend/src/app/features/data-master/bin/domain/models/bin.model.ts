export interface BIN {
  id: number;
  binNumber: string | null;
  binDescription: string | null;
  createdBy: string | null;
  createdByName: string | null;
  createdDt: string | null;
  lastUpdatedBy: string | null;
  lastUpdatedByName: string | null;
  lastUpdatedDt: string | null;
  lastApprovalId: string | null;
  lastApprovalName: string | null;
  lastApprovalDt: string | null;
  activeStatus: boolean;
  hasPendingRequest: boolean;
}
export interface BinQuery {
  limit: number;
  page: number;
  sort: string;
  sortDir: 'asc' | 'desc';
  binNumber: string;
}

export interface BinPayload {
  activeStatus: boolean;
  id: string;
  binNumber: string;
  binDescription: string;
}

export interface BinDetails {
  activeStatus: boolean;
  createdBy: string;
  createdByName: string;
  createdDt: string;
  binDescription: string;
  binNumber: string;
  id: number;
  lastApprovalBy: string;
  lastApprovalDt: string;
  lastApprovalName: string;
  lastUpdatedBy: string;
  lastUpdatedByName: string;
  lastUpdatedDt: string;
}
