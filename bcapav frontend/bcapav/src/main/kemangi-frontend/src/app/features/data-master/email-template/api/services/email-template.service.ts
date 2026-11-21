import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/services/api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EmailTemplateQueryApi } from '../models/email-template.model';

@Injectable({ providedIn: 'root' })
export class EmailTemplateService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public createEmailTemplate(data: any) {
    return this.httpClient.post(`${this.base_URL}/email-template/create`, data);
  }

  public updateEmailTemplate(data: any) {
    return this.httpClient.put(`${this.base_URL}/email-template/update`, data);
  }

  public deleteEmailTemplate(id: number) {
    return this.httpClient.delete(
      `${this.base_URL}/email-template/delete/${id}`,
    );
  }

  public emailTemplateList(param: EmailTemplateQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/email-template/search?`, {
      params,
    });
  }

  public emailTemplateDetails(id: string) {
    return this.httpClient.get(`${this.base_URL}/email-template/detail/${id}`);
  }
}
