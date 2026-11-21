import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../../core/services/failed-modal.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ContentLayout, BreadcrumbProps } from '../../../../../shared';
import { createRuleBreadcrumb } from '../../data';
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
  mapDropdownHistoricalApiToDomain,
  mapDropdownEmailTemplateApiToDomain,
  mapDropdownAbApiToDomain,
  mapDropdownRuleApiToDomain,
} from '../../../../approval/rule/mappers/rule-approval.mapper';
import { RuleDetailsForm } from '../../domain/rule.model';
import { RULEFORM_INIT } from '../../data';

import { mapRulePayloadToApi } from '../../mappers/rule.mapper';
import { mappingRulePayload } from '../../utils';
@Component({
  selector: 'app-rule-base-create',
  templateUrl: './create.component.html',
  styleUrls: [
    './create.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, NgbModule, ContentLayout, RuleForm],
  providers: [DatePipe],
})
export class RuleBaseCreateComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = createRuleBreadcrumb;

  pageTitle: string = 'Create New Rule';

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

  from: string = '';

  details: RuleDetailsForm | null = { ...RULEFORM_INIT };

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
    this.getDropdownProductGroupList();
    this.getDropdownRuleFunction();
    this.getDropdownRuleOperator();
    this.getDropdownDataGroup();
    this.getDropdownRulePipelineType();
    this.getDropdownHistorical();

    this.getDropdownAbTemplate();
    this.getDropdownRule();

    this.handleQueryParams();
    this.initPage();
  }

  private handleQueryParams(): void {
    this.route.queryParams.subscribe(
      (params) => (this.from = params['from'] ?? ''),
    );
  }

  initPage() {
    this.breadcrumb = createRuleBreadcrumb;
    this.breadcrumb[1].url = `/home/rule-management/rule/${this.from}`;
    this.pageTitle = 'Create New Rule';
  }

  getDropdownProductGroupList() {
    this.ruleService.ruleMasterProductGroupList().subscribe({
      next: (res: any) => {
        this.dropdownProductGroup = res['data'].map((x: any) =>
          mapDropdownProductGroupApiToDomain(x),
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

  getDropdownRuleOperator() {
    this.ruleService.ruleMasterOperatorList().subscribe({
      next: (res: any) => {
        this.dropdownRuleOperator = res['data'].map((x: any) =>
          mapDropdownRuleOperatorApiToDomain(x),
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

  getDropdownRuleFunction() {
    this.ruleService.ruleMasterFunctionList().subscribe({
      next: (res: any) => {
        this.dropdownRuleFunction = res['data'].map((x: any) =>
          mapDropdownRuleFunctionApiToDomain(x),
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

  getDropdownDataGroup() {
    this.ruleService.ruleMasterDataGroupList(false).subscribe({
      next: (res: any) => {
        this.dropdownDataGroup = res['data'].map((x: any) =>
          mapDropdownDataGroupApiToDomain(x),
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

  getDropdownRulePipelineType() {
    this.ruleService.ruleMasterPipelineTypeList().subscribe({
      next: (res: any) => {
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
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {},
    });
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

  getDropdownHistorical() {
    this.ruleApprovalService.dropdownHistorical().subscribe({
      next: (res: any) => {
        this.dropdownHistorical = res['data'].map((x: any) =>
          mapDropdownHistoricalApiToDomain(x),
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

  getDropdownRule() {
    this.ruleApprovalService.dropdownRule().subscribe({
      next: (res: any) => {
        this.dropdownRule = res['data'].map((x: any) =>
          mapDropdownRuleApiToDomain(x),
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

  getDropdownAbTemplate() {
    this.ruleApprovalService.dropdownAbTemplate().subscribe({
      next: (res: any) => {
        this.dropdownAb = res['data'].map((x: any) =>
          mapDropdownAbApiToDomain(x),
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

    this.ruleService.create(mapRulePayloadToApi(payload)).subscribe({
      next: () => {
        this.toast.success('Request create rule has been created');

        this.router.navigate([`/home/rule-management/rule/${this.from}`]);
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Request create rule has been failed');
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

        this.router.navigate([`/home/rule-management/rule/${this.from}`]);
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
