import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, Router } from '@angular/router';
import { ColumnDef } from '@tanstack/table-core';
import { finalize } from 'rxjs';

import { RuleCurrentFilter } from '../../components/rule-current-filter/rule-current-filter';
import { ToastService } from '../../../../../core/services/toast.service';
import {
  CustomTabComponent,
  StickyTableComponent,
  FiltersDisplayStruct,
  BreadcrumbProps,
  TabProps,
  PAGE_INFO_INIT,
  TableState,
} from '../../../../../shared';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { ContentLayout } from '../../../../../shared/layout/content-layout/content-layout';
import {
  RULE_CURRENT_TABLE_QUERY_INIT,
  RULE_DISPLAY_INIT,
  ruleTabs,
  ruleCurrentListBreadcrumb,
  ruleListColumns,
} from '../../data';
import { Rule, RuleQuery } from '../../domain/rule.model';
import { RuleService } from '../../api/services/rule.service';
import { mapRuleQueryDomainToApi } from '../../mappers/rule.mapper';
import { SharedDataService } from '../../../../../core/services/shared-data.service';

@Component({
  selector: 'app-rule-current-list',
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
    NgbTooltipModule,
    ContentLayout,
    CustomTabComponent,
    StickyTableComponent,
    RouterLink,
    RuleCurrentFilter,
  ],
  providers: [DatePipe],
})
export class RuleCurrentListV2Component implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = ruleCurrentListBreadcrumb;

  pageTitle: string = 'Rule';

  tabs: TabProps[] = ruleTabs;

  activeTab = 'current';

  columns: ColumnDef<Rule>[] = ruleListColumns;

  pageQuery: TableState<RuleQuery> = { ...RULE_CURRENT_TABLE_QUERY_INIT };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: Rule[] = [];

  columnsPinned: string[] = ['no', 'ruleId', 'ruleName'];

  users: any[] = [];

  rules: any[] = [];

  editPermission: boolean = false;
  createPermission: boolean = false;
  deletePermission: boolean = false;

  showFilter: boolean = false;

  submitFilter: boolean = false;

  filterDisplay = signal<FiltersDisplayStruct[]>([...RULE_DISPLAY_INIT]);

  visibleFilterInfo = computed(() => {
    return this.filterDisplay().filter(
      (item) =>
        item.value !== null && item.value !== '' && item.value !== undefined,
    );
  });

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly ruleService: RuleService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initData();
    this.handlePermission();
    this.getUserList();
    this.getRuleDropdownList();
  }

  initData() {
    this.getRuleList({
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

  getUserList() {
    this.ruleService.getUserList().subscribe({
      next: (res: any) => {
        this.users = res['data'];
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getRuleDropdownList() {
    this.ruleService.ruleDropdownList().subscribe({
      next: (res: any) => {
        this.rules = res['data'].map((i: any) => ({
          ruleId: i.rule_id,
          ruleName: i.rule_name,
        }));
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getRuleList(query: RuleQuery) {
    this.ngxLoader.start();

    this.ruleService
      .list(mapRuleQueryDomainToApi(query))
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

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  handleFilter(data: any) {
    this.submitFilter = true;
    this.showFilter = false;

    this.pageQuery = {
      ...this.pageQuery,
      ...data.filterBy,
    };

    const temp = { ...data.filterDisplayTemp };

    const dateRange = (from?: string | null, to?: string | null) =>
      `${from ?? ''}${to ? ' - ' + to : ''}`;

    const labelValueMap: Record<string, any> = {
      'Rule ID': temp.ruleId,
      'Rule Name': temp.ruleName,
      'Rule Description': temp.ruleDescription,
      'Effective Date': dateRange(temp.effectiveDateFrom, temp.effectiveDateTo),
      'Requested By': temp.requestedBy,
      'Review 1 By': temp.approved1By,
      'Review 2 By': temp.approved2By,
      'Requested Date': dateRange(temp.requestDateFrom, temp.requestDateTo),
      'Review 1 Date': dateRange(temp.approval1DateFrom, temp.approval1DateTo),
      'Review 2 Date': dateRange(temp.approval2DateFrom, temp.approval2DateTo),
      'On/Off': temp.status,
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

    this.filterDisplay.set([...RULE_DISPLAY_INIT]);

    this.pageQuery = {
      ...this.pageQuery,
      ...RULE_CURRENT_TABLE_QUERY_INIT,
    };

    this.initData();
  }

  navigateTo(path: string) {
    if (path === '/home/rule-management/rule/create') {
      this.router.navigate([path], {
        queryParams: {
          from: 'current',
        },
      });

      return;
    }

    this.router.navigate([path]);
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
