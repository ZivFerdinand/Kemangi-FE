import { Component, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FraudTypeDetails } from '../domain/models/fraud-types.model';
import { ToggleSwitch } from '../../../../shared';
import { FailedModalService } from '../../../../core/services/failed-modal.service';
import { FraudTypeService } from './../api/services/fraud-type.service';
import { ContentLayout } from '../../../../shared';
import { detailFraudTypeBreadcrumb } from '../data';
import { BreadcrumbProps } from '../../../../shared';
import { ToastService } from '../../../../core/services/toast.service';
import { FRAUD_TYPE_DETAILS_DEFAULT } from '../data';
import { mapFraudTypeDetailApiToDomain } from '../mappers/fraud-type.mapper';

@Component({
  selector: 'app-fraud-type-detail',
  templateUrl: './fraud-type-detail.component.html',
  styleUrls: [
    './fraud-type-detail.component.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    ToggleSwitch,
    ContentLayout,
  ],
  providers: [DatePipe],
})
export class FraudTypeDetailComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = detailFraudTypeBreadcrumb;

  pageTitle: string = 'View Fraud Type';

  details = signal<FraudTypeDetails>(FRAUD_TYPE_DETAILS_DEFAULT);

  fraudTypeId: string = '';

  isDisabled: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly fraudTypeService: FraudTypeService,
    public failedDialogService: FailedModalService,
    private readonly toast: ToastService
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.fraudTypeId = params.get('id') ?? '';
      if (this.fraudTypeId || this.fraudTypeId !== '') {
        this.initData();
      }
    });
  }

  initData() {
    this.getFraudTypeDetails(this.fraudTypeId);
  }

  getFraudTypeDetails(id: string) {
    this.ngxLoader.start();

    this.fraudTypeService.fraudTypeDetails(id).subscribe({
      next: (res: any) => {
        this.details.set(mapFraudTypeDetailApiToDomain(res['data']));
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

  back() {
    this.router.navigate(['/home/data-master/fraud-type']);
  }
}
