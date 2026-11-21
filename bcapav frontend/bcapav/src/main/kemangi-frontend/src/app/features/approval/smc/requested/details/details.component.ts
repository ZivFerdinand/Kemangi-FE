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
import { SmcApprDetails } from '../../components/smc-details/smc-details';
import { SMCApprovalService } from '../../api/services/smc-approval.service';
import { smcApprovalRequestedListDetailsBreadcrumb } from '../../data';
import { SMCDetailsListTableQuery } from '../../../../action/smc/domain/models/smc.model';
import {
  SMC_DETAILS_INIT,
  SMC_DETAILS_LIST_TABLE_QUERY,
} from '../../../../action/smc/data';
import { SMCApproval } from '../../domain/models/smc-approval.model';
import {
  mapSmcDetailsListTableQueryToApi,
  mapSmcDetailsApiToDomain,
} from '../../../../action/smc/mappers/smc.mapper';
import { SMCService } from '../../../../action/smc/api/services/smc.service';
import { mapSmcDownloadFileParamsDomainToApi } from '../../mappers/smc-approval.mapper';
import { smcDataColumns, smcDataColumnsTypeB } from '../../data';

@Component({
  selector: 'app-smc-approval-requested-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [ContentLayout, SmcApprDetails],
})
export class SmcApprovalRequestedDetailsComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = smcApprovalRequestedListDetailsBreadcrumb;

  pageTitle: string = 'SMC Approval Detail';

  columns: any[] = [];

  pageQuery: SMCDetailsListTableQuery = {
    ...SMC_DETAILS_LIST_TABLE_QUERY,
  };

  pageInfo: any = { ...PAGE_INFO_INIT };

  tableData: any[] = [];

  details: SMCApproval = {
    ...SMC_DETAILS_INIT,
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
    private readonly smcService: SMCService,
    private readonly smcApprovalService: SMCApprovalService,
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

  getDetails(id: string) {
    this.ngxLoader.start();

    this.smcApprovalService
      .details(id)
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.details = mapSmcDetailsApiToDomain(res['data']);
          this.handleColumns(this.details.processStatus);
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

  getDataList(processStatus?: any) {
    this.getDetailsList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
      processStatus:
        processStatus === 'WAITING'
          ? true
          : processStatus === 'DONE'
            ? true
            : null,
    });
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
    this.smcApprovalService
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

  handleColumns(processStatus: string | null) {
    if (processStatus === 'DONE') {
      this.columns = smcDataColumnsTypeB;
    } else {
      this.columns = smcDataColumns;
    }
  }

  back() {
    this.router.navigate(['/home/approval/smc/requested-list']);
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
