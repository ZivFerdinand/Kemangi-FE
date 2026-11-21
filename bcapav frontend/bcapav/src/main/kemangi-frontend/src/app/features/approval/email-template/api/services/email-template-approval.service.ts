import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../../core/services/api.service';
import { EmailTemplateApprovalQueryApi } from './../models/email-template-approval.model';

@Injectable({ providedIn: 'root' })
export class EmailTemplateApprovalService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public list(param: EmailTemplateApprovalQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(
      `${this.base_URL}/email-template/approval/search?`,
      {
        params,
      },
    );
  }

  public details(id: string) {
    return this.httpClient.get(
      `${this.base_URL}/email-template/approval/detail/${id}`,
    );
  }

  public approve(data: any) {
    return this.httpClient.put(
      `${this.base_URL}/email-template/approval/approve`,
      data,
    );
  }

  public reject(data: any) {
    return this.httpClient.put(
      `${this.base_URL}/email-template/approval/reject`,
      data,
    );
  }

  public dropdownEmailTemplate() {
    return this.httpClient.get(
      `${this.base_URL}/email-template/approval/search/dropdown/templateid?query=`,
    );
  }

  public dropdownTemplateType() {
    return this.httpClient.get(
      `${this.base_URL}/email-template/approval/search/dropdown/templatetype?query=`,
    );
  }

  public dropdownProductType() {
    return this.httpClient.get(
      `${this.base_URL}/email-template/approval/search/dropdown/producttype?query=`,
    );
  }
}
