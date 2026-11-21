import { BinPayload, BinQuery, BinDetails } from '../domain/models/bin.model';
import { BinPayloadApi, BinQueryApi, BinDetailsApi } from '../api/models/bin';

export function mapBinPayloadDomainToApi(domain: BinPayload): BinPayloadApi {
  return {
    id: domain.id ? Number(domain.id) : null,
    active_status: domain.activeStatus,
    bin_number: domain.binNumber,
    bin_description: domain.binDescription,
  };
}

export function mapBinQueryDomainToApi(domain: BinQuery): BinQueryApi {
  return {
    limit: Number(domain.limit),
    page: Number(domain.page),
    sort: domain.sort ?? null,
    sort_dir: domain.sortDir ?? null,
    bin_number: domain.binNumber ?? null,
  };
}

export function mapBinDetailApiToDomain(api: BinDetailsApi): BinDetails {
  return {
    activeStatus: api.active_status,
    createdBy: api.created_by ?? '',
    createdByName: api.created_by_name ?? '',
    createdDt: api.created_dt ?? '',
    binDescription: api.bin_description ?? '',
    binNumber: api.bin_number ?? '',
    id: api.id,
    lastApprovalBy: api.last_approval_by ?? '',
    lastApprovalDt: api.last_approval_dt ?? '',
    lastApprovalName: api.last_approval_name ?? '',
    lastUpdatedBy: api.last_updated_by ?? '',
    lastUpdatedByName: api.last_updated_by_name ?? '',
    lastUpdatedDt: api.last_updated_dt ?? '',
  };
}
