import { FilePropsApi } from './../../../../shared/interfaces/other';
import {
  RuleDetailsApi,
  RuleQueryApi,
  RuleDeletePayloadApi,
  PipelineApi,
  RulePayloadFormApi,
  SubrulePayloadFormApi,
  SubruleParameterPayloadFormApi,
  PipelinePayloadFormApi,
  AutoActionFormApi,
} from '../api/models/rule.model';
import {
  RuleDetails,
  RuleQuery,
  RulePayloadForm,
  RuleDeletePayload,
  RuleDetailsForm,
  AutoActionForm,
  Pipeline,
} from '../domain/rule.model';
import { RuleApprovalDetailsApi } from '../../../approval/rule/api/models/rule-approval.model';
import { mappingPipelineFormData } from '../utils';
import { PipelineApprovalApi } from './../../../approval/rule/api/models/rule-approval.model';
import { deletePrefixAB } from '../utils';
import { generateId } from '../../../../shared/utils/general';

export function mapRuleQueryDomainToApi(domain: RuleQuery): RuleQueryApi {
  return {
    limit: Number(domain.limit),
    page: Number(domain.page),
    sort: domain.sort || null,
    sort_dir: domain.sortDir || null,
    rule_id: domain.ruleId.length === 0 ? null : domain.ruleId,
    rule_name: domain.ruleName ?? null,
    rule_description: domain.ruleDescription ?? null,
    active_status: domain.activeStatus ?? null,
    expired: domain.expired ?? null,
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

export function mapRuleDetailsApiToDomain(api: RuleDetailsApi): RuleDetails {
  return {
    id: api.id,
    ruleId: api.rule_id || '',
    productType: api.product_type || '',
    ruleName: api.rule_name || '',
    ruleDescShort: api.rule_desc_short || '',
    ruleDescLong: api.rule_desc_long || '',
    ruleType: api.rule_type || '',
    activeStatus: api.active_status,
    ruleStart: api.rule_start || '',
    ruleEnd: api.rule_end || '',
    autoBlockFlag: api.auto_block_flag,
    alertFlag: api.alert_flag,
    createdBy: api.created_by || '',
    createdByName: api.created_by_name || '',
    createdDt: api.created_dt || '',
    lastUpdatedBy: api.last_updated_by || '',
    lastUpdatedByName: api.last_updated_by_name || '',
    lastUpdatedDt: api.last_updated_dt || '',
    lastApproval1By: api.last_approval1_by || '',
    lastApproval1Name: api.last_approval1_name || '',
    lastApproval1Dt: api.last_approval1_dt || '',
    lastApproval2By: api.last_approval2_by || '',
    lastApproval2Name: api.last_approval2_name || '',
    lastApproval2Dt: api.last_approval2_dt || '',
    lastApprFiles: api.last_appr_files.map((x) => ({
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
              description: y.description || '',
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

export function mapRuleDeletePayloadDomainToApi(
  domain: RuleDeletePayload,
): RuleDeletePayloadApi {
  return {
    rule_id: domain.ruleId,
    list_files: domain.listFiles.map((p) => ({
      extension: p.extension,
      generated_name: p.generatedName,
      original_name: p.originalName,
      url: p.url,
    })),
  };
}

export function mapRulePayloadToApi(
  domain: RulePayloadForm,
): RulePayloadFormApi {
  return {
    appr_id: Number(domain.apprId) || null,
    rule_id: domain.ruleId || null,
    product_type: domain.productType ?? null,
    rule_name: domain.ruleName ?? '',
    rule_desc_short: domain.ruleDescShort ?? '',
    rule_desc_long: domain.ruleDescLong ?? '',
    rule_type: domain.ruleType ?? null,
    active_status: domain.activeStatus,
    rule_start: domain.ruleStart ?? '',
    rule_end: domain.ruleEnd ?? '',
    auto_block_flag: domain.autoBlockFlag,
    alert_flag: domain.alertFlag,
    subrules: (domain.subrules ?? []).map(
      (p): SubrulePayloadFormApi => ({
        subrule_id: p.subruleId ?? null,
        subrule_name: p.subruleName ?? null,
        event_type: p.eventType ?? null,
        has_pipeline: p.hasPipeline ?? false,
        parameters: (p.parameters ?? []).map(
          (q): SubruleParameterPayloadFormApi => ({
            function_name: q.functionName ?? null,
            parameter: q.parameter ?? null,
            operator: q.operator ?? null,
            value: q.dataGroupId ? null : q.value,
            data_group_id: q.dataGroupId === '' ? null : q.dataGroupId,
          }),
        ),
        pipelines: (p.pipelines ?? []).map(
          (q): PipelinePayloadFormApi => ({
            pipeline_type: q.pipelineType ?? null,
            skip_if_exists: q.skipIfExists ?? null,
            var_name: q.varName ?? null,
            pipeline_details:
              q.pipelineDetails.length > 0
                ? q.pipelineDetails.map((qr) => ({
                    detail: {
                      function: qr.detail.function ?? null,
                      event_type: qr.detail.eventType ?? null,
                      period: qr.detail.period ?? null,
                      unit: qr.detail.unit ?? null,
                      ttl_type: qr.detail?.ttlType ?? null,
                      criteria: qr.detail?.criteria ?? null,
                      outcome: qr.detail?.outcome ?? null,
                      operator: qr.detail?.operator ?? null,
                      value: qr.detail.value ?? null,
                    },
                    var_name: qr.varName ?? null,
                  }))
                : [],
          }),
        ),
        pipeline_custom: (p.pipelineCustom ?? []).map((x) => ({
          schema_json: x.schemaJson,
        })),
        auto_action: (p.autoAction ?? []).map(
          (q): AutoActionFormApi => ({
            channel_type: q.channelType ?? '',
            template_id: q.templateId || '',
            limit_flag: q.limitFlag || false,
            key: q.key ?? null,
            threshold: Number(q.threshold) || null,
            period: Number(q.period) || null,
            unit: q.unit || null,
          }),
        ),
      }),
    ),
    list_files: (domain.listFiles ?? []).map(
      (p): FilePropsApi => ({
        extension: p.extension,
        generated_name: p.generatedName,
        original_name: p.originalName,
        url: p.url,
      }),
    ),
  };
}

export function mapRuleDetailsApiToForm(data: RuleDetailsApi): RuleDetailsForm {
  return {
    apprId: null,
    id: data.id,
    ruleId: data.rule_id,
    productType: data.product_type,
    ruleName: deletePrefixAB(data.rule_name),
    ruleDescShort: data.rule_desc_short,
    ruleDescLong: data.rule_desc_long,
    ruleType: data.rule_type,
    activeStatus: data.active_status,
    ruleStart: data.rule_start,
    ruleEnd: data.rule_end,
    autoBlockFlag: data.auto_block_flag,
    alertFlag: data.alert_flag,
    listFiles:
      data.last_appr_files.length > 0
        ? data.last_appr_files.map((x) => ({
            extension: x.extension,
            generatedName: x.generated_name,
            originalName: x.original_name,
          }))
        : [],
    subrules:
      data.subrules.length > 0
        ? data.subrules.map((s, sIndex) => {
            return {
              uiId: `Sub-Rule-${sIndex + 1}`,
              subruleId: s.subrule_id,
              subruleName: s.subrule_name || `SUSPECTED-${sIndex + 1}`,
              eventType: s.event_type,
              hasPipeline: s.has_pipeline,
              parameters:
                s.parameters.length > 0
                  ? s.parameters.map((sp) => {
                      const parameter = sp.parameter?.split(/[,;]/) ?? [];

                      return {
                        uiId: generateId(),
                        functionName: sp.function_name,
                        parameter1: parameter[0] || null,
                        parameter2: parameter[1] || null,
                        operator: sp.operator,
                        value:
                          sp.value === 'true'
                            ? true
                            : sp.value === 'false'
                              ? false
                              : (sp.value ?? null),
                        dataGroupId: sp.data_group_id,
                        dataGroupName: sp.data_group_name || null,
                        dataGroupValue: sp.data_group_value || null,
                        dataGroupSample: sp.data_group_sample || null,
                        isMultiParam: null,
                        returnType:
                          sp.value === 'true'
                            ? 'Boolean'
                            : sp.value === 'false'
                              ? 'Boolean'
                              : (sp.value ?? null),
                      };
                    })
                  : [],
              pipelines: [
                ...(s.pipelines ?? []).map((pipe) => {
                  const spi = mapPipelineApiToDomainToPipeline(pipe);

                  return {
                    uiId: generateId(),
                    pipelineType: spi.pipelineType || null,
                    skipIfExists: spi.skipIfExists || null,
                    varName: spi.varName || null,
                    pipelineDetails: mappingPipelineFormData(spi),
                    pipelineCustomData: null,
                  };
                }),

                ...(s.pipeline_custom ?? []).map((spi) => {
                  return {
                    uiId: generateId(),
                    pipelineType: 'CUSTOM',
                    skipIfExists: null,
                    varName: null,
                    pipelineDetails: [],
                    pipelineCustomData: spi.schema_json,
                  };
                }),
              ],
              // pipelines:
              //   s.pipelines.length > 0
              //     ? s.pipelines
              //         .map((pipe) => mapPipelineApiToDomainToPipeline(pipe))
              //         .map((spi, spiIndex) => {
              //           return {
              //             uiId: `pipeline-${spiIndex + 1}`,
              //             pipelineType: spi.pipelineType || null,
              //             skipIfExists: spi.skipIfExists || null,
              //             varName: spi.varName || null,
              //             pipelineDetails: mappingPipelineFormData(spi),
              //             pipelineCustomData: null,
              //           };
              //         })
              //     : [],

              autoAction: (s.auto_action ?? []).map(
                (q): AutoActionForm => ({
                  channelType: q.channel_type,
                  templateId: q.template_id || null,
                  description: q.description || '',
                  limitFlag: q.limit_flag || false,
                  key: q.key || null,
                  threshold: Number(q.threshold) || null,
                  period: Number(q.period) || null,
                  unit: q.unit || null,
                }),
              ),
            };
          })
        : [],
  };
}

export function mapRuleDetailsApprovalApiToForm(
  data: RuleApprovalDetailsApi,
): RuleDetailsForm {
  return {
    apprId: data.appr_id,
    id: null,
    ruleId: data.rule_id || '',
    productType: data.product_type,
    ruleName: deletePrefixAB(data.rule_name),
    ruleDescShort: data.rule_desc_short,
    ruleDescLong: data.rule_desc_long,
    ruleType: data.rule_type,
    activeStatus: data.active_status,
    ruleStart: data.rule_start,
    ruleEnd: data.rule_end,
    autoBlockFlag: data.auto_block_flag,
    alertFlag: data.alert_flag,
    listFiles:
      data.list_files.length > 0
        ? data.list_files.map((x) => ({
            extension: x.extension,
            generatedName: x.generated_name,
            originalName: x.original_name,
          }))
        : [],
    subrules:
      data.subrules.length > 0
        ? data.subrules.map((s, sIndex) => {
            return {
              uiId: `Sub-Rule-${sIndex + 1}`,
              subruleId: s.subrule_id,
              subruleName: s.subrule_name || `SUSPECTED-${sIndex + 1}`,
              eventType: s.event_type,
              hasPipeline: s.has_pipeline,
              parameters:
                s.parameters.length > 0
                  ? s.parameters.map((sp) => {
                      const parameter = sp.parameter?.split(/[,;]/) ?? [];

                      return {
                        uiId: generateId(),
                        functionName: sp.function_name,
                        parameter1: parameter[0] || null,
                        parameter2: parameter[1] || null,
                        operator: sp.operator,
                        value:
                          sp.value === 'true'
                            ? true
                            : sp.value === 'false'
                              ? false
                              : (sp.value ?? null),
                        dataGroupId: sp.data_group_id,
                        dataGroupName: sp.data_group_name || null,
                        dataGroupValue: sp.data_group_value || null,
                        dataGroupSample: sp.data_group_sample || null,
                        isMultiParam: null,
                        returnType:
                          sp.value === 'true'
                            ? 'Boolean'
                            : sp.value === 'false'
                              ? 'Boolean'
                              : (sp.value ?? null),
                      };
                    })
                  : [],

              pipelines: [
                ...(s.pipelines ?? []).map((pipe) => {
                  const spi = mapPipelineApiToDomainToPipeline(pipe);

                  return {
                    uiId: generateId(),
                    pipelineType: spi.pipelineType || null,
                    skipIfExists: spi.skipIfExists || null,
                    varName: spi.varName || null,
                    pipelineDetails: mappingPipelineFormData(spi),
                    pipelineCustomData: null,
                  };
                }),

                ...(s.pipeline_custom ?? []).map((spi) => {
                  return {
                    uiId: generateId(),
                    pipelineType: 'CUSTOM',
                    skipIfExists: null,
                    varName: null,
                    pipelineDetails: [],
                    pipelineCustomData: spi.schema_json,
                  };
                }),
              ],
              // pipelines:
              //   s.pipelines.length > 0
              //     ? s.pipelines
              //         .map((pipe) => mapPipelineApprovalApiToPipeline(pipe))
              //         .map((spi, spiIndex) => {
              //           return {
              //             uiId: `pipeline-${spiIndex + 1}`,
              //             pipelineType: spi.pipelineType || null,
              //             skipIfExists: spi.skipIfExists || null,
              //             varName: spi.varName || null,
              //             pipelineDetails: mappingPipelineFormData(spi),
              //           };
              //         })
              //     : [],

              autoAction: (s.auto_action ?? []).map(
                (q): AutoActionForm => ({
                  channelType: q.channel_type,
                  templateId: q.template_id || null,
                  description: q.description || '',
                  limitFlag: q.limit_flag || false,
                  key: q.key || null,
                  threshold: Number(q.threshold) || null,
                  period: Number(q.period) || null,
                  unit: q.unit || null,
                }),
              ),
            };
          })
        : [],
  };
}

export function mapPipelineApiToDomainToPipeline(data: PipelineApi): Pipeline {
  return {
    pipelineType: data.pipeline_type,
    skipIfExists: data.skip_if_exists,
    varName: data.var_name,
    pipelineDetails:
      data.pipeline_details.length > 0
        ? data.pipeline_details.map((pd) => {
            return {
              detail: {
                function: pd.detail?.function || null,
                eventType: pd.detail?.event_type || null,
                period: pd.detail?.period || null,
                unit: pd.detail?.unit || null,
                ttlType: pd.detail?.ttl_type || null,
                criteria: pd.detail?.criteria || [],
                outcome: pd.detail?.outcome || null,
                operator: pd.detail?.operator || null,
                value: pd.detail?.value || null,
              },
              varName: pd.var_name,
            };
          })
        : [],
  };
}

export function mapPipelineApprovalApiToPipeline(
  data: PipelineApprovalApi,
): Pipeline {
  return {
    pipelineType: data.pipeline_type,
    skipIfExists: data.skip_if_exists,
    varName: data.var_name,
    pipelineDetails:
      data.pipeline_details.length > 0
        ? data.pipeline_details.map((pd) => {
            return {
              detail: {
                function: pd.detail?.function || null,
                eventType: pd.detail?.event_type || null,
                period: pd.detail?.period || null,
                unit: pd.detail?.unit || null,
                ttlType: pd.detail?.ttl_type || null,
                criteria: pd.detail?.criteria || [],
                outcome: pd.detail?.outcome || null,
                operator: pd.detail?.operator || null,
                value: pd.detail?.value || null,
              },
              varName: pd.var_name,
            };
          })
        : [],
  };
}
