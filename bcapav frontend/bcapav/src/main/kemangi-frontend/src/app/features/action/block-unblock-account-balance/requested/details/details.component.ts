import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';

import { PAGE_INFO_INIT } from '../../../../../shared';
import { BreadcrumbProps } from '../../../../../shared';
import { ContentLayout } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { BlockUnblockAccountBalanceApprDetails } from '../../../../approval/block-unblock-account-balance/components/block-unblock-account-balance-details/block-unblock-account-balance-details';
import { blockUnblockAccountBalanceRequestedListDetailsBreadcrumb } from '../../data';
import { BlockUnblockAccountBalanceService } from '../../api/services/block-unblock-account-balance.service';
import { BlockUnblockAccountBalanceDetails } from '../../domain/models/block-unblock-account-balance.model';
import {
  BLOCK_UNBLOCK_ACCOUNT_BALANCE_DETAILS_INIT,
  BLOCK_UNBLOCK_ACCOUNT_BALANCE_DETAILS_LIST_TABLE_QUERY,
  // unblockAccountBalanceDetailsRequestedColumns,
  // blockDoneAccountBalanceDetailsRequestedColumns,
  // blockNotDoneAccountBalanceDetailsRequestedColumns,
} from '../../data';
import {
  blockAccountBalanceAccountTypeColumnsTypeI,
  blockAccountBalanceAccountTypeColumnsTypeII,
  unblockAccountBalanceAccountTypeColumnsTypeI,
  unblockAccountBalanceAccountTypeColumnsTypeII,
  blockAccountBalancePocketTypeColumnsTypeI,
  blockAccountBalancePocketTypeColumnsTypeII,
  unblockAccountBalancePocketTypeColumnsTypeI,
  unblockAccountBalancePocketTypeColumnsTypeII,
  unblockAccountBalancePocketTypeColumnsTypeIII,
} from '../../../../approval/block-unblock-account-balance/data';
import {
  mapBlockUnblockAccountBalanceDetailsApiToDomain,
  mapBlockUnblockAccountBalanceDetailsListTableQueryToApi,
} from '../../mappers/block-unblock-account-balance.mapper';
import { mapBlockUnblockDownloadFileParamsDomainToApi } from '../../../../approval/block-unblock-account/mappers/block-unblock-approval.mapper';
import { BlockUnblockAccountBalanceDetailsListTableQuery } from '../../domain/models/block-unblock-account-balance.model';
import { BlockUnblockAccountBalanceApprovalService } from '../../../../approval/block-unblock-account-balance/api/services/block-unblock-account-balance-approval.service';

@Component({
  selector: 'app-block-unblock-account-balance-requested-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [ContentLayout, BlockUnblockAccountBalanceApprDetails],
})
export class BlockUnblockAccountBalanceRequestedDetailsComponent
  implements OnInit, OnDestroy
{
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] =
    blockUnblockAccountBalanceRequestedListDetailsBreadcrumb;

  pageTitle: string = 'Block/Unblock Account Balance Detail';

  columns: any[] = [];

  pageQuery: BlockUnblockAccountBalanceDetailsListTableQuery = {
    ...BLOCK_UNBLOCK_ACCOUNT_BALANCE_DETAILS_LIST_TABLE_QUERY,
  };

  pageInfo: any = { ...PAGE_INFO_INIT };

  tableData: any[] = [];

  details: BlockUnblockAccountBalanceDetails = {
    ...BLOCK_UNBLOCK_ACCOUNT_BALANCE_DETAILS_INIT,
  };

  isDisabled: boolean = true;
  apprId: string | null = '';

  pageType: 'task' | 'requested' = 'requested';
  ref: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly blockUnblockAccountBalanceService: BlockUnblockAccountBalanceService,
    private readonly blockUnblockAccountBalanceApprovalService: BlockUnblockAccountBalanceApprovalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.handleRouteParams();
    this.handleQueryParams();
  }

  handleRouteParams() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.apprId = params.get('id');

      if (this.apprId) {
        this.getDetails();
      }
    });
  }

  handleQueryParams() {
    this.route.queryParamMap.subscribe((params) => {
      const ref = params.get('ref');
      this.ref = ref || '';
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

  handleQuery(query: string) {
    this.pageQuery = { ...this.pageQuery, query: query };

    this.getDataList();
  }

  handleColumns(
    accountType: string,
    actionType: string,
    approvalStatus: string,
    processStatus?: string,
  ) {
    if (accountType === 'ACCOUNT') {
      if (actionType === 'BLOCK') {
        if (approvalStatus === 'APPROVED') {
          this.columns = blockAccountBalanceAccountTypeColumnsTypeI;
        } else {
          this.columns = blockAccountBalanceAccountTypeColumnsTypeII;
        }
      } else {
        if (approvalStatus === 'APPROVED') {
          this.columns = unblockAccountBalanceAccountTypeColumnsTypeI;
        } else {
          this.columns = unblockAccountBalanceAccountTypeColumnsTypeII;
        }
      }
    } else {
      if (actionType === 'BLOCK') {
        if (approvalStatus === 'PENDING' || approvalStatus === 'REJECTED') {
          this.columns = blockAccountBalancePocketTypeColumnsTypeII;
        } else {
          this.columns = blockAccountBalancePocketTypeColumnsTypeI;
        }
      } else {
        if (approvalStatus === 'APPROVED') {
          if (processStatus === 'PENDING' || processStatus === 'DONE') {
            this.columns = unblockAccountBalancePocketTypeColumnsTypeII;
          } else {
            this.columns = unblockAccountBalancePocketTypeColumnsTypeI;
          }
        } else {
          this.columns = unblockAccountBalancePocketTypeColumnsTypeIII;
        }
      }
    }
  }

  getDetails() {
    this.ngxLoader.start();
    if (this.apprId) {
      this.blockUnblockAccountBalanceService
        .details(this.apprId)
        .pipe(
          finalize(() => {
            this.ngxLoader.stop();
            if (this.details) {
              this.getDataList();
            }
          }),
        )
        .subscribe({
          next: (res: any) => {
            this.details = mapBlockUnblockAccountBalanceDetailsApiToDomain(
              res['data'],
            );

            this.handleColumns(
              this.details.accountType,
              this.details.action,
              this.details.approvalStatus,
              this.details.processStatus,
            );
          },
          error: this.handleError('Something went wrong while loading data'),
        });
    }
  }

  getDetailsList(query: BlockUnblockAccountBalanceDetailsListTableQuery) {
    this.ngxLoader.start();
    if (this.apprId) {
      this.blockUnblockAccountBalanceService
        .detailsList(
          this.apprId,
          mapBlockUnblockAccountBalanceDetailsListTableQueryToApi(query),
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
  }

  getDataList() {
    this.pageQuery = {
      ...this.pageQuery,
      validStatus:
        this.details.processStatus === 'WAITING'
          ? true
          : this.details.processStatus === 'DONE'
            ? true
            : null,
    };

    this.getDetailsList({ ...this.pageQuery, page: this.pageQuery.page - 1 });
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
      .downloadFile(
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

  handleDownloadUnblock() {
    this.blockUnblockAccountBalanceApprovalService
      .downloadFileUnblock(Number(this.apprId))
      .subscribe((response) => {
        const blob = response.body!;
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ?.split('filename=')[1]
          ?.replace(/"/g, '')
          ?.trim();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = filename || '';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  }

  back() {
    this.router.navigate([
      '/home/action/block-unblock-account-balance/requested',
    ]);
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
