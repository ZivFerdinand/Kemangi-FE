import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DefaultThresholdApproval,
  EditThresholdApproval,
} from '../../../../machine-learning-management/threshold-score/components';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbProps } from '../../../../../shared';
import { RoleApprovalDetails } from '../../..';
import { MLThresholdService } from '../../../../machine-learning-management';
import {
  approvalDetailThresholdBreadcrumbs,
  requestedDetailThresholdBreadcrumbs,
} from '../../../../machine-learning-management/threshold-score/data';
import { ContentLayout } from '../../../../../shared';
@Component({
  selector: 'app-approval-requested-list-view',
  templateUrl: './approval-requested-list-view.component.html',
  styleUrls: [
    './approval-requested-list-view.component.scss',
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
export class ApprovalRequestedListViewComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';
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
  apprRoleId: string | null = '';
  prevApprRoleId: string | null = '';
  roleActionType: string | null = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly mlThresholdService: MLThresholdService,
    private readonly toastr: ToastrService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.apprRoleId = params.get('id');

      this.getApprovalRoleDetails();
    });
  }

  setPageTitle(action: string) {
    if (action === 'CREATE') {
      this.pageTitle = 'New Threshold Approval';
      this.breadcrumb = [
        ...approvalDetailThresholdBreadcrumbs,
        { label: 'New Threshold Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit Threshold Approval';
      this.breadcrumb = [
        ...approvalDetailThresholdBreadcrumbs,
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
      .thresholdApprovalDetail(Number(this.apprRoleId))
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
    this.router.navigate(['/home/approval/threshold-score/requested-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
