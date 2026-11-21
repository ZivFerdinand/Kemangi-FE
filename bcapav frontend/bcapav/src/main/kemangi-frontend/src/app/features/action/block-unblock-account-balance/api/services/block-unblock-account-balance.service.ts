import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../../core/services/api.service';
import { BlockUnblockAccountBalanceDetailsListTableQueryApi } from '../models/block-unblock-account-balance.model';

@Injectable({ providedIn: 'root' })
export class BlockUnblockAccountBalanceService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public upload(formData: any) {
    return this.httpClient.post(
      `${this.base_URL}/block-account-balance/request/upload`,
      formData,
    );
  }

  public request(payload: any) {
    return this.httpClient.put(
      `${this.base_URL}/block-account-balance/request/submit`,
      payload,
    );
  }

  public details(id: string) {
    return this.httpClient.get(
      `${this.base_URL}/block-account-balance/detail/${id}`,
    );
  }

  public detailsList(
    id: string,
    query: BlockUnblockAccountBalanceDetailsListTableQueryApi,
    type: string,
  ) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/block-account-balance/detail/${id}/${type}`,
      { params },
    );
  }

  public detailsTemp(id: string) {
    return this.httpClient.get(
      `${this.base_URL}/block-account-balance/detail-temp/${id}`,
    );
  }

  public detailsTempList(
    id: string,
    query: BlockUnblockAccountBalanceDetailsListTableQueryApi,
    type: string,
  ) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/block-account-balance/detail-temp/${id}/${type}`,
      { params },
    );
  }

  public downloadTemplate(action: string, accountType?: string) {
    return this.httpClient.get(
      `${this.base_URL}/block-account-balance/request/template?action=${action}${accountType ? `&account_type=${accountType}` : ``}`,
      {
        responseType: 'blob',
        observe: 'response',
      },
    );
  }
}
