import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../../core/services/api.service';
import { DataGroupApprovalQueryApi } from '../models/data-group-approval.model';
import { DropdownListQueryApi } from '../../../../../shared';
import { DropdownListParams } from '../../../../../core/interfaces/api.interface';
import { TableParams } from '../../../../../shared';

@Injectable({ providedIn: 'root' })
export class DataGroupApprovalService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public list(param: DataGroupApprovalQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/data-group/approval/search?`, {
      params,
    });
  }

  public details(id: string) {
    return this.httpClient.get(
      `${this.base_URL}/data-group/approval/detail/${id}`,
    );
  }

  public approve(level: number, data: any) {
    return this.httpClient.put(
      `${this.base_URL}/data-group/approval/approve/${level === 1 ? 'lv1' : 'lv2'}`,
      data,
    );
  }

  public reject(level: number, data: any) {
    return this.httpClient.put(
      `${this.base_URL}/data-group/approval/reject/${level === 1 ? 'lv1' : 'lv2'}`,
      data,
    );
  }

  public dataGroupDropdownList() {
    return this.httpClient.get(
      `${this.base_URL}/data-group/approval/search/dropdown/data-group?`,
    );
  }

  public dropdownApprovalList(param: DropdownListQueryApi) {
    let params = new HttpParams();
    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/data-group/approval/search/dropdown/data-group?`,
      {
        params,
      },
    );
  }

  public ruleRelationList(id: string, param: TableParams) {
    let params = new HttpParams();
    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(
      `${this.base_URL}/data-group/rule-relation/${id}?`,
      {
        params,
      },
    );
  }

  public deleteDraft(id: number) {
    return this.httpClient.delete(
      `${this.base_URL}/data-group/approval/delete/${id}`,
    );
  }
}
