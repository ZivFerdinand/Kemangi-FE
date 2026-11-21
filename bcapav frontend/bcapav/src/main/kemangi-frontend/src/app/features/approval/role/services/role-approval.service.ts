import { RoleApprovalQueryApi } from './../api/models/role-approval.model';
import { ApiService } from '../../../../core/services/api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RoleApprovalPayload } from '../interfaces';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoleApprovalService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public roleApprovalList(param: RoleApprovalQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(`${this.base_URL}/role/approval/search?`, {
      params,
    });
  }

  public roleApprovalDetails(id: number) {
    return this.httpClient.get(`${this.base_URL}/role/approval/detail/${id}`);
  }

  public approveRole(data: RoleApprovalPayload) {
    return this.httpClient.put(`${this.base_URL}/role/approval/approve`, data);
  }

  public rejectRole(data: RoleApprovalPayload) {
    return this.httpClient.put(`${this.base_URL}/role/approval/reject`, data);
  }
}
