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
  approvalTabs,
  PAGE_INFO_INIT,
  TableState,
  StickyTableComponent,
} from '../../../../../shared';
import {
  fraudTypeApprTaskListColumns,
  fraudTypeApprovalTaskListBreadcrumb,
} from '../../data';
import { FRAUD_TYPE_TASK_LIST_PAGE_QUERY_INIT } from '../../data';
import {
  FraudTypeApprovalQuery,
  FraudTypeApproval,
} from '../../domain/models/fraud-type-approval.model';
import { FraudTypeApprovalService } from '../../api/services/fraud-type-approval.service';
import { mapFraudTypeApprovalQueryDomainToApi } from '../../mappers/fraud-type-approval.mapper';
import { SharedDataService } from '../../../../../core/services/shared-data.service';
@Component({
  selector: 'app-fraud-type-task-list',
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
    StickyTableComponent,
    ContentLayout,
  ],
  providers: [DatePipe],
})
export class FraudTypeApprovalTaskListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = fraudTypeApprovalTaskListBreadcrumb;

  pageTitle: string = 'Fraud Type Approval';

  tabs: TabProps[] = approvalTabs;

  activeTab: string = 'task';

  columns: ColumnDef<FraudTypeApproval>[] = fraudTypeApprTaskListColumns;

  pageQuery: TableState<FraudTypeApprovalQuery> = {
    ...FRAUD_TYPE_TASK_LIST_PAGE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: FraudTypeApproval[] = [];

  columnsPinned: string[] = ['no', 'fraudType', 'description'];

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
    this.getFraudTypeApprovalList({ ...this.pageQuery, page: e - 1 });
  }

  getFraudTypeApprovalList(param: FraudTypeApprovalQuery) {
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

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
