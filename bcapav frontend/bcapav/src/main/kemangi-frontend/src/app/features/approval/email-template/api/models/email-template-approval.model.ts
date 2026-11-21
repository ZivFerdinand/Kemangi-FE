import { TableQueryApi, FilePropsApi } from '../../../../../shared';

export interface EmailTemplateApprovalFormApi {
  appr_id: number | null;
  approval_status: string;
  note: string;
}

export interface EmailTemplateApprovalQueryApi extends TableQueryApi {
  name: string | null;
  email_template_id: string | null;
  product_type: string | null;
  template_type: string | null;
  task_list: boolean | null;
  request_type: string | null;
  approval_status: string | null;
  requester_id: string[] | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approver_id: string[] | null;
  approval_date_from: string | null;
  approval_date_to: string | null;
}

export interface EmailTemplateApprovalDetailsApi {
  appr_id: number;
  last_appr_id: null;
  template_id: string | null;
  template_name: string | null;
  template_type: string | null;
  request_type: string | null;
  approval_status: string | null;
  active_status: boolean;
  requester_id: string | null;
  requester_name: string | null;
  request_date: string | null;
  approver_id: string | null;
  approver_name: string | null;
  approval_date: string | null;
  rejection_note: string | null;
  product_type: string | null;
  event_type: string | null;
  email_to: string[] | null;
  email_cc: string[] | null;
  email_bcc: string[] | null;
  email_subject: string | null;
  email_body: string | null;
  email_parameter: string | null;
  list_parameters: string[] | null;
  list_resources: FilePropsApi[] | null;
}
