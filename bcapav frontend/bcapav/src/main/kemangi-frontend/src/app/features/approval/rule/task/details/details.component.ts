import { Component, OnInit, computed, OnDestroy } from '@angular/core';
import { Subject, forkJoin, Observable, of, catchError, tap } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { RuleApprovalService } from '../../api/services/rule-approval.service';
import { ReasonModalService } from '../../../../../core/services/reason-modal.service';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { BreadcrumbProps } from '../../../../../shared';
import { ContentLayout } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import {
  mapRuleDetailsApprovalApiToDomain,
  mapDropdownRuleOperatorApiToDomain,
  mapDropdownRuleFunctionApiToDomain,
  mapRuleApprovalPayloadDomainToApi,
  mapDropdownDataGroupApiToDomain,
  mapDropdownHistoricalApiToDomain,
} from '../../mappers/rule-approval.mapper';
import {
  DropdownDataGroup,
  DropdownHistorical,
  RuleApprovalDetails,
} from '../../domain/models/rule-approval.model';
import {
  RULE_APPROVAL_DETAILS_INIT,
  ruleApprovalTaskListBreadcrumb,
} from '../../data';
import { RuleApprDetailsTypeI } from '../../components/rule-appr-details-type-i/rule-appr-details-type-i';
import { SharedDataService } from '../../../../../core/services/shared-data.service';

@Component({
  selector: 'app-rule-approval-task-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [ContentLayout, RuleApprDetailsTypeI],
})
export class RuleApprovalTaskDetailsComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  details: RuleApprovalDetails = { ...RULE_APPROVAL_DETAILS_INIT };

  prevDetails: RuleApprovalDetails = { ...RULE_APPROVAL_DETAILS_INIT };

  isDisabled: boolean = true;
  apprId: string | null = '';

  pageType: 'task' | 'requested' = 'task';
  ref: string = '';

  dropdownRuleFunction: any[] = [];
  dropdownRuleOperator: any[] = [];
  dropdownDataGroup: DropdownDataGroup[] = [];
  dropdownHistorical: DropdownHistorical[] = [];
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
    private ruleApprovalService: RuleApprovalService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly toast: ToastService,
    private sharedData: SharedDataService,
    private fb: FormBuilder,
    private reasonDialogService: ReasonModalService,
    private confirmationDialogService: ConfirmationModalService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.ngxLoader.start();
    forkJoin([
      this.getDropdownOperator(),
      this.getDropdownFunction(),
      this.getDropdownDataGroup(),
      this.getDropdownHistorical(),
    ])
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe(() => {
        this.handleRouteParams();
      });
    this.handleQueryParams();
    this.initForm();
  }

  taskLv1 = computed(() => this.sharedData.checkMenu('APPROVAL-RULE-TASK-LV1'));
  taskLv2 = computed(() => this.sharedData.checkMenu('APPROVAL-RULE-TASK-LV2'));

  menuTask = computed(
    () =>
      this.sharedData.checkMenu('APPROVAL-RULE-TASK-LV1') ||
      this.sharedData.checkMenu('APPROVAL-RULE-TASK-LV2'),
  );

  menuRequested = computed(() =>
    this.sharedData.checkMenu('APPROVAL-RULE-REQUESTED'),
  );

  checkMenu = (value: string): boolean => {
    return value === 'task' ? this.menuTask() : this.menuRequested();
  };

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

  initForm() {
    this.approvalForm = this.fb.group({
      apprId: [0],
      approvalStatus: [''],
      note: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  initPageMode(action: string) {
    if (this.ref === 'before') {
      this.pageTitle = 'Edit Rule Approval';
      this.breadcrumb = [
        ...ruleApprovalTaskListBreadcrumb,
        { label: 'Edit Rule Approval', url: '' },
      ];
      return;
    }

    if (action === 'CREATE') {
      this.pageTitle = 'New Rule Approval';
      this.breadcrumb = [
        ...ruleApprovalTaskListBreadcrumb,
        { label: 'New Rule Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit Rule Approval';
      this.breadcrumb = [
        ...ruleApprovalTaskListBreadcrumb,
        { label: 'Edit Rule Approval', url: '' },
      ];
    } else {
      this.pageTitle = 'Delete Rule Approval';
      this.breadcrumb = [
        ...ruleApprovalTaskListBreadcrumb,
        { label: 'Delete Rule Approval', url: '' },
      ];
    }
  }

  getDetails(id: string) {
    this.ngxLoader.start();

    this.ruleApprovalService.details(id).subscribe({
      next: (res: any) => {
        this.details = structuredClone(
          mapRuleDetailsApprovalApiToDomain(res['data']),
        );

        this.initPageMode(this.details.requestType);

        this.ngxLoader.stop();
      },
      error: (e) => {
        this.ngxLoader.stop();
        if (e?.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {
        const details = this.details;

        if (
          this.ref !== 'before' &&
          details?.requestType === 'UPDATE' &&
          details?.lastApprId
        ) {
          this.getPrevDetails(details.lastApprId.toString());
        }
      },
    });
  }

  getPrevDetails(id: string) {
    this.ruleApprovalService.details(id).subscribe({
      next: (res: any) => {
        this.prevDetails = structuredClone(
          mapRuleDetailsApprovalApiToDomain(res['data']),
        );
      },
      error: (e) => {
        if (e?.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {},
    });
  }

  getDropdownOperator(): Observable<any> {
    return this.ruleApprovalService.ruleMasterOperatorList().pipe(
      tap((res: any) => {
        this.dropdownRuleOperator = res['data'].map((x: any) =>
          mapDropdownRuleOperatorApiToDomain(x),
        );
      }),
      catchError((e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
        return of(null);
      }),
    );
  }

  getDropdownFunction(): Observable<any> {
    return this.ruleApprovalService.ruleMasterFunctionList().pipe(
      tap((res: any) => {
        this.dropdownRuleFunction = res['data'].map((x: any) =>
          mapDropdownRuleFunctionApiToDomain(x),
        );
      }),
      catchError((e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
        return of(null);
      }),
    );
  }

  getDropdownDataGroup(): Observable<any> {
    return this.ruleApprovalService.ruleMasterDataGroupList(false).pipe(
      tap((res: any) => {
        this.dropdownDataGroup = res['data'].map((x: any) =>
          mapDropdownDataGroupApiToDomain(x),
        );
      }),
      catchError((e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
        return of(null);
      }),
    );
  }

  getDropdownHistorical(): Observable<any> {
    return this.ruleApprovalService.dropdownHistorical().pipe(
      tap((res: any) => {
        this.dropdownHistorical = res['data'].map((x: any) =>
          mapDropdownHistoricalApiToDomain(x),
        );
      }),
      catchError((e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
        return of(null);
      }),
    );
  }

  openTab() {
    const urlTree = this.router.createUrlTree(
      ['/home/approval/rule/task-list', this.details.lastApprId],
      {
        queryParams: { ref: 'before' },
      },
    );

    const scriptUrl = this.router.serializeUrl(urlTree);

    const finalUrl = scriptUrl.includes('#') ? scriptUrl : '/#' + scriptUrl;

    window.open(window.location.origin + finalUrl, '_blank');
  }

  approve() {
    this.approvalForm.patchValue({
      apprId: this.apprId,
    });
    this.ngxLoader.start();
    this.ruleApprovalService
      .approve(
        this.taskLv2() ? 2 : 1,
        mapRuleApprovalPayloadDomainToApi(this.approvalForm.getRawValue()),
      )
      .subscribe({
        next: () => {
          this.toast.success('Rule request successfully approved');

          this.router.navigate(['/home/approval/rule/task-list']);
        },
        error: (e) => {
          this.ngxLoader.stop();

          if (e.status !== 400) {
            this.toast.error('Requested rule failed to approve');
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
  }

  reject() {
    this.approvalForm.patchValue({
      apprId: this.apprId,
    });
    this.ngxLoader.start();

    this.ruleApprovalService
      .reject(
        this.taskLv2() ? 2 : 1,
        mapRuleApprovalPayloadDomainToApi(this.approvalForm.getRawValue()),
      )
      .subscribe({
        next: () => {
          this.toast.success('Rule request successfully rejected');

          this.router.navigate(['/home/approval/rule/task-list']);
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e.status !== 400) {
            this.toast.error('Requested rule failed to reject');
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
  }

  handleApprove() {
    this.approvalForm.patchValue({
      approvalStatus: 'APPROVED',
    });

    this.approvalForm.get('note')?.clearValidators();
    this.approvalForm.get('note')?.updateValueAndValidity();

    this.confirmationDialogService
      .confirm('', 'Are you sure you want to approve this rule?', 'Yes', 'No')
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
        'Are you sure you want to reject this rule?',
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
    this.router.navigate(['/home/approval/rule/task-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
