import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService } from '../../../../../core/services/api.service';
import {
  BlockUnblockApprovalQueryApi,
  BlockUnblockDownloadFileParamsApi,
} from '../models/block-unblock-approval.model';

@Injectable({ providedIn: 'root' })
export class BlockUnblockApprovalService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public list(param: BlockUnblockApprovalQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/block-account/search?`, {
      params,
    });
  }

  public details(id: string) {
    return this.httpClient.get(`${this.base_URL}/block-account/detail/${id}`);
  }

  public approve(data: any) {
    return this.httpClient.put(
      `${this.base_URL}/block-account/approval/approve`,
      data,
    );
  }

  public reject(data: any) {
    return this.httpClient.put(
      `${this.base_URL}/block-account/approval/reject`,
      data,
    );
  }

  public downloadFile(
    id: number,
    param: BlockUnblockDownloadFileParamsApi,
  ): Observable<HttpResponse<Blob>> {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/block-account/detail/${id}/download`,
      {
        params,
        observe: 'response',
        responseType: 'blob',
      },
    );
  }

  public downloadTempFile(
    id: number,
    param: BlockUnblockDownloadFileParamsApi,
  ): Observable<HttpResponse<Blob>> {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/block-account/detail-temp/${id}/download`,
      {
        params,
        observe: 'response',
        responseType: 'blob',
      },
    );
  }

  public retry(id: string) {
    return this.httpClient.put(
      `${this.base_URL}/block-account/retry/${id}`,
      null,
    );
  }
}
