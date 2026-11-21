import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { detailFraudTypeRequestedBreadcrumb } from '../../data';
import {
  EditFraudTypeApproval,
  DefaultFraudTypeViewApproval,
} from '../../../../approval/fraud-type/components';
import { BreadcrumbProps } from '../../../../../shared/interfaces';
import { ContentLayout } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { FraudTypeApprovalService } from '../../../../approval/fraud-type/api/services/fraud-type-approval.service';
import { mapFraudTypeApprovalDetailsApiToDomain } from '../../../../approval/fraud-type/mappers/fraud-type-approval.mapper';
import { FraudTypeApprovalDetails } from '../../../../approval/fraud-type/domain/models/fraud-type-approval.model';
import { FRAUD_TYPE_APPROVAL_DETAILS_DEFAULT } from '../../../../approval/fraud-type/data';

@Component({
  selector: 'app-fraud-type-detail-requested',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    EditFraudTypeApproval,
    ContentLayout,
    DefaultFraudTypeViewApproval,
  ],
})
export class FraudTypeDetailRequestedComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  details = signal<FraudTypeApprovalDetails>({
    ...FRAUD_TYPE_APPROVAL_DETAILS_DEFAULT,
  });

  prevDetails = signal<FraudTypeApprovalDetails>({
    ...FRAUD_TYPE_APPROVAL_DETAILS_DEFAULT,
  });

  isDisabled: boolean = true;
  apprId: string | null = '';
  prevApprId: string | null = '';
  actionType: string | null = '';
  pageType: string = 'requested list';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly fraudTypeApprovalService: FraudTypeApprovalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.apprId = params.get('id');

      this.getFraudTypeApprovalDetails();
    });
  }

  initPageMode(action: string) {
    if (action === 'CREATE') {
      this.pageTitle = 'New Fraud Type Approval';
      this.breadcrumb = [
        ...detailFraudTypeRequestedBreadcrumb,
        { label: 'New Fraud Type Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit Fraud Type Approval';
      this.breadcrumb = [
        ...detailFraudTypeRequestedBreadcrumb,
        { label: 'Edit Fraud Type Approval', url: '' },
      ];
    } else {
      this.pageTitle = 'Delete Fraud Type Approval';
      this.breadcrumb = [
        ...detailFraudTypeRequestedBreadcrumb,
        { label: 'Delete Fraud Type Approval', url: '' },
      ];
    }
  }

  getFraudTypeApprovalDetails() {
    this.ngxLoader.start();
    this.fraudTypeApprovalService
      .fraudTypeApprovalDetails(Number(this.apprId))
      .subscribe({
        next: (res: any) => {
          this.details.set(mapFraudTypeApprovalDetailsApiToDomain(res['data']));
          this.prevApprId = res['data']['last_appr_id'] ?? '';
          this.actionType = res['data']['request_type'];
          this.initPageMode(this.actionType ?? '');
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e?.status !== 400) {
            this.toast.error('Something went wrong while loading data');
          }
        },
        complete: () => {
          if (this.prevApprId) {
            this.getPrevFraudTypeApprovalDetails();
            return;
          }

          this.ngxLoader.stop();
        },
      });
  }

  getPrevFraudTypeApprovalDetails() {
    this.fraudTypeApprovalService
      .fraudTypeApprovalDetails(Number(this.prevApprId))
      .subscribe({
        next: (res: any) => {
          this.prevDetails.set(
            mapFraudTypeApprovalDetailsApiToDomain(res['data']),
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

  back() {
    this.router.navigate(['/home/data-master/fraud-type/requested-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
