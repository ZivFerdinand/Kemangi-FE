import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  ContentLayout,
  TableComponent,
  BreadcrumbProps,
  ToggleSwitch,
} from '../../../../shared';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../core/services/failed-modal.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ruleRelationListColumns } from '../data/column';

import { DataGroupService } from '../api/services/data-group.service';
import { viewDataGroupBreadcrumbs } from '../data';
import { PAGE_INFO_INIT, PAGE_QUERY_INIT } from '../../../../shared';
import { DataGroupDetails } from '../domain/models/data-group.model';
import { camelToSnake } from '../../../../shared/utils/string.util';
import { DataGroupViewDetailValueComponent } from '../components/data-group-view-detail-value/data-group-view-detail-value';
import {
  mapDataGroupDetailsApiToDomain,
  mapRuleRelationDomainToApi,
} from '../mappers/data-group.mapper';

@Component({
  selector: 'app-data-group-details',
  templateUrl: './data-group-details.component.html',
  styleUrls: [
    './data-group-details.component.scss',
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
    DataGroupViewDetailValueComponent,
  ],
  providers: [DatePipe],
})
export class DataGroupDetailsComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = viewDataGroupBreadcrumbs;

  pageTitle: string = 'View Data Group';

  columns: any[] = ruleRelationListColumns;

  pageParams = { ...PAGE_QUERY_INIT };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: any[] = [];

  details = signal<DataGroupDetails | null>(null);

  detailValues = signal<string[] | null>(null);

  dataGroupId: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly dataGroupService: DataGroupService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    public failedDialogService: FailedModalService,
    private http: HttpClient,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.dataGroupId = params.get('id') ?? '';
      if (this.dataGroupId || this.dataGroupId !== '') {
        this.getDataGroupDetails(Number(this.dataGroupId));
      }
    });
  }

  getDataGroupDetails(id: number) {
    this.ngxLoader.start();

    this.dataGroupService.details(id).subscribe({
      next: (res: any) => {
        this.details.set(mapDataGroupDetailsApiToDomain(res['data']));
        this.detailValues.set(this.details()?.detailValues ?? []);
        if (this.details()?.dataGroupId) {
          this.getRuleRelationList(this.details()?.dataGroupId ?? '', {
            ...this.pageParams,
            page: this.pageParams.page - 1,
          });
        }
      },
      error: () => {
        this.ngxLoader.stop();
        this.toast.error('Something went wrong while loading data');
      },
      complete: () => this.ngxLoader.stop(),
    });
  }

  getRuleRelationList(id: string, param: any) {
    this.ngxLoader.start();
    this.dataGroupService
      .ruleRelationList(id, mapRuleRelationDomainToApi(param))
      .subscribe({
        next: (res: any) => {
          this.tableData = res['data']['content'];
          this.pageInfo = {
            ...this.pageInfo,
            totalElements: res['data']['totalElements'],
            totalPages: res['data']['totalPages'],
          };
        },
        error: () => {
          this.ngxLoader.stop();
          this.toast.error('Something went wrong while loading data');
        },
        complete: () => this.ngxLoader.stop(),
      });
    this.ngxLoader.stop();
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageParams = {
      ...this.pageParams,
      sort: param === 'ruleName' ? camelToSnake(param) : param,
      sortDir: order,
    };
    this.getRuleRelationList(this.details()?.dataGroupId ?? '', {
      ...this.pageParams,
      page: this.pageParams.page - 1,
    });
  }

  handlePageChange(e: any) {
    this.pageParams = { ...this.pageParams, page: e };
    this.getRuleRelationList(this.details()?.dataGroupId ?? '', {
      ...this.pageParams,
      page: this.pageParams.page - 1,
    });
  }

  handleDownload(url: string, extension: string) {
    if (extension === '.pdf') {
      this.http
        .get(url, {
          responseType: 'blob',
        })
        .subscribe((res) => {
          const blob = new Blob([res], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
          return;
        });

      return;
    }

    const scriptUrl = this.router.serializeUrl(
      this.router.createUrlTree(['/preview-excel'], {
        queryParams: {
          ref: url,
        },
      }),
    );

    const finalUrl = scriptUrl.includes('#') ? scriptUrl : '/#' + scriptUrl;

    window.open(window.location.origin + finalUrl, '_blank');
  }

  back() {
    this.router.navigate(['/home/rule-management/data-group/current']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
