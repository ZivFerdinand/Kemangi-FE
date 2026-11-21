import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ToastService } from '../../../../../core/services/toast.service';

import { DataGroupApprovalService } from '../../api/services/data-group-approval.service';
import {
  ContentLayout,
  valueListColumns,
  BreadcrumbProps,
  TabProps,
} from '../../../../../shared';

import { dataGroupApprovalRequestedListBreadcrumb } from '../../data';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';

import { takeUntil } from 'rxjs/operators';
import { editDataGroupApprovalTabs } from '../../data';
import { RuleRelationTable } from '../../../../rule-management/data-group/domain/models/data-group.model';
import { TableQuery } from '../../../../../shared';
import { PAGE_INFO_INIT, PAGE_QUERY_INIT } from '../../../../../shared';

import { DataGroupApprovalDetails } from '../../domain/models/data-group-approval.model';
import { DATA_GROUP_APPROVAL_DETAILS_INIT } from '../../data';
import { mapRuleRelationDomainToApi } from '../../../../rule-management/data-group/mappers/data-group.mapper';
import { DataGroupViewApproval } from '../../components/data-group-view-approval/data-group-view-approval';
import { DataGroupViewEditApproval } from '../../components/data-group-view-edit-approval/data-group-view-edit-approval';
import { mapDataGroupDetailsApprovalApiToDomain } from '../../mappers/data-group-approval.mapper';
@Component({
  selector: 'app-data-group-approval-requested-view',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    NgbModule,
    ContentLayout,
    DataGroupViewApproval,
    DataGroupViewEditApproval,
  ],
  providers: [DatePipe],
})
export class DataGroupApprovalRequestedListViewComponent
  implements OnInit, OnDestroy
{
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  tabs: TabProps[] = editDataGroupApprovalTabs;

  activeTab: string = 'before';

  valueColumns: any[] = valueListColumns;

  columns: any[] = [];

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

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly dataGroupApprovalService: DataGroupApprovalService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params.get('id')) {
        this.getDetails(params.get('id') ?? '');
      }
    });
  }

  initPageMode() {
    if (this.details()?.requestType === 'CREATE') {
      this.pageTitle = 'New Data Group Approval';
      this.breadcrumb = [
        ...dataGroupApprovalRequestedListBreadcrumb,
        {
          label: 'New Data Group Approval',
          url: '',
        },
      ];
    } else if (this.details()?.requestType === 'UPDATE') {
      this.pageTitle = 'Edit Data Group Approval';
      this.breadcrumb = [
        ...dataGroupApprovalRequestedListBreadcrumb,
        {
          label: 'Edit Data Group Approval',
          url: '',
        },
      ];
    } else {
      this.pageTitle = 'Delete Data Group Approval';
      this.breadcrumb = [
        ...dataGroupApprovalRequestedListBreadcrumb,
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

        if (
          this.details().dataGroupId &&
          !(
            this.details().requestType === 'DELETE' &&
            this.details().approvalStatus === 'APPROVED'
          )
        ) {
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
        error: (e) => {
          this.ngxLoader.stop();
          if (e?.status !== 400) {
            this.toast.error('Something went wrong while loading data');
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;
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

  back() {
    this.router.navigate(['/home/approval/data-group/requested-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
