import { Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  DataGroupDraftRequestedListParams,
  DataGroupRequestedTableParams,
} from '../interfaces';
import { TableParams } from '../../../../shared';
import { DropdownListParams } from '../../../../core/interfaces/api.interface';
import { ResponseDataGroupUploadFileApi } from '../../../rule-management/data-group/api/models/data-group.model';
import { ResponseMLThresholdUploadFileApi } from './ml-threshold.model';

@Injectable({ providedIn: 'root' })
export class MLThresholdService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public getMLListZip() {
    return this.httpClient.get(`${this.base_URL}/ml-threshold/search/download`, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  public thresholdCurrentList(param: TableParams) {
    let params = new HttpParams();
    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/ml-threshold/search?`, {
      params,
    });
  }

  public getMLMProductTypeList() {
    return this.httpClient.get(`${this.base_URL}/ml-threshold/search/find-product-types`);
  }
  public refreshMLMList() {
    return this.httpClient.get(`${this.base_URL}/ml-threshold/refresh`);
  }

  public thresholdApprovalDetail(id: number) {
    return this.httpClient.get(`${this.base_URL}/ml-threshold/approval/detail/${id}`, );
  }

  public thresholdApprovalRequestedList(param: TableParams) {
    let params = new HttpParams();
    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/ml-threshold/approval/search?`, {
      params,
    });
  }

  public approve(level: number, data: any) {
    return this.httpClient.put(
      `${this.base_URL}/ml-threshold/approval/approve/${level === 1 ? 'lv1' : 'lv2'}`,
      data,
    );
  }

  public reject(level: number, data: any) {
    return this.httpClient.put(
      `${this.base_URL}/ml-threshold/approval/reject/${level === 1 ? 'lv1' : 'lv2'}`,
      data,
    );
  }
  
  public modelIdDetail(id: number) {
    return this.httpClient.get(`${this.base_URL}/ml-threshold/detail/${id}`);
  }
  public thresholdIdDetailCurrentList(param: TableParams) {
    let params = new HttpParams();
    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/ml-threshold/search-threshold-ids?`, {
      params,
    });
  }

  public updateThreshold(data: any) {
    return this.httpClient.put(`${this.base_URL}/ml-threshold/update`, data);
  }
  public deleteThreshold(data: any) {
    return this.httpClient.put(`${this.base_URL}/ml-threshold/delete`, data);
  }
  public uploadMLThresholdFile(data: FormData) {
      return this.httpClient.post<ResponseMLThresholdUploadFileApi>(
        `${this.base_URL}/ml-threshold/resource/upload`,
        data,
      );
    }
  
}
