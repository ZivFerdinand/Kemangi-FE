import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
  TemplateRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastService } from '../../../../../core/services/toast.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnDef } from '@tanstack/table-core';
import { finalize } from 'rxjs';

import {
  PAGE_INFO_INIT,
  PAGE_QUERY_INIT,
  ruleRelationListColumns,
  TableQuery,
} from '../../../../../shared';
//import { TruncateOrDashPipe } from '../../../../../shared/pipes/truncate-or-dash.pipe';

import {
  CustomTabComponent,
  StickyTableComponent,
  TableComponent,
  ContentLayout,
  approvalTabs,
  TableState,
} from '../../../../../shared';

import { BreadcrumbProps, TabProps } from '../../../../../shared';
import {
  dataGroupApprovalTaskListBreadcrumb,
  dataGroupApprTaskListColumns,
} from '../../data';
import {
  DATA_GROUP_APPROVAL_TASK_FILTER_DISPLAY_INIT,
  DATA_GROUP_APPROVAL_TASK_TABLE_QUERY_INIT,
} from '../../data/init';
import { DataGroupFiltersDisplay } from '../../../../rule-management/data-group/domain/models/data-group.model';
import { CapitalizePipe } from '../../../../../shared';
import { DataGroupApprovalService } from '../../api/services/data-group-approval.service';
import { mapDropdownListQueryDomainToApi } from '../../../../../shared/mappers';
import { mapRuleRelationDomainToApi } from '../../../../rule-management/data-group/mappers/data-group.mapper';
import { DataGroupTaskFilter } from '../../components/data-group-task-filter/data-group-task-filter';
import { mapDataGroupApprovalQueryDomainToApi } from '../../mappers/data-group-approval.mapper';
import {
  DataGroupApproval,
  DataGroupApprovalQuery,
} from '../../domain/models/data-group-approval.model';
import { SharedDataService } from '../../../../../core/services/shared-data.service';
@Component({
  selector: 'app-data-group-approval-task-list',
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
    // TruncateOrDashPipe,
    CapitalizePipe,
    DataGroupTaskFilter,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class DataGroupApprovalTaskListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = dataGroupApprovalTaskListBreadcrumb;

  pageTitle: string = 'Data Group Approval';

  tabs: TabProps[] = approvalTabs;

  activeTab: string = 'task';

  // data group table

  columns: ColumnDef<DataGroupApproval>[] = dataGroupApprTaskListColumns;

  pageQuery: TableState<DataGroupApprovalQuery> = {
    ...DATA_GROUP_APPROVAL_TASK_TABLE_QUERY_INIT,
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

  filterDisplay = signal<DataGroupFiltersDisplay[]>([
    ...DATA_GROUP_APPROVAL_TASK_FILTER_DISPLAY_INIT,
  ]);

  dataGroups: any[] = [];

  users: any[] = [];

  dataGroupNameRelation: any;

  dataGroupIdSelected: any;

  private modalService = inject(NgbModal);

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
    this.getDataGroupTaskList({
      ...this.pageQuery,
      reviewer1Done: this.taskLv1() && !this.taskLv2() ? false : true,
      page: this.pageQuery.page - 1,
      approvalStatus: 'PENDING',
    });
  }

  taskLv1 = computed(() =>
    this.sharedData.checkMenu('APPROVAL-DATAGROUP-TASK-LV1'),
  );
  taskLv2 = computed(() =>
    this.sharedData.checkMenu('APPROVAL-DATAGROUP-TASK-LV2'),
  );

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
    const payload = {
      taskList: true,
      draft: false,
      reviewer1Done: this.taskLv2() ? true : false,
    };
    this.dataGroupApprovalService
      .dropdownApprovalList(mapDropdownListQueryDomainToApi(payload))
      .subscribe({
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

  getDataGroupTaskList(query: DataGroupApprovalQuery) {
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

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'task') this.navigateTo('/home/approval/data-group/task-list');
    if (tab === 'requested')
      this.navigateTo('/home/approval/data-group/requested-list');
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
      'Requested Date': dateRange(temp.requestDateFrom, temp.requestDateTo),
      'Review 1 Date': dateRange(temp.approval1DateFrom, temp.approval1DateTo),
      'On/Off': temp.status,
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

    this.filterDisplay.set([...DATA_GROUP_APPROVAL_TASK_FILTER_DISPLAY_INIT]);

    this.pageQuery = {
      ...this.pageQuery,
      ...DATA_GROUP_APPROVAL_TASK_TABLE_QUERY_INIT,
    };

    this.initData();
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
