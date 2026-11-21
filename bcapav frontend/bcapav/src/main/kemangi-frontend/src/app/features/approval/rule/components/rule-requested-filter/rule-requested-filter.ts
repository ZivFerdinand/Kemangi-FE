import {
  Component,
  EventEmitter,
  input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import {
  NgbPaginationModule,
  NgbDate,
  NgbCalendar,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

import {
  RuleApprovalQueryFilter,
  RuleApprovalQueryFilterDisplayTemp,
} from '../../domain/models/rule-approval.model';

import { requestType, approvalStatus } from '../../../../../shared';
import {
  DateRangePickerComponent,
  DatePayload,
} from '../../../../../shared/components/date-range-picker/date-range-picker';

import {
  RULE_APPROVAL_PAGE_QUERY_FILTER_INIT,
  RULE_APPROVAL_REQUESTED_LIST_FILTER_DISPLAY_TEMP_INIT,
} from '../../data';

interface User {
  fullName: string;
  userId: string;
}

interface Rule {
  ruleName: string;
  ruleId: string;
}

interface Data {
  filterBy: RuleApprovalQueryFilter;
  filterDisplayTemp: RuleApprovalQueryFilterDisplayTemp;
}

@Component({
  selector: 'app-rule-requested-filter',
  templateUrl: './rule-requested-filter.html',
  styleUrls: [
    './rule-requested-filter.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    NgbPaginationModule,
    DateRangePickerComponent,
  ],
  providers: [DatePipe],
})
export class RuleRequestedFilter {
  approvalStatus = approvalStatus;
  requestType = requestType;

  users = input<User[]>([]);
  rules = input<Rule[]>([]);

  @Output() sendData = new EventEmitter<Data>();

  @Output() handleClearFilter = new EventEmitter();

  filterBy = signal<RuleApprovalQueryFilter>({
    ...RULE_APPROVAL_PAGE_QUERY_FILTER_INIT,
  });

  filterDisplayTemp = signal<RuleApprovalQueryFilterDisplayTemp>({
    ...RULE_APPROVAL_REQUESTED_LIST_FILTER_DISPLAY_TEMP_INIT,
  });

  showFilter = signal<boolean>(false);

  requestFromDate: NgbDate | null = null;
  requestToDate: NgbDate | null = null;
  approval1FromDate: NgbDate | null | any;
  approval1ToDate: NgbDate | null | any;
  approval2FromDate: NgbDate | null | any;
  approval2ToDate: NgbDate | null | any;
  effectiveFromDate: NgbDate | null | any;
  effectiveToDate: NgbDate | null | any;
  maxDate: NgbDate | null | any;

  DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

  DEFAULT_DISPLAY_DATE_FORMAT = 'dd-MMM-yyyy';

  @ViewChild('ruleSelect') ruleSelect!: NgSelectComponent;
  @ViewChild('requesterSelect') requesterSelect!: NgSelectComponent;
  @ViewChild('requestTypeSelect') requestTypeSelect!: NgSelectComponent;
  @ViewChild('approvalStatusSelect') approvalStatusSelect!: NgSelectComponent;
  @ViewChild('approver1Select') approver1Select!: NgSelectComponent;
  @ViewChild('approver2Select') approver2Select!: NgSelectComponent;

  constructor(
    private datePipe: DatePipe,
    private readonly ngbCalendar: NgbCalendar,
  ) {
    this.maxDate = ngbCalendar.getToday();
  }

  toggleFilter() {
    this.showFilter.update((value) => !value);
  }

  updateFilter<K extends keyof ReturnType<typeof this.filterBy>>(
    key: K,
    value: any,
  ) {
    switch (key) {
      case 'ruleName':
        this.filterBy.update((f) => ({ ...f, [key]: value }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          [key]: value,
        }));

        break;

      case 'description':
        this.filterBy.update((f) => ({ ...f, ruleDescription: value }));
        this.filterDisplayTemp.update((f) => ({
          ...f,
          shortDescription: value,
        }));
        break;

      case 'ruleId':
        this.filterBy.update((f) => ({
          ...f,
          [key]: value.map((i: any) => i?.ruleId),
        }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          [key]: value.map((i: any) => i?.ruleId).join(', '),
        }));

        break;

      case 'requesterId':
        this.filterBy.update((f) => ({
          ...f,
          [key]: value.map((i: any) => i?.userId),
        }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          requestedBy: value.map((i: any) => i?.fullName).join(', '),
        }));

        break;

      case 'approver1Id':
        this.filterBy.update((f) => ({
          ...f,
          [key]: value.map((i: any) => i?.userId),
        }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          approved1By: value.map((i: any) => i?.fullName).join(', '),
        }));

        break;

      case 'approver2Id':
        this.filterBy.update((f) => ({
          ...f,
          [key]: value.map((i: any) => i?.userId),
        }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          approved2By: value.map((i: any) => i?.fullName).join(', '),
        }));

        break;

      case 'approvalStatus':
        this.filterBy.update((f) => ({ ...f, [key]: value?.id }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          approvalStatus: value?.name,
        }));

        break;

      case 'requestType':
        this.filterBy.update((f) => ({ ...f, [key]: value?.id }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          [key]: value?.name,
        }));

        break;

      default:
        this.filterBy.update((f) => ({
          ...f,
          [key]: value
            ? this.dateFormatter(value, this.DEFAULT_DATE_FORMAT)
            : '',
        }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          [key]: value
            ? this.dateFormatter(value, this.DEFAULT_DISPLAY_DATE_FORMAT)
            : '',
        }));
    }
  }

  resetFilter() {
    this.showFilter.set(false);
    this.ruleSelect.clearModel();
    this.requesterSelect.clearModel();
    this.requestTypeSelect.clearModel();
    this.approvalStatusSelect.clearModel();
    this.approver1Select.clearModel();
    this.approver2Select.clearModel();

    this.filterBy.set({
      ...RULE_APPROVAL_PAGE_QUERY_FILTER_INIT,
    });

    this.filterDisplayTemp.set({
      ...RULE_APPROVAL_REQUESTED_LIST_FILTER_DISPLAY_TEMP_INIT,
    });

    this.requestFromDate = null;
    this.requestToDate = null;

    this.approval1FromDate = null;
    this.approval1ToDate = null;

    this.approval2FromDate = null;
    this.approval2ToDate = null;

    this.effectiveFromDate = null;
    this.effectiveToDate = null;

    this.handleClearFilter.emit();
  }

  submitFilter() {
    this.showFilter.set(false);

    this.sendData.emit({
      filterBy: this.filterBy(),
      filterDisplayTemp: this.filterDisplayTemp(),
    });
  }

  onFromDateChange(data: DatePayload | null) {
    switch (data?.name) {
      case 'requestDate':
        this.handleRequestDateFrom(data);
        break;
      case 'approval1Date':
        this.handleApproval1DateFrom(data);
        break;
      case 'approval2Date':
        this.handleApproval2DateFrom(data);
        break;
      case 'effectiveDate':
        this.handleEffectiveDateFrom(data);
        break;
    }
  }

  onToDateChange(data: DatePayload | null) {
    switch (data?.name) {
      case 'requestDate':
        this.handleRequestDateTo(data);
        break;
      case 'approval1Date':
        this.handleApproval1DateTo(data);
        break;
      case 'approval2Date':
        this.handleApproval2DateTo(data);
        break;
      case 'effectiveDate':
        this.handleEffectiveDateTo(data);
        break;
    }
  }

  handleEffectiveDateFrom(data: DatePayload | null) {
    this.effectiveFromDate = data?.date || null;

    if (this.effectiveFromDate) {
      this.updateFilter('effectiveDateFrom', this.effectiveFromDate);
      return;
    }

    this.updateFilter('effectiveDateFrom', null);
  }

  handleEffectiveDateTo(data: DatePayload | null) {
    this.effectiveToDate = data?.date || null;

    if (this.effectiveToDate) {
      this.updateFilter('effectiveDateTo', this.effectiveToDate);
      return;
    }

    this.updateFilter('effectiveDateTo', null);
  }

  handleRequestDateFrom(data: DatePayload | null) {
    this.requestFromDate = data?.date || null;

    if (this.requestFromDate) {
      this.updateFilter('requestDateFrom', this.requestFromDate);
      return;
    }

    this.updateFilter('requestDateFrom', null);
  }

  handleRequestDateTo(data: DatePayload | null) {
    this.requestToDate = data?.date || null;

    if (this.requestToDate) {
      this.updateFilter('requestDateTo', this.requestToDate);
      return;
    }

    this.updateFilter('requestDateTo', null);
  }

  handleApproval1DateFrom(data: DatePayload | null) {
    this.approval1FromDate = data?.date || null;

    if (this.approval1FromDate) {
      this.updateFilter('approval1DateFrom', this.approval1FromDate);
      return;
    }

    this.updateFilter('approval1DateFrom', null);
  }

  handleApproval1DateTo(data: DatePayload | null) {
    this.approval1ToDate = data?.date || null;

    if (this.approval1ToDate) {
      this.updateFilter('approval1DateTo', this.approval1ToDate);
      return;
    }

    this.updateFilter('approval1DateTo', null);
  }

  handleApproval2DateFrom(data: DatePayload | null) {
    this.approval2FromDate = data?.date || null;

    if (this.approval2FromDate) {
      this.updateFilter('approval2DateFrom', this.approval2FromDate);
      return;
    }

    this.updateFilter('approval2DateFrom', null);
  }

  handleApproval2DateTo(data: DatePayload | null) {
    this.approval2ToDate = data?.date || null;

    if (this.approval2ToDate) {
      this.updateFilter('approval2DateTo', this.approval2ToDate);
      return;
    }

    this.updateFilter('approval2DateTo', null);
  }

  dateFormatter(date: NgbDate, format: string) {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return this.datePipe.transform(jsDate, format);
  }
}
