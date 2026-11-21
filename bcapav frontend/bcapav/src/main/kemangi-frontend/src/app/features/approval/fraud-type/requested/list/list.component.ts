import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { ColumnDef } from '@tanstack/table-core';

import {
  requestType,
  approvalStatus,
  approvalTabs,
  PAGE_INFO_INIT,
} from '../../../../../shared/data';
import {
  BreadcrumbProps,
  TabProps,
  FiltersDisplayStruct,
  TableState,
} from '../../../../../shared/interfaces';
import {
  CustomTabComponent,
  ContentLayout,
  CapitalizePipe,
  StickyTableComponent,
} from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { FraudTypeApprovalService } from '../../api/services/fraud-type-approval.service';
import { mapFraudTypeApprovalQueryDomainToApi } from '../../mappers/fraud-type-approval.mapper';
import {
  FRAUD_TYPE_APPROVAL_LIST_DISPLAY_STRUCT,
  FRAUD_TYPE_REQUESTED_LIST_PAGE_QUERY_INIT,
  fraudTypeApprovalRequestedListBreadcrumb,
  fraudTypeApprRequestedListColumns,
} from '../../data';
import { FraudTypeRequestedFilter } from '../../components/fraud-type-requested-filter/fraud-type-requested-filter';
import {
  FraudTypeApprovalQuery,
  FraudTypeApproval,
} from '../../domain/models/fraud-type-approval.model';
import { SharedDataService } from '../../../../../core/services/shared-data.service';

@Component({
  selector: 'app-fraud-type-requested-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    RouterLink,
    NgSelectModule,
    CustomTabComponent,
    ContentLayout,
    FormsModule,
    CapitalizePipe,
    FraudTypeRequestedFilter,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class FraudTypeApprovalRequestedListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = fraudTypeApprovalRequestedListBreadcrumb;

  pageTitle: string = 'Fraud Type Approval';

  tabs: TabProps[] = approvalTabs;

  activeTab: string = 'requested';

  columns: ColumnDef<FraudTypeApproval>[] = fraudTypeApprRequestedListColumns;

  pageQuery: TableState<FraudTypeApprovalQuery> = {
    ...FRAUD_TYPE_REQUESTED_LIST_PAGE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: FraudTypeApproval[] = [];

  columnsPinned: string[] = ['no', 'fraudType', 'description'];

  users: any[] = [];

  showFilter: boolean = false;

  submitFilter: boolean = false;

  requestType = requestType;

  approvalStatus = approvalStatus;

  filterDisplay = signal<FiltersDisplayStruct[]>(
    structuredClone(FRAUD_TYPE_APPROVAL_LIST_DISPLAY_STRUCT),
  );

  visibleFilterInfo = computed(() => {
    return this.filterDisplay().filter(
      (item) =>
        item.value !== null && item.value !== '' && item.value !== undefined,
    );
  });

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly fraudTypeApprovalService: FraudTypeApprovalService,
    private readonly toast: ToastService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.getFraudTypeApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });

    this.getUserList();
  }

  menuTask = computed(() =>
    this.sharedData.checkMenu('APPROVAL-FRAUDTYPE-TASK'),
  );

  menuRequested = computed(() =>
    this.sharedData.checkMenu('APPROVAL-FRAUDTYPE-REQUESTED'),
  );

  checkMenu = (value: string): boolean => {
    return value === 'task' ? this.menuTask() : this.menuRequested();
  };

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'task') this.navigateTo('/home/approval/fraud-type/task-list');
    if (tab === 'requested')
      this.navigateTo('/home/approval/fraud-type/requested-list');
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageQuery = { ...this.pageQuery, sort: param, sortDir: order };

    this.getFraudTypeApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };

    this.getFraudTypeApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  handleFilter(data: any) {
    this.submitFilter = true;
    this.showFilter = false;
    this.pageQuery = { ...this.pageQuery, ...data?.filterBy };

    const temp = { ...data.filterDisplayTemp };

    const dateRange = (from?: string | null, to?: string | null) =>
      `${from ?? ''}${to ? ' - ' + to : ''}`;

    const labelValueMap: Record<string, any> = {
      'Fraud Type': temp.fraudType,
      Description: temp.description,
      'Requested By': temp.requestedBy,
      'Requested Date': dateRange(temp.requestDateFrom, temp.requestDateTo),
      'Reviewed By': temp.approvedBy,
      'Reviewed Date': dateRange(temp.approvalDateFrom, temp.approvalDateTo),
      'Action Type': temp.requestType,
      'Approval Status': temp.approvalStatus,
    };

    const mappingData = this.filterDisplay().map((item) => ({
      ...item,
      value:
        item.label in labelValueMap ? labelValueMap[item.label] : item.value,
    }));

    this.filterDisplay.set(mappingData);

    this.getFraudTypeApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  resetFilter() {
    this.showFilter = false;
    this.submitFilter = false;

    this.filterDisplay.set([...FRAUD_TYPE_APPROVAL_LIST_DISPLAY_STRUCT]);

    this.pageQuery = { ...FRAUD_TYPE_REQUESTED_LIST_PAGE_QUERY_INIT };

    this.getFraudTypeApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  getFraudTypeApprovalList(param: any) {
    this.ngxLoader.start();
    this.fraudTypeApprovalService
      .approvalList(mapFraudTypeApprovalQueryDomainToApi(param))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.tableData = res['data']['content'];
          this.pageInfo = {
            ...this.pageInfo,
            totalElements: res['data']['totalElements'],
            totalPages: res['data']['totalPages'],
          };
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  getUserList() {
    this.fraudTypeApprovalService.getUserList().subscribe({
      next: (res: any) => {
        this.users = res['data'];
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
