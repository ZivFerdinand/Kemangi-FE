import {
  Input,
  Component,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  PAGE_INFO_INIT,
  PAGE_QUERY_INIT,
  TableComponent,
} from '../../../../../shared';
import { subruleParamDisplayColumns } from '../../data';
import { enumBoolean } from '../../../../../shared';
import { TabItem } from '../../domain/rule.model';
import {
  DropdownRuleFunction,
  DropdownDataGroup,
  DropdownRuleOperator,
  DropdownPipelineType,
  DropdownSubRuleParameterType,
  DropdownSubRuleParameter,
  DropdownRulePipeline,
  DropdownEmailTemplate,
  DropdownHistorical,
  DropdownSmsTemplate,
  DropdownWaTemplate,
  DropdownMbNotif,
  DropdownAb,
  DropdownRule,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import { RuleService } from '../../api/services/rule.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { mapDropdownSubRuleParameterApiToDomain } from '../../../../approval/rule/mappers/rule-approval.mapper';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { DetailRuleTabComponent } from '../detail-tab/detail-rule-tab';
import { SUBRULE_INIT } from '../../data';
import { SubRule } from '../../domain/rule.model';
import { PipelineDetails } from '../pipeline-details/pipeline-details';
import { AutoActionDetails } from '../auto-action-details/auto-action-details';

type Parameter = {
  uiId?: any;
  functionName: string;
  parameter: string;
  operator: string;
  value: string;
  dataGroupId?: string | null;
  dataGroupName?: string | null;
  dataGroupValue?: string | null;
};

@Component({
  selector: 'app-subrule-details',
  standalone: true,
  templateUrl: './subrule-details.html',
  styleUrls: [
    './subrule-details.scss',
    '../../../../../shared/styles/index.scss',
  ],
  imports: [
    NgSelectModule,
    CommonModule,
    FormsModule,
    TableComponent,
    PipelineDetails,
    AutoActionDetails,
    NgbModule,
    DetailRuleTabComponent,
  ],
})
export class SubruleDetails implements OnChanges {
  @Input() productType: string = '';
  @Input() requestType: string = '';
  @Input() mode: string = '';
  @Input() initialSubRules: SubRule[] | [] = [];
  @Input() prevSubRules: SubRule[] | [] = [];
  @Input() dropdownFunction: DropdownRuleFunction[] = [];
  @Input() dropdownDataGroup: DropdownDataGroup[] = [];
  @Input() dropdownOperator: DropdownRuleOperator[] = [];
  @Input() dropdownPipelineType: DropdownPipelineType[] = [];
  @Input() dropdownParameterType: DropdownSubRuleParameterType[] = [];
  @Input() dropdownPipeline: DropdownRulePipeline[] = [];
  @Input() dropdownHistorical: DropdownHistorical[] = [];
  @Input() dropdownEmailTemplate: DropdownEmailTemplate[] = [];
  @Input() dropdownSmsTemplate: DropdownSmsTemplate[] = [];
  @Input() dropdownWaTemplate: DropdownWaTemplate[] = [];
  @Input() dropdownMbNotif: DropdownMbNotif[] = [];
  @Input() dropdownAb: DropdownAb[] = [];
  @Input() dropdownRule: DropdownRule[] = [];

  @Output() getDropdownPipeline = new EventEmitter<string>();

  dropdownParameter: DropdownSubRuleParameter[] = [];

  columns = subruleParamDisplayColumns;

  enumBoolean = enumBoolean;

  tableData: any[] = [];
  tableQuery = { ...PAGE_QUERY_INIT };
  tableInfo = { ...PAGE_INFO_INIT };

  subrulesData: SubRule[] = [];
  subruleData: SubRule = { ...SUBRULE_INIT };
  prevSubrulesData: SubRule[] = [];

  tabs: TabItem[] = [];
  activeTab: string = '';

  private subruleCounterUiId = 1;

  constructor(
    public confirmationDialogService: ConfirmationModalService,
    private readonly ruleService: RuleService,
    private readonly toast: ToastService,
  ) {}

  generateSubruleUiId() {
    return `${this.subruleCounterUiId++}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['initialSubRules'];
    const changePrev = changes['prevSubRules'];

    if (change && change.currentValue) {
      const value = change.currentValue;
      if (Array.isArray(value) && value.length > 0) {
        this.loadSubrulesForm(value);
      }
    }

    if (changePrev && changePrev.currentValue) {
      this.prevSubrulesData = changePrev.currentValue;
    }

    if (this.subrulesData && this.tabs.length > 0) {
      this.handleTabChange(this.tabs[0].value);
    }

    if (this.subrulesData && this.prevSubrulesData && this.tabs.length > 0) {
      this.handleTabChange(this.tabs[0].value);
    }
  }

  loadSubrulesForm(data: any) {
    if (!data.length) return;

    this.subruleCounterUiId = 1;

    this.subrulesData = data.map((s: any) => {
      const uiId = this.generateSubruleUiId();
      return {
        ...s,
        uiId: `Sub-Rule-${uiId}`,
      };
    });

    this.tabs = this.subrulesData.map((s: any) => {
      const splittedName = s.subruleName?.split('-') || [];

      return {
        label: `Sub-Rule ${splittedName[1] ?? ''}`,
        value: s.uiId,
      };
    });
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    this.handleContentChange(tab);
  }

  handleContentChange(tab: string) {
    const findData = this.subrulesData.find((item) => item.uiId === tab);

    if (!findData) {
      console.warn('Subrule not found for tab:', tab);
      return;
    }

    this.subruleData = findData;

    if (this.subruleData.eventType) {
      this.getDropdownSubRuleParameter(this.subruleData.eventType);
    }

    this.generateTable();
  }

  paramsEqual(a: Parameter, b: Parameter): boolean {
    return (
      a.functionName === b.functionName &&
      a.parameter === b.parameter &&
      a.operator === b.operator &&
      a.value === b.value &&
      a.dataGroupId === b.dataGroupId
    );
  }

  getStatusList(
    current: any[],
    previous: any[],
  ): ('changed' | 'not changed')[] {
    const n = current.length;
    const m = previous.length;

    const dp: number[][] = Array.from({ length: n + 1 }, () =>
      new Array(m + 1).fill(0),
    );

    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = this.paramsEqual(current[i], previous[j])
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }

    const statuses: ('changed' | 'not changed')[] = [];
    let i = 0;
    let j = 0;

    while (i < n) {
      if (j < m && this.paramsEqual(current[i], previous[j])) {
        statuses.push('not changed');
        i++;
        j++;
      } else if (j < m && dp[i][j + 1] > dp[i + 1][j]) {
        j++;
      } else {
        statuses.push('changed');
        i++;
      }
    }

    return statuses;
  }

  handleStatusList(
    currentParams: any[],
    requestType: string,
    mode: string,
  ): any[] {
    if (requestType === 'UPDATE') {
      if (mode !== 'DRAFT') {
        return currentParams.map(() => 'changed' as const);
      } else {
        return currentParams.map(() => 'not changed' as const);
      }
    } else {
      return currentParams.map(() => 'not changed' as const);
    }
  }

  generateTable() {
    const start = (this.tableQuery.page - 1) * this.tableQuery.limit;
    const end = start + this.tableQuery.limit;

    const currentParams = this.subruleData.parameters ?? [];

    const findDataPrev = this.prevSubrulesData?.find(
      (item) => item.subruleId === this.subruleData.subruleId,
    );

    const previousParams = findDataPrev?.parameters ?? [];

    const totalElements = currentParams.length;

    this.tableInfo = {
      totalElements,
      totalPages: Math.ceil(totalElements / this.tableQuery.limit),
    };

    const statusList =
      previousParams.length > 0
        ? this.getStatusList(currentParams, previousParams)
        : this.handleStatusList(currentParams, this.requestType, this.mode);

    this.tableData =
      currentParams
        ?.map((x, idx) => {
          const parameters = x.parameter?.split(/[,;]/) ?? [];

          return {
            function: x.functionName ?? ' ',
            parameter1: parameters[0],
            parameter2: parameters[1] ?? ' ',
            operator: x.operator,
            value: x.dataGroupSample
              ? x.dataGroupSample.map((n: any) => `"${n}"`).join(',')
              : x.dataGroupId
                ? this.findLabel('dataGroupSample', x.dataGroupId)
                : x.value === 'false'
                  ? 'False'
                  : x.value === 'true'
                    ? 'True'
                    : x.value
                      ? x.value
                      : ' ',
            dataGroup:
              x.dataGroupName ||
              this.findLabel('dataGroup', x.dataGroupId) ||
              ' ',
            statusChanged: statusList[idx],
          };
        })
        .slice(start, end) ?? [];
  }

  findLabel(key: string, value: any): string {
    switch (key) {
      case 'function':
        return (
          this.dropdownFunction.find((item) => item.functionId === value)
            ?.functionName ?? value
        );

      case 'parameter1':
        return (
          this.dropdownParameter.find((item) => item.parameterValue === value)
            ?.parameterName ?? value
        );

      case 'parameter2':
        return (
          this.dropdownParameter.find((item) => item.parameterValue === value)
            ?.parameterName ?? value
        );

      case 'dataGroup':
        return (
          this.dropdownDataGroup.find((item) => item.dataGroupId === value)
            ?.dataGroupName ?? value
        );

      case 'dataGroupSnapShot':
        return (
          this.dropdownDataGroup.find((item) => item.dataGroupId === value)
            ?.detailSnapshot ?? ' '
        );

      case 'dataGroupSample':
        const findData = this.dropdownDataGroup.find(
          (item) => item.dataGroupId === value,
        );

        if (findData) {
          let dataCount = findData.detailCount;
          let dataValue =
            dataCount > 2
              ? findData.detailSample
                  .slice(0, 2)
                  .map((s: any) => `"${s}"`)
                  .join(',') + ',...'
              : findData.detailSample.map((s: any) => `"${s}"`).join(',');

          return dataValue;
        }

        return '';

      case 'operator':
        return (
          this.dropdownOperator.find((item) => item.operatorId === value)
            ?.operatorName ?? value
        );

      default:
        return '';
    }
  }

  getDropdownSubRuleParameter(parameterType: string) {
    this.ruleService.ruleMasterParameterList(parameterType).subscribe({
      next: (res: any) => {
        this.dropdownParameter = res['data'].map((x: any) =>
          mapDropdownSubRuleParameterApiToDomain(x),
        );
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {},
    });
  }

  subrulePageChange(page: number) {
    this.tableQuery.page = page;
    this.generateTable();
  }
}
