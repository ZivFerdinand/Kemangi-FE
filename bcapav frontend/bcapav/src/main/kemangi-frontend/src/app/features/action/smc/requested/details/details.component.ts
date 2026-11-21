import { SMCService } from './../../api/services/smc.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';

import { PAGE_INFO_INIT } from '../../../../../shared';
import { BreadcrumbProps } from '../../../../../shared';
import { ContentLayout } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import {
  SMC_DETAILS_INIT,
  SMC_DETAILS_LIST_TABLE_QUERY,
  smcRequestedListDetailsBreadcrumb,
  uploadDetailsInvalidColumn,
  uploadDetailsColumnTypeB,
} from '../../data';

import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { SMCDetailsListTableQuery } from '../../domain/models/smc.model';
import {
  mapSmcDetailsApiToDomain,
  mapSmcDetailsListTableQueryToApi,
  mapSmcDownloadFileParamsDomainToApi,
} from '../../mappers/smc.mapper';
import { SMCApprovalService } from '../../../../approval/smc/api/services/smc-approval.service';
import { SmcApprDetails } from '../../../../approval/smc/components/smc-details/smc-details';
import { smcDataColumns } from '../../../../approval/smc/data';
import { SMCApproval } from '../../../../approval/smc/domain/models/smc-approval.model';
@Component({
  selector: 'app-smc-requested-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [ContentLayout, SmcApprDetails],
})
export class SmcRequestedDetailsComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = smcRequestedListDetailsBreadcrumb;

  pageTitle: string = 'SMC Detail';

  columns: any[] = [];

  pageQuery: SMCDetailsListTableQuery = {
    ...SMC_DETAILS_LIST_TABLE_QUERY,
  };

  pageInfo: any = { ...PAGE_INFO_INIT };

  tableData: any[] = smcDataColumns;

  details: SMCApproval = { ...SMC_DETAILS_INIT };

  isDisabled: boolean = true;
  apprId: string | null = '';

  pageType: 'task' | 'requested' = 'requested';
  ref: string = '';

  showBtnRetry: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly smcService: SMCService,
    private readonly smcApprovalService: SMCApprovalService,
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
        this.getDetails(this.apprId);
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
    this.smcApprovalService
      .retry(id)
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.back();
          this.toast.success(
            'Retry request is being processed. Please wait until the process is complete.',
          );
        },
        error: this.handleError('Retry request failed'),
      });
  }

  getDetails(id: string) {
    this.ngxLoader.start();

    this.smcService
      .details(id)
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.details = mapSmcDetailsApiToDomain(res['data']);
          this.handleColumns(this.details);
        },
        error: this.handleError('Something went wrong while loading data'),
        complete: () => {
          this.getDataList();
        },
      });
  }

  getDetailsList(query: SMCDetailsListTableQuery) {
    this.ngxLoader.start();
    if (this.apprId) {
      this.smcService
        .detailsList(this.apprId, mapSmcDetailsListTableQueryToApi(query))
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
    this.smcService
      .downloadFile(param.id, mapSmcDownloadFileParamsDomainToApi(payload))
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

  handleColumns(data: SMCApproval) {
    if (data.approvalStatus === 'APPROVED') {
      this.columns = uploadDetailsColumnTypeB;
    } else {
      this.columns = uploadDetailsInvalidColumn;
    }
  }

  back() {
    this.router.navigate(['/home/action/smc/requested']);
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
}
