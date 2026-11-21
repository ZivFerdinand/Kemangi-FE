import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnDef } from '@tanstack/table-core';
import { finalize } from 'rxjs';

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
} from '../../../../../shared/interfaces';
import {
  CustomTabComponent,
  StickyTableComponent,
  ContentLayout,
  CapitalizePipe,
} from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { RuleApprovalService } from '../../../../approval/rule/api/services/rule-approval.service';
import { mapRuleApprovalQueryDomainToApi } from '../../../../approval/rule/mappers/rule-approval.mapper';
import {
  ruleRequestedListBreadcrumb,
  ruleRequestedListColumns,
} from '../../data';
import {
  RULE_APPROVAL_REQUESTED_LIST_DISPLAY_INIT,
  RULE_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT,
} from '../../../../approval/rule/data';

import { RuleRequestedFilter } from '../../../../approval/rule/components/rule-requested-filter/rule-requested-filter';
import {
  RuleApproval,
  RuleApprovalQuery,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import { ruleTabs } from '../../data';
import { SharedDataService } from '../../../../../core/services/shared-data.service';

@Component({
  selector: 'app-rule-requested-list',
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
    CapitalizePipe,
    RuleRequestedFilter,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class RuleRequestedListV2Component implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = ruleRequestedListBreadcrumb;

  pageTitle: string = 'Rule';

  tabs: TabProps[] = ruleTabs;

  activeTab: string = 'requested';

  columns: ColumnDef<RuleApproval>[] = ruleRequestedListColumns;

  pageQuery: TableState<RuleApprovalQuery> = {
    ...RULE_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: RuleApproval[] = [];

  columnsPinned: string[] = ['no', 'ruleId', 'ruleName'];

  users: any[] = [];

  rules: any[] = [];

  createPermission: boolean = false;

  showFilter: boolean = false;

  submitFilter: boolean = false;

  requestType = requestType;

  approvalStatus = approvalStatus;

  filterDisplay = signal<FiltersDisplayStruct[]>([
    ...RULE_APPROVAL_REQUESTED_LIST_DISPLAY_INIT,
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
    private readonly ruleApprovalService: RuleApprovalService,
    private readonly toast: ToastService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initData();
    this.handlePermission();
    this.getUserList();
    this.getRuleIdList();
  }

  initData() {
    this.getRuleApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handlePermission() {
    this.createPermission = this.checkMenu('create');
  }

  checkCreatePermission = computed(() =>
    this.sharedData.checkMenu('RULEMANAGEMENT-RULE-CREATE'),
  );

  checkEditPermission = computed(() =>
    this.sharedData.checkMenu('RULEMANAGEMENT-RULE-UPDATE'),
  );

  checkDeletePermission = computed(() =>
    this.sharedData.checkMenu('RULEMANAGEMENT-RULE-DELETE'),
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
    if (path === '/home/rule-management/rule/create') {
      this.router.navigate([path], {
        queryParams: {
          from: 'requested',
        },
      });

      return;
    }

    this.router.navigate([path]);
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'current')
      this.navigateTo('/home/rule-management/rule/current/');
    if (tab === 'expired')
      this.navigateTo('/home/rule-management/rule/expired-soon/');
    if (tab === 'task') this.navigateTo('/home/rule-management/rule/task/');
    if (tab === 'requested')
      this.navigateTo('/home/rule-management/rule/requested/');
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageQuery = { ...this.pageQuery, sort: param, sortDir: order };

    this.getRuleApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };

    this.getRuleApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
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
      'Rule ID': temp.ruleId,
      'Rule Name': temp.ruleName,
      'Short Description': temp.shortDescription,
      'Effective Date': dateRange(temp.effectiveDateFrom, temp.effectiveDateTo),
      'Requested By': temp.requestedBy,
      'Requested Date': dateRange(temp.requestDateFrom, temp.requestDateTo),
      'Review 1 By': temp.approved1By,
      'Review 1 Date': dateRange(temp.approval1DateFrom, temp.approval1DateTo),
      'Review 2 By': temp.approved2By,
      'Review 2 Date': dateRange(temp.approval2DateFrom, temp.approval2DateTo),
      'Action Type': temp.requestType,
      'Approval Status': temp.approvalStatus,
    };

    const mappingData = this.filterDisplay().map((item) => ({
      ...item,
      value:
        item.label in labelValueMap ? labelValueMap[item.label] : item.value,
    }));

    this.filterDisplay.set(mappingData);

    this.getRuleApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  resetFilter() {
    this.showFilter = false;
    this.submitFilter = false;

    this.filterDisplay.set([...RULE_APPROVAL_REQUESTED_LIST_DISPLAY_INIT]);

    this.pageQuery = { ...RULE_APPROVAL_REQUESTED_LIST_PAGE_QUERY_INIT };

    this.getRuleApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  getRuleApprovalList(param: any) {
    this.ngxLoader.start();
    this.ruleApprovalService
      .list(mapRuleApprovalQueryDomainToApi(param))
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
    this.ruleApprovalService.getUserList().subscribe({
      next: (res: any) => {
        this.users = res['data'];
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getRuleIdList() {
    const payload = {
      query: null,
      draft: null,
      task_list: null,
      reviewer1_done: null,
    };
    this.ruleApprovalService.dropdownRuleAppr(payload).subscribe({
      next: (res: any) => {
        this.rules = res['data'].map((x: any) => ({
          ruleId: x.rule_id,
          ruleName: x.rule_name,
        }));
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
