import {
  RuleApprovalPayload,
  RuleApprovalQuery,
  RuleApprovalDetails,
  DropdownRuleOperator,
  DropdownRuleFunction,
  DropdownEmailTemplate,
  DropdownProductGroup,
  DropdownPipelineType,
  DropdownDataGroup,
  DropdownSubRuleParameterType,
  DropdownSubRuleParameter,
  DropdownRulePipeline,
  DropdownHistorical,
  DropdownSmsTemplate,
  DropdownWaTemplate,
  DropdownMbNotif,
  DropdownAb,
  DropdownRule,
  DropdownTemplateType,
  DropdownHistoricalField,
} from '../domain/models/rule-approval.model';

import {
  RuleApprovalPayloadApi,
  RuleApprovalQueryApi,
  RuleApprovalDetailsApi,
  DropdownRuleOperatorApi,
  DropdownRuleFunctionApi,
  DropdownEmailTemplateApi,
  DropdownProductGroupApi,
  DropdownPipelineTypeApi,
  DropdownDataGroupApi,
  DropdownSubRuleParameterTypeApi,
  DropdownSubRuleParameterApi,
  DropdownRulePipelineApi,
  DropdownHistoricalApi,
  DropdownSmsTemplateApi,
  DropdownWaTemplateApi,
  DropdownMbNotifApi,
  DropdownAbApi,
  DropdownRuleApi,
  DropdownTemplateTypeApi,
  DropdownHistoricalFieldApi,
} from '../api/models/rule-approval.model';

export function mapRuleApprovalQueryDomainToApi(
  domain: RuleApprovalQuery,
): RuleApprovalQueryApi {
  return {
    limit: Number(domain.limit),
    page: Number(domain.page),
    sort: domain.sort ?? null,
    sort_dir: domain.sortDir ?? null,
    rule_name: domain.ruleName ?? null,
    rule_id: domain.ruleId.length === 0 ? null : domain.ruleId,
    rule_description: domain.ruleDescription ?? null,
    reviewer1_done: domain.reviewer1Done ?? null,
    draft: domain.draft ?? null,
    active_status: domain.activeStatus ?? null,
    task_list: domain.taskList ?? null,
    request_type: domain.requestType ?? null,
    approval_status: domain.approvalStatus ?? null,
    requester_id: domain.requesterId.length === 0 ? null : domain.requesterId,
    approver1_id: domain.approver1Id.length === 0 ? null : domain.approver1Id,
    approver2_id: domain.approver2Id.length === 0 ? null : domain.approver2Id,
    request_date_from: domain.requestDateFrom || null,
    request_date_to: domain.requestDateTo || domain.requestDateFrom || null,
    approval1_date_from: domain.approval1DateFrom || null,
    approval1_date_to:
      domain.approval1DateTo || domain.approval1DateFrom || null,
    approval2_date_from: domain.approval2DateFrom || null,
    approval2_date_to:
      domain.approval2DateTo || domain.approval2DateFrom || null,
    effective_date_from: domain.effectiveDateFrom || null,
    effective_date_to:
      domain.effectiveDateTo || domain.effectiveDateFrom || null,
  };
}

export function mapRuleDetailsApprovalApiToDomain(
  api: RuleApprovalDetailsApi,
): RuleApprovalDetails {
  return {
    apprId: api.appr_id,
    lastApprId: api.last_appr_id || 0,
    ruleId: api.rule_id || '',
    ruleName: api.rule_name || '',
    ruleDescShort: api.rule_desc_short || '',
    ruleDescLong: api.rule_desc_long || '',
    ruleType: api.rule_type || '',
    activeStatus: api.active_status,
    requestType: api.request_type,
    approvalStatus: api.approval_status,
    productType: api.product_type || '',
    requesterId: api.requester_id || '',
    requesterName: api.requester_name || '',
    requestDate: api.request_date || '',
    approver1Id: api.approver1_id || '',
    approver1Name: api.approver1_name || '',
    approval1Date: api.approval1_date || '',
    approver2Id: api.approver2_id || '',
    approver2Name: api.approver2_name || '',
    approval2Date: api.approval2_date || '',
    rejectionNote: api.rejection_note || '',
    ruleStart: api.rule_start || '',
    ruleEnd: api.rule_end || '',
    alertFlag: api.alert_flag,
    listFiles: api.list_files.map((x) => ({
      extension: x.extension,
      generatedName: x.generated_name,
      originalName: x.original_name,
      url: x.url,
    })),
    subrules: api.subrules.map((x) => ({
      subruleId: x.subrule_id || '',
      subruleName: x.subrule_name,
      eventType: x.event_type || '',
      hasPipeline: x.has_pipeline,
      parameters: x.parameters.map((y) => ({
        functionName: y.function_name,
        parameter: y.parameter,
        operator: y.operator,
        value: y.value || '',
        dataGroupId: y.data_group_id?.toString() || '',
        dataGroupName: y.data_group_name ?? '',
        dataGroupValue: y.data_group_value ?? '',
      })),
      pipelines: x.pipelines.map((y) => ({
        pipelineType: y.pipeline_type,
        skipIfExists: y.skip_if_exists,
        varName: y.var_name,
        pipelineDetails: y.pipeline_details.map((z) => ({
          detail: z.detail
            ? {
                function: z.detail?.function,
                eventType: z.detail?.event_type,
                period: z.detail?.period,
                unit: z.detail?.unit,
                ttlType: z.detail?.ttl_type,
                criteria: z.detail?.criteria,
                outcome: z.detail?.outcome,
                operator: z.detail?.operator,
                value: z.detail.value,
              }
            : z.detail,
          varName: z.var_name,
        })),
      })),
      pipelineCustom: x.pipeline_custom.map((y) => ({
        schemaJson: y.schema_json,
      })),
      autoAction:
        x.auto_action.length > 0
          ? x.auto_action.map((y) => ({
              channelType: y.channel_type,
              templateId: y.template_id.toString() || '',
              description: y.description ?? '',
              limitFlag: y.limit_flag,
              key: y.key,
              threshold: y.threshold || 0,
              period: y.period || 0,
              unit: y.unit || '',
            }))
          : [],
    })),
  };
}

export function mapRuleApprovalPayloadDomainToApi(
  domain: RuleApprovalPayload,
): RuleApprovalPayloadApi {
  return {
    appr_id: domain.apprId,
    approval_status: domain.approvalStatus,
    note: domain.note ?? '-',
  };
}

export function mapDropdownRuleOperatorApiToDomain(
  api: DropdownRuleOperatorApi,
): DropdownRuleOperator {
  return {
    inputSample: api.input_sample,
    inputType: api.input_type,
    noOperands: api.no_operands,
    operatorDescription: api.operator_description,
    operatorId: api.operator_id,
    operatorName: api.operator_name,
  };
}

export function mapDropdownRuleFunctionApiToDomain(
  api: DropdownRuleFunctionApi,
): DropdownRuleFunction {
  return {
    functionId: api.funtion_id,
    functionName: api.function_name,
    functionDescription: api.function_description,
    functionFormula: api.function_formula,
    isAggregation: api.is_aggregation,
    isMultiParam: api.is_multi_param,
    dataType: api.data_type,
    fieldSource: api.field_source,
    inputNeeded: api.input_needed,
    inputDefault: api.input_default,
    inputSample: api.input_sample,
    returnType: api.return_type,
  };
}

export function mapDropdownEmailTemplateApiToDomain(
  api: DropdownEmailTemplateApi,
): DropdownEmailTemplate {
  return {
    id: api.id,
    templateId: api.template_id || '',
    templateName: api.template_name || '',
    emailSubject: api.email_subject || '',
  };
}

export function mapDropdownProductGroupApiToDomain(
  api: DropdownProductGroupApi,
): DropdownProductGroup {
  return {
    productGroup: api.product_group || '',
    productGroupName: api.product_group_name || '',
  };
}

export function mapDropdownPipelineTypeApiToDomain(
  api: DropdownPipelineTypeApi,
): DropdownPipelineType {
  return {
    pipelineId: api.pipeline_id,
    pipelineType: api.pipeline_type,
    description: api.description,
    needExpiryTime: api.need_expiry_time,
    needFunction: api.need_function,
    needEventType: api.need_event_type,
    criteria: (api.criteria ?? []).map((x) => ({
      key: x.key,
      name: x.name,
      source: x.source,
      sourceValue: x.source_value,
      optional: x.optional,
    })),
    evaluation: {
      outcomeSource: api.evaluation?.outcome_source ?? null,
      defaultOutcome: api.evaluation?.default_outcome ?? null,
      defaultOutcomeName: api.evaluation?.default_outcome_name ?? null,
      operator: api.evaluation?.operator ?? null,
      defaultOperator: api.evaluation?.default_operator ?? null,
      value: api.evaluation?.value ?? null,
    },
  };
}

export function mapDropdownDataGroupApiToDomain(
  api: DropdownDataGroupApi,
): DropdownDataGroup {
  return {
    dataGroupId: api.data_group_id,
    dataGroupName: api.data_group_name,
    detailSnapshot: api.detail_snapshot ?? null,
    detailCount: api.detail_count,
    detailSample: api.detail_sample ?? [],
  };
}

export function mapDropdownSubRuleParameterTypeApiToDomain(
  api: DropdownSubRuleParameterTypeApi,
): DropdownSubRuleParameterType {
  return {
    parameterType: api.parameter_type,
    parameterTypeName: api.parameter_type_name,
  };
}

export function mapDropdownSubRuleParameterApiToDomain(
  api: DropdownSubRuleParameterApi,
): DropdownSubRuleParameter {
  return {
    parameterType: api.parameter_type,
    parameterValue: api.parameter_value,
    parameterName: api.parameter_name,
    isTrackable: api.is_trackable,
    isPii: api.is_pii,
    fixedValue: api.fixed_value,
  };
}

export function mapDropdownRulePipelineApiToDomain(
  api: DropdownRulePipelineApi,
): DropdownRulePipeline {
  return {
    pipelineType: api.pipeline_type,
    pipelineId: api.pipeline_id,
    parameterKey: api.parameter_key,
    parameterValue: api.parameter_value,
    isNullable: api.is_nullable,
    valueSource: api.value_source,
    valueDescription: api.value_description,
    outputSource: api.output_source,
    outputValue: api.output_value,
  };
}

export function mapDropdownHistoricalApiToDomain(
  api: DropdownHistoricalApi,
): DropdownHistorical {
  return {
    historicalId: api.historical_id,
    tableHistorical: api.table_historical,
    fieldHistorical: api.field_historical,
    isPrimaryKey: api.is_primary_key,
  };
}

export function mapDropdownSmsApiToDomain(
  api: DropdownSmsTemplateApi,
): DropdownSmsTemplate {
  return {
    smsId: api.sms_id,
    template: api.template,
    recipient: api.recipient,
    smsDivision: api.sms_division,
    smsTemplateId: api.sms_template_id,
    smsOperationType: api.sms_operation_type,
  };
}

export function mapDropdownWaApiToDomain(
  api: DropdownWaTemplateApi,
): DropdownWaTemplate {
  return {
    waId: api.wa_id,
    template: api.template,
    recipient: api.recipient,
    waImage: api.wa_image,
    waVideo: api.wa_video,
    waDocument: api.wa_document,
    waBody: api.wa_body,
    waButton: api.wa_button,
  };
}

export function mapDropdownMbNotifApiToDomain(
  api: DropdownMbNotifApi,
): DropdownMbNotif {
  return {
    mbnotifBody: api.mbnotif_body,
    mbnotifContent: api.mbnotif_content,
    mbnotifData: api.mbnotif_data,
    mbnotifFlagAlert: api.mbnotif_flag_alert === 'false' ? false : true,
    mbnotifId: api.mbnotif_id,
    mbnotifTitle: api.mbnotif_title,
    mbnotifTxnType: api.mbnotif_txn_type,
    recipient: api.recipient,
    template: api.template,
  };
}

export function mapDropdownAbApiToDomain(api: DropdownAbApi): DropdownAb {
  return {
    apiId: api.api_id,
    apiName: api.api_name,
    description: api.description,
    template: api.template,
    product: api.product,
    channel: api.channel,
    autoblockStatus: api.autoblock_status,
  };
}

export function mapDropdownRuleApiToDomain(api: DropdownRuleApi): DropdownRule {
  return {
    ruleId: api.rule_id,
    ruleName: api.rule_name,
  };
}

export function mapDropdownTemplateTypeApiToDomain(
  api: DropdownTemplateTypeApi,
): DropdownTemplateType {
  return {
    templateType: api.template_type,
    useEventType: api.use_event_type,
  };
}

export function mapDropdownHistoricalFieldApiToDomain(
  api: DropdownHistoricalFieldApi,
): DropdownHistoricalField {
  return {
    fieldHistorical: api.field_historical || '',
  };
}
