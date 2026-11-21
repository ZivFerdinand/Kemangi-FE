export const filterDisplayTemp = {};

export interface FraudTypeApprovalDetails {
  appr_id: number | null;
  fraud_type: string | null;
  description: string | null;
  created_by: string | null;
  created_date: string | null;
  requested_by: string | null;
  requested_date: string | null;
  approval_status: string | null;
  active_status: boolean;
  request_type: string | null;
}

export interface FraudTypeDetails {
  apprId: string;
  lastApprId: string | null;
  fraudType: string | null;
  approvalStatus: string | null;
  activeStatus: boolean;
  description: string | null;
  createdBy: string | null;
  createdDate: string | null;
  requestedBy: string | null;
  requestedDate: string | null;
  requestType: string | null;
}
