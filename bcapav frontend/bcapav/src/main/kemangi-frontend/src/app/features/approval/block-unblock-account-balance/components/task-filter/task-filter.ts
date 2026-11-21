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
  BlockUnblockAccountBalanceApprovalQueryFilter,
  BlockUnblockAccountBalanceApprovalQueryFilterDisplayTemp,
} from '../../domain/models/block-unblock-account-balance-approval.model';

import {
  requestType,
  approvalStatus,
  actionBlockType,
  accountTypes,
} from '../../../../../shared';

import {
  DateRangePickerComponent,
  DatePayload,
} from '../../../../../shared/components/date-range-picker/date-range-picker';

import {
  BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_PAGE_QUERY_FILTER_INIT,
  BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_LIST_FILTER_DISPLAY_TEMP_INIT,
} from '../../data';

interface User {
  fullName: string;
  userId: string;
}

interface Data {
  filterBy: BlockUnblockAccountBalanceApprovalQueryFilter;
  filterDisplayTemp: BlockUnblockAccountBalanceApprovalQueryFilterDisplayTemp;
}

@Component({
  selector: 'app-block-unblock-account-balance-task-filter',
  templateUrl: './task-filter.html',
  styleUrls: ['./task-filter.scss', '../../../../../shared/styles/index.scss'],
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
export class BlockUnblockAccountBalanceTaskFilter {
  approvalStatus = approvalStatus;
  requestType = requestType;
  actionBlockType = actionBlockType;
  accountTypes = accountTypes;

  users = input<User[]>([]);

  @Output() sendData = new EventEmitter<Data>();

  @Output() handleClearFilter = new EventEmitter();

  filterBy = signal<BlockUnblockAccountBalanceApprovalQueryFilter>({
    ...BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_PAGE_QUERY_FILTER_INIT,
  });

  filterDisplayTemp =
    signal<BlockUnblockAccountBalanceApprovalQueryFilterDisplayTemp>({
      ...BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_LIST_FILTER_DISPLAY_TEMP_INIT,
    });

  showFilter = signal<boolean>(false);

  requestFromDate: NgbDate | null = null;
  requestToDate: NgbDate | null = null;
  maxDate: NgbDate | null = null;

  DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

  DEFAULT_DISPLAY_DATE_FORMAT = 'dd-MMM-yyyy';

  @ViewChild('requesterSelect') requesterSelect!: NgSelectComponent;
  @ViewChild('actionSelect') actionSelect!: NgSelectComponent;
  @ViewChild('accountTypeSelect') accountTypeSelect!: NgSelectComponent;

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
      case 'accountType':
        this.filterBy.update((f) => ({ ...f, [key]: value?.id }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          [key]: value?.name,
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

      case 'action':
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
    this.requesterSelect.clearModel();
    this.actionSelect.clearModel();
    this.accountTypeSelect.clearModel();

    this.filterBy.set({
      ...BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_PAGE_QUERY_FILTER_INIT,
    });

    this.filterDisplayTemp.set({
      ...BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_LIST_FILTER_DISPLAY_TEMP_INIT,
    });

    this.requestFromDate = null;
    this.requestToDate = null;

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
    }
  }

  onToDateChange(data: DatePayload | null) {
    switch (data?.name) {
      case 'requestDate':
        this.handleRequestDateTo(data);
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

  dateFormatter(date: NgbDate, format: string) {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return this.datePipe.transform(jsDate, format);
  }
}
