import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService } from '../../../../../core/services/api.service';
import {
  BlockUnblockAccountBalanceApprovalQueryApi,
  BlockUnblockAccountBalanceDownloadFileParamsApi,
} from '../models/block-unblock-account-balance-approval.model';

@Injectable({ providedIn: 'root' })
export class BlockUnblockAccountBalanceApprovalService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public list(param: BlockUnblockAccountBalanceApprovalQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(
      `${this.base_URL}/block-account-balance/search?`,
      {
        params,
      },
    );
  }

  public details(id: string) {
    return this.httpClient.get(
      `${this.base_URL}/block-account-balance/detail/${id}`,
    );
  }

  public approve(data: any) {
    return this.httpClient.put(
      `${this.base_URL}/block-account-balance/approval/approve`,
      data,
    );
  }

  public reject(data: any) {
    return this.httpClient.put(
      `${this.base_URL}/block-account-balance/approval/reject`,
      data,
    );
  }

  public downloadFile(
    id: number,
    param: BlockUnblockAccountBalanceDownloadFileParamsApi,
  ): Observable<HttpResponse<Blob>> {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/block-account-balance/detail/${id}/download`,
      {
        params,
        observe: 'response',
        responseType: 'blob',
      },
    );
  }

  public downloadTempFile(
    id: number,
    param: BlockUnblockAccountBalanceDownloadFileParamsApi,
  ): Observable<HttpResponse<Blob>> {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/block-account-balance/detail-temp/${id}/download`,
      {
        params,
        observe: 'response',
        responseType: 'blob',
      },
    );
  }

  public downloadFileUnblock(id: number): Observable<HttpResponse<Blob>> {
    return this.httpClient.get(
      `${this.base_URL}/block-account-balance/request/unblock/${id}`,
      {
        observe: 'response',
        responseType: 'blob',
      },
    );
  }

  public retry(id: string) {
    return this.httpClient.put(
      `${this.base_URL}/block-account-balance/retry/${id}`,
      null,
    );
  }
}
