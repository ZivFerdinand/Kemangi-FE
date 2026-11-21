import { Component, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import {
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { ColumnDef } from '@tanstack/table-core';

import { BinService } from '../api';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import { BIN, BinQuery } from '../domain/models/bin.model';
import {
  ContentLayout,
  BreadcrumbProps,
  PAGE_INFO_INIT,
  CustomTabComponent,
  TabProps,
  genericTabsV1,
  StickyTableComponent,
  TableState,
} from '../../../../shared';
import {
  binListColumns,
  binListBreadcrumb,
  BIN_TABLE_QUERY_INIT,
} from '../data';
import { ToastService } from '../../../../core/services/toast.service';
import { mapBinQueryDomainToApi } from '../mappers/bin.mapper';
import { SharedDataService } from '../../../../core/services/shared-data.service';
@Component({
  selector: 'app-bin-list',
  templateUrl: './bin-list.component.html',
  styleUrls: [
    './bin-list.component.scss',
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
    RouterLink,
    ContentLayout,
    CustomTabComponent,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class BinListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = binListBreadcrumb;

  pageTitle: string = 'BIN';

  tabs: TabProps[] = genericTabsV1;

  activeTab: string = 'current';

  columns: ColumnDef<BIN>[] = binListColumns;

  pageQuery: TableState<BinQuery> = {
    ...BIN_TABLE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: BIN[] = [];

  columnsPinned: string[] = ['no', 'binNumber', 'binDescription'];

  editPermission: boolean = false;
  createPermission: boolean = false;
  deletePermission: boolean = false;

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly binService: BinService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initData();
    this.handlePermission();
  }

  initData() {
    this.getBinList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handlePermission() {
    this.createPermission = this.checkMenu('create');
    this.deletePermission = this.checkMenu('delete');
    this.editPermission = this.checkMenu('edit');
  }

  checkCreatePermission = computed(() =>
    this.sharedData.checkMenu('MASTER-BINNUMBER-CREATE'),
  );

  checkEditPermission = computed(() =>
    this.sharedData.checkMenu('MASTER-BINNUMBER-UPDATE'),
  );

  checkDeletePermission = computed(() =>
    this.sharedData.checkMenu('MASTER-BINNUMBER-DELETE'),
  );

  checkMenu = (value: string): boolean => {
    if (value === 'create') {
      return this.checkCreatePermission();
    } else if (value === 'edit') {
      return this.checkEditPermission();
    } else {
      return this.checkDeletePermission();
    }
  };

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'current') this.navigateTo('/home/data-master/bin/');
    if (tab === 'requested')
      this.navigateTo('/home/data-master/bin/requested-list');
  }

  getBinList(query: BinQuery) {
    this.ngxLoader.start();

    this.binService
      .binList(mapBinQueryDomainToApi(query))
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

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageQuery = {
      ...this.pageQuery,
      sort: param === 'lastUpdatedDt' ? 'lastRequestDt' : param,
      sortDir: order,
    };
    this.getBinList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };
    this.getBinList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handleQuery() {
    this.pageQuery = { ...this.pageQuery, page: 1 };
    this.getBinList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
