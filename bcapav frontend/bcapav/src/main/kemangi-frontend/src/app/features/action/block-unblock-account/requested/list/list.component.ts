import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnDef } from '@tanstack/table-core';
import { finalize } from 'rxjs';

import { BlockUnblockAccountApproval } from '../../../../approval/block-unblock-account/domain/models/block-unblock-approval.model';
import { blockUnblockAccountApprRequestedListColumns } from '../../../../approval/block-unblock-account/data';
import {
  requestType,
  approvalStatus,
  PAGE_INFO_INIT,
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
import { BlockUnblockApprovalService } from '../../../../approval/block-unblock-account/api/services/block-unblock-approval.service';
import {
  BLOCK_UNBLOCK_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT,
  BLOCK_UNBLOCK_APPROVAL_REQUESTED_LIST_DISPLAY_INIT,
} from '../../../../approval/block-unblock-account/data';
import { blockUnblockRequestedListBreadcrumb } from '../../data';
import {
  mapBlockUnblockApprovalQueryDomainToApi,
  mapBlockUnblockDownloadFileParamsDomainToApi,
} from '../../../../approval/block-unblock-account/mappers/block-unblock-approval.mapper';

import { BlockUnblockRequestedFilter } from '../../../../approval/block-unblock-account/components/block-unblock-requested-filter/block-unblock-requested-filter';
import { BlockUnblockApprovalQuery } from '../../../../approval/block-unblock-account/domain/models/block-unblock-approval.model';
import { genericTabsV3 } from '../../../../../shared/data';
import { StickyTableComponent } from '../../../../../shared/components/sticky-table/sticky-table';
import { SharedDataService } from '../../../../../core/services/shared-data.service';
@Component({
  selector: 'app-block-unblock-requested-list',
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
    BlockUnblockRequestedFilter,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class BlockUnblockRequestedListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = blockUnblockRequestedListBreadcrumb;

  pageTitle: string = 'Block/Unblock Account';

  tabs: TabProps[] = genericTabsV3;

  activeTab: string = 'requested';

  columns: ColumnDef<BlockUnblockAccountApproval>[] =
    blockUnblockAccountApprRequestedListColumns;

  pageQuery: TableState<BlockUnblockApprovalQuery> = {
    ...BLOCK_UNBLOCK_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT,
  };

  pageInfo: PageInfo = { ...PAGE_INFO_INIT };

  tableData: BlockUnblockAccountApproval[] = [];

  columnsPinned: string[] = ['no', 'action', 'fileName'];

  users: any[] = [];

  showFilter: boolean = false;

  submitFilter: boolean = false;

  requestType = requestType;

  approvalStatus = approvalStatus;

  filterDisplay = signal<FiltersDisplayStruct[]>([
    ...BLOCK_UNBLOCK_APPROVAL_REQUESTED_LIST_DISPLAY_INIT,
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
    private readonly blockUnblockApprovalService: BlockUnblockApprovalService,
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
    this.sharedData.checkMenu('ACTION-BLOCKUNBLOCK-UPLOAD'),
  );

  menuView = computed(() =>
    this.sharedData.checkMenu('ACTION-BLOCKUNBLOCK-VIEW'),
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
      this.navigateTo('/home/action/block-unblock-account/upload');
    if (tab === 'requested')
      this.navigateTo('/home/action/block-unblock-account/requested');
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
      Action: temp.action,
      'Requested By': temp.requestedBy,
      'Requested Date': dateRange(temp.requestDateFrom, temp.requestDateTo),
      'Approval Status': temp.approvalStatus,
      'Process Status': temp.processStatus,
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
      ...BLOCK_UNBLOCK_APPROVAL_REQUESTED_LIST_DISPLAY_INIT,
    ]);

    this.pageQuery = {
      ...BLOCK_UNBLOCK_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT,
    };

    this.initData();
  }

  getApprovalList(param: BlockUnblockApprovalQuery) {
    this.ngxLoader.start();
    this.blockUnblockApprovalService
      .list(mapBlockUnblockApprovalQueryDomainToApi(param))
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
    this.blockUnblockApprovalService.getUserList().subscribe({
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
    this.blockUnblockApprovalService
      .downloadFile(id, mapBlockUnblockDownloadFileParamsDomainToApi(payload))
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
