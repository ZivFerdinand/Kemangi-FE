import { Component, OnInit, OnDestroy, signal, model } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  ContentLayout,
  TableComponent,
  BreadcrumbProps,
  ToggleSwitch,
  TableParams,
} from '../../../../shared';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../core/services/failed-modal.service';
import { thresholdDetailsDefault } from '../data/mockup';

import { thresholdScoreDetailListColumns, thresholdScoreCurrentDetailBreadcrumbs, thresholdScoreDetailViewListColumns } from '../data';
import { MLThresholdService } from '../services/ml-threshold.service';
import { ThresholdIdDetailParams } from '../interfaces';
import { BadgeDownloadDoc } from "../../../../shared/components/badge-download-doc/badge-download-doc";

@Component({
  selector: 'app-threshold-details',
  templateUrl: './threshold-details.component.html',
  styleUrls: [
    './threshold-details.component.scss',
    '../../../../shared/styles/index.scss',
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
    ToggleSwitch,
    TableComponent,
    BadgeDownloadDoc
],
  providers: [DatePipe],
})
export class ThresholdDetailsComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = thresholdScoreCurrentDetailBreadcrumbs;

  pageTitle: string = 'Details Threshold Score';

  columns = thresholdScoreDetailViewListColumns;

  pageParams: ThresholdIdDetailParams = {
    limit: 5,
    page: 1,
    sort: '',
    sort_dir: 'asc',
    id: '',
    model_id: ''
  };

  pageInfo = {
    totalElements: 31,
    totalPages: 1,
  };

  tableData: any[] = [];

  details = signal(structuredClone(thresholdDetailsDefault));

  dataId: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly mlThresholdService: MLThresholdService,
    private readonly toastr: ToastrService,
    public confirmationDialogService: ConfirmationModalService,
    public failedDialogService: FailedModalService
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.dataId = params.get('id') ?? '';
      if (this.dataId || this.dataId !== '') {
        this.getModelDetail(Number(this.dataId));
        
        this.pageParams.id = this.dataId;
        this.getThresholdIdDetail({
          ...this.pageParams,
          page: this.pageParams.page - 1
        });
      }
    });
  }

  getModelDetail(id: number) {
    this.ngxLoader.start();
    this.mlThresholdService.modelIdDetail(id).subscribe({
      next: (res: any) => {
        this.details.set(res['data']);
      },
      error: (e: any) => {
        this.ngxLoader.stop();
        if (e?.status !== 400) {
          this.toastr.show(
            `<div class="toast-custom toast-failed">
                <div class="info">
                  <div class="icon">
                    <img src="./assets/img/ic-times-rounded.svg" alt="error" />
                  </div>
                  <div class="description">
                    Something went wrong while loading data
                  </div>
                </div>

                <button class="close-btn">
                  <img src="./assets/img/ic-times.svg" alt="close" />
                </button>
            </div>`,
            '',
            { enableHtml: true }
          );
        }
      },
      complete: () => this.ngxLoader.stop(),
    });
    this.ngxLoader.stop();
  }

  getThresholdIdDetail(params: TableParams) {
    this.ngxLoader.start();
    this.mlThresholdService.thresholdIdDetailCurrentList(params).subscribe({
      next: (res: any) => {
        this.tableData = res['data']['content'];
        this.pageInfo = {
          ...this.pageInfo,
          totalElements: res['data']['totalElements'],
          totalPages: res['data']['totalPages'],
        };
      },
      error: (e: any) => {
        this.ngxLoader.stop();
        if (e?.status !== 400) {
          this.toastr.show(
            `<div class="toast-custom toast-failed">
                <div class="info">
                  <div class="icon">
                    <img src="./assets/img/ic-times-rounded.svg" alt="error" />
                  </div>
                  <div class="description">
                    Something went wrong while loading data
                  </div>
                </div>

                <button class="close-btn">
                  <img src="./assets/img/ic-times.svg" alt="close" />
                </button>
            </div>`,
            '',
            { enableHtml: true }
          );
        }
      },
      complete: () => this.ngxLoader.stop(),
    });
    this.ngxLoader.stop();
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageParams = { ...this.pageParams, sort: param, sort_dir: order };

  }

  handlePageChange(e: any) {
    this.pageParams = { ...this.pageParams, page: e };
    this.getThresholdIdDetail({
      ...this.pageParams,
      page: this.pageParams.page - 1,
    });
  }

  back() {
    this.router.navigate(['/home/machine-learning/threshold-score/current']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
