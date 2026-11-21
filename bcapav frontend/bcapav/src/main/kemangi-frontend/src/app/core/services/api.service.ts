import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  base_URL = `${environment.API_KEY}`;

  constructor(protected readonly httpClient: HttpClient) { }

  public getUserLogin() {
    return this.httpClient.get(`${this.base_URL}/user/profile`);
  }

  public getRuleAlertDetail(productGroup: string) {
    return this.httpClient.get(
      `${this.base_URL}/alert/rule/search?product_group=${productGroup}&sort=ruleId`,
    );
  }

  public getModelAlertDetail(productType: string) {
    return this.httpClient.get(
      `${this.base_URL}/alert/model/search?product_type=${productType}`,
    );
  }

  public getRuleAll() {
    return this.httpClient.get(`${this.base_URL}/search/rule/all`);
  }

  public getAllUser() {
    return this.httpClient.get(`${this.base_URL}/search/user/all`);
  }

  public getMenuList() {
    return this.httpClient.get(`${this.base_URL}/search/menu/list`);
  }

  public getUserList() {
    return this.httpClient.get(`${this.base_URL}/search/user/list`);
  }
  public getUserReport() {
    return this.httpClient.get(`${this.base_URL}/search/user/report`);
  }

  public getUserActivityReportData(data: any) {
    let paramUsers = new HttpParams()
      .set(`date_from`, data.dateFrom)
      .set(`date_to`, data.dateTo)
      .set(`user_id`, data.userId)
      .set(`action`, data.action);
    const options = { params: paramUsers };

    return this.httpClient.post(
      `${this.base_URL}/report/user-activity`,
      {},
      options,
    );
  }

  public getUserActivityReportZip(data: any) {
    let paramUsers = new HttpParams()
      .set(`date_from`, data.dateFrom)
      .set(`date_to`, data.dateTo)
      .set(`user_id`, data.userId)
      .set(`action`, data.action);

    return this.httpClient.post(
      `${this.base_URL}/report/user-activity/download`,
      {},
      { params: paramUsers, responseType: 'blob', observe: 'response' },
    );
  }

  public getMasterProductList() {
    return this.httpClient.get(`${this.base_URL}/alert/product-list`);
  }

  public getMasterAlert(data: any) {
    let options = new HttpParams().set(`product`, data.product_type);

    return this.httpClient.get(`${this.base_URL}/alert/event-type`, {
      params: options,
    });
  }

  public getAlertInquiry(payload: any) {
    return this.httpClient.post(`${this.base_URL}/alert/inquiry`, payload);
  }

  public getAlertInquiryZip(payload: any): Observable<HttpResponse<Blob>> {
    return this.httpClient.post(
      `${this.base_URL}/alert/inquiry/download`,
      payload,
      {
        responseType: 'blob',
        observe: 'response',
      },
    );
  }

  public getRoleList() {
    return this.httpClient.get(`${this.base_URL}/search/role/list?`);
  }

  public getTemplateTypeList() {
    return this.httpClient.get(
      `${this.base_URL}/master/rule/email/template-type`,
    );
  }

  public getPlaceholderList(productType: string, eventType?: string) {
    if (!eventType) {
      return this.httpClient.get(
        `${this.base_URL}/master/rule/email/placeholder?product_type=${productType}`,
      );
    }

    return this.httpClient.get(
      `${this.base_URL}/master/rule/parameter?${eventType ? `type=${eventType}` : ''}`,
    );
  }

  public getPlaceholderListNonEventType(productType: string) {
    return this.httpClient.get(
      `${this.base_URL}/master/rule/email/placeholder?product_type=${productType}`,
    );
  }

  public getPlaceholderListEventType(eventType: string) {
    return this.httpClient.get(
      `${this.base_URL}/master/rule/parameter?${eventType ? `type=${eventType}` : ''}`,
    );
  }

  public getRuleDropdownList() {
    return this.httpClient.get(`${this.base_URL}/rule/dropdown`);
  }
}
