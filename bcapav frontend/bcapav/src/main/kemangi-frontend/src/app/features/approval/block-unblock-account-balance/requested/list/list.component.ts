import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnDef } from '@tanstack/angular-table';
import { finalize } from 'rxjs';

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
  PageInfo,
  TableState,
} from '../../../../../shared/interfaces';
import {
  CustomTabComponent,
  ContentLayout,
  CapitalizePipe,
} from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { BlockUnblockAccountBalanceApprovalService } from '../../api/services/block-unblock-account-balance-approval.service';
import {
  blockUnblockAccountBalanceApprRequestedListColumns,
  blockUnblockAccountBalanceApprovalRequestedListBreadcrumb,
} from '../../data';

import {
  mapBlockUnblockAccountBalanceDownloadFileParamsDomainToApi,
  mapBlockUnblockAccountBalanceApprovalQueryDomainToApi,
} from '../../mappers/block-unblock-account-balance-approval.mapper';

import {
  BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT,
  BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_REQUESTED_LIST_DISPLAY_INIT,
} from '../../data';
import { BlockUnblockAccountBalanceRequestedFilter } from '../../components/requested-filter/requested-filter';
import { BlockUnblockAccountBalanceApprovalQuery } from '../../domain/models/block-unblock-account-balance-approval.model';

import { BlockUnblockAccountBalanceApproval } from '../../domain/models/block-unblock-account-balance-approval.model';
import { StickyTableComponent } from '../../../../../shared/components/sticky-table/sticky-table';
import { SharedDataService } from '../../../../../core/services/shared-data.service';
@Component({
  selector: 'app-block-unblock-account-balance-appr-requested-list',
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
    BlockUnblockAccountBalanceRequestedFilter,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class BlockUnblockAccountBalanceApprovalRequestedListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] =
    blockUnblockAccountBalanceApprovalRequestedListBreadcrumb;

  pageTitle: string = 'Block/Unblock Account Balance Approval';

  tabs: TabProps[] = approvalTabs;

  activeTab: string = 'requested';

  columns: ColumnDef<BlockUnblockAccountBalanceApproval>[] =
    blockUnblockAccountBalanceApprRequestedListColumns;

  pageInfo: PageInfo = { ...PAGE_INFO_INIT };

  tableData: BlockUnblockAccountBalanceApproval[] = [];

  pageQuery: TableState<BlockUnblockAccountBalanceApprovalQuery> = {
    ...BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT,
  };

  columnsPinned: string[] = ['no', 'accountType', 'action'];

  users: any[] = [];

  showFilter: boolean = false;

  submitFilter: boolean = false;

  requestType = requestType;

  approvalStatus = approvalStatus;

  filterDisplay = signal<FiltersDisplayStruct[]>([
    ...BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_REQUESTED_LIST_DISPLAY_INIT,
  ]);

  visibleFilterInfo = computed(() => {
    return this.filterDisplay().filter(
      (item) =>
        item.value !== null && item.value !== '' && item.value !== undefined,
    );
  });

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly blockUnblockAccountBalanceApprovalService: BlockUnblockAccountBalanceApprovalService,
    private readonly toast: ToastService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initData();
    this.getUserList();
  }

  menuTask = computed(() =>
    this.sharedData.checkMenu('APPROVAL-BLOCKUNBLOCKBALANCE-TASK'),
  );

  menuRequested = computed(() =>
    this.sharedData.checkMenu('APPROVAL-BLOCKUNBLOCKBALANCE-REQUESTED'),
  );

  checkMenu = (value: string): boolean => {
    return value === 'task' ? this.menuTask() : this.menuRequested();
  };

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  initData() {
    this.getApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'task')
      this.navigateTo('/home/approval/block-unblock-account-balance/task-list');
    if (tab === 'requested')
      this.navigateTo(
        '/home/approval/block-unblock-account-balance/requested-list',
      );
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
      'Account Type': temp.accountType,
      Action: temp.action,
      'Process Status': temp.processStatus,
      'Approval Status': temp.approvalStatus,
      'Requested By': temp.requestedBy,
      'Requested Date': dateRange(temp.requestDateFrom, temp.requestDateTo),
      'Reviewed By': temp.approvedBy,
      'Reviewed Date': dateRange(temp.approvalDateFrom, temp.approvalDateTo),
    };

    const mappingData = this.filterDisplay().map((item) => ({
      ...item,
      value:
        item.label in labelValueMap ? labelValueMap[item.label] : item.value,
    }));

    this.filterDisplay.set(mappingData);

    this.initData();
  }

  resetFilter() {
    this.showFilter = false;
    this.submitFilter = false;

    this.filterDisplay.set([
      ...BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_REQUESTED_LIST_DISPLAY_INIT,
    ]);

    this.pageQuery = {
      ...BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT,
    };

    this.initData();
  }

  getApprovalList(param: BlockUnblockAccountBalanceApprovalQuery) {
    this.ngxLoader.start();
    this.blockUnblockAccountBalanceApprovalService
      .list(mapBlockUnblockAccountBalanceApprovalQueryDomainToApi(param))
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
    this.blockUnblockAccountBalanceApprovalService.getUserList().subscribe({
      next: (res: any) => {
        this.users = res['data'];
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  handleDownload(
    id: number,
    fileName: string,
    validStatus: boolean | null,
    processStatus: boolean | null,
  ) {
    const payload = { validStatus: validStatus, processStatus: processStatus };
    this.blockUnblockAccountBalanceApprovalService
      .downloadFile(
        id,
        mapBlockUnblockAccountBalanceDownloadFileParamsDomainToApi(payload),
      )
      .subscribe((response) => {
        const blob = response.body!;

        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ?.split('filename=')[1]
          ?.replace(/"/g, '')
          ?.trim();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        const name = fileName.split('.');

        link.href = url;
        link.download =
          filename ||
          `${name[0]}${validStatus === true ? '_Valid' : validStatus === false ? '_Invalid' : ''}.${name[1]}`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageQuery = { ...this.pageQuery, sort: param, sortDir: order };
    this.initData();
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };
    this.initData();
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
