import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../core/services/api.service';

import {
  AlertQueueQueryApi,
  UserMasterDataFilterQueryApi,
  AlertQueuePayloadApi,
} from '../models/alert-queue.model';
import { TableQueryApi } from '../../../../shared';

@Injectable({ providedIn: 'root' })
export class AlertQueueService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public create(data: AlertQueuePayloadApi) {
    return this.httpClient.post(`${this.base_URL}/alert-queue/create`, data);
  }

  public update(data: AlertQueuePayloadApi) {
    return this.httpClient.put(`${this.base_URL}/alert-queue/update`, data);
  }

  public delete(id: any) {
    return this.httpClient.delete(`${this.base_URL}/alert-queue/delete/${id}`);
  }

  public list(query: AlertQueueQueryApi) {
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

    return this.httpClient.get(`${this.base_URL}/alert-queue/search?`, {
      params,
    });
  }

  public details(id: number) {
    return this.httpClient.get(`${this.base_URL}/alert-queue/detail/${id}`);
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
      `${this.base_URL}/alert-queue/detail/${id}/assignee?`,
      {
        params,
      },
    );
  }

  public ruleMasterData(unassigned?: boolean | null) {
    return this.httpClient.get(
      `${this.base_URL}/alert-queue/master/rule${unassigned !== null ? `?unassigned=${unassigned}` : ''}`,
    );
  }

  public thresholdMasterData(unassigned?: boolean | null) {
    return this.httpClient.get(
      `${this.base_URL}/alert-queue/master/threshold${unassigned !== null ? `?unassigned=${unassigned}` : ''}`,
    );
  }

  public userMasterData(query: UserMasterDataFilterQueryApi) {
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

    return this.httpClient.get(`${this.base_URL}/alert-queue/master/user`, {
      params,
    });
  }
}
