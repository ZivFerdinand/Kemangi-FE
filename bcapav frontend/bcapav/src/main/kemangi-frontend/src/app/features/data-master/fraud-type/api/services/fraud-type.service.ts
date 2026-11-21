import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/services/api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FraudTypeParamsApi } from '../models/fraud-type';

@Injectable({ providedIn: 'root' })
export class FraudTypeService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public createFraudType(data: any) {
    return this.httpClient.post(`${this.base_URL}/fraud-type/create`, data);
  }

  public updateFraudType(data: any) {
    return this.httpClient.put(`${this.base_URL}/fraud-type/update`, data);
  }

  public deleteFraudType(id: number) {
    return this.httpClient.delete(`${this.base_URL}/fraud-type/delete/${id}`);
  }

  public fraudTypeList(param: FraudTypeParamsApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/fraud-type/search?`, {
      params,
    });
  }

  public fraudTypeDetails(id: string) {
    return this.httpClient.get(`${this.base_URL}/fraud-type/detail/${id}`);
  }
}
