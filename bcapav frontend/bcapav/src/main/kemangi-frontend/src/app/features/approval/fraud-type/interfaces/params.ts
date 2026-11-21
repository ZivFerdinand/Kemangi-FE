import { TableParams } from '../../../../shared';

export interface FraudTypeApprovalListParams extends TableParams {
  task_list: boolean;
  name: string | null;
  description: string | null;
  requester_id: any[] | null;
  request_date_from: string | null;
  request_date_to: string | null;
  request_type: string | null;
  approval_status: string | null;
  approver_id: any[] | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface FraudTypeApprovalDefaultFilter {
  name: string | null;
  description: string | null;
  requester_id: any[] | null;
  request_date_from: string | null;
  request_date_to: string | null;
  request_type: string | null;
  approval_status: string | null;
  approver_id: any[] | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface FraudTypeApprovalTempFilter {
  fraud_type: string | null;
  description: string | null;
  requested_by: string[] | null;
  approved_by: string[] | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
  approval_status: string | null;
  request_type: string | null;
}
