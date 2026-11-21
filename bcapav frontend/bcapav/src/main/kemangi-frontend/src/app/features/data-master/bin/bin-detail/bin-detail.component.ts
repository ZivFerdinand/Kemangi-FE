import { Component, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BinDetails } from '../domain/models/bin.model';
import { ToggleSwitch } from '../../../../shared';
import { FailedModalService } from '../../../../core/services/failed-modal.service';
import { BinService } from '../api/services/bin.service';
import { ContentLayout } from '../../../../shared';
import { detailBinBreadcrumb } from '../data';
import { BreadcrumbProps } from '../../../../shared';
import { ToastService } from '../../../../core/services/toast.service';
import { BIN_DETAILS_DEFAULT } from '../data';
import { mapBinDetailApiToDomain } from '../mappers/bin.mapper';

@Component({
  selector: 'app-bin-detail',
  templateUrl: './bin-detail.component.html',
  styleUrls: [
    './bin-detail.component.scss',
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
export class BinDetailComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = detailBinBreadcrumb;

  pageTitle: string = 'View BIN';

  details = signal<BinDetails>(BIN_DETAILS_DEFAULT);

  binId: string = '';

  isDisabled: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly binService: BinService,
    public failedDialogService: FailedModalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.binId = params.get('id') ?? '';
      if (this.binId || this.binId !== '') {
        this.initData();
      }
    });
  }

  initData() {
    this.getBinDetails(this.binId);
  }

  getBinDetails(id: string) {
    this.ngxLoader.start();

    this.binService.binDetails(id).subscribe({
      next: (res: any) => {
        this.details.set(mapBinDetailApiToDomain(res['data']));
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
    this.router.navigate(['/home/data-master/bin']);
  }
}
