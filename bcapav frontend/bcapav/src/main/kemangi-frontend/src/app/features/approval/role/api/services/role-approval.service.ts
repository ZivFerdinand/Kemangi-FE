import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  RoleApprovalQueryApi,
  RoleApprovalPayloadApi,
} from './../models/role-approval.model';
import { ApiService } from '../../../../../core/services/api.service';

@Injectable({ providedIn: 'root' })
export class RoleApprovalService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public list(query: RoleApprovalQueryApi) {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(`${this.base_URL}/role/approval/search?`, {
      params,
    });
  }

  public details(id: string) {
    return this.httpClient.get(`${this.base_URL}/role/approval/detail/${id}`);
  }

  public approveRole(payload: RoleApprovalPayloadApi) {
    return this.httpClient.put(
      `${this.base_URL}/role/approval/approve`,
      payload,
    );
  }

  public rejectRole(payload: RoleApprovalPayloadApi) {
    return this.httpClient.put(
      `${this.base_URL}/role/approval/reject`,
      payload,
    );
  }
}
