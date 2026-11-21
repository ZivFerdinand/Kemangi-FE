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
} from '..';
import {
  CustomTabComponent,
  TableComponent,
  StickyTableComponent,
} from '../../../../shared/components';
import { CapitalizePipe, TableState } from '../../../../shared';
import { approvalStatus, requestType } from '../../../../shared/data';
import { mapThresholdApprovalQuery } from '../mappers/threshold-score.mapper';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import {
  thresholdScoreTabs,
  thresholdScoreBreadcrumb,
  thresholdScoreDetailViewListColumns,
  thresholdScoreReqListColumns,
  THRESHOLD_PAGE_INFO_INIT,
  THRESHOLD_REQUESTED_TABLE_QUERY_INIT,
} from '../data';
import { ContentLayout } from '../../../../shared/layout/content-layout/content-layout';
import { TruncateOrDashPipe } from '../../../../shared/pipes/truncate-or-dash.pipe';
import { SharedDataService } from '../../../../core/services/shared-data.service';

@Component({
  selector: 'app-threshold-requested-list',
  templateUrl: './threshold-requested-list.component.html',
  styleUrls: [
    './threshold-requested-list.component.scss',
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
    CapitalizePipe,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class ThresholdRequestedListComponent implements OnInit {
  breadcrumb: { label: string; url?: string }[] = thresholdScoreBreadcrumb;

  pageTitle: string = 'Threshold Score';

  // threshold table

  columns: ColumnDef<ThresholdApproval>[] = thresholdScoreReqListColumns;

  pageQuery: TableState<ThresholdApprovalQuery> = {
    ...THRESHOLD_REQUESTED_TABLE_QUERY_INIT,
  };

  pageInfo = { ...THRESHOLD_PAGE_INFO_INIT };

  tableData: ThresholdApproval[] = [];

  columnsPinned: string[] = ['no', 'modelName', 'modelDescription'];

  // threshold details table

  columnsThresholdIdDetail = thresholdScoreDetailViewListColumns;

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

  currentUrl: string = '';

  tableDataThresholdIdDetail: any = [];

  users: any[] = [];

  editPermission: boolean = false;
  deletePermission: boolean = false;

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
  reviewer2DateFrom: NgbDate | null | any;
  reviewer2DateTo: NgbDate | null | any;
  maxDate: NgbDate | null | any;
  approvalMaxDate: NgbDate | null | any;

  productTypeItemList = [];

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

  tabs = thresholdScoreTabs;

  activeTab = 'requested';

  approvalStatus = approvalStatus;

  requestType = requestType;

  dataGroupNameRelation: any;

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'current')
      this.navigateTo('/home/machine-learning/threshold-score/current/');
    if (tab === 'requested')
      this.navigateTo('/home/machine-learning/threshold-score/requested/');
  }

  private modalService = inject(NgbModal);

  @ViewChild('productTypeSelect') productTypeSelect!: NgSelectComponent;
  @ViewChild('approvalStatusSelect') approvalStatusSelect!: NgSelectComponent;
  @ViewChild('requestTypeSelect') requestTypeSelect!: NgSelectComponent;

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

  ngOnInit(): void {
    this.getMLMProductTypeList();

    this.initData();
  }

  checkCreatePermission = computed(() =>
    this.sharedData.checkMenu('RULEMANAGEMENT-DATAGROUP-CREATE'),
  );

  checkEditPermission = computed(() =>
    this.sharedData.checkMenu('RULEMANAGEMENT-DATAGROUP-UPDATE'),
  );

  checkDeletePermission = computed(() =>
    this.sharedData.checkMenu('RULEMANAGEMENT-DATAGROUP-DELETE'),
  );

  checkMenu = (value: string): boolean => {
    if (value === 'edit') {
      return this.checkEditPermission();
    } else {
      return this.checkDeletePermission();
    }
  };

  initData() {
    this.getThresholdApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
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

    this.filterBy.update((f) => ({ ...f, [key]: value }));
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
    this.approvalStatusSelect.clearModel();
    this.requestTypeSelect.clearModel();

    this.clearFilter();

    this.pageQuery = {
      ...THRESHOLD_REQUESTED_TABLE_QUERY_INIT,
    };

    this.initData();
  }

  clearFilter() {
    this.filterBy.set(structuredClone(this.defaultFilter));
    this.hoveredDate = null;
    this.fromDate = null;
    this.toDate = null;
    this.reviewer2DateFrom = null;
    this.reviewer2DateTo = null;
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

    if (!this.reviewer2DateFrom && !this.reviewer2DateTo) {
      this.reviewer2DateFrom = date;
      const fromDateFormatted = this.dateFormatter(
        this.reviewer2DateFrom,
        this.DEFAULT_DATE_FORMAT,
      );

      this.filterBy.update((prevValue) => ({
        ...prevValue,
        reviewer_2_date_from: fromDateFormatted,
      }));
    } else if (
      this.reviewer2DateFrom &&
      !this.reviewer2DateTo &&
      date.after(this.reviewer2DateFrom)
    ) {
      this.reviewer2DateTo = date;

      const toDateFormatted = this.dateFormatter(
        this.reviewer2DateTo,
        this.DEFAULT_DATE_FORMAT,
      );

      this.filterBy.update((prevValue) => ({
        ...prevValue,
        reviewer_2_date_to: toDateFormatted,
      }));
    } else {
      this.reviewer2DateTo = null;
      this.reviewer2DateFrom = date;
      const fromDateFormatted = this.dateFormatter(
        this.reviewer2DateFrom,
        this.DEFAULT_DATE_FORMAT,
      );
      this.filterBy.update((prevValue) => ({
        ...prevValue,
        reviewer_2_date_from: fromDateFormatted,
        reviewer_2_date_to: null,
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
      this.reviewer2DateFrom &&
      !this.reviewer2DateTo &&
      this.approvalHoveredDate &&
      date.after(this.reviewer2DateFrom) &&
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
      this.reviewer2DateTo &&
      date.after(this.reviewer2DateFrom) &&
      date.before(this.reviewer2DateTo)
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
      date.equals(this.reviewer2DateFrom) ||
      (this.toDate && date.equals(this.reviewer2DateTo)) ||
      this.isInside(date, 'approvalDate') ||
      this.isHovered(date, 'approvalDate')
    );
  }

  displayApprovalDate(): string {
    if (this.reviewer2DateFrom && this.reviewer2DateTo) {
      return `${this.dateFormatter(
        this.reviewer2DateFrom,
        this.DEFAULT_DISPLAY_DATE_FORMAT,
      )} - ${this.dateFormatter(
        this.reviewer2DateTo,
        this.DEFAULT_DISPLAY_DATE_FORMAT,
      )} `;
    } else if (this.reviewer2DateFrom) {
      return `${this.dateFormatter(
        this.reviewer2DateFrom,
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
