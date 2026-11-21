import { TableQuery } from '../../../shared/interfaces/index';

export interface AlertQueue {
  id: number;
  queueId: string | null;
  name: string | null;
  description: string | null;
  activeStatus: boolean;
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
  hasPendingRequest: boolean;
}

export interface AlertQueueQuery extends TableQuery {
  name: string | null;
  description: string | null;
  activeStatus: boolean | null;
  assignTo: Array<string> | null;
  requesterId: Array<string> | null;
  approver1Id: Array<string> | null;
  approver2Id: Array<string> | null;
  requestDateFrom: string | null;
  requestDateTo: string | null;
  approval1DateFrom: string | null;
  approval1DateTo: string | null;
  approval2DateFrom: string | null;
  approval2DateTo: string | null;
}

export interface AlertQueueQueryFilter {
  name: string | null;
  description: string | null;
  activeStatus: boolean | null;
  assignTo: Array<string>;
  requesterId: Array<string>;
  approver1Id: Array<string>;
  approver2Id: Array<string>;
  requestDateFrom: string | null;
  requestDateTo: string | null;
  approval1DateFrom: string | null;
  approval1DateTo: string | null;
  approval2DateFrom: string | null;
  approval2DateTo: string | null;
}

export interface AlertQueueFilterDisplayTemp {
  name: string;
  description: string;
  assignTo: string;
  requestedBy: string;
  requestDateFrom: string;
  requestDateTo: string;
  approved1By: string;
  approval1DateFrom: string;
  approval1DateTo: string;
  approved2By: string;
  approval2DateFrom: string;
  approval2DateTo: string;
  status: string;
}

export interface AlertQueueDetails {
  queueId: string | null;
  id: number | null;
  name: string | null;
  description: string | null;
  activeStatus: boolean;
  createdBy: string | null;
  createdByName: string | null;
  createdDt: string | null;
  lastUpdatedBy: string | null;
  lastUpdatedByName: string | null;
  lastUpdatedDt: string | null;
  lastApproval1By: string | null;
  lastApproval1Name: string | null;
  lastApproval1Dt: string | null;
  lastApproval2By: string | null;
  lastApproval2Name: string | null;
  lastApproval2Dt: string | null;
  assignTo: string[];
  details?: AlertQueueRuleModel[];
}
export interface AlertQueueDetailsUI {
  queueId: string | null;
  id: number | null;
  apprId: number | null;
  lastApprId: number | null;
  name: string | null;
  description: string | null;
  activeStatus: boolean;
  requestType: string | null;
  approvalStatus: string | null;
  createdBy: string | null;
  createdByName: string | null;
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
  rejectionNote: string | null;
  assignTo: string[];
  details?: ModelPriorityBox[];
}

export interface AlertQueueDetailsUIForm {
  queueId: string | null;
  id: number | null;
  apprId: number | null;
  lastApprId: number | null;
  name: string | null;
  description: string | null;
  activeStatus: boolean;
  requestType: string | null;
  approvalStatus: string | null;
  createdBy: string | null;
  createdByName: string | null;
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
  rejectionNote: string | null;
  assignTo: string[];
  details?: PriorityBox[];
}

export interface AssignToQuery extends TableQuery {
  userId: string | null;
  userName: string | null;
  roleName: string | null;
}

export interface AlertQueueColumns {}

export interface SourceBoxItems {
  name: string;
  sourceName: string;
  branchName: string;
  id: number | string;
  position?: number;
  highlight?: boolean;
}

interface BranchGroup {
  branchName: string;
  items: SourceBoxItems[];
}

export interface ModelLevel {
  level: number;
  items: SourceBoxItems[];
}

export interface ModelPriorityBox {
  priority: number;
  name: string;
  levels: ModelLevel[];
}

export interface SourceBox {
  name: string;
  groups: BranchGroup[];
  searchQuery: string;
}

export interface AlertQueuePayloadValueComparator {
  currentValue: AlertQueuePayload;
  initialValue: AlertQueuePayload;
}

export interface AlertQueuePayload {
  queueId: string | null;
  activeStatus: boolean;
  name: string | null;
  description: string | null;
  details: AlertQueueRuleModelPayload[];
  assignTo: string[];
}

export interface AlertQueueRuleModelPayload {
  priorityType: number;
  priorityLevel: number;
  prioritySeq: number;
  productType: string;
  itemType: string;
  itemId: string;
}
export interface AlertQueueRuleModel {
  priorityType: number;
  priorityLevel: number;
  prioritySeq: number;
  productType: string;
  itemType: string;
  itemId: string;
  itemName: string;
}

export interface UserMasterDataFilterQuery {
  userId: string | null;
  userName: string | null;
  roleName: string | null;
}

export interface Level {
  id: number;
  name: string;
  items: SourceBoxItems[];
}

export interface PriorityBox {
  name: string;
  levels: Level[];
}

export interface AssignTo {
  roleId: string | null;
  roleName: string | null;
  userId: string | null;
  userName: string | null;
}
