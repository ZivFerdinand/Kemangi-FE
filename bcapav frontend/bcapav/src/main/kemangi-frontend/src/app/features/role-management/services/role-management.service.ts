import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RolePayload } from '../interfaces';
import { RoleQueryApi } from '../api/models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleManagementService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public createRole(data: RolePayload) {
    return this.httpClient.post(`${this.base_URL}/role/create`, data);
  }

  public updateRole(data: RolePayload) {
    return this.httpClient.put(`${this.base_URL}/role/update`, data);
  }

  public deleteRole(id: number) {
    return this.httpClient.delete(`${this.base_URL}/role/delete/${id}`);
  }

  public roleList(param: RoleQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/role/search?`, { params });
  }

  public getRoleListZip() {
    return this.httpClient.get(`${this.base_URL}/role/export`, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  public roleDetails(id: number) {
    return this.httpClient.get(`${this.base_URL}/role/detail/${id}`);
  }
}
