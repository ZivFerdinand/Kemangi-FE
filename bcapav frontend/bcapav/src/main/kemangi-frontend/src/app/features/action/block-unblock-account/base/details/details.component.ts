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

import { ToastService } from '../../../../../core/services/toast.service';
import {
  BreadcrumbProps,
  TableComponent,
  PAGE_INFO_INIT,
} from '../../../../../shared';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { ContentLayout } from '../../../../../shared/layout/content-layout/content-layout';
import {
  blockUnblockUploadDetailsBreadcrumb,
  BLOCK_UNBLOCK_DETAILS_INIT,
  BLOCK_UNBLOCK_DETAILS_LIST_TABLE_QUERY,
} from './../../data';
import { BlockUnblockService } from '../../api/services/block-unblock.service';
import { BlockUnblockApprovalService } from '../../../../approval/block-unblock-account/api/services/block-unblock-approval.service';
import { uploadDetailsInvalidColumn } from '../../data/column';
import {
  BlockUnblockDetails,
  BlockUnblockDetailsListTableQuery,
} from '../../domain/models/block-unblock.model';
import {
  mapBlockUnblockDetailsApiToDomain,
  mapBlockUnblockDetailsListTableQueryToApi,
  mapRequestBlockUnblockPayloadDomainToApi,
} from '../../mappers/block-unblock.mapper';
import { mapBlockUnblockDownloadFileParamsDomainToApi } from '../../../../approval/block-unblock-account/mappers/block-unblock-approval.mapper';
import { CapitalizePipe } from '../../../../../shared';

@Component({
  selector: 'app-block-unblock-upload-details',
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
  ],
  providers: [DatePipe],
})
export class BlockUnblockUploadDetailsComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = blockUnblockUploadDetailsBreadcrumb;

  pageTitle: string = 'Block/Unblock Account Detail';

  columns: any[] = uploadDetailsInvalidColumn;

  pageQuery: BlockUnblockDetailsListTableQuery = {
    ...BLOCK_UNBLOCK_DETAILS_LIST_TABLE_QUERY,
  };

  details: BlockUnblockDetails = { ...BLOCK_UNBLOCK_DETAILS_INIT };

  pageInfo: any = { ...PAGE_INFO_INIT };

  tableData: any[] = [];

  apprId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly blockUnblockService: BlockUnblockService,
    private readonly blockUnblockApprovalService: BlockUnblockApprovalService,
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
    this.blockUnblockService
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
          this.details = mapBlockUnblockDetailsApiToDomain(res['data']);
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  getDetailsList(id: string, query: BlockUnblockDetailsListTableQuery) {
    const payload = { ...query, validStatus: false };

    this.ngxLoader.start();

    this.blockUnblockService
      .detailsTempList(id, mapBlockUnblockDetailsListTableQueryToApi(payload))
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
    this.blockUnblockApprovalService
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

    this.blockUnblockService
      .request(mapRequestBlockUnblockPayloadDomainToApi(payload))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.back();
          this.toast.success(
            'Block/Unblock Account request has been submitted',
          );
        },
        error: this.handleError(
          'Block/Unblock Account request has been failed',
        ),
      });
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }

  back() {
    this.navigateTo('/home/action/block-unblock-account/upload');
  }
}
