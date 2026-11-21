import { FileProps, TableQuery } from '../../../../../shared';

export interface EmailTemplate {
  id: number;
  templateId: string | null;
  templateName: string | null;
  templateType: string | null;
  productType: string | null;
  createdBy: string | null;
  createdByName: string | null;
  createdDt: string | null;
  lastUpdatedBy: string | null;
  lastUpdatedByName: string | null;
  lastUpdatedDt: string | null;
  lastApprovalId: string | null;
  lastApprovalName: string | null;
  lastApprovalDt: string | null;
  activeStatus: boolean;
  hasPendingRequest: boolean;
  hasRuleRelation: boolean;
  hasActiveRuleRelation: boolean;
  hasPendingRuleRelation: boolean;
}

export interface EmailTemplatePayload {
  id: number | null;
  activeStatus: boolean;
  templateId: string | null;
  templateName: string | null;
  templateType: string | null;
  productType: string | null;
  eventType: string | null;
  placeholder: string | null;
  emailSubject: string | null;
  emailTo: string[] | null;
  emailCc: string[] | null;
  emailBcc: string[] | null;
  emailBody: string | null;
  emailParameter: string[] | null;
  listResources?: FileProps[] | null;
}

export interface EmailTemplateQuery extends TableQuery {
  name: string | null;
}

export interface EmailTemplateDetails {
  createdBy: string | null;
  createdByName: string | null;
  createdDt: string | null;
  id: number;
  lastApprovalBy: string | null;
  lastApprovalDt: string | null;
  lastApprovalName: string | null;
  lastUpdatedBy: string | null;
  lastUpdatedByName: string | null;
  lastUpdatedDt: string | null;
  activeStatus: boolean;
  templateId: string | null;
  templateName: string | null;
  templateType: string | null;
  productType: string | null;
  eventType: string | null;
  placeholder: string | null;
  emailSubject: string | null;
  emailTo: string[] | null;
  emailCc: string[] | null;
  emailBcc: string[] | null;
  emailBody: string | null;
  emailParameter: string | null;
  listParameters: string[] | null;
  listResources: FileProps[] | null;
  hasRuleRelation: boolean;
  hasActiveRuleRelation: boolean;
}
