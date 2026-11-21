import {
  EmailTemplatePayload,
  EmailTemplateQuery,
  EmailTemplateDetails,
} from '../domain/models/email-template.model';
import {
  EmailTemplatePayloadApi,
  EmailTemplateQueryApi,
  EmailTemplateDetailsApi,
} from '../api';

export function mapEmailTemplatePayloadDomainToApi(
  domain: EmailTemplatePayload,
): EmailTemplatePayloadApi {
  return {
    id: domain.id ? Number(domain.id) : null,
    active_status: domain.activeStatus,
    template_id: domain.templateId || null,
    template_name: domain.templateName ?? null,
    template_type: domain.templateType ?? null,
    product_type: domain.productType ?? null,
    event_type: domain.eventType ?? null,
    email_subject: domain.emailSubject ?? null,
    email_to: domain.emailTo ?? null,
    email_cc: domain.emailCc ?? null,
    email_bcc: domain.emailBcc ?? null,
    email_body: domain.emailBody ?? null,
    email_parameter: domain.emailParameter || null,
    list_resources: (domain.listResources ?? []).map((x) => ({
      extension: x.extension,
      generated_name: x.generatedName,
      original_name: x.originalName,
      url: x.url,
    })),
  };
}

export function mapEmailTemplateQueryDomainToApi(
  domain: EmailTemplateQuery,
): EmailTemplateQueryApi {
  return {
    limit: Number(domain.limit),
    page: Number(domain.page),
    sort: domain.sort ?? null,
    sort_dir: domain.sortDir ?? null,
    name: domain.name ?? null,
  };
}

export function mapEmailTemplateDetailApiToDomain(
  api: EmailTemplateDetailsApi,
): EmailTemplateDetails {
  return {
    createdBy: api.created_by ?? '',
    createdByName: api.created_by_name ?? '',
    createdDt: api.created_dt ?? '',
    id: api.id,
    lastApprovalBy: api.last_approval_by ?? '',
    lastApprovalDt: api.last_approval_dt ?? '',
    lastApprovalName: api.last_approval_name ?? '',
    lastUpdatedBy: api.last_updated_by ?? '',
    lastUpdatedByName: api.last_updated_by_name ?? '',
    lastUpdatedDt: api.last_updated_dt ?? '',
    activeStatus: api.active_status,
    templateId: api.template_id || '',
    templateName: api.template_name ?? '',
    templateType: api.template_type ?? '',
    productType: api.product_type ?? '',
    eventType: api.event_type ?? '',
    placeholder: api.placeholder ?? '',
    emailSubject: api.email_subject ?? '',
    emailTo: api.email_to ?? [],
    emailCc: api.email_cc ?? [],
    emailBcc: api.email_bcc ?? [],
    emailBody: api.email_body ?? '',
    emailParameter: api.email_parameter || '',
    listParameters: api.list_parameters ?? [],
    listResources: (api.list_resources ?? []).map((x) => ({
      extension: x.extension,
      generatedName: x.generated_name,
      originalName: x.original_name,
      url: x.url,
    })),
    hasRuleRelation: api.has_rule_relation,
    hasActiveRuleRelation: api.has_active_rule_relation,
  };
}

export function mapPlaceholderIIToPlaceholderI(placeholderI: any): any {
  return { email_placeholder: placeholderI.parameter_value };
}
