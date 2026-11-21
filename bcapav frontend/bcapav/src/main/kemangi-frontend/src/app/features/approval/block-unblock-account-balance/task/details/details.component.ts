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
import { BlockUnblockAccountBalanceDetailsListTableQuery } from '../../../../action/block-unblock-account-balance/domain/models/block-unblock-account-balance.model';
import { BlockUnblockAccountBalanceApprDetails } from '../../components/block-unblock-account-balance-details/block-unblock-account-balance-details';
import { BlockUnblockAccountBalanceDetails } from '../../../../action/block-unblock-account-balance/domain/models/block-unblock-account-balance.model';
import { BLOCK_UNBLOCK_ACCOUNT_BALANCE_DETAILS_LIST_TABLE_QUERY } from '../../../../action/block-unblock-account-balance/data';

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
} from '../../data';
import { BlockUnblockAccountBalanceApprovalService } from '../../api/services/block-unblock-account-balance-approval.service';
import { BlockUnblockAccountBalanceService } from '../../../../action/block-unblock-account-balance/api/services/block-unblock-account-balance.service';
import {
  mapBlockUnblockAccountBalanceDetailsListTableQueryToApi,
  mapBlockUnblockAccountBalanceDetailsApiToDomain,
} from '../../../../action/block-unblock-account-balance/mappers/block-unblock-account-balance.mapper';
import { mapBlockUnblockDownloadFileParamsDomainToApi } from '../../../block-unblock-account/mappers/block-unblock-approval.mapper';
import { BLOCK_UNBLOCK_ACCOUNT_BALANCE_DETAILS_INIT } from '../../../../action/block-unblock-account-balance/data';
import { mapRequestBlockUnblockAccountBalancePayloadDomainToApi } from '../../../../action/block-unblock-account-balance/mappers/block-unblock-account-balance.mapper';
import { blockUnblockAccountBalanceApprovalTaskListDetailsBreadcrumb } from '../../data';
@Component({
  selector: 'app-block-unblock-account-balance-approval-task-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [ContentLayout, BlockUnblockAccountBalanceApprDetails],
})
export class BlockUnblockAccountBalanceApprovalTaskDetailsComponent
  implements OnInit, OnDestroy
{
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] =
    blockUnblockAccountBalanceApprovalTaskListDetailsBreadcrumb;

  pageTitle: string = 'Block/Unblock Account Balance Approval Detail';

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
    private readonly blockUnblockAccountBalanceApprovalService: BlockUnblockAccountBalanceApprovalService,
    private readonly blockUnblockAccountBalanceService: BlockUnblockAccountBalanceService,
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

  initForm() {
    this.approvalForm = this.fb.group({
      apprId: [0],
      approvalStatus: [''],
      note: ['', [Validators.required, Validators.maxLength(200)]],
    });
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
        .pipe(finalize(() => this.ngxLoader.stop()))
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
          complete: () => {
            this.getDataList();
          },
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

  approve() {
    this.approvalForm.patchValue({
      apprId: this.apprId,
    });
    this.ngxLoader.start();
    this.blockUnblockAccountBalanceApprovalService
      .approve(
        mapRequestBlockUnblockAccountBalancePayloadDomainToApi(
          this.approvalForm.getRawValue(),
        ),
      )
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.toast.success(
            'Block/Unblock Account Balance request successfully approved',
          );

          this.router.navigate([
            '/home/approval/block-unblock-account-balance/task-list',
          ]);
        },
        error: this.handleError(
          'Block/Unblock Account Balance failed to approve',
        ),
      });
  }

  reject() {
    this.approvalForm.patchValue({
      apprId: this.apprId,
    });
    this.ngxLoader.start();

    this.blockUnblockAccountBalanceApprovalService
      .reject(
        mapRequestBlockUnblockAccountBalancePayloadDomainToApi(
          this.approvalForm.getRawValue(),
        ),
      )
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.toast.success(
            'Block/Unblock Account Balance request successfully rejected',
          );

          this.router.navigate([
            '/home/approval/block-unblock-account-balance/task-list',
          ]);
        },
        error: this.handleError(
          'Block/Unblock Account Balance failed to reject',
        ),
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
    this.router.navigate([
      '/home/approval/block-unblock-account-balance/task-list',
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
