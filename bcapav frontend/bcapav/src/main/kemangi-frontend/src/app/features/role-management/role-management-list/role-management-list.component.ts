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

import { RoleManagementService } from '../services/role-management.service';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal.service';

import { Role, RoleQuery } from '../domain/models/role.model';

import {
  ContentLayout,
  BreadcrumbProps,
  CustomTabComponent,
  TabProps,
  PAGE_INFO_INIT,
  genericTabsV1,
  StickyTableComponent,
  TableState,
} from '../../../shared';
import { mapRoleQueryDomainToApi } from '../mapper/role.mapper';
import {
  roleManagementListBreadcrumb,
  roleListColumns,
  ROLE_TABLE_QUERY_INIT,
} from '../data';
import { ToastService } from '../../../core/services/toast.service';
//import { TruncateOrDashPipe } from '../../../shared/pipes/truncate-or-dash.pipe';
import { SharedDataService } from '../../../core/services/shared-data.service';

@Component({
  selector: 'app-role-management-list',
  templateUrl: './role-management-list.component.html',
  styleUrls: [
    './role-management-list.component.scss',
    '../../../shared/styles/index.scss',
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
    //TruncateOrDashPipe,
    CustomTabComponent,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class RoleManagementListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = roleManagementListBreadcrumb;

  pageTitle: string = 'Role Management';

  tabs: TabProps[] = genericTabsV1;

  activeTab: string = 'current';

  columns: ColumnDef<Role>[] = roleListColumns;

  pageQuery: TableState<RoleQuery> = {
    ...ROLE_TABLE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: Role[] = [];

  columnsPinned: string[] = ['no', 'roleId', 'roleName'];

  editPermission: boolean = false;
  createPermission: boolean = false;
  deletePermission: boolean = false;

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly roleManagementService: RoleManagementService,
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
    this.getRoleList({ ...this.pageQuery, page: this.pageQuery.page - 1 });
  }

  handlePermission() {
    this.createPermission = this.checkMenu('create');
    this.deletePermission = this.checkMenu('delete');
    this.editPermission = this.checkMenu('edit');
  }

  checkCreatePermission = computed(() =>
    this.sharedData.checkMenu('ROLEMANAGEMENT-ROLE-CREATE'),
  );

  checkEditPermission = computed(() =>
    this.sharedData.checkMenu('ROLEMANAGEMENT-ROLE-UPDATE'),
  );

  checkDeletePermission = computed(() =>
    this.sharedData.checkMenu('ROLEMANAGEMENT-ROLE-DELETE'),
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

    if (tab === 'current') this.navigateTo('/home/role-management/');
    if (tab === 'requested')
      this.navigateTo('/home/role-management/requested-list');
  }

  getRoleList(param: RoleQuery) {
    this.ngxLoader.start();

    this.roleManagementService
      .roleList(mapRoleQueryDomainToApi(param))
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
    this.initData();
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };
    this.initData();
  }

  handleQuery() {
    this.pageQuery = { ...this.pageQuery, page: 1 };
    this.initData();
  }

  downloadRoleList() {
    this.ngxLoader.start();
    this.roleManagementService
      .getRoleListZip()
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (resp: any) => {
          const contentDisposition = resp.headers.get('Content-Disposition');
          let filename = 'roles.xlsx';
          if (contentDisposition) {
            const match = contentDisposition.match(/filename="?([^"]+)"?/);
            if (match) filename = match[1];
          }

          const blob = new Blob([resp.body!], { type: 'application/zip' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 100);
        },
        error: (err: any) => {
          alert('Download failed!');
        },
      });
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
