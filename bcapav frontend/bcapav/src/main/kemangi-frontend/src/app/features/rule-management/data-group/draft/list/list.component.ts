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
import { NgbModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, Router } from '@angular/router';
import { ColumnDef } from '@tanstack/table-core';
import { finalize } from 'rxjs';

import { dataGroupDraftListBreadcrumb } from '../../data/breadcrumb';
import { ruleRelationListColumns, TabProps } from '../../../../../shared';
import { BreadcrumbProps, TableQuery, TableState } from '../../../../../shared';

import { DataGroupFiltersDisplay } from '../../domain/models/data-group.model';
import { PAGE_QUERY_INIT, PAGE_INFO_INIT } from '../../../../../shared';
import {
  DATA_GROUP_DRAFT_TABLE_QUERY_INIT,
  DATA_GROUP_DRAFT_FILTER_DISPLAY_INIT,
} from '../../data/init';
import { dataGroupTabs } from '../../data/other';
import {
  ContentLayout,
  CustomTabComponent,
  TableComponent,
  StickyTableComponent,
} from '../../../../../shared';
//import { TruncateOrDashPipe } from '../../../../../shared/pipes/truncate-or-dash.pipe';
import { CapitalizePipe } from '../../../../../shared';
import { DataGroupService } from '../../api/services/data-group.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';

import { mapRuleRelationDomainToApi } from '../../mappers/data-group.mapper';
import { dataGroupDraftListColumns } from '../../data';
import {
  DataGroupApproval,
  DataGroupApprovalQuery,
} from '../../../../approval/data-group/domain/models/data-group-approval.model';
import { DataGroupApprovalService } from '../../../../approval/data-group/api/services/data-group-approval.service';
import { mapDataGroupApprovalQueryDomainToApi } from '../../../../approval/data-group/mappers/data-group-approval.mapper';
import { DataGroupDraftFilter } from '../../components/data-group-draft-filter/data-group-draft-filter';
import { SharedDataService } from './../../../../../core/services/shared-data.service';
@Component({
  selector: 'app-data-group-draft-list',
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
    NgSelectModule,
    NgbModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    ContentLayout,
    CustomTabComponent,
    TableComponent,
    RouterLink,
    // TruncateOrDashPipe,
    CapitalizePipe,
    DataGroupDraftFilter,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class DataGroupDraftListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = dataGroupDraftListBreadcrumb;

  pageTitle: string = 'Data Group';

  tabs: TabProps[] = dataGroupTabs;

  activeTab = 'task';

  // data group table

  columns: ColumnDef<DataGroupApproval>[] = dataGroupDraftListColumns;

  pageQuery: TableState<DataGroupApprovalQuery> = {
    ...DATA_GROUP_DRAFT_TABLE_QUERY_INIT,
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

  editPermission: boolean = false;
  createPermission: boolean = false;
  deletePermission: boolean = false;

  private modalService = inject(NgbModal);

  filterDisplay = signal<DataGroupFiltersDisplay[]>([
    ...DATA_GROUP_DRAFT_FILTER_DISPLAY_INIT,
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
    this.initData();
    this.handlePermission();
    this.getUserList();
    this.getDataGroupDropdownList();
  }

  initData() {
    this.getDataGroupDraftList({
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

  getDataGroupDraftList(query: DataGroupApprovalQuery) {
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
    this.dataGroupService.dropdownApprovalList({ draft: true }).subscribe({
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
      sort: param,
      sortDir: order,
    };

    this.getDataGroupDraftList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
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

    this.getDataGroupDraftList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handlePageRuleRelationChange(e: any) {
    this.pageQueryRuleRelations = { ...this.pageQueryRuleRelations, page: e };
    this.getRuleRelationList(this.dataGroupIdSelected, {
      ...this.pageQueryRuleRelations,
      page: this.pageQueryRuleRelations.page - 1,
    });
  }

  handleDelete(id: any) {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to delete this task ?', 'Yes', 'No')
      .then((confirmed) => {
        if (!confirmed) return;

        if (confirmed) {
          this.deleteDataGroup(id);
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
      'Review 1 By': temp.approved1By,
      'Review 2 By': temp.approved2By,
      'Requested Date': dateRange(temp.requestDateFrom, temp.requestDateTo),
      'Review 1 Date': dateRange(temp.approval1DateFrom, temp.approval1DateTo),
      'Review 2 Date': dateRange(temp.approval2DateFrom, temp.approval2DateTo),
      'On/Off': temp.status,
      'Action Type': temp.requestType,
      Status: temp.approvalStatus,
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

    this.filterDisplay.set([...DATA_GROUP_DRAFT_FILTER_DISPLAY_INIT]);

    this.pageQuery = {
      ...DATA_GROUP_DRAFT_TABLE_QUERY_INIT,
    };

    this.initData();
  }

  navigateTo(path: string) {
    if (path === '/home/rule-management/data-group/create') {
      this.router.navigate([path], {
        queryParams: {
          from: 'draft',
        },
      });

      return;
    }

    this.router.navigate([path]);
  }

  deleteDataGroup(id: any) {
    this.ngxLoader.start();

    this.dataGroupApprovalService
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
