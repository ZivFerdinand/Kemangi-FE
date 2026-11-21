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

import { ToastService } from '../../../../../core/services/toast.service';
import {
  BreadcrumbProps,
  TableComponent,
  PAGE_INFO_INIT,
} from '../../../../../shared';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { ContentLayout } from '../../../../../shared/layout/content-layout/content-layout';
import {
  SMC_DETAILS_INIT,
  SMC_DETAILS_LIST_TABLE_QUERY,
  smcDetailsBreadcrumb,
} from './../../data';
import { SMCService } from '../../api/services/smc.service';

import { uploadDetailsInvalidColumn } from './../../data';
import {
  mapSmcDetailsApiToDomain,
  mapSmcDetailsListTableQueryToApi,
  mapRequestSmcPayloadDomainToApi,
  mapSmcDownloadFileParamsDomainToApi,
} from '../../mappers/smc.mapper';

import {
  SMCDetails,
  SMCDetailsListTableQuery,
} from '../../domain/models/smc.model';

@Component({
  selector: 'app-smc-upload-details',
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
  ],
  providers: [DatePipe],
})
export class SmcDetailsComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = smcDetailsBreadcrumb;

  pageTitle: string = 'SMC Detail';

  columns: any[] = uploadDetailsInvalidColumn;

  pageQuery: SMCDetailsListTableQuery = {
    ...SMC_DETAILS_LIST_TABLE_QUERY,
  };

  details: SMCDetails = { ...SMC_DETAILS_INIT };

  pageInfo: any = { ...PAGE_INFO_INIT };

  tableData: any[] = [];

  apprId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly smcService: SMCService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
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

    this.smcService
      .detailsTemp(id)
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.details = mapSmcDetailsApiToDomain(res['data']);
        },
        error: this.handleError('Something went wrong while loading data'),
        complete: () => {
          if (this.details.totalInvalidData > 0) {
            this.getDataList();
          }
        },
      });
  }

  getDetailsList(id: string, query: SMCDetailsListTableQuery) {
    const payload = { ...query, validStatus: false };

    this.ngxLoader.start();

    this.smcService
      .detailsTempList(id, mapSmcDetailsListTableQueryToApi(payload))
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
    this.smcService
      .downloadTempFile(param.id, mapSmcDownloadFileParamsDomainToApi(payload))
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
      this.smcService
        .request(mapRequestSmcPayloadDomainToApi(payload))
        .pipe(finalize(() => this.ngxLoader.stop()))
        .subscribe({
          next: () => {
            this.back();
            this.toast.success('SMC request has been submitted');
          },
          error: this.handleError('SMC request has been failed'),
        });
    }
  }

  back() {
    this.navigateTo('/home/action/smc/upload');
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
