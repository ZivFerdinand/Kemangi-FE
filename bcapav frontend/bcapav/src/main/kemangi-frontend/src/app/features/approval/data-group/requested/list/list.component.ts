import {
  Component,
  OnInit,
  signal,
  computed,
  TemplateRef,
  inject,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnDef } from '@tanstack/table-core';
import { finalize } from 'rxjs';

//import { TruncateOrDashPipe } from '../../../../../shared/pipes/truncate-or-dash.pipe';
import {
  CustomTabComponent,
  TableComponent,
  ContentLayout,
  PAGE_INFO_INIT,
  PAGE_QUERY_INIT,
  TableQuery,
  ruleRelationListColumns,
  BreadcrumbProps,
  TabProps,
  TableState,
  StickyTableComponent,
} from '../../../../../shared';

import {
  dataGroupApprovalRequestedListBreadcrumb,
  dataGroupApprRequestedListColumns,
} from '../../data';
import { ToastService } from '../../../../../core/services/toast.service';

import { approvalTabs } from '../../../../../shared';

import {
  DATA_GROUP_APPROVAL_REQUESTED_FILTER_DISPLAY_INIT,
  DATA_GROUP_APPROVAL_REQUESTED_TABLE_QUERY_INIT,
} from '../../data/init';
import { DataGroupFiltersDisplay } from '../../../../rule-management/data-group/domain/models/data-group.model';
import {
  DataGroupApproval,
  DataGroupApprovalQuery,
} from '../../domain/models/data-group-approval.model';
import { mapRuleRelationDomainToApi } from '../../../../rule-management/data-group/mappers/data-group.mapper';
import { DataGroupApprovalService } from '../../api/services/data-group-approval.service';
import { CapitalizePipe } from '../../../../../shared';
import { DataGroupRequestedFilter } from '../../components/data-group-requested-filter/data-group-requested-filter';
import { mapDataGroupApprovalQueryDomainToApi } from '../../mappers/data-group-approval.mapper';
import { SharedDataService } from '../../../../../core/services/shared-data.service';

@Component({
  selector: 'app-data-group-approval-requested-list',
  standalone: true,
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  imports: [
    ContentLayout,
    CustomTabComponent,
    TableComponent,
    CommonModule,
    NgbModule,
    RouterLink,
    CapitalizePipe,
    DataGroupRequestedFilter,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class DataGroupApprovalRequestedListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = dataGroupApprovalRequestedListBreadcrumb;

  pageTitle: string = 'Data Group Approval';

  tabs: TabProps[] = approvalTabs;

  activeTab: string = 'requested';

  // data group table

  columns: ColumnDef<DataGroupApproval>[] = dataGroupApprRequestedListColumns;

  pageQuery: TableState<DataGroupApprovalQuery> = {
    ...DATA_GROUP_APPROVAL_REQUESTED_TABLE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: DataGroupApproval[] = [];

  columnsPinned: string[] = ['no', 'dataGroupId', 'name'];

  // rule relation table

  columnsRuleRelation = ruleRelationListColumns;

  pageQueryRuleRelations: TableQuery = { ...PAGE_QUERY_INIT };

  pageInfoRuleRelations = { ...PAGE_INFO_INIT };

  tableDataRuleRelations: any = [];

  showFilter: boolean = false;

  submitFilter: boolean = false;

  dataGroups: any[] = [];

  users: any[] = [];

  dataGroupNameRelation: any;

  dataGroupIdSelected: any;

  private modalService = inject(NgbModal);

  filterDisplay = signal<DataGroupFiltersDisplay[]>([
    ...DATA_GROUP_APPROVAL_REQUESTED_FILTER_DISPLAY_INIT,
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
    private readonly toast: ToastService,
    private readonly dataGroupApprovalService: DataGroupApprovalService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initData();

    this.getUserList();

    this.getDataGroupDropdownList();
  }

  initData() {
    this.getDataGroupRequestedList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  menuTask = computed(
    () =>
      this.sharedData.checkMenu('APPROVAL-DATAGROUP-TASK-LV1') ||
      this.sharedData.checkMenu('APPROVAL-DATAGROUP-TASK-LV2'),
  );

  menuRequested = computed(() =>
    this.sharedData.checkMenu('APPROVAL-DATAGROUP-REQUESTED'),
  );

  checkMenu = (value: string): boolean => {
    return value === 'task' ? this.menuTask() : this.menuRequested();
  };

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'task') this.navigateTo('/home/approval/data-group/task-list');
    if (tab === 'requested')
      this.navigateTo('/home/approval/data-group/requested-list');
  }

  open(content: TemplateRef<any>, id: any) {
    this.dataGroupNameRelation = this.tableData.find(
      (item: any) => item.dataGroupId === id,
    )?.name;

    this.dataGroupIdSelected = id;

    this.getRuleRelationList(id, {
      ...this.pageQueryRuleRelations,
      page: this.pageQueryRuleRelations.page - 1,
    });

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-rule-relation',
      centered: true,
      size: 'lg',
    });
  }

  getUserList() {
    this.dataGroupApprovalService.getUserList().subscribe({
      next: (res: any) => {
        this.users = res['data'];
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getDataGroupDropdownList() {
    this.dataGroupApprovalService.dropdownApprovalList({}).subscribe({
      next: (res: any) => {
        this.dataGroups = res['data'].map((x: any) => ({
          dataGroupId: x.data_group_id,
          dataGroupName: x.data_group_name,
        }));
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getRuleRelationList(id: string, query: TableQuery) {
    this.ngxLoader.start();
    this.dataGroupApprovalService
      .ruleRelationList(id, mapRuleRelationDomainToApi(query))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.tableDataRuleRelations = res['data']['content'];
          this.pageInfoRuleRelations = {
            ...this.pageInfoRuleRelations,
            totalElements: res['data']['totalElements'],
            totalPages: res['data']['totalPages'],
          };
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  getDataGroupRequestedList(query: DataGroupApprovalQuery) {
    this.ngxLoader.start();

    this.dataGroupApprovalService
      .list(mapDataGroupApprovalQueryDomainToApi(query))
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
      sort: param,
      sortDir: order,
    };

    this.initData();
  }

  handleSortChangeRuleRelations(order: 'asc' | 'desc', param: string) {
    this.pageQueryRuleRelations = {
      ...this.pageQueryRuleRelations,
      sort: param,
      sortDir: order,
    };

    this.getRuleRelationList(this.dataGroupIdSelected, {
      ...this.pageQueryRuleRelations,
      page: this.pageQueryRuleRelations.page - 1,
    });
  }

  handleLimitChangeRuleRelations(e: any) {
    this.pageQueryRuleRelations = {
      ...this.pageQueryRuleRelations,
      limit: e.target.value,
    };

    this.getRuleRelationList(this.dataGroupIdSelected, {
      ...this.pageQueryRuleRelations,
      page: this.pageQueryRuleRelations.page - 1,
    });
  }

  handlePageChange(e: any) {
    this.pageQuery = {
      ...this.pageQuery,
      page: e,
    };

    this.initData();
  }

  handlePageRuleRelationChange(e: any) {
    this.pageQueryRuleRelations = { ...this.pageQueryRuleRelations, page: e };
    this.getRuleRelationList(this.dataGroupIdSelected, {
      ...this.pageQueryRuleRelations,
      page: this.pageQueryRuleRelations.page - 1,
    });
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
      'Data Group ID': temp.dataGroupId,
      'Data Group Name': temp.dataGroupName,
      'Data Group Description': temp.description,
      'Dynamic Watchlist': temp.dynamicWatchList,
      'Requested By': temp.requestedBy,
      'Review 1 By': temp.approved1By,
      'Review 2 By': temp.approved2By,
      'Requested Date': dateRange(temp.requestDateFrom, temp.requestDateTo),
      'Review 1 Date': dateRange(temp.approval1DateFrom, temp.approval1DateTo),
      'Review 2 Date': dateRange(temp.approval2DateFrom, temp.approval2DateTo),
      'On/Off': temp.status,
      'Approval Status': temp.approvalStatus,
      'Action Type': temp.requestType,
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

    this.filterDisplay.set([
      ...DATA_GROUP_APPROVAL_REQUESTED_FILTER_DISPLAY_INIT,
    ]);

    this.pageQuery = {
      ...DATA_GROUP_APPROVAL_REQUESTED_TABLE_QUERY_INIT,
    };

    this.initData();
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
