import { Component, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbProps } from '../../../../../shared';
import { RoleApprovalDetails } from '../../..';
import { ContentLayout } from '../../../../../shared';
import {
  approvalDetailThresholdBreadcrumbs,
  approvalTaskListDetailThresholdBreadcrumbs,
} from '../../../../machine-learning-management/threshold-score/data';
import { MLThresholdService } from '../../../../machine-learning-management';
import {
  DefaultThresholdApproval,
  EditThresholdApproval,
} from '../../../../machine-learning-management/threshold-score/components';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReasonModalService } from '../../../../../core/services/reason-modal.service';
import { MenuService } from '../../../../../core/services/menu.service';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { ToastService } from '../../../../../core/services/toast.service';
@Component({
  selector: 'app-approval-task-list-view',
  templateUrl: './approval-task-list-view.component.html',
  styleUrls: [
    './approval-task-list-view.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    DefaultThresholdApproval,
    EditThresholdApproval,
    ContentLayout,
  ],
})
export class ApprovalTaskListViewComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  reasonErrorMessages = {
    note: {
      required: () => 'Rejection notes is required',
      minlength: (e: any) => `${e.requiredLength} characters required`,
      maxlength: (e: any) => `Max ${e.requiredLength} characters allowed`,
    },
  };

  pageTitle: string = '';

  apprId: number = 0;
  apprDetailData: RoleApprovalDetails = {
    role_id: '',
    role_name: '',
    role_group: '',
    role_description: '',
    is_reviewer: true,
    active_status: false,
    menu_ids: [],
    appr_role_id: 0,
    last_appr_role_id: 0,
    request_type: '',
    approval_status: '',
    requester_id: '',
    requester_name: '',
    request_date: '',
    approver_id: null,
    approver_name: null,
    approval_date: null,
    rejection_note: null,
    old_data: {
      role_id: '',
      role_name: '',
      role_group: '',
      role_description: '',
      is_reviewer: true,
      active_status: false,
      menu_ids: [],
      appr_role_id: 0,
      last_appr_role_id: 0,
      request_type: '',
      approval_status: '',
      requester_id: '',
      requester_name: '',
      request_date: '',
      approver_id: null,
      approver_name: null,
      approval_date: null,
      rejection_note: null,
    },
  };

  isDisabled: boolean = true;
  prevApprRoleId: string | null = '';
  roleActionType: string | null = '';

  approvalForm: FormGroup;

  private destroy$ = new Subject<void>();

  menuTaskLv1 = computed(() =>
    this.menu.checkMenu('APPROVAL-THRESHOLDSCORE-TASK-LV1'),
  );

  menuTaskLv2 = computed(() =>
    this.menu.checkMenu('APPROVAL-THRESHOLDSCORE-TASK-LV2'),
  );
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly mlThresholdService: MLThresholdService,
    private reasonDialogService: ReasonModalService,
    private confirmationDialogService: ConfirmationModalService,
    private readonly toastr: ToastrService,
    private readonly toast: ToastService,
    private menu: MenuService,
  ) {
    this.currentUrl = this.router.url;
    this.approvalForm = this.fb.group({
      appr_id: [0],
      approval_status: [''],
      note: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.apprId = Number(params.get('id'));

      this.getApprovalRoleDetails();
    });
  }

  setPageTitle(action: string) {
    if (action === 'CREATE') {
      this.pageTitle = 'New Threshold Approval';
      this.breadcrumb = [
        ...approvalTaskListDetailThresholdBreadcrumbs,
        { label: 'New Threshold Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit Threshold Approval';
      this.breadcrumb = [
        ...approvalTaskListDetailThresholdBreadcrumbs,
        { label: 'Edit Threshold Approval', url: '' },
      ];
    } else {
      this.pageTitle = 'Delete Threshold Approval';
      this.breadcrumb = [
        ...approvalDetailThresholdBreadcrumbs,
        { label: 'Delete Threshold Approval', url: '' },
      ];
    }
  }

  getApprovalRoleDetails() {
    this.ngxLoader.start();
    this.mlThresholdService
      .thresholdApprovalDetail(Number(this.apprId))
      .subscribe({
        next: (res: any) => {
          this.apprDetailData = {
            ...this.apprDetailData,
            ...res['data'],
          };
          this.prevApprRoleId = res['data']['last_appr_id'];

          this.roleActionType = this?.apprDetailData?.request_type;

          this.setPageTitle(this.roleActionType ?? '');
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e) {
            this.toastr.show(
              `<div class="toast-custom toast-failed">
                <div class="info">
                  <div class="icon">
                    <img src="./assets/img/ic-times-rounded.svg" alt="error" />
                  </div>
                  <div class="description">
                     Something went wrong while loading data.
                  </div>
                </div>

                <button class="close-btn">
                  <img src="./assets/img/ic-times.svg" alt="close" />
                </button>
            </div>`,
              '',
              { enableHtml: true },
            );
          }
        },
        complete: () => {
          if (this.prevApprRoleId) {
            this.getPrevApprovalRoleDetails();
            return;
          }

          this.ngxLoader.stop();
        },
      });
  }

  getPrevApprovalRoleDetails() {
    this.mlThresholdService
      .thresholdApprovalDetail(Number(this.prevApprRoleId))
      .subscribe({
        next: (res: any) => {
          this.apprDetailData = {
            ...this.apprDetailData,
            old_data: res['data'],
          };
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e) {
            this.toastr.show(
              `<div class="toast-custom toast-failed">
                <div class="info">
                  <div class="icon">
                    <img src="./assets/img/ic-times-rounded.svg" alt="error" />
                  </div>
                  <div class="description">
                    Something went wrong while loading data.
                  </div>
                </div>

                <button class="close-btn">
                  <img src="./assets/img/ic-times.svg" alt="close" />
                </button>
            </div>`,
              '',
              { enableHtml: true },
            );
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
  }

  back() {
    this.router.navigate(['/home/approval/threshold-score/task-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  reject() {
    this.approvalForm.patchValue({
      appr_id: this.apprId,
    });
    this.ngxLoader.start();

    this.mlThresholdService
      .reject(this.menuTaskLv1() ? 1 : 2, this.approvalForm.getRawValue())
      .subscribe({
        next: () => {
          this.ngxLoader.stop();
          if (this.apprDetailData.request_type === 'UPDATE')
            this.toast.success('Edit threshold request successfully rejected');
          else this.toast.success('Delete model request successfully rejected');

          this.router.navigate(['/home/approval/threshold-score/task-list']);
        },
        error: (e: any) => {
          this.ngxLoader.stop();
          if (e.status !== 400) {
            this.toast.error('Requested ml threshold failed to reject');
          }
        },
      });
  }

  handleReject() {
    this.approvalForm.patchValue({
      approval_status: 'REJECTED',
    });

    this.reasonDialogService
      .reason(
        'Are you sure you want to reject this request?',
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

  approve() {
    this.approvalForm.patchValue({
      appr_id: this.apprId,
    });
    this.ngxLoader.start();
    this.mlThresholdService
      .approve(this.menuTaskLv1() ? 1 : 2, this.approvalForm.getRawValue())
      .subscribe({
        next: () => {
          this.ngxLoader.stop();
          if (this.apprDetailData.request_type === 'UPDATE')
            this.toast.success('Edit threshold request successfully approved');
          else this.toast.success('Delete model request successfully approved');

          this.router.navigate(['/home/approval/threshold-score/task-list']);
        },
        error: (e) => {
          this.ngxLoader.stop();

          if (e.status !== 400) {
            this.toast.error('Requested ml threshold failed to approve');
          }
        },
      });
  }
  handleApprove() {
    this.approvalForm.patchValue({
      approval_status: 'APPROVED',
    });

    this.approvalForm.get('note')?.clearValidators();
    this.approvalForm.get('note')?.updateValueAndValidity();

    this.confirmationDialogService
      .confirm('', 'Are you sure you want to approve?', 'Yes', 'No')
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
}
