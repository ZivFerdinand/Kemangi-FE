import {
  FraudTypeParams,
  FraudTypeDetails,
} from '../domain/models/fraud-types.model';

export const FRAUD_TYPE_LIST_DEFAULT: FraudTypeParams = {
  limit: 10,
  page: 1,
  sort: 'lastApprovalDt',
  sortDir: 'desc',
  fraudType: '',
};

export const FRAUD_TYPE_DETAILS_DEFAULT: FraudTypeDetails = {
  activeStatus: false,
  createdBy: '',
  createdByName: '',
  createdDt: '',
  description: '',
  fraudType: '',
  id: 0,
  lastApprovalBy: '',
  lastApprovalDt: '',
  lastApprovalName: '',
  lastUpdatedBy: '',
  lastUpdatedByName: '',
  lastUpdatedDt: '',
};
