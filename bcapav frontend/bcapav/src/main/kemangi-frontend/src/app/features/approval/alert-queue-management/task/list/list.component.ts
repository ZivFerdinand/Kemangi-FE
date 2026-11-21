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
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ColumnDef } from '@tanstack/table-core';

import {
  ContentLayout,
  CustomTabComponent,
  StickyTableComponent,
} from '../../../../../shared';
import {
  BreadcrumbProps,
  TabProps,
  FiltersDisplayStruct,
  TableQuery,
  TableState,
  PageInfo,
} from '../../../../../shared/interfaces';
import {
  AlertQueueApproval,
  AlertQueueApprovalQuery,
} from '../../domain/alert-queue.model';
import {
  ALERT_QUEUE_APPROVAL_TASK_LIST_TABLE_QUERY_INIT,
  ALERT_QUEUE_APPROVAL_FILTER_DISPLAY_INIT,
  alertQueueManagementApprovalRequestedListBreadcrumb,
} from '../../data';

import {
  ASSIGN_TO_TABLE_QUERY_INIT,
  assignToColumns,
} from '../../../../alert-queue-management/data';
import { alertQueueApprovalTaskListColumns } from '../../data';

import { approvalTabs, PAGE_INFO_INIT } from '../../../../../shared/data';

import { AlertQueueApprovalService } from '../../api/services/alert-queue-approval.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { mapAlertQueueApprovalQueryDomainToApi } from '../../mappers/alert-queue.mapper';
import { mapTableQueryDomainToApi } from '../../../../../shared/mappers';
import { SharedDataService } from '../../../../../core/services/shared-data.service';
import { AlertQueueTaskFilter } from '../../components/task-filter/task-filter';
import {
  AssignTo,
  AssignToQuery,
} from '../../../../alert-queue-management/domain/alert-queue.model';

@Component({
  selector: 'app-alert-queue-approval-task-list',
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
    RouterLink,
    ContentLayout,
    CustomTabComponent,
    StickyTableComponent,
    AlertQueueTaskFilter,
  ],
  providers: [DatePipe],
})
export class AlertQueueApprovalTaskListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] =
    alertQueueManagementApprovalRequestedListBreadcrumb;

  pageTitle: string = 'Alert Queue Approval';

  tabs: TabProps[] = approvalTabs;

  activeTab = 'task';

  // table alert queue management info

  columns: ColumnDef<AlertQueueApproval>[] = alertQueueApprovalTaskListColumns;

  pageQuery: TableState<AlertQueueApprovalQuery> = {
    ...ALERT_QUEUE_APPROVAL_TASK_LIST_TABLE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: AlertQueueApproval[] = [];

  columnsPinned: string[] = ['queueId', 'name', 'description'];

  //

  // table assign to info

  columnsAssignTo: ColumnDef<AssignTo>[] = assignToColumns;

  pageQueryAssignTo: TableState<AssignToQuery> = {
    ...ASSIGN_TO_TABLE_QUERY_INIT,
  };

  pageInfoAssignTo: PageInfo = { ...PAGE_INFO_INIT };

  tableDataAssignTo: AssignTo[] = [];

  columnsAssignToPinned: string[] = ['no', 'userId'];

  //

  showFilter: boolean = false;

  submitFilter: boolean = false;

  users: any[] = [];

  assignToName: any;

  assignToIdSelected: any;

  editPermission: boolean = false;
  createPermission: boolean = false;
  deletePermission: boolean = false;

  filterDisplay = signal<FiltersDisplayStruct[]>([
    ...ALERT_QUEUE_APPROVAL_FILTER_DISPLAY_INIT,
  ]);

  visibleFilterInfo = computed(() => {
    return this.filterDisplay().filter(
      (item) =>
        item.value !== null && item.value !== '' && item.value !== undefined,
    );
  });

  modalRef!: NgbModalRef;

  private modalService = inject(NgbModal);

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly alertQueueApprovalService: AlertQueueApprovalService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initData();
    this.getUserList();
  }

  taskLv1 = computed(() =>
    this.sharedData.checkMenu('APPROVAL-ALERTQUEUE-TASK-LV1'),
  );

  taskLv2 = computed(() =>
    this.sharedData.checkMenu('APPROVAL-ALERTQUEUE-TASK-LV2'),
  );

  menuTask = computed(
    () =>
      this.sharedData.checkMenu('APPROVAL-ALERTQUEUE-TASK-LV1') ||
      this.sharedData.checkMenu('APPROVAL-ALERTQUEUE-TASK-LV2'),
  );

  menuRequested = computed(() =>
    this.sharedData.checkMenu('APPROVAL-ALERTQUEUE-REQUESTED'),
  );

  checkMenu = (value: string): boolean => {
    return value === 'task' ? this.menuTask() : this.menuRequested();
  };

  initData() {
    this.getAlertQueueList({
      ...this.pageQuery,
      reviewer1Done: this.taskLv2() ? true : false,
      page: this.pageQuery.page - 1,
      approvalStatus: 'PENDING',
    });
  }

  initAssignToData(id: string) {
    this.getAssignToList(id, {
      ...this.pageQueryAssignTo,
      page: this.pageQueryAssignTo.page - 1,
    });
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    switch (tab) {
      case 'task':
        this.navigateTo('/home/approval/alert-queue/task-list');
        break;
      case 'requested':
        this.navigateTo('/home/approval/alert-queue/requested-list');
        break;
    }
  }

  // hit API

  getAlertQueueList(query: AlertQueueApprovalQuery) {
    this.ngxLoader.start();
    this.alertQueueApprovalService
      .list(mapAlertQueueApprovalQueryDomainToApi(query))
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

  getAssignToList(id: string, query: TableQuery) {
    this.ngxLoader.start();

    this.alertQueueApprovalService
      .assignToList(id, mapTableQueryDomainToApi(query))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.tableDataAssignTo = res['data']['content'];
          this.pageInfoAssignTo = {
            ...this.pageInfo,
            totalElements: res['data']['totalElements'],
            totalPages: res['data']['totalPages'],
          };
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  getUserList() {
    this.alertQueueApprovalService.getUserList().subscribe({
      next: (res: any) => {
        this.users = res['data'];
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  // table alert queue management control

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

  // table assign to control

  handleSortAssignToChange(order: 'asc' | 'desc', param: string) {
    this.pageQueryAssignTo = {
      ...this.pageQueryAssignTo,
      sort: param,
      sortDir: order,
    };

    this.initAssignToData(this.assignToIdSelected);
  }

  handlePageAssignToChange(e: any) {
    this.pageQueryAssignTo = { ...this.pageQueryAssignTo, page: e };

    this.initAssignToData(this.assignToIdSelected);
  }

  // modal control

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
      'Queue Name': temp.name,
      'Queue Description': temp.description,
      'Assign To': temp.assignTo,
      'On/Off': temp.status,
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

    this.initData();
  }

  resetFilter() {
    this.showFilter = false;
    this.submitFilter = false;

    this.filterDisplay.set([...ALERT_QUEUE_APPROVAL_FILTER_DISPLAY_INIT]);

    this.pageQuery = {
      ...ALERT_QUEUE_APPROVAL_TASK_LIST_TABLE_QUERY_INIT,
    };

    this.initData();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  open(content: TemplateRef<any>, id: any) {
    this.assignToIdSelected = id;
    this.initAssignToData(this.assignToIdSelected);

    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-rule-relation',
      centered: true,
      size: 'lg',
    });
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
