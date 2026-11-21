import { Component, OnInit, OnDestroy, signal, Input } from '@angular/core';
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
import { Router, ActivatedRoute } from '@angular/router';

import { DefaultRoleApproval, EditRoleApproval } from '../../components';
import { RoleApprovalService } from '../..';
import { ApiService } from '../../../../../core/services/api.service';
import { ReasonModalService } from '../../../../../core/services/reason-modal.service';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { BreadcrumbProps } from '../../../../../shared/interfaces';
import { ContentLayout } from '../../../../../shared';
import { roleApprovalTaskListBreadcrumb } from '../../data';
import { ToastService } from '../../../../../core/services/toast.service';
import { mapRoleApprovalDetailsApiToDomain } from '../../../../role-management/mappers/role.mapper';
import { RoleApprovalDetails } from '../../../../role-management/domain/models/role.model';

@Component({
  selector: 'app-role-approval-task-list-view',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    DefaultRoleApproval,
    EditRoleApproval,
    ContentLayout,
  ],
})
export class RoleApprovalTaskListViewComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  rawMenuList = signal<any[]>([]);

  details = signal<RoleApprovalDetails | null>(null);

  prevDetails = signal<RoleApprovalDetails | null>(null);

  isDisabled: boolean = true;
  apprRoleId: string | null = '';
  prevApprRoleId: string | null = '';
  roleActionType: string | null = '';
  approvalForm: FormGroup;

  private destroy$ = new Subject<void>();

  reasonErrorMessages = {
    note: {
      required: () => 'Rejection Notes is required',
      minlength: (e: any) => `${e.requiredLength} characters required`,
      maxlength: (e: any) => `Max ${e.requiredLength} characters allowed`,
    },
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly roleApprovalService: RoleApprovalService,
    private reasonDialogService: ReasonModalService,
    private confirmationDialogService: ConfirmationModalService,
    private readonly toast: ToastService,
    private readonly apiService: ApiService,
  ) {
    this.currentUrl = this.router.url;
    this.approvalForm = this.fb.group({
      appr_role_id: [0],
      approval_status: [''],
      note: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.getMenuList();
      this.apprRoleId = params.get('id');
      this.approvalForm.patchValue({
        appr_role_id: this.apprRoleId,
      });

      this.getApprovalRoleDetails();
    });
  }

  setPageTitle(action: string) {
    if (action === 'CREATE') {
      this.pageTitle = 'New Role Approval';
      this.breadcrumb = [
        ...roleApprovalTaskListBreadcrumb,
        { label: 'New Role Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit Role Approval';
      this.breadcrumb = [
        ...roleApprovalTaskListBreadcrumb,
        { label: 'Edit Role Approval', url: '' },
      ];
    } else {
      this.pageTitle = 'Delete Role Approval';
      this.breadcrumb = [
        ...roleApprovalTaskListBreadcrumb,
        { label: 'Delete Role Approval', url: '' },
      ];
    }
  }

  getApprovalRoleDetails() {
    this.ngxLoader.start();
    this.roleApprovalService
      .roleApprovalDetails(Number(this.apprRoleId))
      .subscribe({
        next: (res: any) => {
          this.details.set(mapRoleApprovalDetailsApiToDomain(res['data']));

          this.prevApprRoleId = res['data']['last_appr_role_id'];

          this.roleActionType = this.details()?.requestType ?? '';

          this.setPageTitle(this.roleActionType ?? '');
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e?.status !== 400) {
            this.toast.error('Something went wrong while loading data');
          }
        },
        complete: () => {
          this.ngxLoader.stop();

          if (this.details()?.requestType === 'UPDATE') {
            this.getPrevApprovalRoleDetails();
          }
        },
      });
  }

  getPrevApprovalRoleDetails() {
    this.roleApprovalService
      .roleApprovalDetails(Number(this.prevApprRoleId))
      .subscribe({
        next: (res: any) => {
          this.prevDetails.set(mapRoleApprovalDetailsApiToDomain(res['data']));
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

  getMenuList() {
    this.apiService.getMenuList().subscribe({
      next: (res: any) => {
        this.rawMenuList.set(res['data']);
      },
      error: (e) => {
        if (e?.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
    });
  }

  back() {
    this.router.navigate(['/home/approval/role/task-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  approve() {
    this.approvalForm.patchValue({
      appr_role_id: this.apprRoleId,
    });
    this.ngxLoader.start();
    this.roleApprovalService
      .approveRole(this.approvalForm.getRawValue())
      .subscribe({
        next: () => {
          this.toast.success('Role request successfully approved');

          this.router.navigate(['/home/approval/role/task-list']);
        },
        error: (e) => {
          this.ngxLoader.stop();

          if (e.status !== 400) {
            this.toast.error('Requested role failed to approve');
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
  }

  reject() {
    this.approvalForm.patchValue({
      appr_role_id: this.apprRoleId,
    });
    this.ngxLoader.start();
    this.roleApprovalService
      .rejectRole(this.approvalForm.getRawValue())
      .subscribe({
        next: (res: any) => {
          this.toast.success('Role request successfully rejected');

          this.router.navigate(['/home/approval/role/task-list']);
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e.status !== 400) {
            this.toast.error('Requested role failed to reject');
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
      .confirm('', 'Are you sure you want to approve this role?', 'Yes', 'No')
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
        'Are you sure you want to reject this role?',
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
