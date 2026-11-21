import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastService } from '../../../../../core/services/toast.service';
import {
  ContentLayout,
  BreadcrumbProps,
  TableQuery,
} from '../../../../../shared';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../../core/services/failed-modal.service';
import { ruleRelationListColumns } from '../../data/column';

import { DataGroupService } from '../../services/data-group.service';
import {
  viewDataGroupRequestedBreadcrumbs,
  valueListColumns,
} from '../../data';
import { PAGE_PARAM_STRUCT } from '../../../../../shared';

import { DataGroupApprovalDetails } from '../../../../approval/data-group/domain/models/data-group-approval.model';
import { DATA_GROUP_APPROVAL_DETAILS_INIT } from '../../../../approval/data-group/data';

import { DataGroupViewApproval } from '../../../../approval/data-group/components/data-group-view-approval/data-group-view-approval';
import { DataGroupViewEditApproval } from '../../../../approval/data-group/components/data-group-view-edit-approval/data-group-view-edit-approval';
import { PAGE_INFO_INIT, PAGE_QUERY_INIT } from '../../../../../shared';
import { RuleRelationTable } from '../../domain/models/data-group.model';
import { mapRuleRelationDomainToApi } from '../../mappers/data-group.mapper';
import { mapDataGroupDetailsApprovalApiToDomain } from '../../../../approval/data-group/mappers/data-group-approval.mapper';

@Component({
  selector: 'app-data-group-details-requested',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    ContentLayout,
    DataGroupViewApproval,
    DataGroupViewEditApproval,
  ],
  providers: [DatePipe],
})
export class DataGroupDetailsRequestedComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = viewDataGroupRequestedBreadcrumbs;

  pageTitle: string = '';

  valueColumns: any[] = valueListColumns;

  columns: any[] = ruleRelationListColumns;

  pageParams = PAGE_PARAM_STRUCT;

  pageRuleRelationQuery = { ...PAGE_QUERY_INIT };

  pageRuleRelationInfo = { ...PAGE_INFO_INIT };

  ruleRelationList = signal<RuleRelationTable[]>([]);

  details = signal<DataGroupApprovalDetails>({
    ...DATA_GROUP_APPROVAL_DETAILS_INIT,
  });

  prevDetails = signal<DataGroupApprovalDetails>({
    ...DATA_GROUP_APPROVAL_DETAILS_INIT,
  });

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private fb: FormBuilder,
    private readonly dataGroupService: DataGroupService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    public failedDialogService: FailedModalService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.getDetails(params.get('id') ?? '');
    });
  }

  initPageMode() {
    if (this.details().requestType === 'CREATE') {
      this.pageTitle = 'New Data Group Approval';
    } else if (this.details().requestType === 'UPDATE') {
      this.pageTitle = 'Edit Data Group Approval';
    } else {
      this.pageTitle = 'Delete Data Group Approval';
    }
  }

  getDetails(id: any) {
    this.ngxLoader.start();

    this.dataGroupService.dataGroupDraftDetails(id).subscribe({
      next: (res: any) => {
        this.details.set(mapDataGroupDetailsApprovalApiToDomain(res['data']));

        this.initPageMode();
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

    this.dataGroupService.dataGroupDraftDetails(id).subscribe({
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
    this.dataGroupService
      .dataGroupRuleRelationList(id, mapRuleRelationDomainToApi(param))
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
    this.router.navigate(['/home/rule-management/data-group/requested']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
