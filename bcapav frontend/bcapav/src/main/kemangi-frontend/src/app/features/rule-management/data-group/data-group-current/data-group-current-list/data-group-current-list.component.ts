import {
  Component,
  OnInit,
  signal,
  TemplateRef,
  inject,
  computed,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  NgbPaginationModule,
  NgbTooltipModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ColumnDef } from '@tanstack/table-core';

import {
  BreadcrumbProps,
  TableQuery,
  TabProps,
  TableState,
} from '../../../../../shared';

import {
  dataGroupListColumns,
  dataGroupCurrentListBreadcrumb,
} from '../../data';
import { ruleRelationListColumns } from '../../../../../shared';
import { DataGroupTableQuery } from '../../domain/models/data-group-query.model';

import {
  DataGroup,
  DataGroupFiltersDisplay,
} from '../../domain/models/data-group.model';
import {
  DATA_GROUP_TABLE_QUERY_INIT,
  DATA_GROUP_FILTER_DISPLAY_INIT,
} from '../../data/init';
import { PAGE_QUERY_INIT, PAGE_INFO_INIT } from '../../../../../shared/data';
import { dataGroupTabs } from '../../data/other';
import { DataGroupService } from '../../api/services/data-group.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';

import {
  mapRuleRelationDomainToApi,
  mapDataGroupTableQueryDomainToApi,
} from '../../mappers/data-group.mapper';
import {
  ContentLayout,
  CustomTabComponent,
  StickyTableComponent,
  TableComponent,
} from '../../../../../shared';
//import { TruncateOrDashPipe } from '../../../../../shared/pipes/truncate-or-dash.pipe';
import { DataGroupCurrentFilter } from '../../components/data-group-current-filter/data-group-current-filter';
import { SharedDataService } from '../../../../../core/services/shared-data.service';

@Component({
  selector: 'app-data-group-current-list',
  templateUrl: './data-group-current-list.component.html',
  styleUrls: [
    './data-group-current-list.component.scss',
    '../../../../../shared/styles/index.scss',
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
    CustomTabComponent,
    // TruncateOrDashPipe,
    DataGroupCurrentFilter,
    StickyTableComponent,
    TableComponent,
  ],
  providers: [DatePipe],
})
export class DataGroupCurrentListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = dataGroupCurrentListBreadcrumb;

  pageTitle: string = 'Data Group';

  tabs: TabProps[] = dataGroupTabs;

  activeTab = 'current';

  // data group table

  columns: ColumnDef<DataGroup>[] = dataGroupListColumns;

  pageQuery: TableState<DataGroupTableQuery> = {
    ...DATA_GROUP_TABLE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: DataGroup[] = [];

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

  editPermission: boolean = false;
  createPermission: boolean = false;
  deletePermission: boolean = false;

  private modalService = inject(NgbModal);

  filterDisplay = signal<DataGroupFiltersDisplay[]>([
    ...DATA_GROUP_FILTER_DISPLAY_INIT,
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
    this.getDataGroupDropdownList();
  }

  initData() {
    this.getDataGroupList({
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
    this.sharedData.checkMenu('RULEMANAGEMENT-DATAGROUP-CREATE'),
  );

  checkEditPermission = computed(() =>
    this.sharedData.checkMenu('RULEMANAGEMENT-DATAGROUP-UPDATE'),
  );

  checkDeletePermission = computed(() =>
    this.sharedData.checkMenu('RULEMANAGEMENT-DATAGROUP-DELETE'),
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
      this.navigateTo('/home/rule-management/data-group/current/');
    if (tab === 'task')
      this.navigateTo('/home/rule-management/data-group/draft/');
    if (tab === 'requested')
      this.navigateTo('/home/rule-management/data-group/requested/');
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

  getDataGroupList(query: DataGroupTableQuery) {
    this.ngxLoader.start();
    this.dataGroupService
      .list(mapDataGroupTableQueryDomainToApi(query))
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

  getUserList() {
    this.dataGroupService.getUserList().subscribe({
      next: (res: any) => {
        this.users = res['data'];
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getDataGroupDropdownList() {
    this.dataGroupService.dropdownList().subscribe({
      next: (res: any) => {
        this.dataGroups = res['data'].map((x: any) => ({
          dataGroupId: x.data_group_id,
          dataGroupName: x.data_group_name,
        }));
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
    this.pageQuery = { ...this.pageQuery, page: e };

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

    this.filterDisplay.set([...DATA_GROUP_FILTER_DISPLAY_INIT]);

    this.pageQuery = {
      ...DATA_GROUP_TABLE_QUERY_INIT,
    };

    this.initData();
  }

  navigateTo(path: string) {
    if (path === '/home/rule-management/data-group/create') {
      this.router.navigate([path], {
        queryParams: {
          from: 'current',
        },
      });

      return;
    }

    this.router.navigate([path]);
  }

  customSearchDataGroup(term: string, item: any): boolean {
    const searchTerm = term?.trim().toLowerCase() ?? '';

    return (
      item?.data_group_name?.toLowerCase().includes(searchTerm) ||
      item?.data_group_id?.toLowerCase().includes(searchTerm)
    );
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
