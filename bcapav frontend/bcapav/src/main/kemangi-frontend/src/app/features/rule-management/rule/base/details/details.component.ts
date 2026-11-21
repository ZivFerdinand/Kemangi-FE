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
  mapDropdownRuleOperatorApiToDomain,
  mapDropdownRuleFunctionApiToDomain,
  mapDropdownDataGroupApiToDomain,
  mapDropdownHistoricalApiToDomain,
} from '../../../../approval/rule/mappers/rule-approval.mapper';
import {
  DropdownDataGroup,
  DropdownRuleFunction,
  DropdownRuleOperator,
  DropdownHistorical,
} from './../../../../approval/rule/domain/models/rule-approval.model';
import { RuleDetailsTypeA } from '../../components/rule-details-type-a/rule-details-type-a';
import { RuleService } from '../../api/services/rule.service';
import { mapRuleDetailsApiToDomain } from '../../mappers/rule.mapper';
import { RuleDetails } from '../../domain/rule.model';
import { RULE_DETAILS_INIT, ruleDetailsBreadcrumb } from '../../data';

@Component({
  selector: 'app-rule-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [ContentLayout, RuleDetailsTypeA],
  // providers: [DatePipe],
})
export class RuleDetailsV2Component implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = ruleDetailsBreadcrumb;

  pageTitle: string = 'View Rule';

  details: RuleDetails = { ...RULE_DETAILS_INIT };

  isDisabled: boolean = true;

  id: string | null = null;

  dropdownRuleFunction: DropdownRuleFunction[] = [];
  dropdownRuleOperator: DropdownRuleOperator[] = [];
  dropdownDataGroup: DropdownDataGroup[] = [];
  dropdownHistorical: DropdownHistorical[] = [];

  from: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private ruleService: RuleService,
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

    this.handleQueryParams();
  }

  handleRouteParams() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.id = params.get('id');

      if (this.id) {
        this.getDetails(this.id);
      }
    });
  }

  private handleQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      this.from = params['from'] ?? '';
      this.breadcrumb = ruleDetailsBreadcrumb.map((item) => {
        if (item.label === 'Rule') {
          return { ...item, url: `/home/rule-management/rule/${this.from}` };
        }
        return item;
      });
    });
  }

  getDetails(id: string) {
    this.ngxLoader.start();

    this.ruleService.details(Number(id)).subscribe({
      next: (res: any) => {
        this.details = mapRuleDetailsApiToDomain(res['data']);

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
      },
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
    this.router.navigate([`/home/rule-management/rule/${this.from}`]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
