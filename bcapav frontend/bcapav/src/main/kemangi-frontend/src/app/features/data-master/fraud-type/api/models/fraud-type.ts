export interface FraudTypePayloadApi {
  id: number | null;
  active_status: boolean;
  fraud_type: string;
  description: string;
}

export interface FraudTypeParamsApi {
  limit: number;
  page: number;
  sort: string | null;
  sort_dir: 'asc' | 'desc' | null;
  fraud_type: string | null;
}

export interface FraudTypeDetailsApi {
  active_status: boolean;
  created_by: string | null;
  created_by_name: string | null;
  created_dt: string | null;
  description: string | null;
  fraud_type: string | null;
  id: number;
  last_approval_by: string | null;
  last_approval_dt: string | null;
  last_approval_name: string | null;
  last_updated_by: string | null;
  last_updated_by_name: string | null;
  last_updated_dt: string | null;
}
