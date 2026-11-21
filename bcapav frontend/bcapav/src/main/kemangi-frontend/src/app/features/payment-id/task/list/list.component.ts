import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnDef } from '@tanstack/table-core';
import { finalize } from 'rxjs';

import { genericTabsV4, PAGE_INFO_INIT } from '../../../../shared/data';
import { paymentIdTaskListBreadcrumb } from '../../data/breadcrumb';
import {
  BreadcrumbProps,
  TabProps,
  FiltersDisplayStruct,
  TableState,
  PageInfo,
  TableQuery,
} from '../../../../shared/interfaces';
import { CustomTabComponent, ContentLayout } from '../../../../shared';
import { ToastService } from '../../../../core/services/toast.service';
import { StickyTableComponent } from '../../../../shared/components/sticky-table/sticky-table';
import { PaymentIdService } from '../../api/services/payment-id.service';
import { MenuService } from '../../../../core/services/menu.service';
import {
  PAYMENT_ID_TASK_LIST_DISPLAY_INIT,
  PAYMENT_PAGE_TASK_QUERY_INIT,
  paymentIdTaskListColumns,
} from '../../data';
import { PaymentIdTaskFilter } from '../../components/payment-id-task-filter/payment-id-task-filter';
import { PaymentId, PaymentIdQuery } from '../../domain/model/payment-id.model';
import { mapPaymentIdQueryDomainToApi } from '../../mappers/payment-id.mapper';
@Component({
  selector: 'app-payment-id-task-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', '../../../../shared/styles/index.scss'],
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
    StickyTableComponent,
    PaymentIdTaskFilter,
  ],
  providers: [DatePipe],
})
export class PaymentIdTaskListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = paymentIdTaskListBreadcrumb;

  pageTitle: string = 'Payment ID';

  tabs: TabProps[] = genericTabsV4;

  activeTab: string = 'task';

  pageQuery: TableState<PaymentIdQuery> = {
    ...PAYMENT_PAGE_TASK_QUERY_INIT,
  };

  pageInfo: PageInfo = { ...PAGE_INFO_INIT };

  tableData: any[] = [];

  columns: ColumnDef<PaymentId>[] = paymentIdTaskListColumns;

  columnsPinned: string[] = ['no', 'requestDate', 'requestType'];

  showFilter: boolean = false;

  submitFilter: boolean = false;

  taskPermission: boolean = false;
  historyPermission: boolean = false;

  filterDisplay = signal<FiltersDisplayStruct[]>([
    ...PAYMENT_ID_TASK_LIST_DISPLAY_INIT,
  ]);

  visibleFilterInfo = computed(() => {
    return this.filterDisplay().filter(
      (item) =>
        item.value !== null && item.value !== '' && item.value !== undefined,
    );
  });

  constructor(
    private router: Router,
    private readonly paymentIdService: PaymentIdService,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly toast: ToastService,
    private menu: MenuService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initData();
  }

  menuTask = computed(() => this.menu.checkMenu('PAYMENTID-TASK'));

  menuHistory = computed(() => this.menu.checkMenu('PAYMENTID-HISTORY'));

  checkMenu = (value: string): boolean => {
    return value === 'task' ? this.menuTask() : this.menuHistory();
  };

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  initData() {
    this.getList({ ...this.pageQuery, page: this.pageQuery.page - 1 });
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

  handleFilter(data: any) {
    this.submitFilter = true;
    this.showFilter = false;
    this.pageQuery = { ...this.pageQuery, ...data?.filterBy };

    const temp = { ...data.filterDisplayTemp };

    const dateRange = (from?: string | null, to?: string | null) =>
      `${from ?? ''}${to ? ' - ' + to : ''}`;

    const labelValueMap: Record<string, any> = {
      'Request Date': dateRange(temp.requestDateFrom, temp.requestDateTo),
      'Request Type': temp.requestType,
      'Last Action Date': dateRange(temp.actionDateFrom, temp.actionDateTo),
      'Payment ID': temp.paymentId,
      'Customer Name': temp.customerName,
      'Bank Name': temp.bankName,
      'Product List': temp.productType,
      CIN: temp.cin,
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

    this.filterDisplay.set([...PAYMENT_ID_TASK_LIST_DISPLAY_INIT]);

    this.pageQuery = {
      ...PAYMENT_PAGE_TASK_QUERY_INIT,
    };

    this.initData();
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'task') this.navigateTo('/home/payment-id/task');
    if (tab === 'history') this.navigateTo('/home/payment-id/history');
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }

  // fetch API

  getList(query: PaymentIdQuery) {
    this.ngxLoader.start();

    this.paymentIdService
      .list(mapPaymentIdQueryDomainToApi(query))
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
}
