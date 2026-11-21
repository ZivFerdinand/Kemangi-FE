import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';

import {
  BreadcrumbProps,
  PAGE_INFO_INIT,
  ContentLayout,
} from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { BlockUnblockApprDetails } from '../../components/block-unblock-details/block-unblock-details';
import { BLOCK_UNBLOCK_DETAILS_LIST_TABLE_QUERY } from '../../../../action/block-unblock-account/data';
import { uploadDetailsColumn } from '../../../../action/block-unblock-account/data';
import { BlockUnblockDetailsListTableQuery } from '../../../../action/block-unblock-account/domain/models/block-unblock.model';
import { BlockUnblockDetails } from '../../../../action/block-unblock-account/domain/models/block-unblock.model';
import { BLOCK_UNBLOCK_DETAILS_INIT } from '../../../../action/block-unblock-account/data';
import { BlockUnblockApprovalService } from '../../api/services/block-unblock-approval.service';
import { BlockUnblockService } from '../../../../action/block-unblock-account/api/services/block-unblock.service';
import {
  mapBlockUnblockDetailsListTableQueryToApi,
  mapBlockUnblockDetailsApiToDomain,
} from '../../../../action/block-unblock-account/mappers/block-unblock.mapper';
import { blockUnblockApprovalRequestedListDetailsBreadcrumb } from '../../data';
import { mapBlockUnblockDownloadFileParamsDomainToApi } from '../../../../approval/block-unblock-account/mappers/block-unblock-approval.mapper';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
@Component({
  selector: 'app-block-unblock-approval-requested-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [ContentLayout, BlockUnblockApprDetails],
})
export class BlockUnblockApprovalRequestedDetailsComponent
  implements OnInit, OnDestroy
{
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] =
    blockUnblockApprovalRequestedListDetailsBreadcrumb;

  pageTitle: string = 'Block/Unblock Account Approval Detail';

  columns: any[] = uploadDetailsColumn;

  pageQuery: BlockUnblockDetailsListTableQuery = {
    ...BLOCK_UNBLOCK_DETAILS_LIST_TABLE_QUERY,
  };

  pageInfo: any = { ...PAGE_INFO_INIT };

  tableData: any[] = [];

  details: BlockUnblockDetails = { ...BLOCK_UNBLOCK_DETAILS_INIT };

  isDisabled: boolean = true;
  apprId: string | null = '';

  pageType: 'task' | 'requested' = 'requested';
  ref: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly blockUnblockApprovalService: BlockUnblockApprovalService,
    private readonly blockUnblockService: BlockUnblockService,
    private confirmationDialogService: ConfirmationModalService,

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

  handleRetry() {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to retry?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          if (this.apprId) {
            this.retry(this.apprId);
          }
        }
      });
  }

  retry(id: string) {
    this.ngxLoader.start();
    this.blockUnblockApprovalService
      .retry(id)
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.back();
          this.toast.success(
            'Retry request is being processed. Please wait until the process is complete.',
          );
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  getDetails() {
    this.ngxLoader.start();
    if (this.apprId) {
      this.blockUnblockService
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
            this.details = mapBlockUnblockDetailsApiToDomain(res['data']);
          },
          error: this.handleError('Something went wrong while loading data'),
        });
    }
  }

  getDetailsList(query: BlockUnblockDetailsListTableQuery) {
    this.ngxLoader.start();
    if (this.apprId) {
      this.blockUnblockService
        .detailsList(
          this.apprId,
          mapBlockUnblockDetailsListTableQueryToApi(query),
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
    this.blockUnblockApprovalService
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

  back() {
    this.router.navigate([
      '/home/approval/block-unblock-account/requested-list',
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
