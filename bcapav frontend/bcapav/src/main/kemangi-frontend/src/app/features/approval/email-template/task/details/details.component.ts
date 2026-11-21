import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { Input } from '@angular/core';

import { ReasonModalService } from '../../../../../core/services/reason-modal.service';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';

import { BreadcrumbProps } from '../../../../../shared/interfaces';
import { ContentLayout } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { EmailTemplateApprovalService } from '../../api/services/email-template-approval.service';
import { EmailTemplateApprovalDetails } from '../../domain/email-approval.model';
import { emailTemplateApprovalTaskListBreadcrumb } from '../../data';
import { mapEmailTemplateDetailsApprovalApiToDomain } from '../../mappers/email-template-approval.mapper';
import { EMAIL_TEMPL_APPROVAL_DETAILS_INIT } from '../../data';
import { EmailTemplateViewApprovalI } from '../../components/view-approval-i/view-approval-i';
import { EmailTemplateViewApprovalII } from '../../components/view-approval-ii/view-approval-ii';

@Component({
  selector: 'app-email-template-task-view',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.html'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ContentLayout,
    EmailTemplateViewApprovalI,
    EmailTemplateViewApprovalII,
  ],
})
export class EmailTemplateTaskViewComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  details = signal<EmailTemplateApprovalDetails>({
    ...EMAIL_TEMPL_APPROVAL_DETAILS_INIT,
  });

  prevDetails = signal<EmailTemplateApprovalDetails>({
    ...EMAIL_TEMPL_APPROVAL_DETAILS_INIT,
  });

  isDisabled: boolean = true;
  apprId: string | null = '';
  prevApprId: string | null = '';
  actionType: string | null = '';
  approvalForm!: FormGroup;
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
    private readonly emailTemplateApprovalService: EmailTemplateApprovalService,
    private reasonDialogService: ReasonModalService,
    private confirmationDialogService: ConfirmationModalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.apprId = params.get('id');

      if (this.apprId) {
        this.approvalForm.patchValue({
          appr_id: this.apprId,
        });

        this.getDetails(this.apprId);
      }
    });
  }

  initForm() {
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

  initPageMode(action: string) {
    if (action === 'CREATE') {
      this.pageTitle = 'New Email Template Approval';
      this.breadcrumb = [
        ...emailTemplateApprovalTaskListBreadcrumb,
        { label: 'New Email Template Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit Email Template Approval';
      this.breadcrumb = [
        ...emailTemplateApprovalTaskListBreadcrumb,
        { label: 'Edit Email Template Approval', url: '' },
      ];
    } else {
      this.pageTitle = 'Delete Email Template Approval';
      this.breadcrumb = [
        ...emailTemplateApprovalTaskListBreadcrumb,
        { label: 'Delete Email Template Approval', url: '' },
      ];
    }
  }

  back() {
    this.router.navigate(['/home/approval/email-template/task-list']);
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
    this.emailTemplateApprovalService
      .approve(this.approvalForm.getRawValue())
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.toast.success('Email Template request successfully approved');

          this.router.navigate(['/home/approval/email-template/task-list']);
        },
        error: this.handleError('Email Template request failed to approve'),
      });
  }

  reject() {
    this.approvalForm.patchValue({
      appr_id: this.apprId,
    });
    this.ngxLoader.start();
    this.emailTemplateApprovalService
      .reject(this.approvalForm.getRawValue())
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.toast.success('Email Template request successfully rejected');

          this.router.navigate(['/home/approval/email-template/task-list']);
        },

        error: this.handleError('Email Template request failed to reject'),
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
        'Are you sure you want to approve this Email Template?',
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
        'Are you sure you want to reject this Email Template?',
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

  // api

  getDetails(id: string) {
    this.ngxLoader.start();
    this.emailTemplateApprovalService
      .details(id)
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.details.set(
            mapEmailTemplateDetailsApprovalApiToDomain(res['data']),
          );
          this.prevApprId = res['data']['last_appr_id'] ?? '';
          this.actionType = res['data']['request_type'];
          this.initPageMode(this.actionType ?? '');
        },
        error: this.handleError('Something went wrong while loading data'),
        complete: () => {
          if (this.details().requestType === 'UPDATE') {
            if (this.prevApprId) {
              this.getPrevDetails(this.prevApprId);
              return;
            }
          }
        },
      });
  }

  getPrevDetails(id: string) {
    this.emailTemplateApprovalService.details(id).subscribe({
      next: (res: any) => {
        this.prevDetails.set(
          mapEmailTemplateDetailsApprovalApiToDomain(res['data']),
        );
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  // general

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
