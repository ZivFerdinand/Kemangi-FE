import {
  EmailTemplateApprovalDetailsApi,
  EmailTemplateApprovalQueryApi,
} from './../api/models/email-template-approval.model';
import {
  EmailTemplateApprovalDetails,
  EmailTemplateApprovalQuery,
} from './../domain/email-approval.model';

export function mapEmailTemplateApprovalQueryDomainToApi(
  domain: EmailTemplateApprovalQuery,
): EmailTemplateApprovalQueryApi {
  return {
    limit: Number(domain.limit),
    page: Number(domain.page),
    sort: domain.sort || null,
    sort_dir: domain.sortDir || null,
    name: domain.name || null,
    email_template_id: domain.emailTemplateId || null,
    product_type: domain.productType || null,
    template_type: domain.templateType || null,
    task_list: domain.taskList ?? null,
    request_type: domain.requestType || null,
    approval_status: domain.approvalStatus || null,
    requester_id: domain.requesterId.length === 0 ? null : domain.requesterId,
    request_date_from: domain.requestDateFrom || null,
    request_date_to: domain.requestDateTo || domain.requestDateFrom || null,
    approver_id: domain.approverId.length === 0 ? null : domain.approverId,
    approval_date_from: domain.approvalDateFrom || null,
    approval_date_to: domain.approvalDateTo || domain.approvalDateFrom || null,
  };
}

export function mapEmailTemplateDetailsApprovalApiToDomain(
  api: EmailTemplateApprovalDetailsApi,
): EmailTemplateApprovalDetails {
  return {
    apprId: api.appr_id.toString(),
    lastApprId: api.last_appr_id ?? '',
    activeStatus: api.active_status,
    requestType: api.request_type ?? '',
    approvalStatus: api.approval_status ?? '',
    requesterName: api.requester_name ?? '',
    requestDate: api.request_date ?? '',
    approverName: api.approver_name ?? '',
    approvalDate: api.approval_date ?? '',
    rejectionNote: api.rejection_note ?? '',
    templateId: api.template_id || '',
    templateName: api.template_name ?? '',
    templateType: api.template_type ?? '',
    productType: api.product_type ?? '',
    eventType: api.event_type ?? '',
    emailTo: api.email_to ?? [],
    emailCc: api.email_cc ?? [],
    emailBcc: api.email_bcc ?? [],
    emailSubject: api.email_subject ?? '',
    emailBody: api.email_body ?? '',
    emailParameter: api.email_parameter || '',
    listParameters: api.list_parameters ?? [],
    listResources: (api.list_resources ?? []).map((x) => ({
      extension: x.extension,
      generatedName: x.generated_name,
      originalName: x.original_name,
      url: x.url,
    })),
  };
}
