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

import {
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
import { MenuService } from '../../../../../core/services/menu.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { smcRequestedListBreadcrumb } from '../../data';
import { StickyTableComponent } from '../../../../../shared/components/sticky-table/sticky-table';
import {
  SMCApproval,
  SMCApprovalQuery,
} from '../../../../approval/smc/domain/models/smc-approval.model';
import {
  SMC_APPROVAL_REQUESTED_LIST_DISPLAY_INIT,
  SMC_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT,
  smcApprRequestedListColumns,
} from '../../../../approval/smc/data';
import { SMCApprovalService } from '../../../../approval/smc/api/services/smc-approval.service';
import { finalize } from 'rxjs';
import { mapSmcDownloadFileParamsDomainToApi } from '../../mappers/smc.mapper';
import { mapSmcApprovalQueryDomainToApi } from '../../../../approval/smc/mappers/smc-approval.mapper';
import { SmcRequestedFilter } from '../../../../approval/smc/components/requested-filter/requested-filter';
@Component({
  selector: 'app-smc-requested-list',
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
    SmcRequestedFilter,
    StickyTableComponent,
    NgbTooltipModule,
  ],
  providers: [DatePipe],
})
export class SmcRequestedListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = smcRequestedListBreadcrumb;

  pageTitle: string = 'SMC';

  tabs: TabProps[] = genericTabsV3;

  activeTab: string = 'requested';

  columns: ColumnDef<SMCApproval>[] = smcApprRequestedListColumns;

  pageQuery: TableState<SMCApprovalQuery> = {
    ...SMC_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT,
  };

  pageInfo: PageInfo = { ...PAGE_INFO_INIT };

  tableData: SMCApproval[] = [];

  users: any[] = [];

  showFilter: boolean = false;

  submitFilter: boolean = false;

  approvalStatus = approvalStatus;

  filterDisplay = signal<FiltersDisplayStruct[]>([
    ...SMC_APPROVAL_REQUESTED_LIST_DISPLAY_INIT,
  ]);

  visibleFilterInfo = computed(() => {
    return this.filterDisplay().filter(
      (item) =>
        item.value !== null && item.value !== '' && item.value !== undefined,
    );
  });

  columnsPinned: string[] = ['no', 'fileName'];

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly smcApprovalService: SMCApprovalService,
    private readonly toast: ToastService,
    private menu: MenuService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initData();
    this.getUserList();
  }

  menuUpload = computed(() => this.menu.checkMenu('ACTION-SMC-UPLOAD'));

  menuView = computed(() => this.menu.checkMenu('ACTION-SMC-VIEW'));

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

    if (tab === 'upload') this.navigateTo('/home/action/smc/upload');
    if (tab === 'requested') this.navigateTo('/home/action/smc/requested');
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

    this.filterDisplay.set([...SMC_APPROVAL_REQUESTED_LIST_DISPLAY_INIT]);

    this.pageQuery = {
      ...SMC_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT,
    };

    this.initData();
  }

  getApprovalList(param: SMCApprovalQuery) {
    this.ngxLoader.start();

    this.smcApprovalService
      .list(mapSmcApprovalQueryDomainToApi(param))
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
    this.smcApprovalService.getUserList().subscribe({
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
    this.smcApprovalService
      .downloadFile(id, mapSmcDownloadFileParamsDomainToApi(payload))
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
