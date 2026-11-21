import { TableQuery, FileProps } from '../../../../../shared';
import { SubRule } from '../../../../rule-management/rule/domain/rule.model';

export interface RuleApproval {
  apprId: number;
  ruleId: string | null;
  ruleName: string | null;
  ruleDescShort: string | null;
  ruleStart: string | null;
  ruleEnd: string | null;
  activeStatus: boolean;
  requestType: string | null;
  approvalStatus: string | null;
  rejectionNote: string | null;
  createdBy: string | null;
  createdDt: string | null;
  requesterId: string | null;
  requesterName: string | null;
  requestDate: string | null;
  approver1Id: string | null;
  approver1Name: string | null;
  approval1Date: string | null;
  approver2Id: string | null;
  approver2Name: string | null;
  approval2Date: string | null;
}

export interface RuleApprovalPayload {
  apprId: number | null;
  approvalStatus: string;
  note: string;
}

export interface RuleApprovalQuery extends TableQuery {
  ruleId: string[];
  ruleName: string;
  ruleDescription: string;
  reviewer1Done: boolean | null;
  draft: boolean | null;
  activeStatus: boolean | null;
  taskList: boolean | null;
  requestType: string;
  approvalStatus: string;
  requesterId: string[];
  effectiveDateFrom: string;
  effectiveDateTo: string;
  requestDateFrom: string;
  requestDateTo: string;
  approver1Id: string[];
  approver2Id: string[];
  approval1DateFrom: string;
  approval1DateTo: string;
  approval2DateFrom: string;
  approval2DateTo: string;
}

export interface RuleApprovalQueryFilter {
  ruleId: string[];
  ruleName: string;
  ruleDescription: string;
  description: string;
  requestType: string;
  requesterId: string[];
  effectiveDateFrom: string;
  effectiveDateTo: string;
  requestDateFrom: string;
  requestDateTo: string;
  approvalStatus: string;
  approver1Id: string[];
  approver2Id: string[];
  approval1DateFrom: string;
  approval1DateTo: string;
  approval2DateFrom: string;
  approval2DateTo: string;
  activeStatus: boolean | null;
}

export interface RuleApprovalQueryFilterDisplayTemp {
  ruleId: string;
  ruleName: string;
  shortDescription: string;
  effectiveDateFrom: string;
  effectiveDateTo: string;
  requestedBy: string;
  requestDateFrom: string;
  requestDateTo: string;
  requestType: string;
  approvalStatus: string;
  approval1DateFrom: string;
  approval1DateTo: string;
  approved1By: string;
  approval2DateFrom: string;
  approval2DateTo: string;
  approved2By: string;
  activeStatus: string;
}

export interface RuleApprovalDetails {
  apprId: number;
  lastApprId: number;
  ruleId: string;
  ruleName: string;
  ruleDescShort: string;
  ruleDescLong: string;
  ruleType: string;
  activeStatus: boolean;
  requestType: string;
  approvalStatus: string;
  productType: string;
  requesterId: string;
  requesterName: string;
  requestDate: string;
  approver1Id: string;
  approver1Name: string;
  approval1Date: string;
  approver2Id: string;
  approver2Name: string;
  approval2Date: string;
  rejectionNote: string;
  ruleStart: string;
  ruleEnd: string;
  alertFlag: boolean;
  listFiles: FileProps[];
  subrules: SubRule[];
}

export interface DropdownRuleFunction {
  functionId: string;
  functionName: string;
  functionDescription: string;
  functionFormula: string;
  isAggregation: boolean;
  isMultiParam: boolean;
  dataType: string;
  fieldSource: string;
  inputNeeded: boolean;
  inputDefault: string;
  inputSample: string;
  returnType: string;
}

export interface DropdownRuleOperator {
  inputSample: string;
  inputType: string;
  noOperands: string;
  operatorDescription: string;
  operatorId: string;
  operatorName: string;
}

export interface DropdownRuleSafeParameter {
  parameterType: string;
  parameterValue: string;
  parameterName: string;
  isTrackable: boolean;
  isPii: boolean;
  fixedValue: boolean;
}

export interface DropdownEmailTemplate {
  id: number;
  templateId: string;
  templateName: string;
  emailSubject: string;
}

export interface DropdownEmaiTemplateParams {
  query: string;
  productType: string;
}

export interface DropdownProductGroup {
  productGroup: string;
  productGroupName: string;
}

export interface DropdownPipelineType {
  pipelineId: string;
  pipelineType: string;
  description?: string;
  needExpiryTime?: boolean;
  needFunction?: boolean;
  needEventType?: boolean;
  criteria?: CriteriaPipelineType[];
  evaluation?: EvaluationPipelineType;
}

export interface CriteriaPipelineType {
  key: string;
  name: string;
  source: string;
  sourceValue: string;
  optional: boolean;
}

export interface EvaluationPipelineType {
  outcomeSource: string | null;
  defaultOutcome: string | null;
  defaultOutcomeName: string | null;
  operator: string | null;
  defaultOperator: string | null;
  value: string | null;
}

export interface DropdownDataGroup {
  dataGroupId: string;
  dataGroupName: string;
  detailSnapshot: string | null;
  detailCount: number;
  detailSample: Array<string>;
}

export interface DropdownSubRuleParameterType {
  parameterType: string;
  parameterTypeName: string;
}

export interface DropdownSubRuleParameter {
  parameterType: string;
  parameterValue: string;
  parameterName: string;
  isTrackable: boolean;
  isPii: boolean;
  fixedValue: boolean;
}

export interface DropdownRulePipeline {
  pipelineType: string;
  pipelineId: string;
  parameterKey: string;
  parameterValue: string;
  isNullable: boolean;
  valueSource: string;
  valueDescription: string;
  outputSource: string;
  outputValue: string;
}

export interface DropdownHistorical {
  historicalId: string;
  tableHistorical: string;
  fieldHistorical: string;
  isPrimaryKey: boolean;
}

export interface DropdownHistoricalField {
  fieldHistorical: string;
}

export interface DropdownSmsTemplate {
  smsId: string;
  template: string;
  recipient: string;
  smsDivision: string;
  smsTemplateId: string;
  smsOperationType: string;
}

export interface DropdownWaTemplate {
  waId: string;
  template: string;
  recipient: string;
  waImage: string;
  waVideo: string;
  waDocument: string;
  waBody: string;
  waButton: string;
}

export interface DropdownMbNotif {
  mbnotifBody: string | null;
  mbnotifContent: string | null;
  mbnotifData: string | null;
  mbnotifFlagAlert: boolean | null;
  mbnotifId: string | null;
  mbnotifTitle: string | null;
  mbnotifTxnType: string | null;
  recipient: string | null;
  template: string | null;
}

export interface DropdownAb {
  apiId: string;
  apiName: string;
  description: string;
  template: string;
  product: string;
  channel: string;
  autoblockStatus: boolean;
}

export interface DropdownRule {
  ruleId: string;
  ruleName: string;
}

export interface DropdownTemplateType {
  templateType: string;
  useEventType: boolean;
}
