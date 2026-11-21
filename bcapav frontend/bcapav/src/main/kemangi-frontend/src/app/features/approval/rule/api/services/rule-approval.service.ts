import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../../core/services/api.service';
import {
  DropdownEmaiTemplateParamsApi,
  RuleApprovalQueryApi,
} from '../models/rule-approval.model';
import { DropdownRuleApprQueryApi } from '../../../../rule-management/rule/api/models/rule.model';

@Injectable({ providedIn: 'root' })
export class RuleApprovalService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public list(param: RuleApprovalQueryApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/rule/approval/search?`, {
      params,
    });
  }

  public details(id: string) {
    return this.httpClient.get(`${this.base_URL}/rule/approval/detail/${id}`);
  }

  public approve(level: number, data: any) {
    return this.httpClient.put(
      `${this.base_URL}/rule/approval/approve/${level === 1 ? 'lv1' : 'lv2'}`,
      data,
    );
  }

  public reject(level: number, data: any) {
    return this.httpClient.put(
      `${this.base_URL}/rule/approval/reject/${level === 1 ? 'lv1' : 'lv2'}`,
      data,
    );
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

  public dropdownEmailTemplate(param: DropdownEmaiTemplateParamsApi) {
    let params = new HttpParams();

    Object.entries(param).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params = params.set(key, value);
      }
    });
    return this.httpClient.get(`${this.base_URL}/email-template/dropdown?`, {
      params,
    });
  }

  public dropdownHistorical() {
    return this.httpClient.get(`${this.base_URL}/master/rule/historical-table`);
  }

  public dropdownSmsTemplate(eventType?: string) {
    return this.httpClient.get(
      `${this.base_URL}/master/rule/contact/sms${eventType ? `?event_type=${eventType}` : ''}`,
    );
  }

  public dropdownWaTemplate(eventType?: string) {
    return this.httpClient.get(
      `${this.base_URL}/master/rule/contact/wa${eventType ? `?event_type=${eventType}` : ''}`,
    );
  }

  public dropdownMbTemplate(eventType?: string) {
    return this.httpClient.get(
      `${this.base_URL}/master/rule/contact/mbnotif${eventType ? `?event_type=${eventType}` : ''}`,
    );
  }

  public dropdownAbTemplate() {
    return this.httpClient.get(`${this.base_URL}/master/rule/contact/api`);
  }

  public dropdownRule() {
    return this.httpClient.get(`${this.base_URL}/rule/dropdown`);
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
}
