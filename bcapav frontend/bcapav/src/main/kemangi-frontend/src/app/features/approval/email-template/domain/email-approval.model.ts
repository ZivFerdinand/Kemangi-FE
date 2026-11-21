import { FileProps, TableQuery } from '../../../../shared';

export interface EmailTemplateApproval {
  apprId: number;
  emailTemplateId: string | null;
  templateId: string | null;
  templateName: string | null;
  templateType: string | null;
  productType: string | null;
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

export interface EmailTemplateApprovalQuery extends TableQuery {
  name: string;
  emailTemplateId: string | null;
  productType: string | null;
  templateType: string;
  taskList: boolean | null;
  requestType: string;
  approvalStatus: string;
  requesterId: string[];
  requestDateFrom: string;
  requestDateTo: string;
  approverId: string[];
  approvalDateFrom: string;
  approvalDateTo: string;
}

export interface EmailRequestedFilterQuery {
  name: string;
  templateType: string;
  emailTemplateId: string;
  productType: string;
  requesterId: Array<string> | null;
  requestDateFrom: string;
  requestDateTo: string;
  requestType: string;
  approvalStatus: string;
  approverId: Array<string> | null;
  approvalDateFrom: string;
  approvalDateTo: string;
}

export interface EmailRequestedFilterDisplayTemp {
  name: string;
  templateType: string;
  requestedBy: string;
  requestDateFrom: string;
  requestDateTo: string;
  reviewedBy: string;
  approvalDateFrom: string;
  approvalDateTo: string;
  approvalStatus: string;
  requestType: string;
}

export interface EmailTemplateApprovalDetails {
  apprId: string;
  lastApprId: string;
  requesterName: string;
  requestDate: string;
  approverName: string;
  approvalDate: string;
  rejectionNote: string;
  approvalStatus: string;
  activeStatus: boolean;
  requestType: string;
  templateId: string | null;
  templateName: string;
  templateType: string;
  productType: string;
  eventType: string;
  emailTo: string[];
  emailCc: string[];
  emailBcc: string[];
  emailSubject: string;
  emailBody: string;
  emailParameter: string;
  listParameters: string[] | null;
  listResources: FileProps[] | null;
}
