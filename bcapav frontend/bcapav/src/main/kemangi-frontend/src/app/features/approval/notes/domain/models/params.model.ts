export interface NoteTaskListParams {
  limit: number;
  page: number;
  sort: string;
  sortDir: string;
  taskList: boolean;
  approvalStatus: string;
}

export interface NoteRequestedListParams extends NoteTaskListParams {
  noteId: string[] | null;
  note: string | null;
  description: string | null;
  activeStatus: boolean | null;
  requestType: string | null;
  requesterId: string[] | null;
  approverId: string[] | null;
  requestDateFrom: string | null;
  requestDateTo: string | null;
  approvalDateFrom: string | null;
  approvalDateTo: string | null;
}

export interface NoteApprovalDefaultFilter {
  note: string;
  description: string;
  requesterId: any[] | null;
  requestDateFrom: string;
  requestDateTo: string;
  requestType: string;
  approvalStatus: string;
  approverId: any[] | null;
  approvalDateFrom: string;
  approvalDateTo: string;
}

export interface NoteApprovalTempFilter {
  note: string | null;
  description: string | null;
  requestedBy: string[] | null;
  approvedBy: string[] | null;
  requestDateFrom: string | null;
  requestDateTo: string | null;
  approvalDateFrom: string | null;
  approvalDateTo: string | null;
  approvalStatus: string | null;
  requestType: string | null;
}
