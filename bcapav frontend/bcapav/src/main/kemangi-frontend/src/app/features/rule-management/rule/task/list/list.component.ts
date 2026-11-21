import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
  ContentLayout,
  CapitalizePipe,
  StickyTableComponent,
} from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { RuleApprovalService } from '../../../../approval/rule/api/services/rule-approval.service';
import { RuleService } from '../../api/services/rule.service';
import { mapRuleApprovalQueryDomainToApi } from '../../../../approval/rule/mappers/rule-approval.mapper';

import { RULE_TASK_LIST_DISPLAY_INIT } from '../../data';

import { RuleTaskFilter } from '../../components/rule-task-filter/rule-task-filter';
import {
  RuleApproval,
  RuleApprovalQuery,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import {
  ruleTabs,
  ruleTaskListBreadcrumbI,
  RULE_TASK_PAGE_QUERY_INIT,
  ruleTaskListColumns,
} from '../../data';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { SharedDataService } from '../../../../../core/services/shared-data.service';
import { ColumnDef } from '@tanstack/table-core';
import { finalize } from 'rxjs';

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
    RouterLink,
    CustomTabComponent,
    ContentLayout,
    FormsModule,
    CapitalizePipe,
    RuleTaskFilter,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class RuleTaskListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = ruleTaskListBreadcrumbI;

  pageTitle: string = 'Rule';

  tabs: TabProps[] = ruleTabs;

  activeTab: string = 'task';

  columns: ColumnDef<RuleApproval>[] = ruleTaskListColumns;

  pageQuery: TableState<RuleApprovalQuery> = {
    ...RULE_TASK_PAGE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: RuleApproval[] = [];

  columnsPinned: string[] = ['no', 'ruleId', 'ruleName'];

  users: any[] = [];

  rules: any[] = [];

  editPermission: boolean = false;
  createPermission: boolean = false;
  deletePermission: boolean = false;

  showFilter: boolean = false;

  submitFilter: boolean = false;

  requestType = requestType;

  approvalStatus = approvalStatus;

  filterDisplay = signal<FiltersDisplayStruct[]>([
    ...RULE_TASK_LIST_DISPLAY_INIT,
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
    private readonly ruleService: RuleService,
    public confirmationDialogService: ConfirmationModalService,
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
    this.deletePermission = this.checkMenu('delete');
    this.editPermission = this.checkMenu('edit');
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
          from: 'task',
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
    this.initData();
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };
    this.initData();
  }

  handleDelete(id: any) {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to delete this task ?', 'Yes', 'No')
      .then((confirmed) => {
        if (!confirmed) return;

        if (confirmed) {
          this.deleteRule(id);
          return;
        }
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
      Description: temp.shortDescription,
      'Requested By': temp.requestedBy,
      'Requested Date': dateRange(temp.requestDateFrom, temp.requestDateTo),
      'Review 1 By': temp.approved1By,
      'Review 1 Date': dateRange(temp.approval1DateFrom, temp.approval1DateTo),
      'Review 2 By': temp.approved2By,
      'Review 2 Date': dateRange(temp.approval2DateFrom, temp.approval2DateTo),
      Status: temp.approvalStatus,
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

    this.filterDisplay.set([...RULE_TASK_LIST_DISPLAY_INIT]);

    this.pageQuery = { ...RULE_TASK_PAGE_QUERY_INIT };

    this.initData();
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
      draft: true,
      task_list: null,
      reviewer1_done: null,
    };
    this.ruleService.dropdownRuleAppr(payload).subscribe({
      next: (res: any) => {
        this.rules = res['data'].map((x: any) => ({
          ruleId: x.rule_id,
          ruleName: x.rule_name,
        }));
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  deleteRule(id: any) {
    this.ngxLoader.start();

    this.ruleApprovalService
      .deleteDraft(Number(id))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.toast.success('Task successfully deleted');

          this.initData();
        },
        error: this.handleError('Task deleted has been failed'),
      });
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
