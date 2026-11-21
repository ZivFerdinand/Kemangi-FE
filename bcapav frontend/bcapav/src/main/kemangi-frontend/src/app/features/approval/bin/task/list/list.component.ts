import { Component, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { ColumnDef } from '@tanstack/table-core';

import { ToastService } from '../../../../../core/services/toast.service';
import {
  CustomTabComponent,
  ContentLayout,
  BreadcrumbProps,
  TabProps,
  PAGE_INFO_INIT,
  approvalTabs,
  TableState,
  StickyTableComponent,
} from '../../../../../shared';
import {
  binApprovalTaskListBreadcrumb,
  binApprTaskListColumns,
  BIN_TASK_LIST_PAGE_QUERY_INIT,
} from '../../data';
import {
  BinApprovalQuery,
  BinApproval,
} from '../../domain/models/bin-approval.model';
import { BinApprovalService } from '../../api/services/bin-approval.service';
import { mapBinApprovalQueryDomainToApi } from '../../mappers/bin-approval.mapper';
import { SharedDataService } from '../../../../../core/services/shared-data.service';

@Component({
  selector: 'app-bin-task-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    RouterLink,
    CustomTabComponent,
    ContentLayout,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class BinApprovalTaskListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = binApprovalTaskListBreadcrumb;

  pageTitle: string = 'BIN Approval';

  tabs: TabProps[] = approvalTabs;

  activeTab: string = 'task';

  columns: ColumnDef<BinApproval>[] = binApprTaskListColumns;

  pageQuery: TableState<BinApprovalQuery> = {
    ...BIN_TASK_LIST_PAGE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: BinApproval[] = [];

  columnsPinned: string[] = ['no', 'binNumber', 'binDescription'];

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly binApprovalService: BinApprovalService,
    private readonly toast: ToastService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.getBinApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  menuTask = computed(() =>
    this.sharedData.checkMenu('APPROVAL-BINNUMBER-TASK'),
  );

  menuRequested = computed(() =>
    this.sharedData.checkMenu('APPROVAL-BINNUMBER-REQUESTED'),
  );

  checkMenu = (value: string): boolean => {
    return value === 'task' ? this.menuTask() : this.menuRequested();
  };

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'task') this.navigateTo('/home/approval/bin/task-list');
    if (tab === 'requested')
      this.navigateTo('/home/approval/bin/requested-list');
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

  getBinApprovalList(param: BinApprovalQuery) {
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

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
