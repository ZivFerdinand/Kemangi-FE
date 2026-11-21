import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnDef } from '@tanstack/angular-table';
import { finalize } from 'rxjs';

import {
  requestType,
  approvalStatus,
  PAGE_INFO_INIT,
  genericTabsV3,
} from '../../../../../shared/data';
import {
  BreadcrumbProps,
  TabProps,
  FiltersDisplayStruct,
  TableState,
  PageInfo,
} from '../../../../../shared/interfaces';
import {
  CustomTabComponent,
  ContentLayout,
  CapitalizePipe,
} from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { BlockUnblockAccountBalanceApprovalService } from '../../../../approval/block-unblock-account-balance/api/services/block-unblock-account-balance-approval.service';

import {
  BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT,
  BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_REQUESTED_LIST_DISPLAY_INIT,
} from '../../../../approval/block-unblock-account-balance/data';
import { blockUnblockAccountBalanceRequestedListBreadcrumb } from '../../data';

import {
  mapBlockUnblockAccountBalanceApprovalQueryDomainToApi,
  mapBlockUnblockAccountBalanceDownloadFileParamsDomainToApi,
} from '../../../../approval/block-unblock-account-balance/mappers/block-unblock-account-balance-approval.mapper';
import { BlockUnblockAccountBalanceRequestedFilter } from '../../../../approval/block-unblock-account-balance/components/requested-filter/requested-filter';
import { BlockUnblockAccountBalanceApprovalQuery } from '../../../../approval/block-unblock-account-balance/domain/models/block-unblock-account-balance-approval.model';
import { BlockUnblockAccountBalanceApproval } from '../../../../approval/block-unblock-account-balance/domain/models/block-unblock-account-balance-approval.model';
import { blockUnblockAccountBalanceApprRequestedListColumns } from '../../../../approval/block-unblock-account-balance/data';
import { StickyTableComponent } from '../../../../../shared/components/sticky-table/sticky-table';
import { SharedDataService } from '../../../../../core/services/shared-data.service';
@Component({
  selector: 'app-block-unblock-account-balance-requested-list',
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
    NgbTooltipModule,
  ],
  providers: [DatePipe],
})
export class BlockUnblockAccountBalanceRequestedListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] =
    blockUnblockAccountBalanceRequestedListBreadcrumb;

  pageTitle: string = 'Block/Unblock Account Balance';

  tabs: TabProps[] = genericTabsV3;

  activeTab: string = 'requested';

  columns: ColumnDef<BlockUnblockAccountBalanceApproval>[] =
    blockUnblockAccountBalanceApprRequestedListColumns;

  pageQuery: TableState<BlockUnblockAccountBalanceApprovalQuery> = {
    ...BLOCK_UNBLOCK_ACCOUNT_BALANCE_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT,
  };

  pageInfo: PageInfo = { ...PAGE_INFO_INIT };

  tableData: BlockUnblockAccountBalanceApproval[] = [];

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

  columnsPinned: string[] = ['no', 'accountType', 'action'];

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

  menuUpload = computed(() =>
    this.sharedData.checkMenu('ACTION-BLOCKUNBLOCKBALANCE-UPLOAD'),
  );

  menuView = computed(() =>
    this.sharedData.checkMenu('ACTION-BLOCKUNBLOCKBALANCE-VIEW'),
  );

  checkMenu = (value: string): boolean => {
    return value === 'upload' ? this.menuUpload() : this.menuView();
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

    if (tab === 'upload')
      this.navigateTo('/home/action/block-unblock-account-balance/upload');
    if (tab === 'requested')
      this.navigateTo('/home/action/block-unblock-account-balance/requested');
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageQuery = { ...this.pageQuery, sort: param, sortDir: order };

    this.initData();
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };

    this.initData();
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

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
