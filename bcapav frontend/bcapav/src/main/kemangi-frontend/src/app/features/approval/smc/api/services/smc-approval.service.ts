import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService } from '../../../../../core/services/api.service';
import {
  SMCApprovalQueryApi,
  SMCDownloadFileParamsApi,
} from '../models/smc-approval.model';

@Injectable({ providedIn: 'root' })
export class SMCApprovalService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public list(param: SMCApprovalQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/smc/search?`, {
      params,
    });
  }

  public details(id: string) {
    return this.httpClient.get(`${this.base_URL}/smc/detail/${id}`);
  }

  public approve(data: any) {
    return this.httpClient.put(`${this.base_URL}/smc/approval/approve`, data);
  }

  public reject(data: any) {
    return this.httpClient.put(`${this.base_URL}/smc/approval/reject`, data);
  }

  public downloadFile(
    id: number,
    param: SMCDownloadFileParamsApi,
  ): Observable<HttpResponse<Blob>> {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(`${this.base_URL}/smc/detail/${id}/download`, {
      params,
      observe: 'response',
      responseType: 'blob',
    });
  }

  public downloadFileUnblock(id: number): Observable<HttpResponse<Blob>> {
    return this.httpClient.get(`${this.base_URL}/smc/request/unblock/${id}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  public retry(id: string) {
    return this.httpClient.put(`${this.base_URL}/smc/retry/${id}`, null);
  }
}
