export interface BinPayloadApi {
  id: number | null;
  active_status: boolean;
  bin_number: string;
  bin_description: string;
}

export interface BinQueryApi {
  limit: number;
  page: number;
  sort: string | null;
  sort_dir: 'asc' | 'desc' | null;
  bin_number: string | null;
}

export interface BinDetailsApi {
  active_status: boolean;
  created_by: string | null;
  created_by_name: string | null;
  created_dt: string | null;
  bin_description: string | null;
  bin_number: string | null;
  id: number;
  last_approval_by: string | null;
  last_approval_dt: string | null;
  last_approval_name: string | null;
  last_updated_by: string | null;
  last_updated_by_name: string | null;
  last_updated_dt: string | null;
}
