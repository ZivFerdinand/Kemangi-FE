import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../core/services/api.service';
import { TableQueryApi } from '../../../../shared';

@Injectable({ providedIn: 'root' })
export class PaymentIdService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public list(param: TableQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (
        value !== '' &&
        value !== null &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0)
      ) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/payment-id/search?`, {
      params,
    });
  }

  public details(id: string) {
    return this.httpClient.get(`${this.base_URL}/payment-id/detail/${id}`);
  }

  public accountList(id: number, param: TableQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (
        value !== '' &&
        value !== null &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0)
      ) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(
      `${this.base_URL}/payment-id/detail/${id}/account`,
      {
        params,
      },
    );
  }

  public sakukuList(id: number, param: TableQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (
        value !== '' &&
        value !== null &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0)
      ) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(
      `${this.base_URL}/payment-id/detail/${id}/sakuku`,
      {
        params,
      },
    );
  }

  public creditCardList(id: number, param: TableQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (
        value !== '' &&
        value !== null &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0)
      ) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(
      `${this.base_URL}/payment-id/detail/${id}/credit`,
      {
        params,
      },
    );
  }

  ///payment-id/detail/1/account
}
