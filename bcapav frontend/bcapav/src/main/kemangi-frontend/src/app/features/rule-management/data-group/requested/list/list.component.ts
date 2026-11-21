import {
  Component,
  OnInit,
  signal,
  inject,
  TemplateRef,
  computed,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  NgbPaginationModule,
  NgbTooltipModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, Router } from '@angular/router';
import { ColumnDef } from '@tanstack/table-core';
import { finalize } from 'rxjs';

//import { TruncateOrDashPipe } from '../../../../../shared/pipes/truncate-or-dash.pipe';
import { DataGroupService } from '../../api/services/data-group.service';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import {
  CustomTabComponent,
  TableComponent,
  ContentLayout,
  StickyTableComponent,
} from '../../../../../shared';
import {
  dataGroupReqListColumns,
  ruleRelationListColumns,
  dataGroupTabs,
  dataGroupRequestedListBreadcrumb,
} from '../../data';
import { ToastService } from '../../../../../core/services/toast.service';
import {
  PAGE_QUERY_INIT,
  PAGE_INFO_INIT,
  TableQuery,
  TabProps,
  BreadcrumbProps,
  CapitalizePipe,
  TableState,
} from '../../../../../shared';
import { DataGroupFiltersDisplay } from '../../domain/models/data-group.model';
import { mapRuleRelationDomainToApi } from '../../mappers/data-group.mapper';
import { DataGroupRequestedFilter } from '../../../../approval/data-group/components/data-group-requested-filter/data-group-requested-filter';
import {
  DataGroupApproval,
  DataGroupApprovalQuery,
} from '../../../../approval/data-group/domain/models/data-group-approval.model';
import {
  DATA_GROUP_APPROVAL_REQUESTED_TABLE_QUERY_INIT,
  DATA_GROUP_APPROVAL_REQUESTED_FILTER_DISPLAY_INIT,
} from '../../../../approval/data-group/data';
import { DataGroupApprovalService } from '../../../../approval/data-group/api/services/data-group-approval.service';
import { mapDataGroupApprovalQueryDomainToApi } from '../../../../approval/data-group/mappers/data-group-approval.mapper';
import { SharedDataService } from '../../../../../core/services/shared-data.service';

@Component({
  selector: 'app-data-group-requested-list',
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
    TableComponent,
    RouterLink,
    // TruncateOrDashPipe,
    CapitalizePipe,
    DataGroupRequestedFilter,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class DataGroupRequestedListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = dataGroupRequestedListBreadcrumb;

  pageTitle: string = 'Data Group';

  tabs: TabProps[] = dataGroupTabs;

  activeTab = 'requested';

  // data group table

  columns: ColumnDef<DataGroupApproval>[] = dataGroupReqListColumns;

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

  createPermission: boolean = false;

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
    private readonly dataGroupService: DataGroupService,
    private readonly dataGroupApprovalService: DataGroupApprovalService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.getUserList();
    this.initData();
    this.handlePermission();
    this.getDataGroupDropdownList();
  }

  initData() {
    this.getDataGroupRequestedList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handlePermission() {
    this.createPermission = this.checkMenu('create');
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'current')
      this.navigateTo('/home/rule-management/data-group/current/');
    if (tab === 'task')
      this.navigateTo('/home/rule-management/data-group/draft/');
    if (tab === 'requested')
      this.navigateTo('/home/rule-management/data-group/requested/');
  }

  checkCreatePermission = computed(() =>
    this.sharedData.checkMenu('RULEMANAGEMENT-DATAGROUP-CREATE'),
  );

  checkMenu = (value: string): boolean => {
    if (value === 'create') {
      return this.checkCreatePermission();
    } else {
      return false;
    }
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
    this.dataGroupService
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

  navigateTo(path: string) {
    if (path === '/home/rule-management/data-group/create') {
      this.router.navigate([path], {
        queryParams: {
          from: 'requested',
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
