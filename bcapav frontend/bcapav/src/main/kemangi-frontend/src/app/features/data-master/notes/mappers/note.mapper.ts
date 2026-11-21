import {
  NotePayload,
  NoteParams,
  NoteDetails,
} from '../domain/models/note.model';
import {
  NotePayloadApi,
  NoteParamsApi,
  NoteDetailsApi,
} from '../api/models/note';

export function mapNotePayloadDomainToApi(domain: NotePayload): NotePayloadApi {
  return {
    id: domain.id ? Number(domain.id) : null,
    active_status: domain.activeStatus,
    note: domain.note,
    description: domain.description,
  };
}

export function mapNoteParamsDomainToApi(domain: NoteParams): NoteParamsApi {
  return {
    limit: Number(domain.limit),
    page: Number(domain.page),
    sort: domain.sort ?? null,
    sort_dir: domain.sortDir ?? null,
    note: domain.note ?? null,
  };
}

export function mapNoteDetailApiToDomain(api: NoteDetailsApi): NoteDetails {
  return {
    activeStatus: api.active_status,
    createdBy: api.created_by ?? '',
    createdByName: api.created_by_name ?? '',
    createdDt: api.created_dt ?? '',
    description: api.description ?? '',
    note: api.note ?? '',
    id: api.id,
    lastApprovalBy: api.last_approval_by ?? '',
    lastApprovalDt: api.last_approval_dt ?? '',
    lastApprovalName: api.last_approval_name ?? '',
    lastUpdatedBy: api.last_updated_by ?? '',
    lastUpdatedByName: api.last_updated_by_name ?? '',
    lastUpdatedDt: api.last_updated_dt ?? '',
  };
}
