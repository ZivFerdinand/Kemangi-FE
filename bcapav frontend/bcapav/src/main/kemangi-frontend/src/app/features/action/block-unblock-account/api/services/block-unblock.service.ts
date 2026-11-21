import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../../core/services/api.service';
import { BlockUnblockDetailsListTableQueryApi } from '../models/block-unblock.model';

@Injectable({ providedIn: 'root' })
export class BlockUnblockService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public upload(formData: any) {
    return this.httpClient.post(
      `${this.base_URL}/block-account/request/upload`,
      formData,
    );
  }

  public request(payload: any) {
    return this.httpClient.put(
      `${this.base_URL}/block-account/request/submit`,
      payload,
    );
  }

  public details(id: string) {
    return this.httpClient.get(`${this.base_URL}/block-account/detail/${id}`);
  }

  public detailsList(id: string, query: BlockUnblockDetailsListTableQueryApi) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/block-account/detail/${id}/list`,
      { params },
    );
  }

  public detailsTemp(id: string) {
    return this.httpClient.get(
      `${this.base_URL}/block-account/detail-temp/${id}`,
    );
  }

  public detailsTempList(
    id: string,
    query: BlockUnblockDetailsListTableQueryApi,
  ) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/block-account/detail-temp/${id}/list`,
      { params },
    );
  }

  public downloadTemplate(action: string) {
    return this.httpClient.get(
      `${this.base_URL}/block-account/request/template?action=${action}`,
      {
        responseType: 'blob',
        observe: 'response',
      },
    );
  }
}
