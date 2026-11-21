import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, forkJoin, Observable, of, catchError, tap } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';

import { RuleApprovalService } from '../../../../approval/rule/api/services/rule-approval.service';
import { BreadcrumbProps } from '../../../../../shared';
import { ContentLayout } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import {
  mapRuleDetailsApprovalApiToDomain,
  mapDropdownRuleOperatorApiToDomain,
  mapDropdownRuleFunctionApiToDomain,
  mapDropdownDataGroupApiToDomain,
  mapDropdownHistoricalApiToDomain,
} from '../../../../approval/rule/mappers/rule-approval.mapper';
import {
  DropdownDataGroup,
  DropdownHistorical,
  RuleApprovalDetails,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import { RULE_APPROVAL_DETAILS_INIT } from '../../../../approval/rule/data';
import { draftRuleBreadcrumb } from '../../data';
import { RuleDetailsTypeB } from '../../components/rule-details-type-b/rule-details-type-b';
import { capitalize } from '../../../../../shared/utils/string.util';

@Component({
  selector: 'app-rule-task-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [ContentLayout, RuleDetailsTypeB],
})
export class RuleTaskDetailsComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = draftRuleBreadcrumb;

  pageTitle: string = 'Edit Rule';

  details: RuleApprovalDetails = { ...RULE_APPROVAL_DETAILS_INIT };

  isDisabled: boolean = true;
  apprId: string | null = '';

  dropdownRuleFunction: any[] = [];
  dropdownRuleOperator: any[] = [];
  dropdownDataGroup: DropdownDataGroup[] = [];
  dropdownHistorical: DropdownHistorical[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private ruleApprovalService: RuleApprovalService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly toast: ToastService,
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
  }

  handleRouteParams() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.apprId = params.get('id');

      if (this.apprId) {
        this.getDetails(this.apprId);
      }
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

  handlePageTitle(approvalStatus: string, actionType: string) {
    this.pageTitle = this.handleLabel(approvalStatus, actionType);
  }

  getDetails(id: string) {
    this.ngxLoader.start();

    this.ruleApprovalService.details(id).subscribe({
      next: (res: any) => {
        this.details = structuredClone(
          mapRuleDetailsApprovalApiToDomain(res['data']),
        );

        this.handleBreadcrumbs(
          this.details.approvalStatus,
          this.details.requestType,
        );

        this.handlePageTitle(
          this.details.approvalStatus,
          this.details.requestType,
        );

        this.ngxLoader.stop();
      },
      error: (e) => {
        this.ngxLoader.stop();
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

  back() {
    this.router.navigate(['/home/rule-management/rule/task']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
