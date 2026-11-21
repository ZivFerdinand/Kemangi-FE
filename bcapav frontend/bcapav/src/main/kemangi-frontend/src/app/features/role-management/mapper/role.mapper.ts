import { RoleQueryApi } from '../api/models/role.model';
import { RoleQuery } from '../domain/models/role.model';

export function mapRoleQueryDomainToApi(domain: RoleQuery): RoleQueryApi {
  return {
    limit: domain.limit,
    page: domain.page,
    sort: domain.sort ?? null,
    sort_dir: domain.sortDir ?? null,
    query: domain.query ?? null,
  };
}
