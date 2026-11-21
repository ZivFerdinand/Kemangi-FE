import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { ColumnDef } from '@tanstack/table-core';

//import { TruncateOrDashPipe } from '../../../../../shared/pipes/truncate-or-dash.pipe';
import { RoleApprovalService } from '../../api/services/role-approval.service';
import { ApiService } from '../../../../../core/services/api.service';
import { approvalTabs } from '../../../../../shared/data';
import {
  RoleApprovalQuery,
  RoleApproval,
} from '../../domain/models/role-approval.model';
import { BreadcrumbProps, TabProps } from '../../../../../shared';
import { roleApprovalRequestedListBreadcrumb } from '../../data';
import {
  CustomTabComponent,
  ContentLayout,
  StickyTableComponent,
  TableState,
} from '../../../../../shared';
import { roleApprRequestedListColumns } from '../../data';
import { CapitalizePipe } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { FiltersDisplayStruct } from '../../../../../shared';
import { PAGE_INFO_INIT } from '../../../../../shared/data';
import {
  ROLE_REQUESTED_LIST_PAGE_QUERY_INIT,
  ROLE_APPROVAL_LIST_DISPLAY_INIT,
} from '../../data';
import { mapRoleApprovalQueryDomainToApi } from '../../mappers/role-approval.mapper';
import { RoleApprovalRequestedFilter } from '../../components';
import { SharedDataService } from '../../../../../core/services/shared-data.service';

@Component({
  selector: 'app-role-approval-requested-list',
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
    RouterLink,
    CustomTabComponent,
    ContentLayout,
    FormsModule,
    // TruncateOrDashPipe,
    CapitalizePipe,
    RoleApprovalRequestedFilter,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class RoleApprovalRequestedListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = roleApprovalRequestedListBreadcrumb;

  pageTitle: string = 'Role Approval';

  tabs: TabProps[] = approvalTabs;

  activeTab: string = 'requested';

  columns: ColumnDef<RoleApproval>[] = roleApprRequestedListColumns;

  pageQuery: TableState<RoleApprovalQuery> = {
    ...ROLE_REQUESTED_LIST_PAGE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: RoleApproval[] = [];

  columnsPinned: string[] = ['no', 'roleId', 'roleName'];

  users: any[] = [];
  roles: any[] = [];

  showFilter: boolean = false;

  submitFilter: boolean = false;

  filterDisplay = signal<FiltersDisplayStruct[]>([
    ...ROLE_APPROVAL_LIST_DISPLAY_INIT,
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
    private readonly roleApprovalService: RoleApprovalService,
    private readonly toast: ToastService,
    private readonly apiService: ApiService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initData();
    this.getUserList();
    this.getRoleList();
  }

  menuTask = computed(() => this.sharedData.checkMenu('APPROVAL-ROLE-TASK'));

  menuRequested = computed(() =>
    this.sharedData.checkMenu('APPROVAL-ROLE-REQUESTED'),
  );

  checkMenu = (value: string): boolean => {
    return value === 'task' ? this.menuTask() : this.menuRequested();
  };

  initData() {
    this.getRoleApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

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
      'Role ID - Name': temp.roleId,
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

    this.initData();
  }

  resetFilter() {
    this.showFilter = false;
    this.submitFilter = false;

    this.filterDisplay.set([...ROLE_APPROVAL_LIST_DISPLAY_INIT]);

    this.pageQuery = { ...ROLE_REQUESTED_LIST_PAGE_QUERY_INIT };

    this.initData();
  }

  getRoleApprovalList(param: RoleApprovalQuery) {
    this.ngxLoader.start();

    this.roleApprovalService
      .list(mapRoleApprovalQueryDomainToApi(param))
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
    this.apiService.getUserList().subscribe({
      next: (res: any) => {
        this.users = res['data'];
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getRoleList() {
    this.apiService.getRoleList().subscribe({
      next: (res: any) => {
        this.roles = res['data'];
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
