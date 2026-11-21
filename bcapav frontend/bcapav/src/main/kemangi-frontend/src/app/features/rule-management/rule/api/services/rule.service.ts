import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpContext } from '@angular/common/http';
import { ApiService } from '../../../../../core/services/api.service';
import {
  RuleQueryApi,
  RulePayloadFormApi,
  RuleDeletePayloadApi,
  DropdownRuleApprQueryApi,
} from '../models/rule.model';
import { ResponseUploadFileApi } from '../../../../../shared';

@Injectable({ providedIn: 'root' })
export class RuleService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public list(param: RuleQueryApi) {
    let params = new HttpParams();
    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/rule/search?`, {
      params,
    });
  }

  public details(id: number) {
    return this.httpClient.get(`${this.base_URL}/rule/detail/${id}`);
  }

  public create(data: RulePayloadFormApi, context?: HttpContext) {
    return this.httpClient.post(`${this.base_URL}/rule/create`, data, {
      context: context ?? new HttpContext(),
    });
  }

  public update(data: RulePayloadFormApi, context?: HttpContext) {
    return this.httpClient.put(`${this.base_URL}/rule/update`, data, {
      context: context ?? new HttpContext(),
    });
  }

  public delete(data: RuleDeletePayloadApi) {
    return this.httpClient.put(`${this.base_URL}/rule/delete`, data);
  }

  public saveDraft(data: RulePayloadFormApi) {
    return this.httpClient.post(`${this.base_URL}/rule/draft`, data);
  }

  public deleteDraft(id: number) {
    return this.httpClient.delete(
      `${this.base_URL}/rule/approval/delete/${id}`,
    );
  }

  public ruleMasterProductGroupList() {
    return this.httpClient.get(`${this.base_URL}/master/rule/product-group`);
  }

  public ruleMasterParameterTypeList(product_group: string) {
    return this.httpClient.get(
      `${this.base_URL}/master/rule/parameter-type?product_group=${product_group}`,
    );
  }

  public ruleMasterParameterList(type: string) {
    return this.httpClient.get(
      `${this.base_URL}/master/rule/parameter?type=${type}`,
    );
  }

  public ruleMasterOperatorList() {
    return this.httpClient.get(`${this.base_URL}/master/rule/operator`);
  }

  public ruleMasterFunctionList() {
    return this.httpClient.get(`${this.base_URL}/master/rule/function`);
  }

  public ruleMasterDataGroupList(watchlist?: boolean) {
    return this.httpClient.get(
      `${this.base_URL}/data-group/dropdown${watchlist !== undefined ? `?watchlist=${watchlist}` : ''}`,
    );
  }

  public ruleMasterPipelineTypeList() {
    return this.httpClient.get(`${this.base_URL}/master/rule/pipeline-type`);
  }

  public ruleMasterPipelineList(pipelineType: string) {
    return this.httpClient.get(
      `${this.base_URL}/master/rule/pipeline?pipeline_type=${pipelineType}`,
    );
  }

  public ruleMasterEmailTemplateList(productType?: string, eventType?: string) {
    return this.httpClient.get(
      `${this.base_URL}/email-template/dropdown?query=&${productType ? `&product_type=${productType}` : ''}${eventType ? `&event_type=${eventType}` : ''}`,
    );
  }

  public ruleDropdownList(expired?: boolean) {
    return this.httpClient.get(
      `${this.base_URL}/rule/dropdown${expired ? `?expired=${expired}` : ``}`,
    );
  }

  public uploadRuleFile(data: FormData) {
    return this.httpClient.post<ResponseUploadFileApi>(
      `${this.base_URL}/rule/resource/upload`,
      data,
    );
  }

  public dropdownRuleAppr(param: DropdownRuleApprQueryApi) {
    let params = new HttpParams();
    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(
      `${this.base_URL}/rule/approval/search/dropdown?`,
      {
        params,
      },
    );
  }

  public dropdownHistoricalFieldList(historiId: string) {
    return this.httpClient.get(
      `${this.base_URL}/master/rule/historical-table/${historiId}`,
    );
  }
}
