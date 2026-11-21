import {
  NotesApprovalQueryApi,
  NoteApprovalDetailsApi,
} from '../api/models/note-approval';
import {
  NotesApprovalQuery,
  NoteApprovalDetails,
} from '../domain/models/notes-approval.model';

export function mapNotesApprovalQueryDomainToApi(
  domain: NotesApprovalQuery,
): NotesApprovalQueryApi {
  return {
    limit: Number(domain.limit),
    page: Number(domain.page),
    sort: domain.sort || null,
    sort_dir: domain.sortDir || null,
    task_list: domain.taskList ?? null,
    request_type: domain.requestType || null,
    approval_status: domain.approvalStatus || null,
    note_id: domain.noteId.length === 0 ? null : domain.noteId,
    note: domain.note || null,
    description: domain.description || null,
    active_status: domain.activeStatus ?? null,
    requester_id: domain.requesterId.length === 0 ? null : domain.requesterId,
    request_date_from: domain.requestDateFrom || null,
    request_date_to: domain.requestDateTo || domain.requestDateFrom || null,
    approver_id: domain.approverId.length === 0 ? null : domain.approverId,
    approval_date_from: domain.approvalDateFrom || null,
    approval_date_to: domain.approvalDateTo || domain.approvalDateFrom || null,
  };
}

export function mapNoteApprovalDetailsApiToDomain(
  api: NoteApprovalDetailsApi,
): NoteApprovalDetails {
  return {
    activeStatus: api.active_status,
    apprId: api.appr_id.toString(),
    approvalDate: api.approval_date ? api.approval_date : '',
    approvalStatus: api.approval_status ? api.approval_status : '',
    approverId: api.approver_id ? api.approver_id : '',
    approverName: api.approver_name ? api.approver_name : '',
    description: api.description ? api.description : '',
    note: api.note ? api.note : '',
    noteId: api.note_id ? api.note_id.toString() : '',
    lastApprId: api.last_appr_id ? api.last_appr_id.toString() : '',
    rejectionNote: api.rejection_note ? api.rejection_note : '',
    requestDate: api.request_date ? api.request_date : '',
    requestType: api.request_type ? api.request_type : '',
    requesterId: api.requester_id ? api.requester_id : '',
    requesterName: api.requester_name ? api.requester_name : '',
  };
}
