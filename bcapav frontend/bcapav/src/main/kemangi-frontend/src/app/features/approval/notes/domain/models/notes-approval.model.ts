import { TableQuery } from '../../../../../shared';

export interface NoteApproval {
  apprId: number;
  noteId: number | null;
  note: string | null;
  description: string | null;
  activeStatus: boolean;
  requestType: string | null;
  approvalStatus: string | null;
  rejectionNote: string | null;
  createdBy: string | null;
  createdDt: string | null;
  requesterId: string | null;
  requesterName: string | null;
  requestDate: string | null;
  approverId: string | null;
  approverName: string | null;
  approvalDate: string | null;
}
export interface NoteApprovalDetails {
  activeStatus: boolean;
  apprId: string;
  approvalDate: string;
  approvalStatus: string;
  approverId: string;
  approverName: string;
  description: string;
  note: string;
  noteId: string;
  lastApprId: string;
  rejectionNote: string;
  requestDate: string;
  requestType: string;
  requesterId: string;
  requesterName: string;
}

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

export interface NotesApprovalQuery extends TableQuery {
  taskList: boolean;
  approvalStatus: string;
  noteId: string[];
  note: string;
  description: string;
  activeStatus: boolean | null;
  requestType: string;
  requesterId: string[];
  approverId: string[];
  requestDateFrom: string;
  requestDateTo: string;
  approvalDateFrom: string;
  approvalDateTo: string;
}

export interface NotesApprovalQueryFilter {
  note: string;
  description: string;
  requesterId: string[];
  requestDateFrom: string;
  requestDateTo: string;
  requestType: string;
  approvalStatus: string;
  approverId: string[];
  approvalDateFrom: string;
  approvalDateTo: string;
}

export interface NotesApprovalQueryFilterDisplayTemp {
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
