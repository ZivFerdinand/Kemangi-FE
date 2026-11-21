import { Component, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import {
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { ColumnDef } from '@tanstack/table-core';

import { FraudTypeService } from '../api';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import { FraudTypeParams, FraudType } from '../domain/models/fraud-types.model';

import {
  ContentLayout,
  CustomTabComponent,
  StickyTableComponent,
} from '../../../../shared';
import { BreadcrumbProps, TabProps, TableState } from '../../../../shared';
import { fraudTypeListColumns, fraudTypeListBreadcrumb } from '../data';
import { FRAUD_TYPE_LIST_DEFAULT } from '../data';
import { ToastService } from '../../../../core/services/toast.service';
import { PAGE_INFO_INIT, genericTabsV1 } from '../../../../shared';
import { mapFraudTypeParamsDomainToApi } from '../mappers/fraud-type.mapper';
import { SharedDataService } from '../../../../core/services/shared-data.service';

@Component({
  selector: 'app-fraud-type-list',
  templateUrl: './fraud-type-list.component.html',
  styleUrls: [
    './fraud-type-list.component.scss',
    '../../../../shared/styles/index.scss',
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
  ],
  providers: [DatePipe],
})
export class FraudTypeListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = fraudTypeListBreadcrumb;

  pageTitle: string = 'Fraud Type';

  tabs: TabProps[] = genericTabsV1;

  activeTab: string = 'current';

  columns: ColumnDef<FraudType>[] = fraudTypeListColumns;

  pageQuery: TableState<FraudTypeParams> = {
    ...FRAUD_TYPE_LIST_DEFAULT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: FraudType[] = [];

  columnsPinned: string[] = ['no', 'fraudType', 'description'];

  editPermission: boolean = false;
  createPermission: boolean = false;
  deletePermission: boolean = false;

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly fraudTypeService: FraudTypeService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initData();
    this.handlePermission();
  }

  initData() {
    this.getFraudTypeList({
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
    this.sharedData.checkMenu('MASTER-FRAUDTYPE-CREATE'),
  );

  checkEditPermission = computed(() =>
    this.sharedData.checkMenu('MASTER-FRAUDTYPE-UPDATE'),
  );

  checkDeletePermission = computed(() =>
    this.sharedData.checkMenu('MASTER-FRAUDTYPE-DELETE'),
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
    this.router.navigate([path]);
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'current') this.navigateTo('/home/data-master/fraud-type/');
    if (tab === 'requested')
      this.navigateTo('/home/data-master/fraud-type/requested-list');
  }

  getFraudTypeList(param: FraudTypeParams) {
    this.ngxLoader.start();

    this.fraudTypeService
      .fraudTypeList(mapFraudTypeParamsDomainToApi(param))
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
    this.getFraudTypeList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };
    this.getFraudTypeList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handleQuery() {
    this.pageQuery = { ...this.pageQuery, page: 1 };
    this.getFraudTypeList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
