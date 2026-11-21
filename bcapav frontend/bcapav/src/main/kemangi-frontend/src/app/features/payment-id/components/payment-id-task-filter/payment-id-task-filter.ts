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
} from '@ng-bootstrap/ng-bootstrap';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

import {
  PaymentIdQueryFilter,
  PaymentIdQueryFilterDisplayTemp,
} from '../../domain/model/payment-id.model';
import {
  requestType,
  approvalStatus,
  actionBlockType,
  productType,
  bankList,
} from '../../../../shared';
import {
  DateRangePickerComponent,
  DatePayload,
} from '../../../../shared/components/date-range-picker/date-range-picker';

import {
  PAYMENT_ID_TASK_LIST_PAGE_QUERY_FILTER_INIT,
  PAYMENT_ID_TASK_LIST_FILTER_DISPLAY_TEMP_INIT,
} from '../../data';

interface User {
  fullName: string;
  userId: string;
}

interface Data {
  filterBy: PaymentIdQueryFilter;
  filterDisplayTemp: PaymentIdQueryFilterDisplayTemp;
}

@Component({
  selector: 'app-payment-id-task-filter',
  templateUrl: './payment-id-task-filter.html',
  styleUrls: [
    './payment-id-task-filter.scss',
    '../../../../shared/styles/index.scss',
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
export class PaymentIdTaskFilter {
  requestType = actionBlockType;
  productType = productType;
  bankList = bankList;

  users = input<User[]>([]);

  @Output() sendData = new EventEmitter<Data>();

  @Output() handleClearFilter = new EventEmitter();

  filterBy = signal<PaymentIdQueryFilter>({
    ...PAYMENT_ID_TASK_LIST_PAGE_QUERY_FILTER_INIT,
  });

  filterDisplayTemp = signal<PaymentIdQueryFilterDisplayTemp>({
    ...PAYMENT_ID_TASK_LIST_FILTER_DISPLAY_TEMP_INIT,
  });

  showFilter = signal<boolean>(false);

  requestFromDate: NgbDate | null = null;
  requestToDate: NgbDate | null = null;
  actionFromDate: NgbDate | null = null;
  actionToDate: NgbDate | null = null;
  maxDate: NgbDate | null = null;

  DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

  DEFAULT_DISPLAY_DATE_FORMAT = 'dd-MMM-yyyy';

  @ViewChild('lastActionStatusSelect')
  lastActionStatusSelect!: NgSelectComponent;
  @ViewChild('requestTypeSelect') requestTypeSelect!: NgSelectComponent;
  @ViewChild('productTypeSelect') productTypeSelect!: NgSelectComponent;
  @ViewChild('banksSelect') banksSelect!: NgSelectComponent;
  // #productTypeSelect

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
      case 'customerName':
        this.filterBy.update((f) => ({ ...f, [key]: value }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          [key]: value,
        }));

        break;

      case 'paymentId':
        this.filterBy.update((f) => ({ ...f, [key]: value }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          [key]: value,
        }));

        break;

      case 'bankName':
        this.filterBy.update((f) => ({ ...f, [key]: value?.id }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          [key]: value?.name,
        }));

        break;

      case 'productType':
        this.filterBy.update((f) => ({ ...f, [key]: value?.id }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          [key]: value?.name,
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
    this.productTypeSelect.clearModel();
    this.requestTypeSelect.clearModel();
    this.banksSelect.clearModel();

    this.filterBy.set({
      ...PAYMENT_ID_TASK_LIST_PAGE_QUERY_FILTER_INIT,
    });

    this.filterDisplayTemp.set({
      ...PAYMENT_ID_TASK_LIST_FILTER_DISPLAY_TEMP_INIT,
    });

    this.requestFromDate = null;
    this.requestToDate = null;
    this.actionFromDate = null;
    this.actionToDate = null;

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

      case 'actionDate':
        this.handleActionDateFrom(data);
    }
  }

  onToDateChange(data: DatePayload | null) {
    switch (data?.name) {
      case 'requestDate':
        this.handleRequestDateTo(data);
        break;

      case 'actionDate':
        this.handleActionDateTo(data);
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

  handleActionDateFrom(data: DatePayload | null) {
    this.actionFromDate = data?.date || null;

    if (this.actionFromDate) {
      this.updateFilter('actionDateFrom', this.actionFromDate);
      return;
    }

    this.updateFilter('actionDateFrom', null);
  }

  handleActionDateTo(data: DatePayload | null) {
    this.actionToDate = data?.date || null;

    if (this.actionToDate) {
      this.updateFilter('actionDateTo', this.actionToDate);
      return;
    }

    this.updateFilter('actionDateTo', null);
  }

  dateFormatter(date: NgbDate, format: string) {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return this.datePipe.transform(jsDate, format);
  }
}
