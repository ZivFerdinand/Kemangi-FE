import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/services/api.service';
import { FraudTypeApprovalQueryApi } from '../models/fraud-type-approval';

@Injectable({ providedIn: 'root' })
export class FraudTypeApprovalService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public approvalList(param: FraudTypeApprovalQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(`${this.base_URL}/fraud-type/approval/search?`, {
      params,
    });
  }

  public fraudTypeApprovalDetails(id: number) {
    return this.httpClient.get(
      `${this.base_URL}/fraud-type/approval/detail/${id}`,
    );
  }

  public approveFraudType(data: any) {
    return this.httpClient.put(
      `${this.base_URL}/fraud-type/approval/approve`,
      data,
    );
  }

  public rejectFraudType(data: any) {
    return this.httpClient.put(
      `${this.base_URL}/fraud-type/approval/reject`,
      data,
    );
  }
}
