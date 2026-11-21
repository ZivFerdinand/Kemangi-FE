import { FileProps } from '../../../../../shared';

export interface DataGroup {
  id: number;
  dataGroupId: string | null;
  name: string | null;
  description: string | null;
  dynamicWatchList: boolean | null;
  ruleCount: number | null;
  ruleCountActive: number | null;
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
  activeStatus: boolean | null;
  hasPendingDraft: boolean | null;
  hasPendingRequest: boolean | null;
  hasRuleRelation: boolean | null;
  hasActiveRuleRelation: boolean | null;
  hasPendingRuleRelation: boolean | null;
}

export interface DataGroupTable {
  id: number;
  dataGroupId: string;
  name: string;
  description: string;
  dynamicWatchList: boolean;
  ruleRelation: number;
  createdBy: string;
  createdByName: string;
  createdDt: string;
  lastUpdatedBy: string;
  lastUpdatedByName: string;
  lastUpdatedDt: string;
  lastApprovalId: string;
  lastApprovalName: string;
  lastApprovalDt: string;
  activeStatus: boolean;
  hasPendingDraft: boolean;
  hasPendingRequest: boolean;
}

export interface DataGroupApprovalTable {
  apprId: number;
  dataGroupId: string;
  name: string;
  description: string;
  dynamicWatchList: boolean;
  activeStatus: boolean;
  ruleRelation: number;
  requestType: string;
  approvalStatus: string;
  rejectionNote: string;
  createdBy: string;
  createdDt: string;
  requesterId: string;
  requesterName: string;
  requestDate: string;
  approverId: string;
  approverName: string;
  approvalDate: string;
}

export interface DataGroupDetails {
  id: number;
  dataGroupId: string;
  name: string;
  description: string;
  dynamicWatchList: boolean;
  activeStatus: boolean;
  detailValues: string[];
  hasActiveRuleRelation: boolean;
  hasRuleRelation: boolean;
  createdBy: string;
  createdByName: string;
  createdDt: string;
  lastUpdatedBy: string;
  lastUpdatedByName: string;
  lastUpdatedDt: string;
  lastApproval1By: string;
  lastApproval1Dt: string;
  lastApproval1Name: string;
  lastApproval2By: string;
  lastApproval2Dt: string;
  lastApproval2Name: string;
  lastApprFiles: FileProps[];
}

export interface DataGroupApprovalDetails {
  apprId: number;
  lastApprId: string;
  dataGroupId: string;
  name: string;
  description: string;
  dynamicWatchList: boolean;
  activeStatus: boolean;
  detailValues: string[];
  requestType: string;
  approvalStatus: string;
  requesterId: string;
  requesterName: string;
  requestDate: string;
  rejectionNote: string;
  approver1id: string;
  approver1name: string;
  approval1date: string;
  approver2id: string;
  approver2name: string;
  approval2date: string;
}

export interface RuleRelationTable {
  ruleId: string;
  status: boolean;
  ruleName: string;
}

export interface DataGroupFiltersDisplay {
  label: string;
  value: string | null;
}

export interface DataGroupFilterDisplayTemp {
  dataGroupId: string | null;
  dataGroupName: string | null;
  dynamicWatchList: string | null;
  description: string | null;
  requestedBy: string | null;
  requestDateFrom: string | null;
  requestDateTo: string | null;
  requestType: string | null;
  status: boolean | null;
  approval1DateFrom: string | null;
  approval1DateTo: string | null;
  approved1By: string | null;
  approval2DateFrom: string | null;
  approval2DateTo: string | null;
  approved2By: string | null;
}

export interface DataGroupDraftFilterDisplayTemp {
  data_group_id: string | null;
  data_group_name: string | null;
  description: string | null;
  reviewed1_by: string | null;
  reviewed2_by: string | null;
  request_date_from: string | null;
  request_date_to: string | null;
  reviewed1_date_from: string | null;
  reviewed1_date_to: string | null;
  reviewed2_date_from: string | null;
  reviewed2_date_to: string | null;
  status: string | null;
  approval_status: string | null;
}

export interface DataGroupTaskFilterDisplayTemp {
  data_group_id: string | null;
  data_group_name: string;
  description: string;
  requested_by: string | null;
  reviewed1_by: string | null;
  request_date_from: string | null;
  request_date_to: string | null;
  reviewed1_date_from: string | null;
  reviewed1_date_to: string | null;
  status: string | null;
  dynamic_watch_list: boolean | null;
  request_type: string | null;
}

export interface DataGroupUploadFile {
  originalName: string;
  extension: string;
  generatedName: string;
}

export interface DataGroupDeletePayload {
  dataGroupId: string;
  listFiles: DataGroupUploadFile[];
}
