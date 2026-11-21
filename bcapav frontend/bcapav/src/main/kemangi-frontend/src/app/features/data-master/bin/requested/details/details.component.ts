import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { detailBinRequestedBreadcrumb } from '../../data';
import {
  EditBinApproval,
  DefaultBinViewApproval,
} from '../../../../approval/bin/components';
import { BreadcrumbProps } from '../../../../../shared/interfaces';
import { ContentLayout } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { BinApprovalService } from './../../../../approval/bin/api/services/bin-approval.service';
import { BinApprovalDetails } from '../../../../approval/bin/domain/models/bin-approval.model';
import { BIN_APPROVAL_DETAILS_INIT } from '../../../../approval/bin/data';
import { mapBinDetailsApprovalApiToDomain } from '../../../../approval/bin/mappers/bin-approval.mapper';

@Component({
  selector: 'app-bin-detail-requested',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.html',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    ContentLayout,
    EditBinApproval,
    DefaultBinViewApproval,
  ],
})
export class BinDetailRequestedComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  details = signal<BinApprovalDetails>({ ...BIN_APPROVAL_DETAILS_INIT });

  prevDetails = signal<BinApprovalDetails>({ ...BIN_APPROVAL_DETAILS_INIT });

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
    private readonly binApprovalService: BinApprovalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.apprId = params.get('id');

      if (this.apprId) {
        this.getBinApprovalDetails();
      }
    });
  }

  initPageMode(action: string) {
    if (action === 'CREATE') {
      this.pageTitle = 'New BIN Approval';
      this.breadcrumb = [
        ...detailBinRequestedBreadcrumb,
        { label: 'New BIN Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit BIN Approval';
      this.breadcrumb = [
        ...detailBinRequestedBreadcrumb,
        { label: 'Edit BIN Approval', url: '' },
      ];
    } else {
      this.pageTitle = 'Delete BIN Approval';
      this.breadcrumb = [
        ...detailBinRequestedBreadcrumb,
        { label: 'Delete BIN Approval', url: '' },
      ];
    }
  }

  getBinApprovalDetails() {
    this.ngxLoader.start();
    this.binApprovalService.details(this.apprId ? this.apprId : '').subscribe({
      next: (res: any) => {
        this.details.set(mapBinDetailsApprovalApiToDomain(res['data']));
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
        this.ngxLoader.stop();
        if (this.details().requestType === 'UPDATE') {
          if (this.prevApprId) {
            this.getPrevBinApprovalDetails();
            return;
          }
        }
      },
    });
  }

  getPrevBinApprovalDetails() {
    this.binApprovalService
      .details(this.prevApprId ? this.prevApprId : '')
      .subscribe({
        next: (res: any) => {
          this.prevDetails.set(mapBinDetailsApprovalApiToDomain(res['data']));
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
    this.router.navigate(['/home/data-master/bin/requested-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
