import { Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  DataGroupDraftRequestedListParams,
  DataGroupRequestedTableParams,
} from '../interfaces';
import { TableParams } from '../../../../shared';
import { DropdownListParams } from '../../../../core/interfaces/api.interface';

@Injectable({ providedIn: 'root' })
export class DataGroupService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public createDataGroup(data: any) {
    return this.httpClient.post(`${this.base_URL}/data-group/create`, data);
  }

  public updateDataGroup(data: any) {
    return this.httpClient.put(`${this.base_URL}/data-group/update`, data);
  }

  public deleteDataGroup(id: number) {
    return this.httpClient.delete(`${this.base_URL}/data-group/delete/${id}`);
  }

  public deleteDraftDataGroup(id: number) {
    return this.httpClient.delete(
      `${this.base_URL}/data-group/approval/delete/${id}`
    );
  }

  public saveAsDraft(data: any) {
    return this.httpClient.post(`${this.base_URL}/data-group/draft`, data);
  }

  public dataGroupCurrentList(param: TableParams) {
    let params = new HttpParams();
    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/data-group/search?`, {
      params,
    });
  }

  public dataGroupDraftList(param: DataGroupDraftRequestedListParams) {
    let params = new HttpParams();
    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/data-group/approval/search?`, {
      params,
    });
  }

  public dataGroupRequestedList(param: DataGroupDraftRequestedListParams) {
    let params = new HttpParams();
    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/data-group/approval/search?`, {
      params,
    });
  }

  public dataGroupDetails(id: number) {
    return this.httpClient.get(`${this.base_URL}/data-group/detail/${id}`);
  }

  public dataGroupDraftDetails(id: number) {
    return this.httpClient.get(
      `${this.base_URL}/data-group/approval/detail/${id}`
    );
  }

  public dataGroupDropdownList(param: DropdownListParams) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/data-group/approval/search/dropdown/data-group?`,
      {
        params,
      }
    );
  }

  public requesterDropdownList(param: DropdownListParams) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/data-group/approval/search/dropdown/requester?`,
      {
        params,
      }
    );
  }

  public approverDropdownList(param: DropdownListParams) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });

    return this.httpClient.get(
      `${this.base_URL}/data-group/approval/search/dropdown/approver?`,
      {
        params,
      }
    );
  }

  public dataGroupRuleRelationList(id: string, param: TableParams) {
    let params = new HttpParams();
    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(
      `${this.base_URL}/data-group/rule-relation/${id}?`,
      {
        params,
      }
    );
  }
}
