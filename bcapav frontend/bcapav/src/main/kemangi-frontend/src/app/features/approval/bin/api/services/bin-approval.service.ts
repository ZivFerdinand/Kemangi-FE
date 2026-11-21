import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../../core/services/api.service';
import { BinApprovalQueryApi } from '../models/bin-approval.model';

@Injectable({ providedIn: 'root' })
export class BinApprovalService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public list(param: BinApprovalQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/bin-number/approval/search?`, {
      params,
    });
  }

  public details(id: string) {
    return this.httpClient.get(
      `${this.base_URL}/bin-number/approval/detail/${id}`,
    );
  }

  public approve(data: any) {
    return this.httpClient.put(
      `${this.base_URL}/bin-number/approval/approve`,
      data,
    );
  }

  public reject(data: any) {
    return this.httpClient.put(
      `${this.base_URL}/bin-number/approval/reject`,
      data,
    );
  }
}
