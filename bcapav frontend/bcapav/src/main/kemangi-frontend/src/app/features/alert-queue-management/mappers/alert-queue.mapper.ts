import {
  AlertQueueDetails,
  AlertQueueDetailsUI,
  AlertQueueDetailsUIForm,
  AlertQueuePayload,
  UserMasterDataFilterQuery,
} from '../domain/alert-queue.model';
import {
  AlertQueueDetailsApi,
  AlertQueueDetailsApprovalApi,
  AssignToQueryApi,
  AlertQueueQueryApi,
  RuleModelDetailApi,
  AlertQueuePayloadApi,
  UserMasterDataFilterQueryApi,
} from '../api/models/alert-queue.model';
import {
  AssignToQuery,
  AlertQueueQuery,
  SourceBoxItems,
} from '../domain/alert-queue.model';

import { mappingModelPriorityBox, mappingPriorityBox } from '../utils';

export function mapAlertQueueDetailsResponseToAlertQueueDetailsUI(
  data: AlertQueueDetailsApi,
): AlertQueueDetailsUI {
  return {
    queueId: data.queue_id ?? null,
    id: data.id,
    apprId: null,
    lastApprId: null,
    name: data.name,
    description: data.description ?? null,
    activeStatus: data.active_status,
    assignTo: data.assign_to,
    requestType: null,
    approvalStatus: null,
    createdBy: data.created_by,
    createdByName: data.created_by_name,
    createdDt: data.created_dt,
    requesterId: data.last_updated_by,
    requesterName: data.last_updated_by_name,
    requestDate: data.last_updated_dt,
    approver1Id: data.last_approval1_by,
    approver1Name: data.last_approval1_name,
    approval1Date: data.last_approval1_dt,
    approver2Id: data.last_approval2_by,
    approver2Name: data.last_approval2_name,
    approval2Date: data.last_approval2_dt,
    rejectionNote: null,
    details: mappingModelPriorityBox(data.details),
  };
}

export function mapAlertQueueDetailsApprovalResponseToAlertQueueDetailsUI(
  data: AlertQueueDetailsApprovalApi,
): AlertQueueDetailsUI {
  return {
    queueId: data.queue_id ?? null,
    id: null,
    apprId: data.appr_id,
    lastApprId: data.last_appr_id ?? null,
    name: data.name ?? null,
    description: data.description ?? null,
    activeStatus: data.active_status,
    assignTo: data.assign_to,
    requestType: data.request_type,
    approvalStatus: data.approval_status,
    createdBy: null,
    createdByName: null,
    createdDt: null,
    requesterId: data.requester_id ?? null,
    requesterName: data.requester_name ?? null,
    requestDate: data.request_date ?? null,
    approver1Id: data.approver1_id ?? null,
    approver1Name: data.approver1_name ?? null,
    approval1Date: data.approval1_date ?? null,
    approver2Id: data.approver2_id ?? null,
    approver2Name: data.approver2_name ?? null,
    approval2Date: data.approval2_date ?? null,
    rejectionNote: data.rejection_note ?? null,
    details: mappingModelPriorityBox(data.details),
  };
}

export function mapAssignToQueryDomainToApi(
  domain: AssignToQuery,
): AssignToQueryApi {
  return {
    limit: domain.limit ?? null,
    page: domain.page ?? null,
    sort: domain.sort ?? null,
    sort_dir: domain.sortDir ?? null,
    user_id: domain.userId ?? null,
    user_name: domain.userName ?? null,
    role_name: domain.roleName ?? null,
  };
}

export function mapAlertQueueQueryDomainToApi(
  domain: AlertQueueQuery,
): AlertQueueQueryApi {
  return {
    limit: domain.limit ?? null,
    page: domain.page ?? null,
    sort: domain.sort ?? null,
    sort_dir: domain.sortDir ?? null,
    name: domain.name ?? null,
    description: domain.description ?? null,
    active_status: domain.activeStatus ?? null,
    assign_to: domain.assignTo ?? null,
    requester_id: domain.requesterId ?? null,
    approver1_id: domain.approver1Id ?? null,
    approver2_id: domain.approver2Id ?? null,
    request_date_from: domain.requestDateFrom || null,
    request_date_to: domain.requestDateTo || domain.requestDateFrom || null,
    approval1_date_from: domain.approval1DateFrom || null,
    approval1_date_to:
      domain.approval1DateTo || domain.approval1DateFrom || null,
    approval2_date_from: domain.approval2DateFrom || null,
    approval2_date_to:
      domain.approval2DateTo || domain.approval2DateFrom || null,
  };
}

export function mapRuleModelDetailToSourceBoxItem(
  mod: RuleModelDetailApi,
): SourceBoxItems {
  return {
    name: mod.item_id,
    sourceName: mod.item_type,
    branchName: mod.product_type,
    id: mod.item_id,
  };
}

export function mapAlertQueuePayloadDomainToApi(
  domain: AlertQueuePayload,
): AlertQueuePayloadApi {
  return {
    queue_id: domain.queueId ?? null,
    active_status: domain.activeStatus,
    name: domain.name,
    description: domain.description,
    details: domain.details.map((i) => ({
      priority_type: i.priorityType,
      priority_level: i.priorityLevel,
      priority_seq: i.prioritySeq,
      product_type: i.productType,
      item_type: i.itemType,
      item_id: i.itemId,
    })),
    assign_to: [...domain.assignTo],
  };
}

export function mapUserMasterDataFilterQueryDomainToApi(
  domain: UserMasterDataFilterQuery,
): UserMasterDataFilterQueryApi {
  return {
    user_id: domain.userId ?? null,
    user_name: domain.userName ?? null,
    role_name: domain.roleName ?? null,
  };
}

export function mapAlertQueueDetailsResponseToAlertQueueDetailsUIForm(
  data: AlertQueueDetailsApi,
): AlertQueueDetailsUIForm {
  return {
    queueId: data.queue_id ?? null,
    id: data.id,
    apprId: null,
    lastApprId: null,
    name: data.name,
    description: data.description ?? null,
    activeStatus: data.active_status,
    requestType: null,
    approvalStatus: null,
    createdBy: data.created_by,
    createdByName: data.created_by_name,
    createdDt: data.created_dt,
    requesterId: data.last_updated_by,
    requesterName: data.last_updated_by_name,
    requestDate: data.last_updated_dt,
    approver1Id: data.last_approval1_by,
    approver1Name: data.last_approval1_name,
    approval1Date: data.last_approval1_dt,
    approver2Id: data.last_approval2_by,
    approver2Name: data.last_approval2_name,
    approval2Date: data.last_approval2_dt,
    rejectionNote: null,
    assignTo: data.assign_to,
    details: mappingPriorityBox(data.details),
  };
}

export function mapAlertQueueDetailsApprovalResponseToAlertQueueDetailsUIForm(
  data: AlertQueueDetailsApi,
): AlertQueueDetailsUIForm {
  return {
    queueId: data.queue_id ?? null,
    id: data.id,
    apprId: null,
    lastApprId: null,
    name: data.name,
    description: data.description ?? null,
    activeStatus: data.active_status,
    requestType: null,
    approvalStatus: null,
    createdBy: data.created_by,
    createdByName: data.created_by_name,
    createdDt: data.created_dt,
    requesterId: data.last_updated_by,
    requesterName: data.last_updated_by_name,
    requestDate: data.last_updated_dt,
    approver1Id: data.last_approval1_by,
    approver1Name: data.last_approval1_name,
    approval1Date: data.last_approval1_dt,
    approver2Id: data.last_approval2_by,
    approver2Name: data.last_approval2_name,
    approval2Date: data.last_approval2_dt,
    rejectionNote: null,
    assignTo: data.assign_to,
    details: mappingPriorityBox(data.details),
  };
}

export function mapAlertQueueDetailsApiToDomain(
  api: AlertQueueDetailsApi,
): AlertQueueDetails {
  return {
    queueId: api.queue_id,
    id: api.id,
    name: api.name,
    description: api.description,
    activeStatus: api.active_status,
    createdBy: api.created_by,
    createdByName: api.created_by_name,
    createdDt: api.created_dt,
    lastUpdatedBy: api.last_updated_by,
    lastUpdatedByName: api.last_updated_by_name,
    lastUpdatedDt: api.last_updated_dt,
    lastApproval1By: api.last_approval1_by,
    lastApproval1Name: api.last_approval1_name,
    lastApproval1Dt: api.last_approval1_dt,
    lastApproval2By: api.last_approval2_by,
    lastApproval2Name: api.last_approval2_name,
    lastApproval2Dt: api.last_approval2_dt,
    assignTo: api.assign_to ?? [],
    details: (api.details ?? []).map((x) => ({
      priorityType: x.priority_type,
      priorityLevel: x.priority_level,
      prioritySeq: x.priority_seq,
      productType: x.product_type,
      itemType: x.item_type,
      itemId: x.item_id,
      itemName: x.item_name,
    })),
  };
}
