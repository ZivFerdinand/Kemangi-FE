export interface Note {
  id: number;
  note: string | null;
  description: string | null;
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

export interface NoteParams {
  limit: number;
  page: number;
  sort: string;
  sortDir: 'asc' | 'desc';
  note: string;
}

export interface NotePayload {
  activeStatus: boolean;
  id: string;
  note: string;
  description: string;
}

export interface NoteDetails {
  activeStatus: boolean;
  createdBy: string;
  createdByName: string;
  createdDt: string;
  description: string;
  note: string;
  id: number;
  lastApprovalBy: string;
  lastApprovalDt: string;
  lastApprovalName: string;
  lastUpdatedBy: string;
  lastUpdatedByName: string;
  lastUpdatedDt: string;
}
