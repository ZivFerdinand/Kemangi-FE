import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, forkJoin, Observable, of, catchError, tap } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { RuleApprovalService } from '../../../../approval/rule/api/services/rule-approval.service';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../../core/services/failed-modal.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ContentLayout, BreadcrumbProps } from '../../../../../shared';
import { editRuleBreadcrumb } from '../../data';
import { RuleService } from '../../api/services/rule.service';
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

import {
  mapRuleDetailsApiToForm,
  mapRulePayloadToApi,
} from '../../mappers/rule.mapper';

import { RuleDetailsForm } from '../../domain/rule.model';
import { mappingRulePayload } from '../../utils';
@Component({
  selector: 'app-rule-base-update',
  templateUrl: './update.component.html',
  styleUrls: [
    './update.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, NgbModule, ContentLayout, RuleForm],
  providers: [DatePipe],
})
export class RuleBaseUpdateComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = editRuleBreadcrumb;

  pageTitle: string = 'Edit Rule';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly ruleService: RuleService,
    private readonly ruleApprovalService: RuleApprovalService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    public failedDialogService: FailedModalService,
    private readonly ngxLoader: NgxUiLoaderService,
  ) {}

  ngOnInit(): void {
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
    this.initPage();
  }

  private handleQueryParams(): void {
    this.route.queryParams.subscribe(
      (params) => (this.from = params['from'] ?? ''),
    );
  }

  initPage() {
    this.breadcrumb[1].url = `/home/rule-management/rule/${this.from}`;
  }

  private handleRouteParams(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (!id) return;

      this.getDetails(+id);
    });
  }

  getDetails(id: number) {
    this.ngxLoader.start();
    this.ruleService.details(id).subscribe({
      next: (res: any) => {
        this.details = structuredClone(mapRuleDetailsApiToForm(res['data']));
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

  updateRule(data?: any) {
    this.ngxLoader.start();

    const payload = mappingRulePayload(data);

    this.ruleService.update(mapRulePayloadToApi(payload)).subscribe({
      next: () => {
        this.toast.success('Request update rule has been created');

        this.router.navigate([`/home/rule-management/rule/${this.from}`]);
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Request update rule has been failed');
        }

        this.ngxLoader.stop();
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

        this.router.navigate(['/home/rule-management/rule/current']);
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
          this.updateRule(data);
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

  back(value: any) {
    const currentValue = value?.currentValue;
    const initValue = value?.initValue;
    const changed = this.getChangedValues(initValue, currentValue);

    if (Object.keys(changed).length === 0) {
      this.router.navigate([`/home/rule-management/rule/${this.from}`]);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure you want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            this.router.navigate([`/home/rule-management/rule/${this.from}`]);
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
