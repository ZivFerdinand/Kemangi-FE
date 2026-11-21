export interface FraudType {
  id: number;
  fraudType: string | null;
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
  activeStatus: true;
  hasPendingRequest: false;
}

export interface FraudTypeParams {
  limit: number;
  page: number;
  sort: string;
  sortDir: 'asc' | 'desc';
  fraudType: string;
}

export interface FraudTypePayload {
  activeStatus: boolean;
  id: string;
  fraudType: string;
  description: string;
}

export interface FraudTypeDetails {
  activeStatus: boolean;
  createdBy: string;
  createdByName: string;
  createdDt: string;
  description: string;
  fraudType: string;
  id: number;
  lastApprovalBy: string;
  lastApprovalDt: string;
  lastApprovalName: string;
  lastUpdatedBy: string;
  lastUpdatedByName: string;
  lastUpdatedDt: string;
}
