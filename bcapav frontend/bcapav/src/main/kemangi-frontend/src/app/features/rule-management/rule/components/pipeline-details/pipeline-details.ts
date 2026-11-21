import {
  Input,
  Component,
  OnChanges,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tap, catchError, throwError } from 'rxjs';

import { ToastService } from '../../../../../core/services/toast.service';
import { RuleService } from '../../api/services/rule.service';
import {
  pipelineColumnsV2Aggregation,
  pipelineColumnsV2GetBalance,
  pipelineColumnsV2GetHistorical,
  pipelineColumnsV2RealTimeHistorical,
  pipelineColumnsV2Journey,
  pipelineColumnsV2Watchlist,
  pipelineColumnsV2Null,
} from '../../../../../features/approval/rule/data';
import { SUBRULE_INIT, PIPELINE_INIT } from '../../data';
import {
  TabItem,
  SubRule,
  Pipeline,
  PipelineDetail,
} from '../../domain/rule.model';

import { PipelineTableV2 } from '../pipeline-table-v2/pipeline-table-v2';
import {
  DropdownPipelineType,
  DropdownRuleFunction,
  DropdownRuleOperator,
  DropdownRulePipeline,
  DropdownSubRuleParameter,
  DropdownDataGroup,
  DropdownRule,
  DropdownHistorical,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import {
  enumBoolean,
  timeUnits,
  ttlTypes,
  PAGE_QUERY_INIT,
  PAGE_INFO_INIT,
} from '../../../../../shared';
import {
  mapDropdownSubRuleParameterApiToDomain,
  mapDropdownDataGroupApiToDomain,
} from '../../../../approval/rule/mappers/rule-approval.mapper';
import {
  balanceTimings,
  valueOperations,
  valueOperations2,
  initCriteria,
  DROPDOWN_EVENT_TYPE_GROUPED_OPTIONS,
} from '../../data';

import { DetailRuleTabComponent } from '../detail-tab/detail-rule-tab';

@Component({
  selector: 'app-pipeline-details',
  standalone: true,
  templateUrl: './pipeline-details.html',
  styleUrls: [
    './pipeline-details.scss',
    '../../../../../shared/styles/index.scss',
  ],
  imports: [
    NgSelectModule,
    CommonModule,
    FormsModule,
    PipelineTableV2,
    DetailRuleTabComponent,
  ],
})
export class PipelineDetails implements OnChanges {
  @Input() dropdownPipelineType: DropdownPipelineType[] = [];
  @Input() dropdownFunction: DropdownRuleFunction[] = [];
  @Input() dropdownOperator: DropdownRuleOperator[] = [];
  @Input() dropdownPipeline: DropdownRulePipeline[] = [];
  @Input() dropdownRule: DropdownRule[] = [];
  @Input() dropdownHistorical: DropdownHistorical[] = [];
  @Input() requestType: string = '';
  @Input() data: SubRule = { ...SUBRULE_INIT };
  @Input() prevData: SubRule[] = [];
  @Input() hasPipeline: boolean = false;
  @Input() mode: string = '';

  @Output() getDropdownPipeline = new EventEmitter<string>();

  prevSubrulesData: SubRule[] = [];
  subruleData: SubRule = { ...SUBRULE_INIT };
  prevSubruleData: SubRule | null = null;

  columns: any[] = [];
  fullTableData: any[] = [];
  tableData: any[] = [];
  tableQuery = { ...PAGE_QUERY_INIT };
  tableInfo = { ...PAGE_INFO_INIT };
  displayPipelineCustomData: any = null;

  pipelines: Pipeline[] = [];
  pipeline: Pipeline = { ...PIPELINE_INIT };

  enumBoolean = enumBoolean;
  timeUnits = timeUnits;
  ttlTypes = ttlTypes;
  balanceTimings = balanceTimings;
  valueOperations2 = valueOperations2;
  valueOperations = valueOperations;

  dropdownEventTypeGroupedOptions = DROPDOWN_EVENT_TYPE_GROUPED_OPTIONS;
  dropdownDataGroup: DropdownDataGroup[] = [];
  dropdownParameter: DropdownSubRuleParameter[] = [];

  tabs: TabItem[] = [];
  activeTab: string = '';

  private pipelineCounter = 1;

  constructor(
    public confirmationDialogService: ConfirmationModalService,
    private readonly ruleService: RuleService,
    private readonly toast: ToastService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      const data = changes['data'].currentValue;

      this.loadSubrule(data);
    }

    if (changes['prevData']) {
      const data = changes['prevData'].currentValue;

      this.prevSubrulesData = data;
    }

    if (this.prevSubrulesData) {
      const findData = this.prevSubrulesData.find(
        (x) => x.subruleId === this.subruleData.subruleId,
      );

      if (findData) {
        this.prevSubruleData = findData;
      }
    }
  }

  getDropdownSubRuleParameter(parameterType: string) {
    this.ruleService.ruleMasterParameterList(parameterType).subscribe({
      next: (res: any) => {
        this.dropdownParameter = res['data'].map((x: any) =>
          mapDropdownSubRuleParameterApiToDomain(x),
        );

        this.dropdownEventTypeGroupedOptions = (
          this.dropdownEventTypeGroupedOptions || []
        ).map((group) => {
          if (group.group === 'Event Type') {
            return {
              ...group,
              items: (this.dropdownParameter || []).map((param) => ({
                name: param?.parameterValue ?? '',
                value: param?.parameterValue ?? '',
              })),
            };
          }

          return group;
        });
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {},
    });
  }

  getDropdownDataGroup() {
    return this.ruleService.ruleMasterDataGroupList(true).pipe(
      tap((res: any) => {
        this.dropdownDataGroup = res['data'].map((x: any) =>
          mapDropdownDataGroupApiToDomain(x),
        );
      }),
      catchError((e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }

        return throwError(() => e);
      }),
    );
  }

  generatePipelineUiId() {
    return `Pipeline-${this.pipelineCounter++}`;
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    this.handleContentChange(tab);
  }

  handleContentChange(tab: string) {
    const findData = this.pipelines.find((item) => item.uiId === tab);

    if (findData) {
      this.pipeline = findData;
      this.generateTable(findData);
    }

    if (findData?.pipelineCustomData) {
      this.loadPipelineCustomData(findData?.pipelineCustomData);
    }
  }

  private loadSubrule(subrule: SubRule) {
    if (!subrule?.pipelines?.length && !subrule?.pipelineCustom?.length) return;

    this.subruleData = { ...subrule };

    this.getDropdownDataGroup().subscribe({
      next: () => {
        this.pipelineCounter = 1;

        const pipelines = subrule.pipelines ?? [];
        const pipelineCustomData = subrule.pipelineCustom ?? [];

        this.pipelines = [
          ...pipelines.map((s: any) => {
            const uiId = this.generatePipelineUiId();

            return {
              ...s,
              uiId,
            };
          }),
          ...pipelineCustomData
            .filter((s: any) => s.schemaJson !== '')
            .map((s: any) => {
              const uiId = this.generatePipelineUiId();

              return {
                ...s,
                uiId,
                pipelineType: 'CUSTOM',
                pipelineDetails: [],
                pipelineCustomData: s.schemaJson,
              };
            }),
        ];

        this.tabs = this.pipelines.map((s: Pipeline) => ({
          label: s.pipelineType,
          value: s.uiId ?? '',
        }));

        const firstTab = this.tabs[0];

        if (firstTab?.value) {
          this.handleTabChange(firstTab.value);
        }
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  createTable(pipeline: Pipeline): any[] {
    switch (pipeline.pipelineType) {
      case 'AGGREGATION':
        this.columns = pipelineColumnsV2Aggregation;

        return pipeline.pipelineDetails.map((y: PipelineDetail) => {
          const functionType = y.detail?.function
            ? this.findFunctionEventType(y.detail.function)
            : null;

          const splitEvent = y.detail?.eventType
            ? y.detail.eventType.split(',')
            : [];

          return {
            ...y.detail,
            pipelineType: pipeline.pipelineType,
            eventType: splitEvent[0] ?? null,
            ttlType: y.detail?.ttlType
              ? this.findLabel('ttlType', y.detail?.ttlType)
              : y.detail?.ttlType,
            unit: y.detail?.unit
              ? this.findLabel('unit', y.detail?.unit)
              : y.detail?.unit,
            groupBy:
              splitEvent.length > 1 ? splitEvent.slice(1).join(', ') : null,
            varName: y.varName,
          };
        });

      case 'GETBALANCE':
        this.columns = pipelineColumnsV2GetBalance;

        return pipeline.pipelineDetails.map((y: any) => {
          const criteria = y.detail?.criteria
            ? Object.fromEntries(
                y.detail?.criteria.map((item: any) => [item.key, item.value]),
              )
            : null;

          return {
            ...y.detail,
            pipelineType: pipeline.pipelineType,
            criteria: { ...initCriteria, ...criteria },
            ttlType: y.detail.ttlType
              ? this.findLabel('ttlType', y.detail.ttlType)
              : y.detail.ttlType,
            unit: y.detail.unit
              ? this.findLabel('unit', y.detail.unit)
              : y.detail.unit,
            varName: y.varName,
          };
        });

      case 'GETHISTORICAL':
        this.columns = pipelineColumnsV2GetHistorical;

        return pipeline.pipelineDetails.map((y: PipelineDetail) => {
          const splitOutcome = y.detail?.outcome
            ? y.detail.outcome.split(',')
            : [];

          const criteria = y.detail?.criteria
            ? Object.fromEntries(
                y.detail?.criteria.map((item: any) => [item.key, item.value]),
              )
            : null;

          return {
            ...y.detail,
            pipelineType: pipeline.pipelineType,
            criteria: { ...initCriteria, ...criteria },
            ttlType: y.detail?.ttlType
              ? this.findLabel('ttlType', y.detail.ttlType)
              : y.detail?.ttlType,
            unit: y.detail?.unit
              ? this.findLabel('unit', y.detail.unit)
              : y.detail?.unit,
            outcome: splitOutcome.length > 0 ? splitOutcome[0] : null,
            outcomeExtra: splitOutcome.length > 1 ? splitOutcome[1] : null,
            varName: y.varName,
          };
        });

      case 'REALTIMEHISTORICAL':
        this.columns = pipelineColumnsV2RealTimeHistorical;

        return pipeline.pipelineDetails.map((y: any) => {
          const criteria = y.detail?.criteria
            ? Object.fromEntries(
                y.detail?.criteria.map((item: any) => [item.key, item.value]),
              )
            : null;

          return {
            ...y.detail,
            pipelineType: pipeline.pipelineType,
            criteria: { ...initCriteria, ...criteria },
            ttlType: y.detail.ttlType
              ? this.findLabel('ttlType', y.detail.ttlType)
              : y.detail.ttlType,
            unit: y.detail.unit
              ? this.findLabel('unit', y.detail.unit)
              : y.detail.unit,
            varName: y.varName,
          };
        });

      case 'JOURNEY':
        this.columns = pipelineColumnsV2Journey;

        return pipeline.pipelineDetails.map((y: any) => {
          const criteria = y.detail?.criteria
            ? Object.fromEntries(
                y.detail?.criteria.map((item: any) => [item.key, item.value]),
              )
            : null;

          return {
            ...y.detail,
            pipelineType: pipeline.pipelineType,
            criteria: { ...initCriteria, ...criteria },
            ttlType: y.detail.ttlType
              ? this.findLabel('ttlType', y.detail.ttlType)
              : y.detail.ttlType,
            unit: y.detail.unit
              ? this.findLabel('unit', y.detail.unit)
              : y.detail.unit,
            varName: y.varName,
            value:
              y.detail.value === 'true'
                ? 'True'
                : y.detail.value === 'false'
                  ? 'False'
                  : y.detail.value,
          };
        });

      case 'WATCHLIST':
        this.columns = pipelineColumnsV2Watchlist;

        return pipeline.pipelineDetails.map((y: any) => {
          const criteria = y.detail?.criteria
            ? Object.fromEntries(
                y.detail?.criteria.map((item: any) => [item.key, item.value]),
              )
            : null;

          return {
            ...y.detail,
            pipelineType: pipeline.pipelineType,
            criteria: { ...initCriteria, ...criteria },
            ttlType: y.detail.ttlType
              ? this.findLabel('ttlType', y.detail.ttlType)
              : y.detail.ttlType,
            unit: y.detail.unit
              ? this.findLabel('unit', y.detail.unit)
              : y.detail.unit,
            varName: y.varName,
            value:
              y.detail.value === 'true'
                ? 'True'
                : y.detail.value === 'false'
                  ? 'False'
                  : y.detail.value,
          };
        });

      default:
        this.columns = pipelineColumnsV2Null;
        return pipeline.pipelineDetails.map((y: PipelineDetail) => {
          const splitEvent = y.detail?.eventType
            ? y.detail.eventType.split(',')
            : [];

          return {
            ...y.detail,
            pipelineType: pipeline.pipelineType,
            eventType: splitEvent.length > 0 ? splitEvent[0] : null,
            ttlType: y.detail?.ttlType
              ? this.findLabel('ttlType', y.detail.ttlType)
              : y.detail?.ttlType,
            unit: y.detail?.unit
              ? this.findLabel('unit', y.detail.unit)
              : y.detail?.unit,
            eventTypeExtra:
              splitEvent.length > 1 ? splitEvent.slice(1).join(', ') : null,
            varName: y.varName,
          };
        });
    }
  }

  findLabel(key: string, value: any): string {
    switch (key) {
      case 'function':
        return (
          this.dropdownFunction.find((item) => item.functionId === value)
            ?.functionName ?? value
        );

      case 'unit':
        return (
          this.timeUnits.find((item) => item.value === value)?.label ?? value
        );

      case 'ttlType':
        return (
          this.ttlTypes.find((item) => item.value === value)?.label ?? value
        );

      case 'dataGroup':
        return (
          this.dropdownDataGroup.find((item) => item.dataGroupId === value)
            ?.dataGroupName ?? value
        );

      case 'historical':
        return (
          this.dropdownHistorical.find((item) => item.historicalId === value)
            ?.tableHistorical ?? value
        );

      case 'operator':
        return (
          this.dropdownOperator.find((item) => item.operatorId === value)
            ?.operatorName ?? value
        );

      default:
        return '';
    }
  }

  findFunctionEventType(functionName: string): string {
    const findFormula = this.dropdownFunction.find(
      (x) => x.functionName === functionName,
    )?.functionFormula;

    if (findFormula) {
      return this.getInputType(findFormula);
    }

    return 'multiple';
  }

  getInputType(str: string): 'single' | 'multiple' {
    const match = str.match(/\{([^}]*)\}/);

    if (!match) return 'single';

    const content = match[1];

    return content.includes(',') ? 'multiple' : 'single';
  }

  pageChange(page: number) {
    this.tableQuery.page = page;

    this.applyPagination();
  }

  normalize(val: any): string {
    if (val === null || val === undefined) return '';
    return String(val).trim();
  }

  deepEqual(a: any, b: any, currentKey?: string): boolean {
    if (a === b) return true;
    if (a == null || b == null) return a === b;
    if (typeof a !== typeof b) return false;

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;

      if (currentKey === 'criteria') {
        const sortedA = [...a].sort((x, y) => x.key.localeCompare(y.key));

        const sortedB = [...b].sort((x, y) => x.key.localeCompare(y.key));

        return sortedA.every((item, idx) => this.deepEqual(item, sortedB[idx]));
      }

      return a.every((item, idx) => this.deepEqual(item, b[idx]));
    }

    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);

      if (keysA.length !== keysB.length) return false;

      return keysA.every((key) => this.deepEqual(a[key], b[key], key));
    }

    return this.normalize(a) === this.normalize(b);
  }

  getPipelineDetailStatusList(
    currentDetails: PipelineDetail[],
    prevDetails: PipelineDetail[],
  ): ('changed' | 'not changed')[] {
    return currentDetails.map((detail, idx) => {
      const prevDetail = prevDetails[idx];
      if (!prevDetail) return 'changed';
      const isChanged = !this.deepEqual(detail.detail, prevDetail.detail);
      return isChanged ? 'changed' : 'not changed';
    });
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

  generateTable(pipeline: Pipeline) {
    const start = (this.tableQuery.page - 1) * this.tableQuery.limit;
    const end = start + this.tableQuery.limit;

    const totalElements = pipeline.pipelineDetails.length;

    this.tableInfo = {
      totalElements,
      totalPages: Math.ceil(totalElements / this.tableQuery.limit),
    };

    const currentPipelines =
      this.pipelines.filter((x) => x.pipelineType === pipeline.pipelineType) ??
      [];
    const prevPipelines = this.prevSubruleData?.pipelines ?? [];

    const occurrenceIndex = this.getOccurrenceIndex(pipeline, currentPipelines);

    const filteredPrevPipelines = prevPipelines.filter(
      (p) =>
        this.normalize(p.pipelineType) ===
        this.normalize(pipeline.pipelineType),
    );
    const matchedPrevPipeline = filteredPrevPipelines[occurrenceIndex];

    const statusList = matchedPrevPipeline
      ? this.getPipelineDetailStatusList(
          pipeline.pipelineDetails,
          matchedPrevPipeline.pipelineDetails,
        )
      : this.handleStatusList(
          pipeline.pipelineDetails,
          this.requestType,
          this.mode,
        );

    const table = this.createTable(pipeline).map((row, idx) => ({
      ...row,
      statusChanged: statusList[idx],
    }));

    this.fullTableData = table;

    this.tableData = table.slice(start, end) ?? [];
  }

  getOccurrenceIndex(pipeline: Pipeline, allPipelines: Pipeline[]): number {
    const sameType = allPipelines.filter(
      (p) =>
        this.normalize(p.pipelineType) ===
        this.normalize(pipeline.pipelineType),
    );

    return sameType.indexOf(pipeline);
  }

  applyPagination() {
    const start = (this.tableQuery.page - 1) * this.tableQuery.limit;
    const end = start + this.tableQuery.limit;

    this.tableData = this.fullTableData.slice(start, end) ?? [];
  }

  loadPipelineCustomData(data: any) {
    const cleanedData = data.trim().replace(/^"|"$/g, '');

    this.displayPipelineCustomData = JSON.parse(`[${cleanedData}]`)
      .map((item: any) => JSON.stringify(item, null, 2))
      .join(',\n');
  }
}
