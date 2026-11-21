import { TableQuery, FileProps } from '../../../../shared';
import { DropdownHistoricalField } from '../../../approval/rule/domain/models/rule-approval.model';

export interface Rule {
  id: number;
  ruleId: string | null;
  ruleName: string | null;
  ruleDescShort: string | null;
  ruleStart: string | null;
  ruleEnd: string | null;
  createdBy: string | null;
  createdByName: string | null;
  createdDt: string | null;
  lastUpdatedBy: string | null;
  lastUpdatedByName: string | null;
  lastUpdatedDt: string | null;
  lastApproval1Id: string | null;
  lastApproval1Name: string | null;
  lastApproval1Dt: string | null;
  lastApproval2Id: string | null;
  lastApproval2Name: string | null;
  lastApproval2Dt: string | null;
  activeStatus: boolean;
  hasPendingDraft: boolean;
  hasPendingRequest: boolean;
  hasRelatedPendingDataGroup: boolean;
  hasRelatedPendingEmailTemplate: boolean;
}
export interface RuleQuery extends TableQuery {
  ruleId: Array<string>;
  ruleName: string | null;
  ruleDescription: string | null;
  activeStatus: boolean | null;
  expired: boolean | null;
  requesterId: Array<string>;
  requestDateFrom: string;
  requestDateTo: string;
  approver1Id: Array<string>;
  approval1DateFrom: string;
  approval1DateTo: string;
  approver2Id: Array<string>;
  approval2DateFrom: string;
  approval2DateTo: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
}

export interface RuleFilterQuery {
  ruleId: Array<string>;
  ruleName: string | null;
  ruleDescription: string | null;
  activeStatus: boolean | null;
  requesterId: Array<string>;
  approver1Id: Array<string>;
  approver2Id: Array<string>;
  requestDateFrom: string;
  requestDateTo: string;
  approval1DateFrom: string;
  approval1DateTo: string;
  approval2DateFrom: string;
  approval2DateTo: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
}

export interface RuleFilterDisplayTemp {
  ruleId: string;
  ruleName: string;
  ruleDescription: string;
  requestedBy: string;
  requestDateFrom: string;
  requestDateTo: string;
  requestType: string;
  status: boolean | null;
  approval1DateFrom: string;
  approval1DateTo: string;
  approved1By: string;
  approval2DateFrom: string;
  approval2DateTo: string;
  approved2By: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
}

export interface RuleDetails {
  id: number;
  ruleId: string;
  productType: string;
  ruleName: string;
  ruleDescShort: string;
  ruleDescLong: string;
  ruleType: string;
  activeStatus: boolean;
  ruleStart: string;
  ruleEnd: string;
  autoBlockFlag: boolean;
  alertFlag: boolean;
  createdBy: string;
  createdByName: string;
  createdDt: string;
  lastUpdatedBy: string;
  lastUpdatedByName: string;
  lastUpdatedDt: string;
  lastApproval1By: string;
  lastApproval1Name: string;
  lastApproval1Dt: string;
  lastApproval2By: string;
  lastApproval2Name: string;
  lastApproval2Dt: string;
  lastApprFiles: FileProps[];
  subrules: SubRule[];
}

export interface SubruleParameter {
  functionName: string;
  parameter: string;
  parameter1?: string;
  parameter2?: string;
  operator: string;
  value: string;
  dataGroupId?: string;
  dataGroupName?: string;
  dataGroupValue?: string;
}

export interface SubRule {
  uiId?: string;
  subruleId: string;
  subruleName: string;
  eventType: string | null;
  hasPipeline: boolean;
  parameters: SubRuleParameter[];
  pipelines: Pipeline[];
  pipelineCustom?: PipelineCustom[];
  autoAction: AutoAction[];
}

export interface PipelineCustom {
  schemaJson: string | null;
}

export interface SubRuleParameter {
  functionName: string;
  parameter: string;
  operator: string;
  value: string;
  dataGroupId?: string;
  dataGroupName?: string;
  dataGroupValue?: string;
  dataGroupSample?: any;
}

export interface RulePayloadForm {
  apprId: number | null;
  ruleId: string | null;
  productType: string | null;
  ruleName: string | null;
  ruleDescShort: string | null;
  ruleDescLong: string | null;
  ruleType: string | null;
  activeStatus: boolean;
  ruleStart: string | null;
  ruleEnd: string | null;
  autoBlockFlag: boolean;
  alertFlag: boolean;
  listFiles: FileProps[];
  subrules: SubrulePayloadForm[];
}
export interface SubrulePayloadForm {
  subruleId?: string | null;
  subruleName?: string | null;
  eventType: string | null;
  parameters: SubruleParameterPayloadForm[] | null;
  hasPipeline: boolean;
  pipelines: PipelinePayloadForm[];
  pipelineCustom?: PipelineCustomPayloadForm[];
  autoAction?: AutoActionForm[];
}

export interface PipelineCustomPayloadForm {
  schemaJson: string;
}

export interface SubruleParameterPayloadForm {
  functionName: string | null;
  parameter: string | null;
  operator: string | null;
  value: string | boolean | null;
  dataGroupId: string | number | null;
}

export interface PipelinePayloadForm {
  pipelineType: string | null;
  skipIfExists: boolean | null;
  varName: string | null;
  pipelineDetails: PipelineDetailsPayloadForm[];
}

export interface PipelineDetailsPayloadForm {
  detail: PipelineDetailsDetailsPayloadForm;
  varName: string | null;
}

export interface PipelineDetailsDetailsPayloadForm {
  function: string | null;
  eventType: string | null;
  period: number | null;
  unit: string | null;
  ttlType: string;
  criteria: PipelineDetailsCriteriaPayloadForm[];
  outcome: string | null;
  operator: string | null;
  value: string | boolean | null;
}

export interface PipelineDetailsCriteriaPayloadForm {
  key: string | null;
  value: string | null;
}

export interface TabItem {
  label: string;
  value: string;
  active?: boolean;
}

export interface Pipeline {
  uiId?: string;
  pipelineType: string;
  skipIfExists: boolean;
  varName: string;
  pipelineDetails: PipelineDetail[];
  pipelineCustomData?: string | null;
}

export interface PipelineDetail {
  detail?: PipelineDetailConfig;
  varName: string | null;
}

export interface PipelineDetailConfig {
  function: string | null;
  eventType: string | null;
  period: number | null;
  unit: string | null;
  ttlType: string | null;
  criteria: Criteria[];
  outcome: string | null;
  operator: string | null;
  value: string | boolean | null;
}

export interface Criteria {
  key: string;
  value: string;
}

export interface AutoAction {
  channelType: string | null;
  templateId: string | null;
  description: string | null;
  limitFlag: boolean;
  key: string | null;
  threshold: number | null;
  period: number | null;
  unit: string | null;
}

export interface AutoActionForm {
  uiId?: string;
  channelType: string | null;
  templateId: string | null;
  description?: string | null;
  limitFlag: boolean;
  key: string | null;
  threshold: number | null;
  period: number | null;
  unit: string | null;
}

export interface RuleDeletePayload {
  ruleId: string;
  listFiles: FileProps[];
}

export interface RuleDetailsForm {
  apprId: number | null;
  id: number | null;
  ruleId: string | null;
  productType: string | null;
  ruleName: string | null;
  ruleDescShort: string | null;
  ruleDescLong: string | null;
  ruleType: string | null;
  activeStatus: boolean;
  ruleStart: string | null;
  ruleEnd: string | null;
  autoBlockFlag: boolean;
  alertFlag: boolean;
  listFiles: FileProps[] | null;
  subrules: RuleDetailsSubrulesForm[];
}

export interface RuleDetailsSubrulesForm {
  uiId: string | null;
  subruleTabName?: string | null;
  subruleId: string | null;
  subruleName: string | null;
  eventType: string | null;
  hasPipeline: boolean;
  parameters: RuleDetailsSubruleParamsForm[];
  pipelines: PipelineForm[];
  autoAction: AutoActionForm[];
}

export interface RuleDetailsSubruleParamsForm {
  uiId: string | null;
  functionName: string | null;
  parameter1: string | null;
  parameter2: string | null;
  operator: string | null;
  value: string | boolean | null;
  dataGroupId: string | number | null;
  dataGroupName: string | null;
  dataGroupValue: string | null;
  dataGroupSample: string[] | null;
  isMultiParam: boolean | null;
  returnType: string | null;
}

export interface PipelineForm {
  uiId: string | null;
  pipelineType: string | null;
  skipIfExists: boolean | null;
  varName: string | null;
  pipelineDetails: PipelineDetailsForm[];
  pipelineCustomData?: string | null;
}

export interface PipelineDetailsForm {
  uiId: string | null;
  function: string | null;
  functionFormulaArg: string | null;
  eventType: string | null;
  eventTypeExtra: string | null;
  groupBy: string[] | null;
  period: number | null;
  unit: string | null;
  ttlType: string | null;
  criteria: PipelineDetailsCriteriaForm | null;
  outcome: string | null;
  outcomeExtra: string | null;
  operator: string | null;
  value: string | boolean | null;
  varName: string | null;
  isMultiParam: boolean | null;
  dataType: string | null;
  historicalFieldOptions?: DropdownHistoricalField[];
}

export interface PipelineDetailsCriteriaForm {
  CURRTRXAMOUNT: string | null;
  CONTEXT: string | null;
  ACCOUNTNUMBER: string | null;
  PREVIOUSCONTEXT: string | null;
  KEY: string | null;
  OPERATION: string | null;
  VALUE: string | null;
  GROUP: string | null;
}

export interface SetToVarHolderItem {
  uiId: string | null;
  oldValue: string | null;
  newValue: string | null;
}

export interface SetToVarHolderItemBackup {
  oldValue: string | null;
  newValue: string | null;
}

export interface SubruleAndVarList {
  subrule: any;
  varlist: any[];
}
