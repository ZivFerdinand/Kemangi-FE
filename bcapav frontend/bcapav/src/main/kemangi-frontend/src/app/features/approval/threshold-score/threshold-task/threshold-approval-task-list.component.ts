import {
  Component,
  OnInit,
  signal,
  inject,
  ViewChild,
  computed,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  NgbPaginationModule,
  NgbTooltipModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  NgbModule,
  NgbCalendar,
  NgbDate,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ColumnDef } from '@tanstack/table-core';

import {
  MLThresholdService,
  ThresholdIdDetailParams,
  ThresholdRequestedListFilterParams,
  ThresholdApproval,
  ThresholdApprovalQuery,
} from '../../../machine-learning-management';
import {
  CustomTabComponent,
  TableComponent,
  StickyTableComponent,
} from '../../../../shared/components';
import { TableState } from '../../../../shared';
import { approvalStatus, requestType } from '../../../../shared/data';

import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import { ContentLayout } from '../../../../shared/layout/content-layout/content-layout';
import { TruncateOrDashPipe } from '../../../../shared/pipes/truncate-or-dash.pipe';

import {
  approvalThresholdScoreBreadcrumb,
  approvalThresholdScoreTabs,
  thresholdScoreDetailViewListColumns,
  thresholdScoreApprTaskListColumns,
  THRESHOLD_PAGE_INFO_INIT,
  THRESHOLD_APPR_TASK_TABLE_QUERY_INIT,
} from '../../../machine-learning-management/threshold-score/data';
import { SharedDataService } from '../../../../core/services/shared-data.service';
import { mapThresholdApprovalQuery } from '../../../machine-learning-management/threshold-score/mappers/threshold-score.mapper';
@Component({
  selector: 'app-threshold-approval-task-list',
  templateUrl: './threshold-approval-task-list.component.html',
  styleUrls: [
    './threshold-approval-task-list.component.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    ContentLayout,
    CustomTabComponent,
    TableComponent,
    RouterLink,
    TruncateOrDashPipe,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class ThresholdApprovalTaskListComponent implements OnInit {
  breadcrumb: { label: string; url?: string }[] =
    approvalThresholdScoreBreadcrumb;

  pageTitle: string = 'Threshold Score Approval';

  // threshold table

  columns: ColumnDef<ThresholdApproval>[] = thresholdScoreApprTaskListColumns;

  pageQuery: TableState<ThresholdApprovalQuery> = {
    ...THRESHOLD_APPR_TASK_TABLE_QUERY_INIT,
  };

  pageInfo = { ...THRESHOLD_PAGE_INFO_INIT };

  tableData: ThresholdApproval[] = [];

  columnsPinned: string[] = ['no', 'modelName', 'modelDescription'];

  // threshold details table

  columnsThresholdIdDetail = thresholdScoreDetailViewListColumns;

  productTypeItemList = [];

  pageParamsThresholdIdDetail: ThresholdIdDetailParams = {
    limit: 5,
    page: 1,
    sort: '',
    sort_dir: 'asc',
    id: '',
    model_id: '',
  };

  pageInfoThresholdIdDetail = {
    totalElements: 31,
    totalPages: 1,
  };

  tableDataThresholdIdDetail: any = [];

  currentUrl: string = '';

  users: any[] = [];

  showFilter: boolean = false;
  submitFilter: boolean = false;

  DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

  DEFAULT_DISPLAY_DATE_FORMAT = 'dd-MMM-yyyy';

  fromDateCreated: NgbDate | null | any;
  toDateCreated: NgbDate | null | any;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null | any;
  toDate: NgbDate | null | any;
  approvalHoveredDate: NgbDate | null = null;
  reviewer1DateFrom: NgbDate | null | any;
  reviewer1DateTo: NgbDate | null | any;
  maxDate: NgbDate | null | any;
  approvalMaxDate: NgbDate | null | any;

  defaultFilter: ThresholdRequestedListFilterParams = {
    model_name: '',
    model_description: '',
    product_type: '',
    requester_id: [],
    reviewer_1_id: [],
    reviewer_2_date_from: null,
    reviewer_2_date_to: null,
    reviewer_1_date_from: null,
    reviewer_1_date_to: null,
    rejection_notes: '',
    approval_status: '',
    request_type: '',
  };

  filterBy = signal(structuredClone(this.defaultFilter));

  tabs = approvalThresholdScoreTabs;

  activeTab = 'task';

  approvalStatus = approvalStatus;

  requestType = requestType;

  dataGroupNameRelation: any;

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'task')
      this.navigateTo('/home/approval/threshold-score/task-list');
    if (tab === 'requested')
      this.navigateTo('/home/approval/threshold-score/requested-list');
  }

  private modalService = inject(NgbModal);

  @ViewChild('productTypeSelect') productTypeSelect!: NgSelectComponent;
  @ViewChild('requestTypeSelect') requestTypeSelect!: NgSelectComponent;
  @ViewChild('requesterSelect') requesterSelect!: NgSelectComponent;
  @ViewChild('approver1Select') approver1Select!: NgSelectComponent;

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly mlThresholdService: MLThresholdService,
    private readonly toastr: ToastrService,
    public confirmationDialogService: ConfirmationModalService,
    private readonly ngbCalendar: NgbCalendar,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
    this.maxDate = ngbCalendar.getToday();
    this.approvalMaxDate = ngbCalendar.getToday();
  }

  taskLv1 = computed(() =>
    this.sharedData.checkMenu('APPROVAL-THRESHOLDSCORE-TASK-LV1'),
  );

  taskLv2 = computed(() =>
    this.sharedData.checkMenu('APPROVAL-THRESHOLDSCORE-TASK-LV2'),
  );

  ngOnInit(): void {
    this.getUserList();
    this.getMLMProductTypeList();
    this.pageQuery.reviewer1_done =
      this.taskLv1() && !this.taskLv2() ? false : true;

    this.initData();
  }

  initData() {
    this.getThresholdApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  getMLMProductTypeList() {
    this.ngxLoader.start();
    this.mlThresholdService.getMLMProductTypeList().subscribe({
      next: (res: any) => {
        this.productTypeItemList = res['data'];
      },
      error: (e: any) => {
        this.ngxLoader.stop();
        if (e?.status !== 400) {
          this.toastr.show(
            `<div class="toast-custom toast-failed">
                <div class="info">
                  <div class="icon">
                    <img src="./assets/img/ic-times-rounded.svg" alt="error" />
                  </div>
                  <div class="description">
                    Something went wrong while loading data
                  </div>
                </div>

                <button class="close-btn">
                  <img src="./assets/img/ic-times.svg" alt="close" />
                </button>
            </div>`,
            '',
            { enableHtml: true },
          );
        }
      },
      complete: () => this.ngxLoader.stop(),
    });
    this.ngxLoader.stop();
  }

  getUserList() {
    this.mlThresholdService.getUserList().subscribe({
      next: (res: any) => {
        this.users = res['data'];
      },
      error: (e: any) => {
        if (e?.status !== 400) {
          this.toastr.show(
            `<div class="toast-custom toast-failed">
                <div class="info">
                  <div class="icon">
                    <img src="./assets/img/ic-times-rounded.svg" alt="error" />
                  </div>
                  <div class="description">
                    Something went wrong while loading data
                  </div>
                </div>

                <button class="close-btn">
                  <img src="./assets/img/ic-times.svg" alt="close" />
                </button>
            </div>`,
            '',
            { enableHtml: true },
          );
        }
      },
    });
  }

  handleDelete(id: number) {
    this.confirmationDialogService
      .confirm('', 'Are you sure want to delete this data group?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          // this.deleteDataGroupCurrent(id);
        }
      });
  }

  getThresholdApprovalList(param: ThresholdApprovalQuery) {
    this.ngxLoader.start();

    this.mlThresholdService
      .thresholdApprovalRequestedList(mapThresholdApprovalQuery(param))
      .subscribe({
        next: (res: any) => {
          this.tableData = res['data']['content'];
          this.pageInfo = {
            ...this.pageInfo,
            totalElements: res['data']['totalElements'],
            totalPages: res['data']['totalPages'],
          };
        },
        error: (e: any) => {
          this.ngxLoader.stop();
          if (e?.status !== 400) {
            this.toastr.show(
              `<div class="toast-custom toast-failed">
                <div class="info">
                  <div class="icon">
                    <img src="./assets/img/ic-times-rounded.svg" alt="error" />
                  </div>
                  <div class="description">
                    Something went wrong while loading data
                  </div>
                </div>

                <button class="close-btn">
                  <img src="./assets/img/ic-times.svg" alt="close" />
                </button>
            </div>`,
              '',
              { enableHtml: true },
            );
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
    this.ngxLoader.stop();
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageQuery = { ...this.pageQuery, sort: param, sortDir: order };

    this.initData();
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };

    this.initData();
  }

  handlePageChangeThresholdId(e: any) {
    this.pageParamsThresholdIdDetail = {
      ...this.pageParamsThresholdIdDetail,
      page: e,
    };
    this.updatePageInfoThresholdIdDetail();
  }

  back(c: Function) {
    this.pageParamsThresholdIdDetail.page = 1;
    c('close');
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  updateFilter<K extends keyof ReturnType<typeof this.filterBy>>(
    key: K,
    value: any,
  ) {
    if (key === 'product_type') {
      this.filterBy.update((f) => ({
        ...f,
        [key]: value.map((i: any) => i),
      }));
      return;
    }
    if (key === 'requester_id') {
      this.filterBy.update((f) => ({
        ...f,
        [key]: value.map((i: any) => i?.userId),
      }));
      return;
    }
    if (key === 'reviewer_1_id') {
      this.filterBy.update((f) => ({
        ...f,
        [key]: value.map((i: any) => i?.userId),
      }));
      return;
    }

    this.filterBy.update((f) => ({ ...f, [key]: value }));
  }

  displayRequestedDate(): string {
    if (this.fromDate && this.toDate) {
      return `${this.dateFormatter(
        this.fromDate,
        this.DEFAULT_DISPLAY_DATE_FORMAT,
      )} - ${this.dateFormatter(
        this.toDate,
        this.DEFAULT_DISPLAY_DATE_FORMAT,
      )} `;
    } else if (this.fromDate) {
      return `${this.dateFormatter(
        this.fromDate,
        this.DEFAULT_DISPLAY_DATE_FORMAT,
      )}`;
    }
    return '';
  }

  handleFilter() {
    this.submitFilter = true;
    this.showFilter = false;
    this.pageQuery = { ...this.pageQuery, ...this.filterBy() };

    this.initData();
  }

  resetFilter() {
    this.showFilter = false;
    this.submitFilter = false;

    this.productTypeSelect.clearModel();
    this.requestTypeSelect.clearModel();
    this.requesterSelect.clearModel();
    this.approver1Select.clearModel();

    this.clearFilter();

    this.pageQuery = {
      ...THRESHOLD_APPR_TASK_TABLE_QUERY_INIT,
      reviewer1_done: this.taskLv1() && !this.taskLv2() ? false : true,
    };

    this.initData();
  }

  clearFilter() {
    this.filterBy.set(structuredClone(this.defaultFilter));
    this.hoveredDate = null;
    this.fromDate = null;
    this.toDate = null;
    this.reviewer1DateFrom = null;
    this.reviewer1DateTo = null;
  }

  navigateTo(path: string) {
    if (path === '/home/rule-management/data-group/create') {
      this.router.navigate([path], {
        queryParams: {
          from: 'current',
        },
      });

      return;
    }

    this.router.navigate([path]);
  }

  handleQuery() {
    this.pageQuery = { ...this.pageQuery, page: 1 };

    this.initData();
  }

  onDateSelection(date: NgbDate, type: string) {
    if (type === 'requestDate') {
      if (!this.fromDate && !this.toDate) {
        this.fromDate = date;
        const fromDateFormatted = this.dateFormatter(
          this.fromDate,
          this.DEFAULT_DATE_FORMAT,
        );
        this.filterBy.update((prevValue) => ({
          ...prevValue,
          request_date_from: fromDateFormatted,
        }));
      } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
        this.toDate = date;
        const toDateFormatted = this.dateFormatter(
          this.toDate,
          this.DEFAULT_DATE_FORMAT,
        );
        this.filterBy.update((prevValue) => ({
          ...prevValue,
          request_date_to: toDateFormatted,
        }));
      } else {
        this.toDate = null;
        this.fromDate = date;
        const fromDateFormatted = this.dateFormatter(
          this.fromDate,
          this.DEFAULT_DATE_FORMAT,
        );
        this.filterBy.update((prevValue) => ({
          ...prevValue,
          request_date_from: fromDateFormatted,
          request_date_to: null,
        }));
      }
      return;
    }

    if (!this.reviewer1DateFrom && !this.reviewer1DateTo) {
      this.reviewer1DateFrom = date;
      const fromDateFormatted = this.dateFormatter(
        this.reviewer1DateFrom,
        this.DEFAULT_DATE_FORMAT,
      );

      this.filterBy.update((prevValue) => ({
        ...prevValue,
        reviewer_1_date_from: fromDateFormatted,
      }));
    } else if (
      this.reviewer1DateFrom &&
      !this.reviewer1DateTo &&
      date.after(this.reviewer1DateFrom)
    ) {
      this.reviewer1DateTo = date;

      const toDateFormatted = this.dateFormatter(
        this.reviewer1DateTo,
        this.DEFAULT_DATE_FORMAT,
      );

      this.filterBy.update((prevValue) => ({
        ...prevValue,
        reviewer_1_date_to: toDateFormatted,
      }));
    } else {
      this.reviewer1DateTo = null;
      this.reviewer1DateFrom = date;
      const fromDateFormatted = this.dateFormatter(
        this.reviewer1DateFrom,
        this.DEFAULT_DATE_FORMAT,
      );
      this.filterBy.update((prevValue) => ({
        ...prevValue,
        reviewer_1_date_from: fromDateFormatted,
        reviewer_1_date_to: null,
      }));
    }
  }

  isHovered(date: NgbDate, type: string) {
    if (type === 'requestDate') {
      return (
        this.fromDate &&
        !this.toDate &&
        this.hoveredDate &&
        date.after(this.fromDate) &&
        date.before(this.hoveredDate)
      );
    }

    return (
      this.reviewer1DateFrom &&
      !this.reviewer1DateTo &&
      this.approvalHoveredDate &&
      date.after(this.reviewer1DateFrom) &&
      date.before(this.approvalHoveredDate)
    );
  }

  outsideDay(date: NgbDate, type: string) {
    if (type === 'requestDate') {
      return date.after(this.maxDate);
    }

    return date.after(this.approvalMaxDate);
  }

  isInside(date: NgbDate, type: string) {
    if (type === 'requestDate') {
      return (
        this.toDate && date.after(this.fromDate) && date.before(this.toDate)
      );
    }
    return (
      this.reviewer1DateTo &&
      date.after(this.reviewer1DateFrom) &&
      date.before(this.reviewer1DateTo)
    );
  }

  isRange(date: NgbDate, type: string) {
    if (type === 'requestDate') {
      return (
        date.equals(this.fromDate) ||
        (this.toDate && date.equals(this.toDate)) ||
        this.isInside(date, 'requestDate') ||
        this.isHovered(date, 'requestDate')
      );
    }

    return (
      date.equals(this.reviewer1DateFrom) ||
      (this.toDate && date.equals(this.reviewer1DateTo)) ||
      this.isInside(date, 'approvalDate') ||
      this.isHovered(date, 'approvalDate')
    );
  }

  displayApprovalDate(): string {
    if (this.reviewer1DateFrom && this.reviewer1DateTo) {
      return `${this.dateFormatter(
        this.reviewer1DateFrom,
        this.DEFAULT_DISPLAY_DATE_FORMAT,
      )} - ${this.dateFormatter(
        this.reviewer1DateTo,
        this.DEFAULT_DISPLAY_DATE_FORMAT,
      )} `;
    } else if (this.reviewer1DateFrom) {
      return `${this.dateFormatter(
        this.reviewer1DateFrom,
        this.DEFAULT_DISPLAY_DATE_FORMAT,
      )}`;
    }
    return '';
  }

  filterValue(key: keyof ReturnType<typeof this.filterBy>) {
    return this.filterBy()[key];
  }

  formatKey(key: string | number | symbol): string {
    return String(key)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  dateFormatter(date: NgbDate, format: string) {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return this.datePipe.transform(jsDate, format);
  }

  objectKeys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
  }

  getFilterValue(key: keyof ThresholdRequestedListFilterParams) {
    return this.filterBy()[key];
  }

  isValidFilterValue(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  }

  openModal(event: Event, content: any, thresholdDetails: any[]): void {
    event.preventDefault();
    this.tableDataThresholdIdDetail = thresholdDetails;
    this.pageParamsThresholdIdDetail.page = 1; // reset to first page
    this.pageParamsThresholdIdDetail.limit = 5; // set page size

    this.updatePageInfoThresholdIdDetail();
    // this.pageParamsThresholdIdDetail.model_id = i
    // this.getThresholdIdDetail({
    //   ...this.pageParamsThresholdIdDetail,
    //   page: this.pageParamsThresholdIdDetail.page - 1,
    // });
    this.modalService.open(content, {
      scrollable: true,
      size: 'lg',
      centered: true,
      windowClass: 'modal-holder',
    });
  }

  updatePageInfoThresholdIdDetail() {
    const totalElements = this.tableDataThresholdIdDetail.length;
    this.pageInfoThresholdIdDetail = {
      totalElements,
      totalPages:
        Math.ceil(totalElements / this.pageParamsThresholdIdDetail.limit) || 1,
    };
  }

  get pagedThresholdIdDetail() {
    const start =
      (this.pageParamsThresholdIdDetail.page - 1) *
      this.pageParamsThresholdIdDetail.limit;
    const end = start + this.pageParamsThresholdIdDetail.limit;
    return this.tableDataThresholdIdDetail.slice(start, end);
  }
}
