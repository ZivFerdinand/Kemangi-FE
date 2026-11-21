import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { ApiService } from '../../../../../core/services/api.service';
import {
  SMCDetailsListTableQueryApi,
  SMCDownloadFileParamsApi,
} from '../models/smc.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SMCService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public upload(formData: any) {
    return this.httpClient.post(
      `${this.base_URL}/smc/request/upload`,
      formData,
    );
  }

  public request(payload: any) {
    return this.httpClient.put(`${this.base_URL}/smc/request/submit`, payload);
  }

  public details(id: string) {
    return this.httpClient.get(`${this.base_URL}/smc/detail/${id}`);
  }

  public detailsList(id: string, query: SMCDetailsListTableQueryApi) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(`${this.base_URL}/smc/detail/${id}/list`, {
      params,
    });
  }

  public detailsTemp(id: string) {
    return this.httpClient.get(`${this.base_URL}/smc/detail-temp/${id}`);
  }

  public detailsTempList(id: string, query: SMCDetailsListTableQueryApi) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(`${this.base_URL}/smc/detail-temp/${id}/list`, {
      params,
    });
  }

  public downloadTemplate() {
    return this.httpClient.get(`${this.base_URL}/smc/request/template`, {
      responseType: 'blob',
      observe: 'response',
    });
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

  public downloadTempFile(
    id: number,
    param: SMCDownloadFileParamsApi,
  ): Observable<HttpResponse<Blob>> {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/smc/detail-temp/${id}/download`,
      {
        params,
        observe: 'response',
        responseType: 'blob',
      },
    );
  }
}
