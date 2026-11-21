import {
  FraudTypePayload,
  FraudTypeParams,
  FraudTypeDetails,
} from '../domain/models/fraud-types.model';
import {
  FraudTypePayloadApi,
  FraudTypeParamsApi,
  FraudTypeDetailsApi,
} from '../api/models/fraud-type';

export function mapFraudTypePayloadDomainToApi(
  domain: FraudTypePayload,
): FraudTypePayloadApi {
  return {
    id: domain.id ? Number(domain.id) : null,
    active_status: domain.activeStatus,
    fraud_type: domain.fraudType,
    description: domain.description,
  };
}

export function mapFraudTypeParamsDomainToApi(
  domain: FraudTypeParams,
): FraudTypeParamsApi {
  return {
    limit: Number(domain.limit),
    page: Number(domain.page),
    sort: domain.sort ?? null,
    sort_dir: domain.sortDir ?? null,
    fraud_type: domain.fraudType ?? null,
  };
}

export function mapFraudTypeDetailApiToDomain(
  api: FraudTypeDetailsApi,
): FraudTypeDetails {
  return {
    activeStatus: api.active_status,
    createdBy: api.created_by ?? '',
    createdByName: api.created_by_name ?? '',
    createdDt: api.created_dt ?? '',
    description: api.description ?? '',
    fraudType: api.fraud_type ?? '',
    id: api.id,
    lastApprovalBy: api.last_approval_by ?? '',
    lastApprovalDt: api.last_approval_dt ?? '',
    lastApprovalName: api.last_approval_name ?? '',
    lastUpdatedBy: api.last_updated_by ?? '',
    lastUpdatedByName: api.last_updated_by_name ?? '',
    lastUpdatedDt: api.last_updated_dt ?? '',
  };
}
