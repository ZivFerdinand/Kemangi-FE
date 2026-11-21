import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

import { ToastService } from '../../../../../core/services/toast.service';
import {
  BreadcrumbProps,
  TableComponent,
  PAGE_INFO_INIT,
} from '../../../../../shared';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { ContentLayout } from '../../../../../shared/layout/content-layout/content-layout';
import {
  blockUnblockAccountBalanceUploadDetailsBreadcrumb,
  BLOCK_UNBLOCK_ACCOUNT_BALANCE_DETAILS_INIT,
  BLOCK_UNBLOCK_ACCOUNT_BALANCE_DETAILS_LIST_TABLE_QUERY,
} from '../../data';
import { BlockUnblockAccountBalanceService } from '../../api/services/block-unblock-account-balance.service';
import { BlockUnblockAccountBalanceApprovalService } from '../../../../approval/block-unblock-account-balance/api/services/block-unblock-account-balance-approval.service';
import {
  uploadDetailsInvalidBlockTypeAccount,
  uploadDetailsInvalidUnblockTypeAccount,
  uploadDetailsInvalidBlockTypePocket,
  uploadDetailsInvalidUnblockTypePocket,
} from '../../data/column';
import {
  BlockUnblockAccountBalanceDetails,
  BlockUnblockAccountBalanceDetailsListTableQuery,
} from '../../domain/models/block-unblock-account-balance.model';
import {
  mapBlockUnblockAccountBalanceDetailsApiToDomain,
  mapBlockUnblockAccountBalanceDetailsListTableQueryToApi,
  mapRequestBlockUnblockAccountBalancePayloadDomainToApi,
} from '../../mappers/block-unblock-account-balance.mapper';
import { mapBlockUnblockDownloadFileParamsDomainToApi } from '../../../../approval/block-unblock-account/mappers/block-unblock-approval.mapper';
import { CapitalizePipe } from '../../../../../shared';

registerLocaleData(localeDe);

@Component({
  selector: 'app-block-unblock-account-balance-upload-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    NgbPaginationModule,
    NgbTooltipModule,
    ContentLayout,
    TableComponent,
    CapitalizePipe,
    DecimalPipe,
  ],
  providers: [DatePipe],
})
export class BlockUnblockAccountBalanceUploadDetailsComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] =
    blockUnblockAccountBalanceUploadDetailsBreadcrumb;

  pageTitle: string = 'Block/Unblock Account Balance Detail';

  columns: any[] = [];

  pageQuery: BlockUnblockAccountBalanceDetailsListTableQuery = {
    ...BLOCK_UNBLOCK_ACCOUNT_BALANCE_DETAILS_LIST_TABLE_QUERY,
  };

  details: BlockUnblockAccountBalanceDetails = {
    ...BLOCK_UNBLOCK_ACCOUNT_BALANCE_DETAILS_INIT,
  };

  pageInfo: any = { ...PAGE_INFO_INIT };

  tableData: any[] = [];

  apprId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly blockUnblockAccountBalanceService: BlockUnblockAccountBalanceService,
    private readonly blockUnblockAccountBalanceApprovalService: BlockUnblockAccountBalanceApprovalService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    private http: HttpClient,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params.get('id')) {
        this.apprId = params.get('id');
      }

      if (this.apprId) {
        this.getDetails(this.apprId);
      }
    });
  }

  getDetails(id: string) {
    this.ngxLoader.start();
    this.blockUnblockAccountBalanceService
      .detailsTemp(id)
      .pipe(
        finalize(() => {
          this.ngxLoader.stop();
          if (this.details.totalInvalidData > 0) {
            this.getDataList();
          }
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.details = mapBlockUnblockAccountBalanceDetailsApiToDomain(
            res['data'],
          );

          this.handleColumns(this.details.accountType, this.details.action);
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  getDetailsList(
    id: string,
    query: BlockUnblockAccountBalanceDetailsListTableQuery,
  ) {
    const payload = { ...query, validStatus: false };

    this.ngxLoader.start();
    this.blockUnblockAccountBalanceService
      .detailsTempList(
        id,
        mapBlockUnblockAccountBalanceDetailsListTableQueryToApi(payload),
        this.details.accountType === 'ACCOUNT' ? 'list-ids' : 'list-cell',
      )
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

  getDataList() {
    if (this.apprId) {
      this.getDetailsList(this.apprId, {
        ...this.pageQuery,
        page: this.pageQuery.page - 1,
      });
    }
  }

  navigateTo(path: string) {
    if (path === '/home/rule-management/rule/create') {
      this.router.navigate([path], {
        queryParams: {
          from: 'current',
        },
      });

      return;
    }

    this.router.navigate([path]);
  }

  handleDownload(param: {
    id: number;
    fileName: string;
    validStatus: boolean | null;
    processStatus: boolean | null;
  }) {
    const payload = {
      validStatus: param.validStatus,
      processStatus: param.processStatus,
    };
    this.blockUnblockAccountBalanceApprovalService
      .downloadTempFile(
        param.id,
        mapBlockUnblockDownloadFileParamsDomainToApi(payload),
      )
      .subscribe((response) => {
        const blob = response.body!;

        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ?.split('filename=')[1]
          ?.replace(/"/g, '')
          ?.trim();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        const name = param.fileName.split('.');

        link.href = url;
        link.download =
          filename ||
          `${name[0]}${payload.validStatus === true ? '_Valid' : payload.validStatus === false ? '_Invalid' : ''}.${name[1]}`;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  }

  handlePageChange(event: any) {
    this.pageQuery = { ...this.pageQuery, page: event };

    this.getDataList();
  }

  handleSortChange(order: string, param: string) {
    this.pageQuery = { ...this.pageQuery, sort: param, sortDir: order };

    this.getDataList();
  }

  submit() {
    if (this.details.totalInvalidData > 0) {
      this.confirmationDialogService
        .confirm(
          '',
          `There is invalid record in your file and won’t be submitted.
Are you sure you want to submit?
          `,
          'Yes',
          'No',
        )
        .then((confirmed) => {
          if (confirmed) {
            this.request();
            return;
          }
        });

      return;
    }

    this.confirmationDialogService
      .confirm('', `Are you sure you want to submit?`, 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.request();
          return;
        }
      });
  }

  request() {
    this.ngxLoader.start();
    const payload = {
      apprId: Number(this.apprId),
      approvalStatus: 'PENDING',
      note: '',
    };
    if (this.apprId) {
      this.blockUnblockAccountBalanceService
        .request(
          mapRequestBlockUnblockAccountBalancePayloadDomainToApi(payload),
        )
        .pipe(finalize(() => this.ngxLoader.stop()))
        .subscribe({
          next: () => {
            this.back();
            this.toast.success(
              'Block/Unblock Account Balance request has been submitted',
            );
          },
          error: this.handleError(
            'Block/Unblock Account Balance request has been failed',
          ),
        });
    }
  }

  back() {
    this.navigateTo('/home/action/block-unblock-account-balance/upload');
  }

  handleColumns(accountType: string, action: string) {
    if (accountType === 'ACCOUNT') {
      if (action === 'BLOCK') {
        this.columns = uploadDetailsInvalidBlockTypeAccount;
      } else {
        this.columns = uploadDetailsInvalidUnblockTypeAccount;
      }
    } else {
      if (action === 'BLOCK') {
        this.columns = uploadDetailsInvalidBlockTypePocket;
      } else {
        this.columns = uploadDetailsInvalidUnblockTypePocket;
      }
    }
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
