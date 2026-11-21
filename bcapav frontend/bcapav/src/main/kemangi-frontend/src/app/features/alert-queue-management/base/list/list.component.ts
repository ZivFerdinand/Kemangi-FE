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
import { finalize } from 'rxjs/operators';
import { ColumnDef } from '@tanstack/table-core';

import {
  ContentLayout,
  CustomTabComponent,
  StickyTableComponent,
} from '../../../../shared';
import {
  BreadcrumbProps,
  TabProps,
  FiltersDisplayStruct,
  PageInfo,
  TableState,
} from '../../../../shared/interfaces';
import {
  AlertQueueQuery,
  AssignToQuery,
  UserMasterDataFilterQuery,
} from '../../domain/alert-queue.model';
import {
  alertQueueManagementBreadcrumb,
  alertQueueListColumns,
  assignToColumns,
  ALERT_QUEUE_TABLE_QUERY_INIT,
  ALERT_QUEUE_FILTER_DISPLAY_INIT,
  ASSIGN_TO_TABLE_QUERY_INIT,
  USER_MASTER_DATA_QUERY_INIT,
} from '../../data';
import { genericTabsV1, PAGE_INFO_INIT } from '../../../../shared/data';
import { AlertQueueService } from '../../api/services/alert-queue.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import {
  mapAssignToQueryDomainToApi,
  mapAlertQueueQueryDomainToApi,
  mapUserMasterDataFilterQueryDomainToApi,
} from '../../mappers/alert-queue.mapper';
import { AlertQueueCurrentFilter } from '../../components/current-filter/current-filter';
import { SharedDataService } from '../../../../core/services/shared-data.service';
import { AlertQueue, AssignTo } from '../../domain/alert-queue.model';
@Component({
  selector: 'app-alert-queue-current-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', '../../../../shared/styles/index.scss'],
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
    AlertQueueCurrentFilter,
  ],
  providers: [DatePipe],
})
export class AlertQueueCurrentListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = alertQueueManagementBreadcrumb;

  pageTitle: string = 'Alert Queue Management';

  tabs: TabProps[] = genericTabsV1;

  activeTab = 'current';

  // table alert queue management info

  columns: ColumnDef<AlertQueue>[] = alertQueueListColumns;

  pageQuery: TableState<AlertQueueQuery> = { ...ALERT_QUEUE_TABLE_QUERY_INIT };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: AlertQueue[] = [];

  columnsPinned: string[] = ['queueId', 'name', 'description'];

  // table assign to info

  columnsAssignTo: ColumnDef<AssignTo>[] = assignToColumns;

  pageQueryAssignTo: TableState<AssignToQuery> = {
    ...ASSIGN_TO_TABLE_QUERY_INIT,
  };

  pageInfoAssignTo: PageInfo = { ...PAGE_INFO_INIT };

  tableDataAssignTo: AssignTo[] = [];

  columnsAssignToPinned: string[] = ['no', 'userId'];

  //

  assignToUserQuery: UserMasterDataFilterQuery = {
    ...USER_MASTER_DATA_QUERY_INIT,
  };

  showFilter: boolean = false;

  submitFilter: boolean = false;

  users: any[] = [];

  assignToUsers: any[] = [];

  assignToName: any;

  assignToIdSelected: any;

  editPermission: boolean = false;
  createPermission: boolean = false;
  deletePermission: boolean = false;

  filterDisplay = signal<FiltersDisplayStruct[]>([
    ...ALERT_QUEUE_FILTER_DISPLAY_INIT,
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
    private readonly alertQueueService: AlertQueueService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.handlePermission();
    this.initData();
    this.getUserList();
    this.getUserMasterData();
  }

  initData() {
    this.getAlertQueueList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  initAssignToData(id: string) {
    this.getAssignToList(id, {
      ...this.pageQueryAssignTo,
      page: this.pageQueryAssignTo.page - 1,
    });
  }

  handlePermission() {
    this.createPermission = this.checkMenu('create');
    this.deletePermission = this.checkMenu('delete');
    this.editPermission = this.checkMenu('edit');
  }

  checkCreatePermission = computed(() =>
    this.sharedData.checkMenu('ALERTQUEUE-ALERTQUEUE-CREATE'),
  );

  checkEditPermission = computed(() =>
    this.sharedData.checkMenu('ALERTQUEUE-ALERTQUEUE-UPDATE'),
  );

  checkDeletePermission = computed(() =>
    this.sharedData.checkMenu('ALERTQUEUE-ALERTQUEUE-DELETE'),
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

    switch (tab) {
      case 'current':
        this.navigateTo('/home/alert-queue-management/');
        break;
      case 'requested':
        this.navigateTo('/home/alert-queue-management/requested/');
        break;
    }
  }

  // hit API

  getAlertQueueList(query: AlertQueueQuery) {
    this.ngxLoader.start();

    this.alertQueueService
      .list(mapAlertQueueQueryDomainToApi(query))
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

  getAssignToList(id: string, query: AssignToQuery) {
    this.ngxLoader.start();

    this.alertQueueService
      .assignToList(id, mapAssignToQueryDomainToApi(query))
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
    this.alertQueueService.getUserList().subscribe({
      next: (res: any) => {
        this.users = res['data'];
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getUserMasterData() {
    this.alertQueueService
      .userMasterData(
        mapUserMasterDataFilterQueryDomainToApi(this.assignToUserQuery),
      )
      .subscribe({
        next: (res: any) => {
          this.assignToUsers = res['data'];
        },
        error: this.handleError('Something went wrong!'),
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

    this.filterDisplay.set([...ALERT_QUEUE_FILTER_DISPLAY_INIT]);

    this.pageQuery = {
      ...ALERT_QUEUE_TABLE_QUERY_INIT,
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
      ariaLabelledBy: 'modal-assign-to',
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
