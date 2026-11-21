import { BinQuery, BinDetails } from '../domain/models/bin.model';

export const BIN_TABLE_QUERY_INIT: BinQuery = {
  limit: 10,
  page: 1,
  sort: 'lastApprovalDt',
  sortDir: 'desc',
  binNumber: '',
};

export const BIN_DETAILS_DEFAULT: BinDetails = {
  activeStatus: false,
  createdBy: '',
  createdByName: '',
  createdDt: '',
  binDescription: '',
  binNumber: '',
  id: 0,
  lastApprovalBy: '',
  lastApprovalDt: '',
  lastApprovalName: '',
  lastUpdatedBy: '',
  lastUpdatedByName: '',
  lastUpdatedDt: '',
};
