import {
  RuleFilterDisplayTemp,
  RuleQuery,
  RuleFilterQuery,
  RuleDetails,
} from '../domain/rule.model';

import { RuleApprovalQuery } from '../../../approval/rule/domain/models/rule-approval.model';

export const RULE_CURRENT_TABLE_QUERY_INIT: RuleQuery = {
  limit: 10,
  page: 1,
  sort: 'lastApproval2Dt',
  sortDir: 'desc',
  ruleId: [],
  ruleName: '',
  ruleDescription: '',
  activeStatus: null,
  expired: null,
  requesterId: [],
  approver1Id: [],
  approver2Id: [],
  requestDateFrom: '',
  requestDateTo: '',
  approval1DateFrom: '',
  approval1DateTo: '',
  approval2DateFrom: '',
  approval2DateTo: '',
  effectiveDateFrom: '',
  effectiveDateTo: '',
};

export const RULE_EXPIRED_SOON_TABLE_QUERY_INIT: RuleQuery = {
  limit: 10,
  page: 1,
  sort: 'ruleEnd',
  sortDir: 'desc',
  ruleId: [],
  ruleName: '',
  ruleDescription: '',
  activeStatus: null,
  expired: true,
  requesterId: [],
  approver1Id: [],
  approver2Id: [],
  requestDateFrom: '',
  requestDateTo: '',
  approval1DateFrom: '',
  approval1DateTo: '',
  approval2DateFrom: '',
  approval2DateTo: '',
  effectiveDateFrom: '',
  effectiveDateTo: '',
};

export const RULE_FILTER_QUERY_INIT: RuleFilterQuery = {
  ruleId: [],
  ruleName: '',
  ruleDescription: '',
  activeStatus: null,
  requesterId: [],
  approver1Id: [],
  approver2Id: [],
  requestDateFrom: '',
  requestDateTo: '',
  approval1DateFrom: '',
  approval1DateTo: '',
  approval2DateFrom: '',
  approval2DateTo: '',
  effectiveDateFrom: '',
  effectiveDateTo: '',
};

export const RULE_DISPLAY_INIT = [
  { label: 'Rule ID', value: null },
  { label: 'Rule Name', value: null },
  { label: 'Rule Description', value: null },
  { label: 'Effective Date', value: null },
  { label: 'Requested By', value: null },
  { label: 'Requested Date', value: null },
  { label: 'Review 1 By', value: null },
  { label: 'Review 1 Date', value: null },
  { label: 'Review 2 By', value: null },
  { label: 'Review 2 Date', value: null },
  { label: 'On/Off', value: null },
];

export const RULE_FILTER_DISPLAY_TEMP_INIT: RuleFilterDisplayTemp = {
  ruleId: '',
  ruleName: '',
  ruleDescription: '',
  requestedBy: '',
  requestDateFrom: '',
  requestDateTo: '',
  requestType: '',
  status: null,
  approval1DateFrom: '',
  approval1DateTo: '',
  approved1By: '',
  approval2DateFrom: '',
  approval2DateTo: '',
  approved2By: '',
  effectiveDateFrom: '',
  effectiveDateTo: '',
};

export const RULE_TASK_PAGE_QUERY_INIT: RuleApprovalQuery = {
  page: 1,
  limit: 10,
  sort: 'requestDate',
  sortDir: 'desc',
  ruleId: [],
  ruleName: '',
  reviewer1Done: null,
  ruleDescription: '',
  draft: true,
  activeStatus: null,
  taskList: null,
  requestType: '',
  approvalStatus: '',
  requesterId: [],
  requestDateFrom: '',
  requestDateTo: '',
  approver1Id: [],
  approver2Id: [],
  approval1DateFrom: '',
  approval1DateTo: '',
  approval2DateFrom: '',
  approval2DateTo: '',
  effectiveDateFrom: '',
  effectiveDateTo: '',
};

export const SUB_RULE_FORM_INIT = {
  uiId: '',
  subruleId: null,
  subruleName: null,
  eventType: null,
  parameters: [],
  hasPipeline: false,
  pipelines: [],
  autoAction: [],
};

export const PIPELINE_FORM_INIT = {
  uiId: null,
  pipelineId: null,
  pipelineType: null,
  pipelineDetails: [],
  skipIfExists: false,
  varName: null,
  pipelineCustomData: null,
};

export const RULE_DETAILS_INIT: RuleDetails = {
  id: 0,
  ruleId: '',
  productType: '',
  ruleName: '',
  ruleDescShort: '',
  ruleDescLong: '',
  ruleType: '',
  activeStatus: false,
  ruleStart: '',
  ruleEnd: '',
  autoBlockFlag: false,
  alertFlag: false,
  createdBy: '',
  createdByName: '',
  createdDt: '',
  lastUpdatedBy: '',
  lastUpdatedByName: '',
  lastUpdatedDt: '',
  lastApproval1By: '',
  lastApproval1Name: '',
  lastApproval1Dt: '',
  lastApproval2By: '',
  lastApproval2Name: '',
  lastApproval2Dt: '',
  lastApprFiles: [],
  subrules: [],
};

export const PIPELINE_INIT = {
  pipelineType: '',
  skipIfExists: false,
  varName: '',
  pipelineDetails: [],
  pipelineCustomData: null,
};

export const SUBRULE_PARAMETER_FORM_INIT = {
  uiId: '',
  functionName: '',
  functionCodeName: '',
  parameter: '',
  parameter1: '',
  parameter2: '',
  operator: '',
  operatorName: '',
  value: '',
  dataGroupId: '',
  dataGroupName: '',
  dataGroupValue: '',
  returnType: '',
  isMultiParam: false,
};

export const AUTO_ACTION_SMS_DETAILS_INIT = {
  smsId: '',
  template: '',
  recipient: '',
  smsDivision: '',
  smsTemplateId: '',
  smsOperationType: '',
};

export const AUTO_ACTION_WA_DETAILS_INIT = {
  waId: '',
  template: '',
  recipient: '',
  waImage: '',
  waVideo: '',
  waDocument: '',
  waBody: '',
  waButton: '',
};

export const AUTO_ACTION_MB_DETAILS_INIT = {
  mbnotifBody: '',
  mbnotifContent: '',
  mbnotifData: '',
  mbnotifFlagAlert: null,
  mbnotifId: '',
  mbnotifTitle: '',
  mbnotifTxnType: '',
  recipient: '',
  template: '',
};

export const AUTO_ACTION_AB_DETAILS_INIT = {
  apiId: '',
  apiName: '',
  description: '',
  template: '',
  product: '',
  channel: '',
  autoblockStatus: false,
};

export const PIPELINE_DETAILS_FORM_INIT = {
  uiId: '',
  function: null,
  functionFormulaArg: null,
  eventType: null,
  eventTypeExtra: null,
  groupBy: [],
  period: null,
  unit: null,
  ttlType: 'SESSION',
  criteria: {
    CURRTRXAMOUNT: null,
    CONTEXT: null,
    ACCOUNTNUMBER: null,
    PREVIOUSCONTEXT: null,
    KEY: null,
    OPERATION: null,
    VALUE: null,
    GROUP: null,
  },
  outcome: null,
  outcomeExtra: null,
  operator: null,
  value: null,
  varName: null,
  isMultiParam: false,
  dataType: null,
};

export const DROPDOWN_EVENT_TYPE_GROUPED_OPTIONS = [
  {
    group: 'SET TO VAR',
    open: false,
    items: [],
  },
  {
    group: 'Event Type',
    open: false,
    items: [
      { name: 'Option B1', value: 'Option B1' },
      { name: 'Option B2', value: 'Option B2' },
    ],
  },
];

export const SUBRULE_INIT = {
  subruleId: '',
  subruleName: '',
  eventType: null,
  hasPipeline: true,
  parameters: [],
  pipelines: [],
  autoAction: [],
};

export const RULE_TASK_LIST_DISPLAY_INIT = [
  { label: 'Rule ID', value: null },
  { label: 'Rule Name', value: null },
  { label: 'Description', value: null },
  { label: 'Requested By', value: null },
  { label: 'Requested Date', value: null },
  { label: 'Review 1 By', value: null },
  { label: 'Review 1 Date', value: null },
  { label: 'Review 2 By', value: null },
  { label: 'Review 2 Date', value: null },
  { label: 'Status', value: null },
  { label: 'On/Off', value: null },
];

export const RULEFORM_INIT = {
  apprId: null,
  id: null,
  ruleId: null,
  productType: null,
  ruleName: null,
  ruleDescShort: null,
  ruleDescLong: null,
  ruleType: null,
  activeStatus: true,
  ruleStart: null,
  ruleEnd: null,
  autoBlockFlag: false,
  alertFlag: true,
  listFiles: null,
  subrules: [
    {
      uiId: `Sub-Rule-1`,
      subruleId: null,
      subruleName: `SUSPECTED-1`,
      eventType: null,
      hasPipeline: false,
      parameters: [],
      pipelines: [],
      autoAction: [],
    },
  ],
};

export const initCriteria = {
  CURRTRXAMOUNT: null,
  CONTEXT: null,
  ACCOUNTNUMBER: null,
  PREVIOUSCONTEXT: null,
  KEY: null,
  OPERATION: null,
  VALUE: null,
  GROUP: null,
};
