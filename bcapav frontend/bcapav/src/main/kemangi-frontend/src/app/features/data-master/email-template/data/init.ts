import {
  EmailTemplateQuery,
  EmailTemplateDetails,
} from '../domain/models/email-template.model';

export const EMAIL_TEMPLATE_LIST_PAGE_QUERY_INIT: EmailTemplateQuery = {
  limit: 10,
  page: 1,
  sort: 'lastApprovalDt',
  sortDir: 'desc',
  name: '',
};

export const EMAIL_TEMPLATE_DETAILS_INIT: EmailTemplateDetails = {
  createdBy: '',
  createdByName: '',
  createdDt: '',
  id: 0,
  lastApprovalBy: '',
  lastApprovalDt: '',
  lastApprovalName: '',
  lastUpdatedBy: '',
  lastUpdatedByName: '',
  lastUpdatedDt: '',
  activeStatus: false,
  templateId: '',
  templateName: '',
  templateType: '',
  productType: '',
  eventType: '',
  placeholder: '',
  emailSubject: '',
  emailTo: [],
  emailCc: [],
  emailBcc: [],
  emailBody: '',
  emailParameter: '',
  listParameters: [],
  listResources: [],
  hasActiveRuleRelation: false,
  hasRuleRelation: false,
};
