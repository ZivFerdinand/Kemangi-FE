import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ContentLayout, TableComponent } from '../../../../../shared';
import { BreadcrumbProps, PageInfo, TableQuery } from '../../../../../shared';
import { PAGE_QUERY_INIT, PAGE_INFO_INIT } from '../../../../../shared';
import {
  ALERT_QUEQUE_DETAILS_INIT,
  assignToDisplayListColumns,
  USER_MASTER_DATA_QUERY_INIT,
} from '../../../../alert-queue-management/data';
import { alertQueueManagementApprovalRequestedListViewBreadcrumb } from '../../data';
import { mapAlertQueueDetailsApprovalResponseToAlertQueueDetailsUI } from '../../../../alert-queue-management/mappers/alert-queue.mapper';
import { AlertDetails } from '../../../../alert-queue-management/components/alert-details/alert-details';
import { RuleModelView } from '../../../../alert-queue-management/components/rule-model-view/rule-model-view';
import {
  AlertQueueDetailsUI,
  UserMasterDataFilterQuery,
} from '../../../../alert-queue-management/domain/alert-queue.model';
import { ToastService } from '../../../../../core/services/toast.service';
import { AlertQueueApprovalService } from '../../api/services/alert-queue-approval.service';

type Parameter = {
  roleId: string | null;
  roleName: string | null;
  userId: string | null;
  userName: string | null;
};
@Component({
  selector: 'app-alert-queue-management-appr-requested-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [ContentLayout, AlertDetails, RuleModelView, TableComponent],
})
export class AlertQueueApprovalRequestedDetailsComponent
  implements OnInit, OnDestroy
{
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] =
    alertQueueManagementApprovalRequestedListViewBreadcrumb;

  pageTitle: string = '';

  details: AlertQueueDetailsUI = { ...ALERT_QUEQUE_DETAILS_INIT };

  prevDetails: AlertQueueDetailsUI = { ...ALERT_QUEQUE_DETAILS_INIT };

  pageQuery: TableQuery = { ...PAGE_QUERY_INIT };

  columns: any[] = assignToDisplayListColumns;

  tableData: any[] = [];

  pageInfo: PageInfo = { ...PAGE_INFO_INIT };

  userQuery: UserMasterDataFilterQuery = {
    ...USER_MASTER_DATA_QUERY_INIT,
  };

  users: any[] = [];

  assignTo: any[] = [];

  prevAssignTo: any[] = [];

  isDisabled: boolean = true;

  apprId: string | null = '';

  pageType: 'task' | 'requested' = 'requested';

  ref: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly alertQueueApprovalService: AlertQueueApprovalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.handleRouteParams();
    this.handleQueryParams();
  }

  handleRouteParams() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.apprId = params.get('id');

      if (this.apprId) {
        this.getDetails();
        this.getAssignTo(this.apprId, 'current');
      }
    });
  }

  handleQueryParams() {
    this.route.queryParamMap.subscribe((params) => {
      const ref = params.get('ref');
      this.ref = ref || '';
    });
  }

  handleBreadcrumbs(actionType: string) {
    this.breadcrumb =
      alertQueueManagementApprovalRequestedListViewBreadcrumb.map(
        (item, index) =>
          index === 2
            ? {
                ...item,
                label: this.handleLabel(actionType),
              }
            : item,
      );
  }

  handleLabel(actionType: string): string {
    switch (actionType) {
      case 'CREATE':
        return `New Alert Queue Approval`;
      case 'UPDATE':
        return `Edit Alert Queue Approval`;
      default:
        return 'Delete Alert Queue Approval';
    }
  }

  handlePageTitle(actionType: string) {
    this.pageTitle = this.handleLabel(actionType);
  }

  handlePageChange(event: any) {
    this.pageQuery = { ...this.pageQuery, page: event };
    this.generateTable();
  }

  handleSortChange(order: string, param: string) {
    this.pageQuery = { ...this.pageQuery, sort: param, sortDir: order };
    this.generateTable();
  }

  getDetails() {
    this.ngxLoader.start();
    if (this.apprId) {
      this.alertQueueApprovalService
        .details(this.apprId)
        .pipe(finalize(() => this.ngxLoader.stop()))
        .subscribe({
          next: (res: any) => {
            this.details =
              mapAlertQueueDetailsApprovalResponseToAlertQueueDetailsUI(
                res['data'],
              );

            if (this.details?.requestType) {
              if (this.ref === 'before') {
                this.handleBreadcrumbs('UPDATE');

                this.handlePageTitle('UPDATE');
              } else {
                this.handleBreadcrumbs(this.details.requestType);

                this.handlePageTitle(this.details.requestType);
              }
            }
          },
          error: this.handleError('Something went wrong while loading data'),
          complete: () => {
            const details = this.details;

            if (
              this.ref !== 'before' &&
              details?.requestType === 'UPDATE' &&
              details?.lastApprId
            ) {
              this.getPrevDetails(details.lastApprId.toString());
              this.getAssignTo(details.lastApprId.toString(), 'previous');
            }
          },
        });
    }
  }

  getPrevDetails(id: string) {
    this.alertQueueApprovalService.details(id).subscribe({
      next: (res: any) => {
        this.prevDetails =
          mapAlertQueueDetailsApprovalResponseToAlertQueueDetailsUI(
            res['data'],
          );
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getAssignTo(id: string, position: string) {
    this.alertQueueApprovalService.assignToListAll(id).subscribe({
      next: (res: any) => {
        if (position === 'current') {
          this.assignTo = res['data'];
        }

        if (position === 'previous') {
          this.prevAssignTo = res['data'];
        }

        this.generateTable();
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  back() {
    this.router.navigate(['/home/approval/alert-queue/requested-list']);
  }

  openTab() {
    const urlTree = this.router.createUrlTree(
      ['/home/approval/alert-queue/requested-list', this.details.lastApprId],

      {
        queryParams: { ref: 'before' },
      },
    );

    const scriptUrl = this.router.serializeUrl(urlTree);

    const finalUrl = scriptUrl.includes('#') ? scriptUrl : '/#' + scriptUrl;

    window.open(window.location.origin + finalUrl, '_blank');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }

  getStatusList(
    current: any[],
    previous: any[],
  ): ('changed' | 'not changed')[] {
    const n = current.length;
    const m = previous.length;

    const dp: number[][] = Array.from({ length: n + 1 }, () =>
      new Array(m + 1).fill(0),
    );

    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = this.paramsEqual(current[i], previous[j])
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }

    const statuses: ('changed' | 'not changed')[] = [];
    let i = 0;
    let j = 0;

    while (i < n) {
      if (j < m && this.paramsEqual(current[i], previous[j])) {
        statuses.push('not changed');
        i++;
        j++;
      } else if (j < m && dp[i][j + 1] > dp[i + 1][j]) {
        j++;
      } else {
        statuses.push('changed');
        i++;
      }
    }

    return statuses;
  }

  handleStatusList(currentParams: any[], requestType: string): any[] {
    if (requestType === 'UPDATE') {
      return currentParams.map(() => 'changed' as const);
    } else {
      return currentParams.map(() => 'not changed' as const);
    }
  }

  generateTable() {
    const start = (this.pageQuery.page - 1) * this.pageQuery.limit;
    const end = start + this.pageQuery.limit;

    const currentValue = this.assignTo ?? [];

    const previousValue = this.prevAssignTo ?? [];

    const totalElements = currentValue.length;

    this.pageInfo = {
      totalElements,
      totalPages: Math.ceil(totalElements / this.pageQuery.limit),
    };

    let statusList: any[] = [];

    if (this.details.requestType && previousValue.length > 0) {
      statusList = this.getStatusList(currentValue, previousValue);
    }

    const data =
      currentValue
        ?.map((x, idx) => {
          return {
            ...x,
            statusChanged: statusList[idx] ?? null,
          };
        })
        .slice(start, end) ?? [];

    const sort = this.pageQuery.sort;

    if (sort) {
      data.sort((a, b) => {
        const aValue = a[sort];
        const bValue = b[sort];
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        const comparison =
          typeof aValue === 'string' && typeof bValue === 'string'
            ? aValue.localeCompare(bValue)
            : aValue < bValue
              ? -1
              : aValue > bValue
                ? 1
                : 0;
        return this.pageQuery.sortDir === 'asc' ? comparison : -comparison;
      });
    }

    this.tableData = data.slice(start, end);
  }

  paramsEqual(a: Parameter, b: Parameter): boolean {
    return (
      a.userId === b.userId &&
      a.userName === b.userName &&
      a.roleId === b.roleId &&
      a.roleName === b.roleName
    );
  }
}
