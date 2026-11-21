import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute } from '@angular/router';

import {
  BreadcrumbProps,
  PAGE_INFO_INIT,
  PAGE_QUERY_INIT,
  PageInfo,
  TableQuery,
} from '../../../../shared';
import { ContentLayout, TableComponent } from '../../../../shared';
import { ToastService } from '../../../../core/services/toast.service';
import { AlertQueueDetailsUI } from '../../domain/alert-queue.model';
import {
  ALERT_QUEQUE_DETAILS_INIT,
  alertQueueManagementViewBreadcrumb,
  assignToDisplayListColumns,
} from '../../data';
import { mapAlertQueueDetailsResponseToAlertQueueDetailsUI } from '../../mappers/alert-queue.mapper';
import { AlertDetails } from '../../components/alert-details/alert-details';
import { RuleModelView } from '../../components/rule-model-view/rule-model-view';
import { AlertQueueService } from '../../api/services/alert-queue.service';
import { mapTableQueryDomainToApi } from '../../../../shared/mappers';
@Component({
  selector: 'app-alert-queue-details',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [ContentLayout, AlertDetails, TableComponent, RuleModelView],
})
export class AlertQueueDetailsComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = alertQueueManagementViewBreadcrumb;

  pageTitle: string = 'View Alert Queue';

  details: AlertQueueDetailsUI = { ...ALERT_QUEQUE_DETAILS_INIT };

  pageQuery: TableQuery = { ...PAGE_QUERY_INIT };

  columns: any[] = assignToDisplayListColumns;

  tableData: any[] = [];

  pageInfo: PageInfo = { ...PAGE_INFO_INIT };

  isDisabled: boolean = true;

  id: string | null = null;

  pageType: 'current' = 'current';

  from: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly alertQueueService: AlertQueueService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.handleRouteParams();
  }

  handleRouteParams() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.id = params.get('id');

      if (this.id) {
        this.getDetails(this.id);
        this.getDataAssignTo();
      }
    });
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };

    this.getDataAssignTo();
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageQuery = {
      ...this.pageQuery,
      sort: param === 'lastUpdatedDt' ? 'lastRequestDt' : param,
      sortDir: order,
    };

    this.getDataAssignTo();
  }

  getDataAssignTo() {
    if (this.id) {
      this.getAssignToList(this.id, {
        ...this.pageQuery,
        page: this.pageQuery.page - 1,
      });
    }
  }

  getDetails(id: string) {
    this.ngxLoader.start();
    this.alertQueueService
      .details(Number(id))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.details = mapAlertQueueDetailsResponseToAlertQueueDetailsUI(
            res['data'],
          );
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  getAssignToList(id: string, query: TableQuery) {
    this.ngxLoader.start();

    this.alertQueueService
      .assignToList(id, mapTableQueryDomainToApi(query))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.tableData = res['data']['content'];
          this.pageInfo = {
            ...this.pageInfo,
            totalElements: res['data']['totalElements'],
            totalPages: res['data']['totalPages'],
          };
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  back() {
    this.router.navigate([`/home/alert-queue-management`]);
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
}
