import { Component, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { ColumnDef } from '@tanstack/table-core';

//import { TruncateOrDashPipe } from '../../../../../shared/pipes/truncate-or-dash.pipe';
import { StickyTableComponent } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import {
  CustomTabComponent,
  ContentLayout,
  BreadcrumbProps,
  TabProps,
  PAGE_INFO_INIT,
  TableState,
} from '../../../../../shared';
import { approvalTabs } from '../../../../../shared';
import {
  roleApprovalTaskListBreadcrumb,
  ROLE_TASK_LIST_PAGE_QUERY_INIT,
  roleApprTaskListColumns,
} from '../../data';
import { RoleApprovalService } from '../../services/role-approval.service';

import {
  RoleApprovalQuery,
  RoleApproval,
} from '../../domain/models/role-approval.model';
import { mapRoleApprovalQueryDomainToApi } from '../../mappers/role-approval.mapper';
import { SharedDataService } from '../../../../../core/services/shared-data.service';
@Component({
  selector: 'app-role-approval-task-list',
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
export class RoleApprovalTaskListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = roleApprovalTaskListBreadcrumb;

  pageTitle: string = 'Role Approval';

  tabs: TabProps[] = approvalTabs;

  activeTab: string = 'task';

  columns: ColumnDef<RoleApproval>[] = roleApprTaskListColumns;

  pageQuery: TableState<RoleApprovalQuery> = {
    ...ROLE_TASK_LIST_PAGE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: RoleApproval[] = [];

  columnsPinned: string[] = ['no', 'roleId', 'roleName'];

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly roleApprovalService: RoleApprovalService,
    private readonly toast: ToastService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.getRoleApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  menuTask = computed(() => this.sharedData.checkMenu('APPROVAL-ROLE-TASK'));

  menuRequested = computed(() =>
    this.sharedData.checkMenu('APPROVAL-ROLE-REQUESTED'),
  );

  checkMenu = (value: string): boolean => {
    return value === 'task' ? this.menuTask() : this.menuRequested();
  };

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'task') this.navigateTo('/home/approval/role/task-list');
    if (tab === 'requested')
      this.navigateTo('/home/approval/role/requested-list');
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageQuery = { ...this.pageQuery, sort: param, sortDir: order };
    this.getRoleApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };
    this.getRoleApprovalList({ ...this.pageQuery, page: e - 1 });
  }

  getRoleApprovalList(param: RoleApprovalQuery) {
    this.ngxLoader.start();
    this.roleApprovalService
      .roleApprovalList(mapRoleApprovalQueryDomainToApi(param))
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
