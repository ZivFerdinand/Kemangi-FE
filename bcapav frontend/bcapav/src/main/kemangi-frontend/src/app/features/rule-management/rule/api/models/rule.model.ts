import { TableQueryApi, FilePropsApi } from '../../../../../shared';

export interface DropdownRuleApprQueryApi {
  query: string | null;
  draft: boolean | null;
  task_list: boolean | null;
  reviewer1_done: boolean | null;
}
export interface RuleQueryApi extends TableQueryApi {
  rule_id: Array<string> | null;
  rule_name: string | null;
  rule_description: string | null;
  active_status: boolean | null;
  expired: boolean | null;
  requester_id: Array<string> | null;
  request_date_from: string | null;
  request_date_to: string | null;
  approver1_id: Array<string> | null;
  approval1_date_from: string | null;
  approval1_date_to: string | null;
  approver2_id: Array<string> | null;
  approval2_date_from: string | null;
  approval2_date_to: string | null;
  effective_date_from: string | null;
  effective_date_to: string | null;
}

export interface RuleDetailsApi {
  id: number;
  rule_id: string;
  product_type: string | null;
  rule_name: string;
  rule_desc_short: string | null;
  rule_desc_long: string | null;
  rule_type: string | null;
  active_status: boolean;
  rule_start: string;
  rule_end: string;
  auto_block_flag: boolean;
  alert_flag: boolean;
  created_by: string | null;
  created_by_name: string | null;
  created_dt: string | null;
  last_updated_by: string | null;
  last_updated_by_name: string | null;
  last_updated_dt: string | null;
  last_approval1_by: string | null;
  last_approval1_name: string | null;
  last_approval1_dt: string | null;
  last_approval2_by: string | null;
  last_approval2_name: string | null;
  last_approval2_dt: string | null;
  last_appr_files: FilePropsApi[];
  subrules: SubRuleApi[];
}

export interface SubRuleApi {
  subrule_id: string | null;
  subrule_name: string;
  event_type: string | null;
  has_pipeline: boolean;
  parameters: SubRuleParameterApi[];
  pipelines: PipelineApi[];
  pipeline_custom: PipelineCustomApi[];
  auto_action: AutoActionApi[];
}

export interface PipelineCustomApi {
  schema_json: string | null;
}
export interface SubRuleParameterApi {
  function_name: string;
  parameter: string;
  operator: string;
  value: string | null;
  data_group_id: string | number | null;
  data_group_name?: string | null;
  data_group_value?: string | null;
  data_group_sample?: string[] | null;
}

export interface PipelineApi {
  pipeline_type: string;
  skip_if_exists: boolean;
  var_name: string;
  pipeline_details: PipelineDetailApi[];
}

export interface PipelineDetailApi {
  detail: PipelineDetailConfigApi;
  var_name: string | null;
}

export interface PipelineDetailConfigApi {
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

export interface CriteriaParameterApi {
  parameter: string;
  value: string;
}

export interface AutoActionApi {
  channel_type: string;
  template_id: string;
  description: string;
  limit_flag: boolean;
  key: string | null;
  threshold?: number | null;
  period?: number | null;
  unit?: string | null;
}

export interface RuleDeletePayloadApi {
  rule_id: string;
  list_files: FilePropsApi[];
}

export interface RulePayloadFormApi {
  appr_id: number | null;
  rule_id: string | null;
  product_type: string | null;
  rule_name: string | null;
  rule_desc_short: string | null;
  rule_desc_long: string | null;
  rule_type: string | null;
  active_status: boolean;
  rule_start: string | null;
  rule_end: string | null;
  auto_block_flag: boolean;
  alert_flag: boolean;
  list_files: FilePropsApi[];
  subrules: SubrulePayloadFormApi[];
}
export interface SubrulePayloadFormApi {
  subrule_id?: string | null;
  subrule_name?: string | null;
  event_type: string | null;
  parameters: SubruleParameterPayloadFormApi[] | null;
  has_pipeline: boolean;
  pipelines: PipelinePayloadFormApi[];
  pipeline_custom: PipelineCustomPayloadFormApi[];
  auto_action?: AutoActionFormApi[];
}

export interface PipelineCustomPayloadFormApi {
  schema_json: string;
}

export interface SubruleParameterPayloadFormApi {
  function_name: string | null;
  parameter: string | null;
  operator: string | null;
  value: string | boolean | null;
  data_group_id: string | number | null;
}

export interface PipelinePayloadFormApi {
  pipeline_type: string | null;
  skip_if_exists: boolean | null;
  var_name: string | null;
  pipeline_details: PipelineDetailsPayloadFormApi[];
}

export interface PipelineDetailsPayloadFormApi {
  detail: PipelineDetailsDetailsPayloadFormApi;
  var_name: string | null;
}

export interface PipelineDetailsDetailsPayloadFormApi {
  function: string | null;
  event_type: string | null;
  period: number | null;
  unit: string | null;
  ttl_type: string;
  criteria: PipelineDetailsCriteriaPayloadFormApi[];
  outcome: string | null;
  operator: string | null;
  value: string | boolean | null;
}

export interface PipelineDetailsCriteriaPayloadFormApi {
  key: string | null;
  value: string | null;
}

export interface AutoActionFormApi {
  channel_type: string;
  template_id: string;
  limit_flag: boolean;
  key: string | null;
  threshold?: number | null;
  period?: number | null;
  unit?: string | null;
}
