import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../core/services/api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BinQueryApi } from '../models/bin';

@Injectable({ providedIn: 'root' })
export class BinService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public createBin(data: any) {
    return this.httpClient.post(`${this.base_URL}/bin-number/create`, data);
  }

  public updateBin(data: any) {
    return this.httpClient.put(`${this.base_URL}/bin-number/update`, data);
  }

  public deleteBin(id: number) {
    return this.httpClient.delete(`${this.base_URL}/bin-number/delete/${id}`);
  }

  public binList(param: BinQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/bin-number/search?`, {
      params,
    });
  }

  public binDetails(id: string) {
    return this.httpClient.get(`${this.base_URL}/bin-number/detail/${id}`);
  }
}
