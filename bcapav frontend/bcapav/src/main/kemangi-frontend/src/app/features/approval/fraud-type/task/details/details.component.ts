import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  DefaultFraudTypeApproval,
  EditFraudTypeApproval,
} from '../../components';

import { ReasonModalService } from '../../../../../core/services/reason-modal.service';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Input } from '@angular/core';
import { BreadcrumbProps } from '../../../../../shared/interfaces';
import { ContentLayout } from '../../../../../shared';

import { ToastService } from '../../../../../core/services/toast.service';

import { FraudTypeApprovalService } from '../../api/services/fraud-type-approval.service';
import { fraudTypeApprovalTaskListBreadcrumb } from '../../data/breadcrumb';
import { mapFraudTypeApprovalDetailsApiToDomain } from '../../mappers/fraud-type-approval.mapper';
import { FraudTypeApprovalDetails } from '../../domain/models/fraud-type-approval.model';
import { FRAUD_TYPE_APPROVAL_DETAILS_DEFAULT } from '../../data';

@Component({
  selector: 'app-fraud-type-approval-task-view',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ContentLayout,
    DefaultFraudTypeApproval,
    EditFraudTypeApproval,
  ],
})
export class FraudTypeApprovalTaskListViewComponent
  implements OnInit, OnDestroy
{
  @Input() formGroup!: FormGroup;
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  details = signal<FraudTypeApprovalDetails>(
    FRAUD_TYPE_APPROVAL_DETAILS_DEFAULT,
  );

  prevDetails = signal<FraudTypeApprovalDetails>(
    FRAUD_TYPE_APPROVAL_DETAILS_DEFAULT,
  );

  isDisabled: boolean = true;
  apprId: string | null = '';
  prevApprId: string | null = '';
  actionType: string | null = '';
  approvalForm: FormGroup;
  pageType: string = 'task list';

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
    private fb: FormBuilder,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly fraudTypeApprovalService: FraudTypeApprovalService,
    private reasonDialogService: ReasonModalService,
    private confirmationDialogService: ConfirmationModalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
    this.approvalForm = this.fb.group({
      appr_id: [0],
      approval_status: [''],
      note: [
        '',
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(10),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.apprId = params.get('id');
      this.approvalForm.patchValue({
        appr_id: this.apprId,
      });

      this.getFraudTypeApprovalDetails();
    });
  }

  initPageMode(action: string) {
    if (action === 'CREATE') {
      this.pageTitle = 'New Fraud Type Approval';
      this.breadcrumb = [
        ...fraudTypeApprovalTaskListBreadcrumb,
        { label: 'New Fraud Type Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit Fraud Type Approval';
      this.breadcrumb = [
        ...fraudTypeApprovalTaskListBreadcrumb,
        { label: 'Edit Fraud Type Approval', url: '' },
      ];
    } else {
      this.pageTitle = 'Delete Fraud Type Approval';
      this.breadcrumb = [
        ...fraudTypeApprovalTaskListBreadcrumb,
        { label: 'Delete Fraud Type Approval', url: '' },
      ];
    }
  }

  getFraudTypeApprovalDetails() {
    this.ngxLoader.start();
    this.fraudTypeApprovalService
      .fraudTypeApprovalDetails(Number(this.apprId))
      .subscribe({
        next: (res: any) => {
          this.details.set(mapFraudTypeApprovalDetailsApiToDomain(res['data']));
          this.prevApprId = res['data']['last_appr_id'] ?? '';
          this.actionType = res['data']['request_type'];
          this.initPageMode(this.actionType ?? '');
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e?.status !== 400) {
            this.toast.error('Something went wrong while loading data');
          }
        },
        complete: () => {
          if (this.prevApprId) {
            this.getPrevFraudTypeApprovalDetails();
            return;
          }

          this.ngxLoader.stop();
        },
      });
  }

  getPrevFraudTypeApprovalDetails() {
    this.fraudTypeApprovalService
      .fraudTypeApprovalDetails(Number(this.prevApprId))
      .subscribe({
        next: (res: any) => {
          this.prevDetails.set(
            mapFraudTypeApprovalDetailsApiToDomain(res['data']),
          );
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e?.status !== 400) {
            this.toast.error('Something went wrong while loading data');
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
  }

  back() {
    this.router.navigate(['/home/approval/fraud-type/task-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  approve() {
    this.approvalForm.patchValue({
      appr_id: this.apprId,
    });
    this.ngxLoader.start();
    this.fraudTypeApprovalService
      .approveFraudType(this.approvalForm.getRawValue())
      .subscribe({
        next: () => {
          this.toast.success('Fraud Type request successfully approved');

          this.router.navigate(['/home/approval/fraud-type/task-list']);
        },
        error: (e) => {
          this.ngxLoader.stop();

          if (e.status !== 400) {
            this.toast.error('Fraud Type request failed to approve');
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
  }

  reject() {
    this.approvalForm.patchValue({
      appr_id: this.apprId,
    });
    this.ngxLoader.start();
    this.fraudTypeApprovalService
      .rejectFraudType(this.approvalForm.getRawValue())
      .subscribe({
        next: () => {
          this.toast.success('Fraud Type request successfully rejected');

          this.router.navigate(['/home/approval/fraud-type/task-list']);
        },
        error: (e: any) => {
          this.ngxLoader.stop();
          if (e.status !== 400) {
            this.toast.error('Fraud Type request failed to reject');
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
  }

  handleApprove() {
    this.approvalForm.patchValue({
      approval_status: 'APPROVED',
    });

    this.approvalForm.get('note')?.clearValidators();
    this.approvalForm.get('note')?.updateValueAndValidity();

    this.confirmationDialogService
      .confirm(
        '',
        'Are you sure you want to approve this fraud type?',
        'Yes',
        'No',
      )
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
      approval_status: 'REJECTED',
    });

    this.reasonDialogService
      .reason(
        'Are you sure you want to reject this fraud type?',
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
}
