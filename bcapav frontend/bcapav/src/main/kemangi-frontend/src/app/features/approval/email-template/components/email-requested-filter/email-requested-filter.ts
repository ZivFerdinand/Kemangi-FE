import {
  Component,
  EventEmitter,
  input,
  Input,
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
} from '@ng-bootstrap/ng-bootstrap';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

import {
  DateRangePickerComponent,
  DatePayload,
} from '../../../../../shared/components/date-range-picker/date-range-picker';
import {
  EmailRequestedFilterQuery,
  EmailRequestedFilterDisplayTemp,
} from '../../domain/email-approval.model';
import { requestType, approvalStatus } from '../../../../../shared';
import {
  EMAIL_TEMPL_REQUESTED_FILTER_QUERY_INIT,
  EMAIL_TEMPL_REQUESTED_FILTER_DISPLAY_TEMP_INIT,
} from './../../data/init';
import {
  DropdownEmailTemplate,
  DropdownProductGroup,
  DropdownTemplateType,
} from '../../../rule/domain/models/rule-approval.model';

interface User {
  fullName: string;
  userId: string;
}

interface Data {
  filterBy: EmailRequestedFilterQuery;
  filterDisplayTemp: EmailRequestedFilterDisplayTemp;
}

@Component({
  selector: 'app-email-requested-filter',
  templateUrl: './email-requested-filter.html',
  styleUrls: [
    './email-requested-filter.scss',
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
export class EmailRequestedFilter {
  approvalStatus = approvalStatus;
  requestType = requestType;

  @Input() users: User[] = [];

  @Input() productTypes: DropdownProductGroup[] = [];

  @Input() emailTemplates: DropdownEmailTemplate[] = [];

  @Input() templateTypes: DropdownTemplateType[] = [];

  @Output() sendData = new EventEmitter<Data>();

  @Output() handleClearFilter = new EventEmitter();

  filterBy = signal<EmailRequestedFilterQuery>({
    ...EMAIL_TEMPL_REQUESTED_FILTER_QUERY_INIT,
  });

  filterDisplayTemp = signal<EmailRequestedFilterDisplayTemp>({
    ...EMAIL_TEMPL_REQUESTED_FILTER_DISPLAY_TEMP_INIT,
  });

  showFilter = signal<boolean>(false);

  requestFromDate: NgbDate | null = null;
  requestToDate: NgbDate | null = null;
  approvalFromDate: NgbDate | null = null;
  approvalToDate: NgbDate | null = null;
  maxDate: NgbDate | null = null;

  DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

  DEFAULT_DISPLAY_DATE_FORMAT = 'dd-MMM-yyyy';

  @ViewChild('templateIdSelect') templateIdSelect!: NgSelectComponent;
  @ViewChild('templateTypeSelect') templateTypeSelect!: NgSelectComponent;
  @ViewChild('productTypeSelect') productTypeSelect!: NgSelectComponent;
  @ViewChild('requesterSelect') requesterSelect!: NgSelectComponent;
  @ViewChild('approverSelect') approverSelect!: NgSelectComponent;
  @ViewChild('requestTypeSelect') requestTypeSelect!: NgSelectComponent;
  @ViewChild('approvalStatusSelect') approvalStatusSelect!: NgSelectComponent;

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

      case 'approverId':
        this.filterBy.update((f) => ({
          ...f,
          [key]: value.map((i: any) => i?.userId),
        }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          reviewedBy: value.map((i: any) => i?.fullName).join(', '),
        }));

        break;

      case 'emailTemplateId':
        this.filterBy.update((f) => ({
          ...f,
          emailTemplateId: value.map((i: any) => i?.id),
        }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          templateId: value.map((i: any) => i?.templateId).join(', '),
        }));

        break;

      case 'productType':
        this.filterBy.update((f) => ({ ...f, [key]: value?.productGroup }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          product: value?.productGroupName,
        }));

        break;

      case 'approvalStatus':
        this.filterBy.update((f) => ({ ...f, [key]: value?.id }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          approvalStatus: value?.name,
        }));

        break;

      case 'name':
        this.filterBy.update((f) => ({ ...f, [key]: value }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          [key]: value,
        }));

        break;

      case 'templateType':
        this.filterBy.update((f) => ({ ...f, [key]: value?.templateType }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          [key]: value?.templateType,
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
    this.templateIdSelect.clearModel();
    this.templateTypeSelect.clearModel();
    this.productTypeSelect.clearModel();
    this.requesterSelect.clearModel();
    this.approverSelect.clearModel();
    this.requestTypeSelect.clearModel();
    this.approvalStatusSelect.clearModel();

    this.filterBy.set({
      ...EMAIL_TEMPL_REQUESTED_FILTER_QUERY_INIT,
    });

    this.filterDisplayTemp.set({
      ...EMAIL_TEMPL_REQUESTED_FILTER_DISPLAY_TEMP_INIT,
    });

    this.requestFromDate = null;
    this.requestToDate = null;

    this.approvalFromDate = null;
    this.approvalToDate = null;

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
      case 'approvalDate':
        this.handleApprovalDateFrom(data);
        break;
    }
  }

  onToDateChange(data: DatePayload | null) {
    switch (data?.name) {
      case 'requestDate':
        this.handleRequestDateTo(data);
        break;
      case 'approvalDate':
        this.handleApprovalDateTo(data);
        break;
    }
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

  handleApprovalDateFrom(data: DatePayload | null) {
    this.approvalFromDate = data?.date || null;

    if (this.approvalFromDate) {
      this.updateFilter('approvalDateFrom', this.approvalFromDate);
      return;
    }

    this.updateFilter('approvalDateFrom', null);
  }

  handleApprovalDateTo(data: DatePayload | null) {
    this.approvalToDate = data?.date || null;

    if (this.approvalToDate) {
      this.updateFilter('approvalDateTo', this.approvalToDate);
      return;
    }

    this.updateFilter('approvalDateTo', null);
  }

  dateFormatter(date: NgbDate, format: string) {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return this.datePipe.transform(jsDate, format);
  }
}
