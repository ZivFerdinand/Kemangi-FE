export interface NotePayloadApi {
  id: number | null;
  active_status: boolean;
  note: string;
  description: string;
}

export interface NoteParamsApi {
  limit: number;
  page: number;
  sort: string | null;
  sort_dir: 'asc' | 'desc' | null;
  note: string | null;
}

export interface NoteDetailsApi {
  active_status: boolean;
  created_by: string | null;
  created_by_name: string | null;
  created_dt: string | null;
  description: string | null;
  note: string | null;
  id: number;
  last_approval_by: string | null;
  last_approval_dt: string | null;
  last_approval_name: string | null;
  last_updated_by: string | null;
  last_updated_by_name: string | null;
  last_updated_dt: string | null;
}
