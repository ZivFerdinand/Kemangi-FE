import {
  Component,
  OnInit,
  signal,
  computed,
  OnDestroy,
  inject,
  TemplateRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import {
  NgbModal,
  NgbModalRef,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
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
  CustomTabComponent,
  ContentLayout,
  TableComponent,
  PAGE_QUERY_INIT,
  PAGE_INFO_INIT,
} from '../../../../shared';
import { ToastService } from '../../../../core/services/toast.service';

import { StickyTableComponent } from '../../../../shared/components/sticky-table/sticky-table';
import {
  PaymentIdAccount,
  PaymentIdCreditCard,
  PaymentIdDetails,
  PaymentIdSakuku,
} from '../../domain/model/payment-id.model';
import {
  accountListColumns,
  creditCardListColumns,
  paymentIdAccount,
  paymentIdCc,
  paymentIdHistoryDetailsBreadcrumb,
  paymentIdListMockup,
  paymentIdSakuku,
  sakukuListColumns,
  historyColumns,
  historyList,
  detailProductColumns,
  detailProductList,
} from '../../data';
import { PaymentDetailsProduct } from '../../components/payment-details-product/payment-details-product';
import { PaymentIdDetailsInfo } from '../../components/payment-details-info/payment-details-info';
import { finalize, Subject, takeUntil } from 'rxjs';
import { PaymentIdService } from '../../api/services/payment-id.service';
import { mapPaymentIdDetailsApiToDomain } from '../../mappers/payment-id.mapper';
import { mapTableQueryDomainToApi } from '../../../../shared/mappers';

//type PaymentRow = PaymentIdSakuku | PaymentIdAccount | PaymentIdCreditCard;
// interface DetailProduct {
//   name: string;
//   columns: ColumnDef<PaymentRow>[];
//   tableData: any[];
// }

interface DetailProduct<T> {
  name: string;
  columns: ColumnDef<T>[];
  tableData: T[];
  pageQuery: TableQuery;
  pageInfo: PageInfo;
}

@Component({
  selector: 'app-payment-id-history-details',
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
export class PaymentIdHistoryDetailsComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = paymentIdHistoryDetailsBreadcrumb;

  pageTitle: string = 'Detail Product';

  details: PaymentIdDetails | null = null;

  id: string | null = null;

  columnsHistory: any[] = historyColumns;

  columnsDetailProduct: any[] = detailProductColumns;

  dataHistory: any[] = historyList;

  dataProductList: any[] = detailProductList;

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

  private modalService = inject(NgbModal);

  modalRef!: NgbModalRef;

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

  open(content: TemplateRef<any>, id: any) {
    // this.dataGroupNameRelation = this.tableDataDataGroupRequested.find(
    //   (item: any) => item.dataGroupId === id,
    // )?.name;

    // this.dataGroupIdSelected = id;
    // this.getRuleRelationList(id, {
    //   ...this.pageQueryRuleRelations,
    //   page: this.pageQueryRuleRelations.page - 1,
    // });
    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-product-list',
      centered: true,
      size: 'lg',
    });
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
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
    this.router.navigate(['/home/payment-id/history']);
  }
}
