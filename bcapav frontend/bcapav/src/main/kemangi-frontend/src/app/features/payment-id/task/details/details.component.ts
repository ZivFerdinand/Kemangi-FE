import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColumnDef } from '@tanstack/table-core';

import {
  BreadcrumbProps,
  PageInfo,
  TableQuery,
} from '../../../../shared/interfaces';
import {
  ContentLayout,
  PAGE_QUERY_INIT,
  PAGE_INFO_INIT,
  TableComponent,
} from '../../../../shared';
import { ToastService } from '../../../../core/services/toast.service';

import { finalize, Subject, takeUntil } from 'rxjs';
import { PaymentIdService } from '../../api/services/payment-id.service';
import {
  accountListColumns,
  creditCardListColumns,
  historyColumns,
  historyList,
  paymentIdTaskDetailsBreadcrumb,
  sakukuListColumns,
} from '../../data';
import {
  PaymentIdAccount,
  PaymentIdCreditCard,
  PaymentIdDetails,
  PaymentIdSakuku,
} from '../../domain/model/payment-id.model';
import { PaymentIdDetailsInfo } from '../../components/payment-details-info/payment-details-info';
import { PaymentDetailsProduct } from '../../components/payment-details-product/payment-details-product';
import { mapPaymentIdDetailsApiToDomain } from '../../mappers/payment-id.mapper';
import { mapTableQueryDomainToApi } from '../../../../shared/mappers';

interface DetailProduct<T> {
  name: string;
  columns: ColumnDef<T>[];
  tableData: T[];
  pageQuery: TableQuery;
  pageInfo: PageInfo;
}

@Component({
  selector: 'app-payment-id-task-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    NgSelectModule,
    ContentLayout,
    FormsModule,
    PaymentDetailsProduct,
    PaymentIdDetailsInfo,
    TableComponent,
  ],
  providers: [DatePipe],
})
export class PaymentIdTaskDetailsComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = paymentIdTaskDetailsBreadcrumb;

  pageTitle: string = 'Detail Product';

  details: PaymentIdDetails | null = null;

  id: string | null = null;

  columnsHistory: any[] = historyColumns;

  dataHistory: any[] = historyList;

  productAccount: DetailProduct<PaymentIdAccount> = {
    name: 'ACCOUNT',
    columns: accountListColumns,
    tableData: [],
    pageQuery: PAGE_QUERY_INIT,
    pageInfo: PAGE_INFO_INIT,
  };

  productSakuku: DetailProduct<PaymentIdSakuku> = {
    name: 'SAKUKU',
    columns: sakukuListColumns,
    tableData: [],
    pageQuery: PAGE_QUERY_INIT,
    pageInfo: PAGE_INFO_INIT,
  };

  productCC: DetailProduct<PaymentIdCreditCard> = {
    name: 'CREDIT CARD',
    columns: creditCardListColumns,
    tableData: [],
    pageQuery: PAGE_QUERY_INIT,
    pageInfo: PAGE_INFO_INIT,
  };

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly toast: ToastService,
    private readonly paymentIdService: PaymentIdService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.handleRouteParams();
  }

  handleRouteParams() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.id = params.get('id');

      if (this.id) {
        this.getDetails(this.id);
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  getDetails(id: string) {
    this.ngxLoader.start();
    this.paymentIdService
      .details(id)
      .pipe(
        finalize(() => {
          this.ngxLoader.stop();
          if (this.details && this.details.productList) {
            this.callProduct(this.details.productList);
          }
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.details = mapPaymentIdDetailsApiToDomain(res['data']);
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  getSakuku(id: number) {
    this.paymentIdService
      .sakukuList(
        id,
        mapTableQueryDomainToApi({
          ...this.productSakuku.pageQuery,
          page: this.productSakuku.pageQuery.page - 1,
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.productSakuku = {
            ...this.productSakuku,
            tableData: res['data']['content'],
            pageInfo: {
              totalElements: res['data']['totalElements'],
              totalPages: res['data']['totalPages'],
            },
          };
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  getAccount(id: number) {
    this.paymentIdService
      .accountList(
        id,
        mapTableQueryDomainToApi({
          ...this.productAccount.pageQuery,
          page: this.productAccount.pageQuery.page - 1,
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.productAccount = {
            ...this.productAccount,
            tableData: res['data']['content'],
            pageInfo: {
              totalElements: res['data']['totalElements'],
              totalPages: res['data']['totalPages'],
            },
          };
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  getCreditCard(id: number) {
    this.paymentIdService
      .creditCardList(
        id,
        mapTableQueryDomainToApi({
          ...this.productCC.pageQuery,
          page: this.productCC.pageQuery.page - 1,
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.productCC = {
            ...this.productCC,
            tableData: res['data']['content'],
            pageInfo: {
              totalElements: res['data']['totalElements'],
              totalPages: res['data']['totalPages'],
            },
          };
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  callProduct(products: string[]) {
    products.forEach((x: string) => {
      if (x === 'Sakuku') {
        this.getSakuku(Number(this.id));
        return;
      }

      if (x === 'Account') {
        this.getAccount(Number(this.id));
        return;
      }

      if (x === 'Credit Card' || x === 'Credit') {
        this.getCreditCard(Number(this.id));
        return;
      }
    });
  }

  handleProduct(type: string, pageQuery: TableQuery) {
    console.log('type', type);
    console.log('pageQuery', pageQuery);
    switch (type) {
      case 'sakuku':
        this.productSakuku = {
          ...this.productSakuku,
          pageQuery: { ...pageQuery },
        };
        this.getSakuku(Number(this.id));
        break;

      case 'account':
        this.productAccount = {
          ...this.productAccount,
          pageQuery: { ...pageQuery },
        };
        this.getAccount(Number(this.id));
        break;

      case 'cc':
        this.productCC = { ...this.productCC, pageQuery: { ...pageQuery } };
        this.getCreditCard(Number(this.id));
        break;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }

  back() {
    this.router.navigate(['/home/payment-id/task']);
  }
}
