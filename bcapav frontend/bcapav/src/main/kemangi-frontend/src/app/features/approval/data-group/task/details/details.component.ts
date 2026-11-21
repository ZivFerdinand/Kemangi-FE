import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastService } from '../../../../../core/services/toast.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataGroupApprovalService } from '../../api/services/data-group-approval.service';
import { ContentLayout, BreadcrumbProps } from '../../../../../shared';
import { dataGroupApprovalTaskListBreadcrumb } from '../../data';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { ReasonModalService } from '../../../../../core/services/reason-modal.service';
import { mapRuleRelationDomainToApi } from '../../../../rule-management/data-group/mappers/data-group.mapper';
import { mapDataGroupDetailsApprovalApiToDomain } from '../../mappers/data-group-approval.mapper';
import { DataGroupViewTaskApproval } from '../../components/data-group-view-task-approval/data-group-view-task-approval';
import { DataGroupViewTaskEditApproval } from '../../components/data-group-view-task-edit-approval/data-group-view-task-edit-approval';
import { PAGE_QUERY_INIT, PAGE_INFO_INIT } from '../../../../../shared';
import { RuleRelationTable } from '../../../../rule-management/data-group/domain/models/data-group.model';
import { DataGroupApprovalDetails } from '../../domain/models/data-group-approval.model';
import { DATA_GROUP_APPROVAL_DETAILS_INIT } from '../../data/init';
import { TableQuery } from '../../../../../shared';
import { SharedDataService } from '../../../../../core/services/shared-data.service';

@Component({
  selector: 'app-data-group-approval-task-view',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    NgbModule,
    ContentLayout,
    DataGroupViewTaskApproval,
    DataGroupViewTaskEditApproval,
  ],
  providers: [DatePipe],
})
export class DataGroupApprovalTaskViewComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  pageRuleRelationQuery = { ...PAGE_QUERY_INIT };

  pageRuleRelationInfo = { ...PAGE_INFO_INIT };

  ruleRelationList = signal<RuleRelationTable[]>([]);

  details = signal<DataGroupApprovalDetails>({
    ...DATA_GROUP_APPROVAL_DETAILS_INIT,
  });

  prevDetails = signal<DataGroupApprovalDetails>({
    ...DATA_GROUP_APPROVAL_DETAILS_INIT,
  });

  prevApprId: number = 0;

  approvalForm: FormGroup;

  apprId: number = 0;

  menuTaskLv1 = computed(() =>
    this.sharedData.checkMenu('APPROVAL-DATAGROUP-TASK-LV1'),
  );

  menuTaskLv2 = computed(() =>
    this.sharedData.checkMenu('APPROVAL-DATAGROUP-TASK-LV2'),
  );

  private destroy$ = new Subject<void>();

  reasonErrorMessages = {
    note: {
      required: () => 'Rejection notes is required',
      minlength: (e: any) => `${e.requiredLength} characters required`,
      maxlength: (e: any) => `Max ${e.requiredLength} characters allowed`,
    },
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly dataGroupApprovalService: DataGroupApprovalService,
    private readonly toast: ToastService,
    private reasonDialogService: ReasonModalService,
    private confirmationDialogService: ConfirmationModalService,
    private sharedData: SharedDataService,
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
      if (params.get('id')) {
        this.apprId = Number(params.get('id'));
        this.getDetails(params.get('id') ?? '');
      }
    });
  }

  initPageMode() {
    if (this.details()?.requestType === 'CREATE') {
      this.pageTitle = 'New Data Group Approval';
      this.breadcrumb = [
        ...dataGroupApprovalTaskListBreadcrumb,
        {
          label: 'New Data Group Approval',
          url: '',
        },
      ];
    } else if (this.details()?.requestType === 'UPDATE') {
      this.pageTitle = 'Edit Data Group Approval';
      this.breadcrumb = [
        ...dataGroupApprovalTaskListBreadcrumb,
        {
          label: 'Edit Data Group Approval',
          url: '',
        },
      ];
    } else {
      this.pageTitle = 'Delete Data Group Approval';
      this.breadcrumb = [
        ...dataGroupApprovalTaskListBreadcrumb,
        {
          label: 'Delete Data Group Approval',
          url: '',
        },
      ];
    }
  }

  getDetails(id: any) {
    this.ngxLoader.start();
    this.dataGroupApprovalService.details(id).subscribe({
      next: (res: any) => {
        this.details.set(mapDataGroupDetailsApprovalApiToDomain(res['data']));
        this.initPageMode();
        this.ngxLoader.stop();
      },
      error: (e) => {
        this.ngxLoader.stop();
        if (e?.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {
        this.ngxLoader.stop();

        if (
          this.details().requestType === 'UPDATE' &&
          this.details().lastApprId !== ''
        ) {
          this.getComparisonDetails(this.details().lastApprId);
        }

        if (this.details().dataGroupId) {
          this.getRuleRelationList(this.details().dataGroupId, {
            ...this.pageRuleRelationQuery,
            page: this.pageRuleRelationQuery.page - 1,
          });
        }
      },
    });
  }

  getComparisonDetails(id: any) {
    this.ngxLoader.start();
    this.dataGroupApprovalService.details(id).subscribe({
      next: (res: any) => {
        this.prevDetails.set(
          mapDataGroupDetailsApprovalApiToDomain(res['data']),
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

  getRuleRelationList(id: string, param: TableQuery) {
    this.ngxLoader.start();
    this.dataGroupApprovalService
      .ruleRelationList(id, mapRuleRelationDomainToApi(param))
      .subscribe({
        next: (res: any) => {
          this.ruleRelationList.set(res['data']['content']);

          this.pageRuleRelationInfo = {
            ...this.pageRuleRelationInfo,
            totalElements: res['data']['totalElements'],
            totalPages: res['data']['totalPages'],
          };
        },
        error: () => {
          this.ngxLoader.stop();
          this.toast.error('Something went wrong while loading data');
        },
        complete: () => this.ngxLoader.stop(),
      });
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageRuleRelationQuery = {
      ...this.pageRuleRelationQuery,
      sort: param,
      sortDir: order,
    };

    this.getRuleRelationList(this.details().dataGroupId, {
      ...this.pageRuleRelationQuery,
      page: this.pageRuleRelationQuery.page - 1,
    });
  }

  handlePageChange(e: any) {
    this.pageRuleRelationQuery = { ...this.pageRuleRelationQuery, page: e };

    this.getRuleRelationList(this.details().dataGroupId, {
      ...this.pageRuleRelationQuery,
      page: this.pageRuleRelationQuery.page - 1,
    });
  }

  approve() {
    this.approvalForm.patchValue({
      appr_id: this.apprId,
    });
    this.ngxLoader.start();
    this.dataGroupApprovalService
      .approve(this.menuTaskLv1() ? 1 : 2, this.approvalForm.getRawValue())
      .subscribe({
        next: () => {
          this.toast.success('Data Group request successfully approved');

          this.router.navigate(['/home/approval/data-group/task-list']);
        },
        error: (e) => {
          this.ngxLoader.stop();

          if (e.status !== 400) {
            this.toast.error('Requested data group failed to approve');
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

    this.dataGroupApprovalService
      .reject(this.menuTaskLv1() ? 1 : 2, this.approvalForm.getRawValue())
      .subscribe({
        next: () => {
          this.toast.success('Data Group request successfully rejected');

          this.router.navigate(['/home/approval/data-group/task-list']);
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e.status !== 400) {
            this.toast.error('Requested data group failed to reject');
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
        'Are you sure you want to approve this data group?',
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
        'Are you sure you want to reject this data group?',
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
    this.router.navigate(['/home/approval/data-group/task-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
