import {
  Component,
  TemplateRef,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PAGE_QUERY_INIT, TableComponent } from '../../../../../shared';
import { autoActionListColumns, SUBRULE_INIT } from '../../data';
import { DetailRuleTabComponent } from '../../../../rule-management/rule/components/detail-tab/detail-rule-tab';

import { SubRule, AutoAction } from '../../domain/rule.model';
import {
  AUTO_ACTION_INIT,
  channelType,
  timeUnitOptions,
} from '../../../../../features/approval/rule/data';
import { TabProps, PAGE_INFO_INIT } from '../../../../../shared';
import {
  DropdownEmailTemplate,
  DropdownSmsTemplate,
  DropdownWaTemplate,
  DropdownMbNotif,
  DropdownAb,
  DropdownSubRuleParameter,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import {
  mapDropdownSubRuleParameterApiToDomain,
  mapDropdownSmsApiToDomain,
  mapDropdownWaApiToDomain,
  mapDropdownMbNotifApiToDomain,
  mapDropdownEmailTemplateApiToDomain,
  mapDropdownAbApiToDomain,
} from '../../../../approval/rule/mappers/rule-approval.mapper';
import { RuleService } from '../../api/services/rule.service';
import { RuleApprovalService } from '../../../../approval/rule/api/services/rule-approval.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChannelTypeEmailDetails } from '../channel-type-email-details/channel-type-email-details';
import { ChannelTypeAutoBlockDetails } from '../channel-type-auto-block-details/channel-type-auto-block-details';
import { ChannelTypeMbcaDetails } from '../channel-type-mbca-details/channel-type-mbca-details';
import { ChannelTypeSmsDetails } from '../channel-type-sms-details/channel-type-sms-details';
import { ChannelTypeWaDetails } from '../channel-type-wa-details/channel-type-wa-details';

@Component({
  selector: 'app-auto-action-details',
  templateUrl: './auto-action-details.html',
  styleUrls: [
    './auto-action-details.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DetailRuleTabComponent,
    TableComponent,
    NgSelectModule,
    ChannelTypeEmailDetails,
    ChannelTypeAutoBlockDetails,
    ChannelTypeMbcaDetails,
    ChannelTypeSmsDetails,
    ChannelTypeWaDetails,
  ],
  providers: [],
})
export class AutoActionDetails implements OnChanges {
  @Input() subrulesData: SubRule[] = [];
  @Input() prevSubrulesData: SubRule[] = [];
  @Input() productType: string = '';
  @Input() requestType: string = '';
  @Input() mode: string = '';

  currentData: SubRule[] = [];
  prevData: SubRule[] = [];

  subruleData: SubRule = { ...SUBRULE_INIT };
  tabs: TabProps[] = [];
  activeTab: string = '';

  columns: any[] = autoActionListColumns;

  tableData: any[] = [];
  tableQuery = { ...PAGE_QUERY_INIT };
  tableInfo = { ...PAGE_INFO_INIT };
  fullTableData: any[] = [];

  channelTabs: any[] = [];
  channelActiveTab: string = '';

  dropdownChannelType = channelType;
  dropdownEmailTemplate: DropdownEmailTemplate[] = [];
  dropdownParameter: DropdownSubRuleParameter[] = [];
  dropdownSmsTemplate: DropdownSmsTemplate[] = [];
  dropdownWaTemplate: DropdownWaTemplate[] = [];
  dropdownMbNotif: DropdownMbNotif[] = [];
  dropdownAb: DropdownAb[] = [];

  selectedValues: any[] = [];

  autoActionData: AutoAction = { ...AUTO_ACTION_INIT };

  channelType: any[] = channelType;
  timeUnitOptions: any[] = timeUnitOptions;

  modalRef!: NgbModalRef;

  private modalService = inject(NgbModal);

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['subrulesData'];
    const changePrev = changes['prevSubrulesData'];

    if (change && change.currentValue) {
      const value = change.currentValue;

      if (Array.isArray(value) && value.length > 0) {
        this.loadSubrulesData(value);
      }
    }

    if (changePrev && changePrev.currentValue) {
      const value = changePrev.currentValue;

      if (Array.isArray(value) && value.length > 0) {
        this.prevData = value;
      }
    }

    if (this.currentData) {
      this.generateTable();
    }

    if (this.currentData && this.prevData) {
      this.generateTable();
    }
  }

  constructor(
    private readonly toast: ToastService,
    private readonly ruleService: RuleService,
    private readonly ruleApprovalService: RuleApprovalService,
  ) {}

  loadSubrulesData(data: any) {
    if (!data.length) return;

    this.tabs = this.subrulesData
      .filter((s: any) => s.autoAction?.length > 0)
      .map((s: any) => {
        const splittedName = s.subruleName.split('-');
        return {
          label: `Sub-Rule ${splittedName[1]}`,
          value: s.uiId,
        };
      });

    this.currentData = this.subrulesData;

    this.getDropdownEmailTemplate(this.productType);
    this.getDropdownSmsTemplate();
    this.getDropdownWaTemplate();
    this.getDropdownMbNotif();
    this.getDropdownAbTemplate();

    //this.generateTable();
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

    this.channelActiveTab = '';

    this.subruleData = findData;

    this.getDropdownParameter(findData.eventType || '');

    if (this.subruleData.autoAction.length > 0) {
      this.selectedValues = (this.subruleData.autoAction ?? []).map((x) => {
        return {
          label:
            x.channelType === 'AUTOBLOCK'
              ? 'AUTO BLOCK'
              : x.channelType === 'MBNOTIF'
                ? 'MBCA'
                : x.channelType,
          value: x.channelType,
        };
      });

      if (this.selectedValues.length > 0) {
        this.handleActionTypeActive(this.selectedValues[0].label);
      }
    }
  }

  subrulePageChange(page: number) {
    this.tableQuery.page = page;

    this.applyPagination();
  }

  ////

  normalize = (val: any): string => {
    if (val === null || val === undefined) return '';
    return String(val).trim();
  };

  autoActionEqual = (a: any, b: any): boolean => {
    return (
      this.normalize(a.channelType) === this.normalize(b.channelType) &&
      this.normalize(a.description) === this.normalize(b.description) &&
      this.normalize(a.templateId) === this.normalize(b.templateId) &&
      this.normalize(a.key) === this.normalize(b.key) &&
      this.normalize(a.limitFlag) === this.normalize(b.limitFlag) &&
      this.normalize(a.period) === this.normalize(b.period) &&
      this.normalize(a.unit) === this.normalize(b.unit) &&
      this.normalize(a.threshold) === this.normalize(b.threshold)
    );
  };

  getStatusListByChannelType(
    current: any[],
    previous: any[],
  ): ('changed' | 'not changed')[] {
    const prevMap = new Map<string, any>();
    previous.forEach((p) => {
      prevMap.set(this.normalize(p.channelType), p);
    });

    return current.map((curr) => {
      const match = prevMap.get(this.normalize(curr.channelType));

      if (!match) {
        return 'not changed';
      }

      const isChanged = !this.autoActionEqual(curr, match);

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

  generateTable() {
    const autoActionData = this.currentData.flatMap((item) => {
      const findDataPrev = this.prevData?.find(
        (prevItem) => prevItem.subruleId === item.subruleId,
      );

      const prevAutoAction = findDataPrev?.autoAction ?? [];

      const currentAutoAction = (item.autoAction ?? []).filter(
        (action) => action.channelType,
      );

      const statusList =
        prevAutoAction.length > 0
          ? this.getStatusListByChannelType(currentAutoAction, prevAutoAction)
          : this.handleStatusList(
              currentAutoAction,
              this.requestType,
              this.mode,
            );

      return currentAutoAction.map((action, idx) => {
        const splittedName = item.subruleName.split('-') || [];

        return {
          subrule: `Sub-Rule ${splittedName[1] ?? ''}`,
          channel:
            action.channelType === 'AUTOBLOCK'
              ? 'AUTO BLOCK'
              : action.channelType === 'MBNOTIF'
                ? 'MBCA'
                : action.channelType,
          description: action.description,
          statusChanged: statusList[idx],
        };
      });
    });

    this.fullTableData = autoActionData;

    const totalElements = autoActionData.length;

    this.tableInfo = {
      totalElements,
      totalPages: Math.ceil(totalElements / this.tableQuery.limit),
    };

    this.applyPagination();
  }

  ///

  handleActionTypeActive(type: string) {
    this.channelActiveTab = type;
    this.handleActionTypeContent(type);
  }

  handleActionTypeContent(type: string) {
    const typeName =
      type === 'AUTO BLOCK' ? 'AUTOBLOCK' : type === 'MBCA' ? 'MBNOTIF' : type;

    const findData = this.subruleData.autoAction.find(
      (x) => x.channelType === typeName,
    );

    if (findData) {
      this.autoActionData = {
        ...findData,
        channelType: findData.channelType ?? '',
        key: findData.key ?? '',
        description: findData.description ?? '',
      };
    }
  }

  handleDeleteActionType(type: string) {
    this.selectedValues = [
      ...this.selectedValues.filter((item: any) => item != type),
    ];
  }

  actionTypeSelected(): any[] {
    return this.channelType.filter((item) =>
      this.selectedValues.includes(item.value),
    );
  }

  toggleSelection(item: any) {
    const index = this.selectedValues.indexOf(item.value);

    if (index > -1) {
      this.selectedValues.splice(index, 1);
    } else {
      this.selectedValues.push(item.value);
    }

    this.selectedValues = [...this.selectedValues];
  }

  getDropdownEmailTemplate(productType: string) {
    this.ruleService.ruleMasterEmailTemplateList(productType).subscribe({
      next: (res: any) => {
        this.dropdownEmailTemplate = res['data'].map((x: any) =>
          mapDropdownEmailTemplateApiToDomain(x),
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

  getDropdownParameter(eventType: string) {
    this.ruleService.ruleMasterParameterList(eventType).subscribe({
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

  getDropdownSmsTemplate() {
    this.ruleApprovalService.dropdownSmsTemplate().subscribe({
      next: (res: any) => {
        this.dropdownSmsTemplate = res['data'].map((x: any) =>
          mapDropdownSmsApiToDomain(x),
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

  getDropdownWaTemplate() {
    this.ruleApprovalService.dropdownWaTemplate().subscribe({
      next: (res: any) => {
        this.dropdownWaTemplate = res['data'].map((x: any) =>
          mapDropdownWaApiToDomain(x),
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

  getDropdownMbNotif() {
    this.ruleApprovalService.dropdownMbTemplate().subscribe({
      next: (res: any) => {
        this.dropdownMbNotif = res['data'].map((x: any) =>
          mapDropdownMbNotifApiToDomain(x),
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

  getDropdownAbTemplate() {
    this.ruleApprovalService.dropdownAbTemplate().subscribe({
      next: (res: any) => {
        this.dropdownAb = res['data'].map((x: any) =>
          mapDropdownAbApiToDomain(x),
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

  findLabel(key: string, value: any): string {
    switch (key) {
      case 'channelType':
        return (
          this.dropdownChannelType.find((item) => item.value === value.value)
            ?.label ?? ''
        );

      default:
        return '';
    }
  }

  isSelected(item: any) {
    return this.selectedValues?.includes(item.value);
  }

  applyPagination() {
    const start = (this.tableQuery.page - 1) * this.tableQuery.limit;
    const end = start + this.tableQuery.limit;

    this.tableData = this.fullTableData.slice(start, end) ?? [];
  }

  handleSortChange(direction: 'asc' | 'desc', key: string) {
    // this.tableQuery = { ...this.tableQuery, sort: key, sortDir: 'asc' };

    this.tableData = [...this.tableData].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return 1;
      if (valueB == null) return -1;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      }

      // Fallback for mixed/unexpected types -> compare as strings
      return direction === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });

    //this.applyPagination();
  }

  open(content: TemplateRef<any>) {
    this.handleTabChange(this.tabs[0].value);
    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-auto-action',
      centered: true,
      size: 'xl',
    });
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
