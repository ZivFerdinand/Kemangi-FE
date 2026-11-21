import { Component, OnInit, signal } from '@angular/core';
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
  binRequestedListColumns,
  binRequestedListBreadcrumb,
} from '../../data';
import {
  BIN_REQUESTED_LIST_PAGE_QUERY_INIT,
  BIN_APPROVAL_LIST_DISPLAY_INIT,
} from '../../../../approval/bin/data';
import { BinApprovalService } from '../../../../approval/bin/api/services/bin-approval.service';
import {
  BreadcrumbProps,
  TabProps,
  genericTabsV1,
  PAGE_INFO_INIT,
  CustomTabComponent,
  ContentLayout,
  CapitalizePipe,
  FiltersDisplayStruct,
  TableState,
  StickyTableComponent,
} from '../../../../../shared';

import { ToastService } from '../../../../../core/services/toast.service';
import {
  BinApprovalQuery,
  BinApproval,
} from '../../../../approval/bin/domain/models/bin-approval.model';
import { mapBinApprovalQueryDomainToApi } from '../../../../approval/bin/mappers/bin-approval.mapper';
import { BinRequestedFilter } from '../../../../approval/bin/components/bin-requested-filter/bin-requested-filter';

@Component({
  selector: 'app-bin-requested-list',
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
    BinRequestedFilter,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class BinRequestedListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = binRequestedListBreadcrumb;

  pageTitle: string = 'BIN';

  tabs: TabProps[] = genericTabsV1;

  activeTab: string = 'requested';

  columns: ColumnDef<BinApproval>[] = binRequestedListColumns;

  pageQuery: TableState<BinApprovalQuery> = {
    ...BIN_REQUESTED_LIST_PAGE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: BinApproval[] = [];

  columnsPinned: string[] = ['no', 'binNumber', 'binDescription'];

  users: any[] = [];

  showFilter: boolean = false;

  submitFilter: boolean = false;

  filterDisplay = signal<FiltersDisplayStruct[]>([
    ...BIN_APPROVAL_LIST_DISPLAY_INIT,
  ]);

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly binApprovalService: BinApprovalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.getBinApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });

    this.getUserList();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'current') this.navigateTo('/home/data-master/bin');
    if (tab === 'requested')
      this.navigateTo('/home/data-master/bin/requested-list');
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageQuery = { ...this.pageQuery, sort: param, sortDir: order };
    this.getBinApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };
    this.getBinApprovalList({ ...this.pageQuery, page: e - 1 });
  }

  handleFilter(data: any) {
    this.submitFilter = true;
    this.showFilter = false;
    this.pageQuery = { ...this.pageQuery, ...data?.filterBy };

    const temp = { ...data.filterDisplayTemp };

    const dateRange = (from?: string | null, to?: string | null) =>
      `${from ?? ''}${to ? ' - ' + to : ''}`;

    const labelValueMap: Record<string, any> = {
      BIN: temp.binNumber,
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

    this.getBinApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  resetFilter() {
    this.showFilter = false;
    this.submitFilter = false;

    this.filterDisplay.set([...BIN_APPROVAL_LIST_DISPLAY_INIT]);

    this.pageQuery = { ...BIN_REQUESTED_LIST_PAGE_QUERY_INIT };

    this.getBinApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  get visibleFilterInfo() {
    return this.filterDisplay().filter(
      (item) =>
        item.value !== null && item.value !== '' && item.value !== undefined,
    );
  }

  getBinApprovalList(param: any) {
    this.ngxLoader.start();
    this.binApprovalService
      .list(mapBinApprovalQueryDomainToApi(param))
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
    this.binApprovalService.getUserList().subscribe({
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
