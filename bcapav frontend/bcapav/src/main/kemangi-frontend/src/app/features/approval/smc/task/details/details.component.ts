import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ReasonModalService } from '../../../../../core/services/reason-modal.service';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { BreadcrumbProps, PAGE_INFO_INIT } from '../../../../../shared';
import { ContentLayout } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { SmcApprDetails } from '../../components/smc-details/smc-details';

import { SMCDetailsListTableQuery } from '../../../../action/smc/domain/models/smc.model';
import {
  SMC_DETAILS_INIT,
  SMC_DETAILS_LIST_TABLE_QUERY,
} from '../../../../action/smc/data';
import {
  smcApprovalTaskListDetailsBreadcrumb,
  smcDataColumns,
} from '../../data';
import { SMCApprovalService } from '../../api/services/smc-approval.service';
import {
  mapRequestSmcPayloadDomainToApi,
  mapSmcDetailsApiToDomain,
  mapSmcDetailsListTableQueryToApi,
} from '../../../../action/smc/mappers/smc.mapper';
import { mapSmcDownloadFileParamsDomainToApi } from '../../mappers/smc-approval.mapper';
import { SMCService } from '../../../../action/smc/api/services/smc.service';
import { SMCApproval } from '../../domain/models/smc-approval.model';
@Component({
  selector: 'app-smc-approval-task-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [ContentLayout, SmcApprDetails],
})
export class SmcApprovalTaskDetailsComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = smcApprovalTaskListDetailsBreadcrumb;

  pageTitle: string = 'SMC Approval Detail';

  columns: any[] = smcDataColumns;

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

  pageType: 'task' | 'requested' = 'task';
  ref: string = '';

  approvalForm!: FormGroup;

  reasonErrorMessages = {
    note: {
      required: () => 'Rejection notes is required',
      minlength: (e: any) => `${e.requiredLength} characters required`,
      maxlength: (e: any) => `Max ${e.requiredLength} characters allowed`,
    },
  };

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly toast: ToastService,
    private fb: FormBuilder,
    private reasonDialogService: ReasonModalService,
    private confirmationDialogService: ConfirmationModalService,
    private smcApprovalService: SMCApprovalService,
    private smcService: SMCService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.handleRouteParams();
    this.handleQueryParams();
    this.initForm();
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

  initForm() {
    this.approvalForm = this.fb.group({
      apprId: [0],
      approvalStatus: [''],
      note: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  getDetails(id: string) {
    this.ngxLoader.start();

    this.smcApprovalService
      .details(id)
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.details = mapSmcDetailsApiToDomain(res['data']);
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

  approve() {
    this.approvalForm.patchValue({
      apprId: this.apprId,
    });
    this.ngxLoader.start();
    this.smcApprovalService
      .approve(mapRequestSmcPayloadDomainToApi(this.approvalForm.getRawValue()))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.toast.success('SMC request successfully approved');

          this.router.navigate(['/home/approval/smc/task-list']);
        },
        error: this.handleError('SMC failed to approve'),
      });
  }

  reject() {
    this.approvalForm.patchValue({
      apprId: this.apprId,
    });
    this.ngxLoader.start();

    this.smcApprovalService
      .reject(mapRequestSmcPayloadDomainToApi(this.approvalForm.getRawValue()))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.toast.success('SMC request successfully rejected');

          this.router.navigate(['/home/approval/smc/task-list']);
        },
        error: this.handleError('SMC failed to reject'),
      });
  }

  handleApprove() {
    this.approvalForm.patchValue({
      approvalStatus: 'APPROVED',
    });

    this.approvalForm.get('note')?.clearValidators();
    this.approvalForm.get('note')?.updateValueAndValidity();

    this.confirmationDialogService
      .confirm('', 'Are you sure you want to approve this file?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.approve();
        } else {
          this.approvalForm
            .get('note')
            ?.setValidators([Validators.required, Validators.maxLength(200)]);
          this.approvalForm.get('note')?.updateValueAndValidity();
        }
      });
  }

  handleReject() {
    this.approvalForm.patchValue({
      approvalStatus: 'REJECTED',
    });

    this.reasonDialogService
      .reason(
        'Are you sure you want to reject this file?',
        'Yes',
        'No',
        'md',
        this.approvalForm,
        this.reasonErrorMessages,
      )
      .then((confirmed) => {
        if (confirmed) {
          this.reject();
        }
      });
  }

  back() {
    this.router.navigate(['/home/approval/smc/task-list']);
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
