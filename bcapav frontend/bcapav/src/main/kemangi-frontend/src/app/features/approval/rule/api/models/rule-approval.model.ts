import { TableQueryApi, FilePropsApi } from '../../../../../shared';

export interface RuleApprovalPayloadApi {
  appr_id: number | null;
  approval_status: string;
  note: string;
}

export interface RuleApprovalQueryApi extends TableQueryApi {
  rule_id: string[] | null;
  rule_name: string | null;
  rule_description: string | null;
  reviewer1_done: boolean | null;
  draft: boolean | null;
  active_status: boolean | null;
  task_list: boolean | null;
  request_type: string | null;
  approval_status: string | null;
  requester_id: string[] | null;
  approver1_id: string[] | null;
  approver2_id: string[] | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approval1_date_from: string | null;
  approval1_date_to: string | null;
  approval2_date_from: string | null;
  approval2_date_to: string | null;
  effective_date_from: string | null;
  effective_date_to: string | null;
}

export interface RuleApprovalDetailsApi {
  appr_id: number;
  last_appr_id: number | null;
  rule_id: string | null;
  rule_name: string;
  rule_desc_short: string | null;
  rule_desc_long: string | null;
  rule_type: string | null;
  active_status: boolean;
  request_type: string;
  approval_status: string;
  product_type: string | null;
  requester_id: string | null;
  requester_name: string | null;
  request_date: string | null;
  approver1_id: string | null;
  approver1_name: string | null;
  approval1_date: string | null;
  approver2_id: string | null;
  approver2_name: string | null;
  approval2_date: string | null;
  rejection_note: string | null;
  rule_start: string;
  rule_end: string;
  auto_block_flag: boolean;
  alert_flag: boolean;
  list_files: FilePropsApi[];
  subrules: SubRuleApprovalApi[];
}

export interface SubRuleApprovalApi {
  subrule_id: string;
  subrule_name: string;
  event_type: string;
  has_pipeline: boolean;
  parameters: SubRuleApprovalParameterApi[];
  pipelines: PipelineApprovalApi[];
  pipeline_custom: PipelineApprovalCustomApi[];
  auto_action: AutoActionApi[];
}

export interface PipelineApprovalCustomApi {
  schema_json: string | null;
}

export interface SubRuleApprovalParameterApi {
  function_name: string;
  parameter: string;
  operator: string;
  value: string;
  data_group_id: string | number | null;
  data_group_name: string | null;
  data_group_value: string | null;
  data_group_sample: string[] | null;
}

export interface PipelineApprovalApi {
  pipeline_type: string;
  skip_if_exists: boolean;
  var_name: string;
  pipeline_details: PipelineApprovalDetailApi[];
}

export interface PipelineApprovalDetailApi {
  detail: PipelineApprovalDetailConfigApi;
  var_name: string;
}

export interface PipelineApprovalDetailConfigApi {
  function: string | null;
  event_type: string | null;
  period: number | null;
  unit: string | null;
  ttl_type: string | null;
  criteria: CriteriaApi[];
  outcome: string | null;
  operator: string | null;
  value: string | null;
}

export interface CriteriaApi {
  key: string;
  value: string;
}

export interface AutoActionApi {
  channel_type: string;
  template_id: string;
  description: string;
  limit_flag: boolean;
  key: string;
  threshold: number;
  period: number;
  unit: string;
}

export interface DropdownRuleFunctionApi {
  funtion_id: string;
  function_name: string;
  function_description: string;
  function_formula: string;
  is_aggregation: boolean;
  is_multi_param: boolean;
  data_type: string;
  field_source: string;
  input_needed: boolean;
  input_default: string;
  input_sample: string;
  return_type: string;
}

export interface DropdownRuleOperatorApi {
  input_sample: string;
  input_type: string;
  no_operands: string;
  operator_description: string;
  operator_id: string;
  operator_name: string;
}

export interface DropdownRuleSafeParameterApi {
  parameter_type: string;
  parameter_value: string;
  parameter_name: string;
  is_trackable: boolean;
  is_pii: boolean;
  fixed_value: boolean;
}

export interface DropdownEmailTemplateApi {
  id: number;
  template_id: string | null;
  template_name: string | null;
  email_subject: string | null;
}
export interface DropdownEmaiTemplateParamsApi {
  query: string;
  product_type: string;
}

export interface DropdownProductGroupApi {
  product_group: string;
  product_group_name: string;
}

export interface DropdownPipelineTypeApi {
  pipeline_id: string;
  pipeline_type: string;
  description: string;
  need_expiry_time: boolean;
  need_function: boolean;
  need_event_type: boolean;
  criteria: CriteriaPipelineTypeApi[];
  evaluation: EvaluationPipelineTypeApi;
}

export interface CriteriaPipelineTypeApi {
  key: string;
  name: string;
  source: string;
  source_value: string;
  optional: boolean;
}

export interface EvaluationPipelineTypeApi {
  outcome_source: string | null;
  default_outcome: string | null;
  default_outcome_name: string | null;
  operator: string | null;
  default_operator: string | null;
  value: string | null;
}

export interface DropdownDataGroupApi {
  data_group_id: string;
  data_group_name: string;
  detail_snapshot: string | null;
  detail_count: number;
  detail_sample: string[];
}

export interface DropdownSubRuleParameterTypeApi {
  parameter_type: string;
  parameter_type_name: string;
}

export interface DropdownSubRuleParameterApi {
  parameter_type: string;
  parameter_value: string;
  parameter_name: string;
  is_trackable: boolean;
  is_pii: boolean;
  fixed_value: boolean;
}

export interface DropdownRulePipelineApi {
  pipeline_type: string;
  pipeline_id: string;
  parameter_key: string;
  parameter_value: string;
  is_nullable: boolean;
  value_source: string;
  value_description: string;
  output_source: string;
  output_value: string;
}

export interface DropdownHistoricalApi {
  historical_id: string;
  table_historical: string;
  field_historical: string;
  is_primary_key: boolean;
}

export interface DropdownHistoricalFieldApi {
  field_historical: string;
}

export interface DropdownSmsTemplateApi {
  sms_id: string;
  template: string;
  recipient: string;
  sms_division: string;
  sms_template_id: string;
  sms_operation_type: string;
}

export interface DropdownWaTemplateApi {
  wa_id: string;
  template: string;
  recipient: string;
  wa_image: string;
  wa_video: string;
  wa_document: string;
  wa_body: string;
  wa_button: string;
}

export interface DropdownMbNotifApi {
  mbnotif_body: string | null;
  mbnotif_content: string | null;
  mbnotif_data: string | null;
  mbnotif_flag_alert: string | null;
  mbnotif_id: string | null;
  mbnotif_title: string | null;
  mbnotif_txn_type: string | null;
  recipient: string | null;
  template: string | null;
}

export interface DropdownAbApi {
  api_id: string;
  api_name: string;
  description: string;
  template: string;
  product: string;
  channel: string;
  autoblock_status: boolean;
}

export interface DropdownRuleApi {
  rule_id: string;
  rule_name: string;
}

export interface DropdownTemplateTypeApi {
  template_type: string;
  use_event_type: boolean;
}
