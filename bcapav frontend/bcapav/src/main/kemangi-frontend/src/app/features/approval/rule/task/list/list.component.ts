import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  NgbCalendar,
  NgbDatepickerModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ColumnDef } from '@tanstack/table-core';
import { finalize } from 'rxjs';

import {
  requestType,
  approvalStatus,
  approvalTabs,
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
  ContentLayout,
  CapitalizePipe,
  StickyTableComponent,
} from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { RuleApprovalService } from '../../api/services/rule-approval.service';
import { mapRuleApprovalQueryDomainToApi } from '../../mappers/rule-approval.mapper';

import {
  ruleApprovalTaskListBreadcrumb,
  ruleApprTaskListColumns,
  RULE_APPROVAL_TASK_LIST_DISPLAY_INIT,
  RULE_APPROVAL_TASK_LIST_PAGE_QUERY_INIT,
} from '../../data';

import { RuleTaskFilter } from '../../components/rule-task-filter/rule-task-filter';
import {
  RuleApprovalQuery,
  RuleApproval,
} from '../../domain/models/rule-approval.model';
import { SharedDataService } from '../../../../../core/services/shared-data.service';

@Component({
  selector: 'app-rule-task-list',
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
    RuleTaskFilter,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class RuleApprovalTaskListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = ruleApprovalTaskListBreadcrumb;

  pageTitle: string = 'Rule Approval';

  tabs: TabProps[] = approvalTabs;

  activeTab: string = 'task';

  columns: ColumnDef<RuleApproval>[] = ruleApprTaskListColumns;

  pageQuery: TableState<RuleApprovalQuery> = {
    ...RULE_APPROVAL_TASK_LIST_PAGE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: RuleApproval[] = [];

  columnsPinned: string[] = ['no', 'ruleId', 'ruleName'];

  users: any[] = [];

  rules: any[] = [];

  showFilter: boolean = false;

  submitFilter: boolean = false;

  requestType = requestType;

  approvalStatus = approvalStatus;

  filterDisplay = signal<FiltersDisplayStruct[]>([
    ...RULE_APPROVAL_TASK_LIST_DISPLAY_INIT,
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
    private readonly ngbCalendar: NgbCalendar,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initData();
    this.getUserList();
    this.getRuleIdList();
  }

  taskLv1 = computed(() => this.sharedData.checkMenu('APPROVAL-RULE-TASK-LV1'));

  taskLv2 = computed(() => this.sharedData.checkMenu('APPROVAL-RULE-TASK-LV2'));

  menuTask = computed(
    () =>
      this.sharedData.checkMenu('APPROVAL-RULE-TASK-LV1') ||
      this.sharedData.checkMenu('APPROVAL-RULE-TASK-LV2'),
  );

  menuRequested = computed(() =>
    this.sharedData.checkMenu('APPROVAL-RULE-REQUESTED'),
  );

  checkMenu = (value: string): boolean => {
    return value === 'task' ? this.menuTask() : this.menuRequested();
  };

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'task') this.navigateTo('/home/approval/rule/task-list');
    if (tab === 'requested')
      this.navigateTo('/home/approval/rule/requested-list');
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
    this.pageQuery = {
      ...this.pageQuery,
      ...data?.filterBy,
      approvalStatus: 'PENDING',
      reviewer1Done: this.taskLv2() ? true : false,
    };

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
      'On/Off': temp.activeStatus,
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

    this.filterDisplay.set([...RULE_APPROVAL_TASK_LIST_DISPLAY_INIT]);

    this.pageQuery = { ...RULE_APPROVAL_TASK_LIST_PAGE_QUERY_INIT };

    this.initData();
  }

  initData() {
    this.getRuleApprovalList({
      ...this.pageQuery,
      reviewer1Done: this.taskLv2() ? true : false,
      page: this.pageQuery.page - 1,
      approvalStatus: 'PENDING',
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
      task_list: true,
      reviewer1_done: this.taskLv2() ? true : false,
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
