import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../../core/services/api.service';
import { AlertQueueApprovalQueryApi } from '../../../../approval/alert-queue-management/api/models/alert-queue.model';
import { TableQueryApi } from '../../../../../shared';

@Injectable({ providedIn: 'root' })
export class AlertQueueApprovalService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public list(param: AlertQueueApprovalQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (
        value !== '' &&
        value !== null &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0)
      ) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(
      `${this.base_URL}/alert-queue/approval/search?`,
      {
        params,
      },
    );
  }

  public details(id: string) {
    return this.httpClient.get(
      `${this.base_URL}/alert-queue/approval/detail/${id}`,
    );
  }

  public approve(level: number, data: any) {
    return this.httpClient.put(
      `${this.base_URL}/alert-queue/approval/approve/${level === 1 ? 'lv1' : 'lv2'}`,
      data,
    );
  }

  public reject(level: number, data: any) {
    return this.httpClient.put(
      `${this.base_URL}/alert-queue/approval/reject/${level === 1 ? 'lv1' : 'lv2'}`,
      data,
    );
  }

  public assignToList(id: string, query: TableQueryApi) {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (
        value !== '' &&
        value !== null &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0)
      ) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/alert-queue/approval/detail/${id}/assignee?`,
      {
        params,
      },
    );
  }

  public assignToListAll(id: string) {
    return this.httpClient.get(
      `${this.base_URL}/alert-queue/approval/detail/${id}/assignee-list`,
    );
  }
}
