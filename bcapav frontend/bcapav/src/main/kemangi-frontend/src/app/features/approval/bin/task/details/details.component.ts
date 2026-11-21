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

import { DefaultBinApproval, EditBinApproval } from '../../components';

import { ReasonModalService } from '../../../../../core/services/reason-modal.service';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Input } from '@angular/core';
import { BreadcrumbProps } from '../../../../../shared/interfaces';
import { ContentLayout } from '../../../../../shared';

import { ToastService } from '../../../../../core/services/toast.service';

import { BinApprovalService } from '../../api/services/bin-approval.service';
import { binApprovalTaskListBreadcrumb } from '../../data/breadcrumb';
import { mapBinDetailsApprovalApiToDomain } from '../../mappers/bin-approval.mapper';

import { BIN_APPROVAL_DETAILS_INIT } from '../../data';
import { BinApprovalDetails } from '../../domain/models/bin-approval.model';

@Component({
  selector: 'app-bin-task-view',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ContentLayout,
    DefaultBinApproval,
    EditBinApproval,
  ],
})
export class BinTaskViewComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  details = signal<BinApprovalDetails>({ ...BIN_APPROVAL_DETAILS_INIT });

  prevDetails = signal<BinApprovalDetails>({ ...BIN_APPROVAL_DETAILS_INIT });

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
    private readonly binApprovalService: BinApprovalService,
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

      this.getBinApprovalDetails();
    });
  }

  initPageMode(action: string) {
    if (action === 'CREATE') {
      this.pageTitle = 'New BIN Approval';
      this.breadcrumb = [
        ...binApprovalTaskListBreadcrumb,
        { label: 'New BIN Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit BIN Approval';
      this.breadcrumb = [
        ...binApprovalTaskListBreadcrumb,
        { label: 'Edit BIN Approval', url: '' },
      ];
    } else {
      this.pageTitle = 'Delete BIN Approval';
      this.breadcrumb = [
        ...binApprovalTaskListBreadcrumb,
        { label: 'Delete BIN Approval', url: '' },
      ];
    }
  }

  getBinApprovalDetails() {
    this.ngxLoader.start();
    this.binApprovalService
      .details(this.apprId ? this.apprId.toString() : '')
      .subscribe({
        next: (res: any) => {
          this.details.set(mapBinDetailsApprovalApiToDomain(res['data']));
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
          this.ngxLoader.stop();
          if (this.details().requestType === 'UPDATE') {
            this.getPrevBinApprovalDetails();
            return;
          }
        },
      });
  }

  getPrevBinApprovalDetails() {
    this.binApprovalService
      .details(this.prevApprId ? this.prevApprId.toString() : '')
      .subscribe({
        next: (res: any) => {
          this.prevDetails.set(mapBinDetailsApprovalApiToDomain(res['data']));
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
    this.router.navigate(['/home/approval/bin/task-list']);
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
    this.binApprovalService.approve(this.approvalForm.getRawValue()).subscribe({
      next: () => {
        this.toast.success('BIN request successfully approved');

        this.router.navigate(['/home/approval/bin/task-list']);
      },
      error: (e) => {
        this.ngxLoader.stop();

        if (e.status !== 400) {
          this.toast.error('BIN request failed to approve');
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
    this.binApprovalService.reject(this.approvalForm.getRawValue()).subscribe({
      next: () => {
        this.toast.success('BIN request successfully rejected');

        this.router.navigate(['/home/approval/bin/task-list']);
      },
      error: (e: any) => {
        this.ngxLoader.stop();
        if (e.status !== 400) {
          this.toast.error('BIN request failed to reject');
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
      .confirm('', 'Are you sure you want to approve this BIN?', 'Yes', 'No')
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
        'Are you sure you want to reject this BIN?',
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
