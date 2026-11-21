import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, forkJoin, Observable, of, catchError, tap } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';
import { HttpContext, HttpErrorResponse } from '@angular/common/http';

import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../../core/services/failed-modal.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ContentLayout, BreadcrumbProps } from '../../../../../shared';
import { draftRuleBreadcrumb } from '../../data';
import { RuleService } from '../../api/services/rule.service';
import { RuleApprovalService } from '../../../../approval/rule/api/services/rule-approval.service';
import { RuleForm } from '../../components/rule-form/rule-form';
import {
  DropdownDataGroup,
  DropdownPipelineType,
  DropdownProductGroup,
  DropdownRuleFunction,
  DropdownRuleOperator,
  DropdownSubRuleParameterType,
  DropdownRulePipeline,
  DropdownEmailTemplate,
  DropdownHistorical,
  DropdownAb,
  DropdownRule,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import {
  mapDropdownProductGroupApiToDomain,
  mapDropdownRuleFunctionApiToDomain,
  mapDropdownRuleOperatorApiToDomain,
  mapDropdownPipelineTypeApiToDomain,
  mapDropdownDataGroupApiToDomain,
  mapDropdownSubRuleParameterTypeApiToDomain,
  mapDropdownRulePipelineApiToDomain,
  mapDropdownEmailTemplateApiToDomain,
  mapDropdownHistoricalApiToDomain,
  mapDropdownAbApiToDomain,
  mapDropdownRuleApiToDomain,
} from '../../../../approval/rule/mappers/rule-approval.mapper';
import { mapRuleDetailsApprovalApiToForm } from '../../mappers/rule.mapper';
import { FailedModalEventService } from '../../../../../shared/services/failed-modal-event.service';
import { mappingRulePayload } from '../../utils';
import { mapRulePayloadToApi } from '../../mappers/rule.mapper';
import { RuleDetailsForm } from '../../domain/rule.model';
import { SKIP_GLOBAL_ERROR } from '../../../../../core/helpers/error-context.token';
import { capitalize } from '../../../../../shared/utils/string.util';
@Component({
  selector: 'app-rule-task-update',
  templateUrl: './update.component.html',
  styleUrls: [
    './update.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, NgbModule, ContentLayout, RuleForm],
  providers: [DatePipe],
})
export class RuleTaskUpdateComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = draftRuleBreadcrumb;

  pageTitle: string = 'Edit Rule';

  draftMode: string = '';

  approvalStatus: string = '';

  dropdownProductGroup: DropdownProductGroup[] = [];

  dropdownRuleOperator: DropdownRuleOperator[] = [];

  dropdownRuleFunction: DropdownRuleFunction[] = [];

  dropdownDataGroup: DropdownDataGroup[] = [];

  dropdownRulePipelineType: DropdownPipelineType[] = [];

  dropdownParameterType: DropdownSubRuleParameterType[] = [];

  dropdownPipeline: DropdownRulePipeline[] = [];

  dropdownHistorical: DropdownHistorical[] = [];

  dropdownEmailTemplate: DropdownEmailTemplate[] = [];

  dropdownAb: DropdownAb[] = [];

  dropdownRule: DropdownRule[] = [];

  details: RuleDetailsForm | null = null;

  from: string = '';

  private destroy$ = new Subject<void>();

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly ruleService: RuleService,
    private readonly ruleApprovalService: RuleApprovalService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    public failedDialogService: FailedModalService,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly failedModalEventService: FailedModalEventService,
  ) {}

  ngOnInit(): void {
    this.failedModalEventService.message$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => {
        if (
          message ===
          'Sorry! This draft cannot be submitted because the email template used in this rule is currently pending approval.'
        ) {
          this.router.navigate([`/home/rule-management/rule/task`]);
        }
      });

    this.ngxLoader.start();

    forkJoin([
      this.getDropdownProductGroupList(),
      this.getDropdownRuleFunction(),
      this.getDropdownRuleOperator(),
      this.getDropdownDataGroup(),
      this.getDropdownRulePipelineType(),
      this.getDropdownHistorical(),
      this.getDropdownAbTemplate(),
      this.getDropdownRule(),
    ])
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe(() => {
        this.handleRouteParams();
      });

    this.handleQueryParams();
  }

  private handleQueryParams(): void {
    this.route.queryParams.subscribe(
      (params) => (this.from = params['from'] ?? ''),
    );
  }

  private handleRouteParams(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (!id) return;

      this.getDetails(+id);
    });
  }

  handleBreadcrumbs(approvalStatus: string, actionType: string) {
    this.breadcrumb = draftRuleBreadcrumb.map((item, index) =>
      index === 2
        ? {
            ...item,
            label: this.handleLabel(approvalStatus, actionType),
          }
        : item,
    );
  }

  handlePageTitle(approvalStatus: string, actionType: string) {
    this.pageTitle = this.handleLabel(approvalStatus, actionType);
  }

  handleLabel(approvalStatus: string, actionType: string): string {
    switch (actionType) {
      case 'CREATE':
        return `Create New Rule ${capitalize(approvalStatus)}`;
      case 'UPDATE':
        return `Edit Rule ${capitalize(approvalStatus)}`;
      default:
        return '';
    }
  }

  getDetails(id: number) {
    this.ngxLoader.start();
    this.ruleApprovalService.details(id.toString()).subscribe({
      next: (res: any) => {
        this.details = structuredClone(
          mapRuleDetailsApprovalApiToForm(res['data']),
        );

        this.draftMode = res['data'].request_type;
        this.approvalStatus = res['data'].approval_status;
        this.handleBreadcrumbs(
          res['data'].approval_status,
          res['data'].request_type,
        );
        this.handlePageTitle(
          res['data'].approval_status,
          res['data'].request_type,
        );
      },
      error: (e) => {
        this.ngxLoader.stop();
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => this.ngxLoader.stop(),
    });
  }

  getDropdownProductGroupList(): Observable<any> {
    return this.ruleService.ruleMasterProductGroupList().pipe(
      tap((res: any) => {
        this.dropdownProductGroup = res['data'].map((x: any) =>
          mapDropdownProductGroupApiToDomain(x),
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

  getDropdownRuleOperator(): Observable<any> {
    return this.ruleService.ruleMasterOperatorList().pipe(
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

  getDropdownRuleFunction(): Observable<any> {
    return this.ruleService.ruleMasterFunctionList().pipe(
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

  getDropdownAbTemplate(): Observable<any> {
    return this.ruleApprovalService.dropdownAbTemplate().pipe(
      tap((res: any) => {
        this.dropdownAb = res['data'].map((x: any) =>
          mapDropdownAbApiToDomain(x),
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
    return this.ruleService.ruleMasterDataGroupList(false).pipe(
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

  getDropdownRulePipelineType(): Observable<any> {
    return this.ruleService.ruleMasterPipelineTypeList().pipe(
      tap((res: any) => {
        this.dropdownRulePipelineType = res['data'].map((x: any) =>
          mapDropdownPipelineTypeApiToDomain(x),
        );

        this.dropdownRulePipelineType = [
          ...res['data'].map((x: any) => mapDropdownPipelineTypeApiToDomain(x)),
          {
            pipelineId: 'CUSTOM',
            pipelineType: 'CUSTOM',
            description: '',
            needExpiryTime: false,
            needFunction: false,
            needEventType: false,
            criteria: [],
            evaluation: '',
          },
        ];
      }),
      catchError((e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
        return of(null);
      }),
    );
  }

  getDropdownSubRuleParameterType(productGroup: string) {
    this.ruleService.ruleMasterParameterTypeList(productGroup).subscribe({
      next: (res: any) => {
        this.dropdownParameterType = res['data'].map((x: any) =>
          mapDropdownSubRuleParameterTypeApiToDomain(x),
        );
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {},
    });
  }

  getDropdownPipeline(pipelineType: string) {
    this.ruleService.ruleMasterPipelineList(pipelineType).subscribe({
      next: (res: any) => {
        this.dropdownPipeline = res['data'].map((x: any) =>
          mapDropdownRulePipelineApiToDomain(x),
        );
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {},
    });
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

  getDropdownRule(): Observable<any> {
    return this.ruleApprovalService.dropdownRule().pipe(
      tap((res: any) => {
        this.dropdownRule = res['data'].map((x: any) =>
          mapDropdownRuleApiToDomain(x),
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

  getDropdownEmailTemplate(productType: string) {
    this.ruleService.ruleMasterEmailTemplateList(productType).subscribe({
      next: (res: any) => {
        this.dropdownEmailTemplate = res['data'].map((x: any) =>
          mapDropdownEmailTemplateApiToDomain(x),
        );
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {},
    });
  }

  createRule(data?: any) {
    this.ngxLoader.start();

    const payload = mappingRulePayload(data);

    this.ruleService
      .create(
        mapRulePayloadToApi(payload),
        new HttpContext().set(SKIP_GLOBAL_ERROR, true),
      )
      .subscribe({
        next: () => {
          this.toast.success('Request create rule has been created');

          this.router.navigate([`/home/rule-management/rule/task`]);
        },
        error: (e) => {
          this.ngxLoader.stop();

          this.handleError(e);

          if (e.status !== 400) {
            this.toast.error('Request create rule has been failed');
          }
        },
        complete: () => {
          this.ngxLoader.stop();
        },
      });
  }

  updateRule(data?: any) {
    this.ngxLoader.start();

    const payload = mappingRulePayload(data);

    this.ruleService
      .update(
        mapRulePayloadToApi(payload),
        new HttpContext().set(SKIP_GLOBAL_ERROR, true),
      )
      .subscribe({
        next: () => {
          this.toast.success('Request update rule has been created');

          this.router.navigate([`/home/rule-management/rule/task`]);
        },
        error: (e) => {
          this.ngxLoader.stop();

          this.handleError(e);

          if (e.status !== 400 && e.status !== 409) {
            this.toast.error('Request update rule has been failed');
          }
        },
        complete: () => {
          this.ngxLoader.stop();
        },
      });
  }

  createDraft(data?: any) {
    this.ngxLoader.start();

    const payload = mappingRulePayload(data);

    this.ruleService.saveDraft(mapRulePayloadToApi(payload)).subscribe({
      next: () => {
        this.toast.success('Draft rule has been created');

        this.router.navigate([`/home/rule-management/rule/task`]);
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Draft rule has been failed');
        }

        this.ngxLoader.stop();
      },
      complete: () => {
        this.ngxLoader.stop();
      },
    });
  }

  onSubmit(data?: any) {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to submit?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          if (this.draftMode === 'UPDATE') {
            this.updateRule(data);
            return;
          }

          this.createRule(data);
          return;
        }
      });
  }

  onSubmitDraft(data?: any) {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to save as draft?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.createDraft(data);
          return;
        }
      });
  }

  getChangedValues(original: any, current: any): any {
    const changes: any = {};
    for (const key in current) {
      if (typeof current[key] === 'object' && current[key] !== null) {
        const nested = this.getChangedValues(original[key] || {}, current[key]);
        if (Object.keys(nested).length > 0) {
          changes[key] = nested;
        }
      } else if (current[key] !== original[key]) {
        changes[key] = { from: original[key], to: current[key] };
      }
    }

    return changes;
  }

  handleError(e: HttpErrorResponse) {
    switch (e.status) {
      case 400:
        this.failedDialogService.failed(
          '',
          '400',
          this.changeErrorMsg(e.error.message),
        );

        break;

      case 409:
        this.failedDialogService
          .failed('', '409', e?.error.message)
          .then((confirmed) => {
            if (confirmed) {
              this.router.navigate(['/home/rule-management/rule/task']);
            }
          });

        break;

      default:
        this.toast.error(e.error.message);
    }
  }

  changeErrorMsg(message: string): string {
    switch (message) {
      case 'Auto-action EMAIL template not found':
        return 'Sorry! The Auto Action Email Template used in this rule has been deleted. Please update the rule.';

      case 'Data group was not found':
        return 'Sorry! The Data Group used in this rule has been deleted. Please update the rule.';

      default:
        return message;
    }
  }

  back(value: any) {
    const currentValue = value?.currentValue;
    const initValue = value?.initValue;
    const changed = this.getChangedValues(initValue, currentValue);

    if (Object.keys(changed).length === 0) {
      this.router.navigate([`/home/rule-management/rule/task`]);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure you want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            this.router.navigate([`/home/rule-management/rule/task`]);
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
