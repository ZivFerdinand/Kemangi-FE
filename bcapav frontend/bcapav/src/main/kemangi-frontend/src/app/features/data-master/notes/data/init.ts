import { NoteParams, NoteDetails } from '../domain/models/note.model';

export const NOTE_LIST_DEFAULT: NoteParams = {
  limit: 10,
  page: 1,
  sort: 'lastApprovalDt',
  sortDir: 'desc',
  note: '',
};

export const NOTE_DETAILS_DEFAULT: NoteDetails = {
  activeStatus: false,
  createdBy: '',
  createdByName: '',
  createdDt: '',
  description: '',
  note: '',
  id: 0,
  lastApprovalBy: '',
  lastApprovalDt: '',
  lastApprovalName: '',
  lastUpdatedBy: '',
  lastUpdatedByName: '',
  lastUpdatedDt: '',
};
