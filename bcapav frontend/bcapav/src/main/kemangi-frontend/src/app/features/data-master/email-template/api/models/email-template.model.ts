import { FilePropsApi, TableQueryApi } from '../../../../../shared';

export interface EmailTemplatePayloadApi {
  id: number | null;
  active_status: boolean;
  template_id: string | null;
  template_name: string | null;
  template_type: string | null;
  product_type: string | null;
  event_type: string | null;

  email_subject: string | null;
  email_to: string[] | null;
  email_cc: string[] | null;
  email_bcc: string[] | null;
  email_body: string | null;
  email_parameter: string[] | null;
  list_resources?: FilePropsApi[] | null;
}

export interface EmailTemplateQueryApi extends TableQueryApi {
  name: string | null;
}

export interface EmailTemplateDetailsApi {
  created_by: string | null;
  created_by_name: string | null;
  created_dt: string | null;
  id: number;
  last_approval_by: string | null;
  last_approval_dt: string | null;
  last_approval_name: string | null;
  last_updated_by: string | null;
  last_updated_by_name: string | null;
  last_updated_dt: string | null;
  active_status: boolean;
  template_id: string | null;
  template_name: string | null;
  template_type: string | null;
  product_type: string | null;
  event_type: string | null;
  placeholder: string | null;
  email_subject: string | null;
  email_to: string[] | null;
  email_cc: string[] | null;
  email_bcc: string[] | null;
  email_body: string | null;
  email_parameter: string | null;
  list_parameters: string[] | null;
  list_resources: FilePropsApi[] | null;
  has_rule_relation: boolean;
  has_active_rule_relation: boolean;
}
