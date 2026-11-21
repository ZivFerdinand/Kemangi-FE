import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import {
  NgbPaginationModule,
  NgbDate,
  NgbCalendar,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';

import {
  AlertQueueQueryFilter,
  AlertQueueFilterDisplayTemp,
} from '../../domain/alert-queue.model';
import { enumBoolean, activeStatus } from '../../../../shared';
import {
  DateRangePickerComponent,
  DatePayload,
} from '../../../../shared/components/date-range-picker/date-range-picker';
import {
  ALERT_QUEUE_TABLE_QUERY_FILTER_INIT,
  ALERT_QUEUE_FILTER_DISPLAY_TEMP_INIT,
} from '../../data';

interface User {
  fullName: string;
  userId: string;
}

interface Data {
  filterBy: AlertQueueQueryFilter;
  filterDisplayTemp: AlertQueueFilterDisplayTemp;
}

@Component({
  selector: 'app-alert-queue-current-filter',
  templateUrl: './current-filter.html',
  styleUrls: ['./current-filter.scss', '../../../../shared/styles/index.scss'],
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
export class AlertQueueCurrentFilter {
  activeStatus = activeStatus;
  enumBoolean = enumBoolean;

  @Input() users: User[] = [];

  @Input() assignToUsers: any[] = [];

  @Output() sendData = new EventEmitter<Data>();

  @Output() handleClearFilter = new EventEmitter();

  filterBy = signal<AlertQueueQueryFilter>({
    ...ALERT_QUEUE_TABLE_QUERY_FILTER_INIT,
  });

  filterDisplayTemp = signal<AlertQueueFilterDisplayTemp>({
    ...ALERT_QUEUE_FILTER_DISPLAY_TEMP_INIT,
  });

  showFilter = signal<boolean>(false);

  requestFromDate: NgbDate | null = null;
  requestToDate: NgbDate | null = null;
  approval1FromDate: NgbDate | null = null;
  approval1ToDate: NgbDate | null = null;
  approval2FromDate: NgbDate | null = null;
  approval2ToDate: NgbDate | null = null;
  maxDate: NgbDate | null = null;

  DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

  DEFAULT_DISPLAY_DATE_FORMAT = 'dd-MMM-yyyy';

  @ViewChild('assignToSelect') assignToSelect!: NgSelectComponent;
  @ViewChild('requesterSelect') requesterSelect!: NgSelectComponent;
  @ViewChild('approver1Select') approver1Select!: NgSelectComponent;
  @ViewChild('approver2Select') approver2Select!: NgSelectComponent;
  @ViewChild('activeStatusSelect') activeStatusSelect!: NgSelectComponent;

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
      case 'name':
        this.filterBy.update((f) => ({ ...f, [key]: value }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          name: value,
        }));

        break;

      case 'description':
        this.filterBy.update((f) => ({ ...f, [key]: value }));
        this.filterDisplayTemp.update((f) => ({
          ...f,
          [key]: value,
        }));
        break;

      case 'assignTo':
        this.filterBy.update((f) => ({
          ...f,
          [key]: value.map((i: any) => i?.userId),
        }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          [key]: value.map((i: any) => i?.userName).join(', '),
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

      case 'activeStatus':
        this.filterBy.update((f) => ({ ...f, [key]: value?.id }));

        this.filterDisplayTemp.update((f) => ({
          ...f,
          status: value?.name,
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
    this.approver1Select.clearModel();
    this.approver2Select.clearModel();
    this.activeStatusSelect.clearModel();
    this.assignToSelect.clearModel();

    this.filterBy.set({
      ...ALERT_QUEUE_TABLE_QUERY_FILTER_INIT,
    });

    this.filterDisplayTemp.set({
      ...ALERT_QUEUE_FILTER_DISPLAY_TEMP_INIT,
    });

    this.requestFromDate = null;
    this.requestToDate = null;

    this.approval1FromDate = null;
    this.approval1ToDate = null;

    this.approval2FromDate = null;
    this.approval2ToDate = null;

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

  customSearchDataGroup(term: string, item: any): boolean {
    const searchTerm = term?.trim().toLowerCase() ?? '';

    return (
      item?.data_group_name?.toLowerCase().includes(searchTerm) ||
      item?.data_group_id?.toLowerCase().includes(searchTerm)
    );
  }

  dateFormatter(date: NgbDate, format: string) {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return this.datePipe.transform(jsDate, format);
  }
}
