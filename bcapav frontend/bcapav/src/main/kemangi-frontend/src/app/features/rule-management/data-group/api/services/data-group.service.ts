import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../../core/services/api.service';
import { DropdownListQueryApi, TableQueryApi } from '../../../../../shared';
import {
  DataGroupTableQueryApi,
  DataGroupDraftTableQueryApi,
} from '../models/data-group-query.model';
import { DataGroupFormApi } from '../models/data-group-form.model';
import {
  DataGroupDeletePayloadApi,
  ResponseDataGroupUploadFileApi,
} from '../models/data-group.model';

@Injectable({ providedIn: 'root' })
export class DataGroupService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public create(data: DataGroupFormApi) {
    return this.httpClient.post(`${this.base_URL}/data-group/create`, data);
  }

  public update(data: DataGroupFormApi) {
    return this.httpClient.put(`${this.base_URL}/data-group/update`, data);
  }

  public delete(data: DataGroupDeletePayloadApi) {
    return this.httpClient.put(`${this.base_URL}/data-group/delete`, data);
  }

  public deleteDraft(id: number) {
    return this.httpClient.delete(
      `${this.base_URL}/data-group/approval/delete/${id}`,
    );
  }

  public createDraft(data: DataGroupFormApi) {
    return this.httpClient.post(`${this.base_URL}/data-group/draft`, data);
  }

  public list(query: DataGroupTableQueryApi) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/data-group/search?`, {
      params,
    });
  }

  public draftList(query: DataGroupDraftTableQueryApi) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/data-group/approval/search?`, {
      params,
    });
  }

  public details(id: number) {
    return this.httpClient.get(`${this.base_URL}/data-group/detail/${id}`);
  }

  public draftDetails(id: number) {
    return this.httpClient.get(
      `${this.base_URL}/data-group/approval/detail/${id}`,
    );
  }

  public dropdownList() {
    return this.httpClient.get(`${this.base_URL}/data-group/dropdown?`);
  }

  public dropdownApprovalList(query: DropdownListQueryApi) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(
      `${this.base_URL}/data-group/approval/search/dropdown/data-group?`,
      {
        params,
      },
    );
  }

  public ruleRelationList(id: string, query: TableQueryApi) {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/data-group/rule-relation/${id}?`,
      {
        params,
      },
    );
  }

  public uploadDataGroupFile(data: FormData) {
    return this.httpClient.post<ResponseDataGroupUploadFileApi>(
      `${this.base_URL}/data-group/resource/upload`,
      data,
    );
  }
}
