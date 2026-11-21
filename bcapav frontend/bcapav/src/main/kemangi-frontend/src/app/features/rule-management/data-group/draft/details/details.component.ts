import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CapitalizePipe } from '../../../../../shared';

import {
  ContentLayout,
  TableComponent,
  BreadcrumbProps,
  ToggleSwitch,
} from '../../../../../shared';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../../core/services/failed-modal.service';
import { ruleRelationListColumns } from '../../data/column';
import { ToastService } from '../../../../../core/services/toast.service';
import { DataGroupService } from '../../api/services/data-group.service';
import { viewDataGroupDraftBreadcrumbs } from '../../data';
import { PAGE_INFO_INIT, PAGE_QUERY_INIT } from '../../../../../shared';
import { mapRuleRelationDomainToApi } from '../../mappers/data-group.mapper';
import { camelToSnake } from '../../../../../shared/utils/string.util';
import { DataGroupApprovalDetails } from '../../domain/models/data-group.model';
import { DataGroupUploadFile } from '../../domain/models/data-group.model';
import { DataGroupViewDetailValueComponent } from '../../components/data-group-view-detail-value/data-group-view-detail-value';
import { BadgeUploadedDoc } from '../../../../../shared';
import { mapDataGroupDetailsApprovalApiToDomain } from '../../../../approval/data-group/mappers/data-group-approval.mapper';
@Component({
  selector: 'app-data-group-draft-detail',
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
    ToggleSwitch,
    TableComponent,
    DataGroupViewDetailValueComponent,
    CapitalizePipe,
    BadgeUploadedDoc,
  ],
  providers: [DatePipe],
})
export class DataGroupDraftDetailsComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = 'View Data Group';

  columns: any[] = ruleRelationListColumns;

  pageParams = { ...PAGE_QUERY_INIT };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: any[] = [];

  details = signal<DataGroupApprovalDetails | null>(null);

  detailValues = signal<string[] | null>(null);

  dataGroupId: string = '';

  initialFormValue: any;

  listFiles = signal<DataGroupUploadFile[]>([]);

  private destroy$ = new Subject<void>();

  @ViewChild('autoDescTA') autoDescTA!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('autoNameTA') autoNameTA!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly dataGroupService: DataGroupService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    public failedDialogService: FailedModalService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.dataGroupId = params.get('id') ?? '';
      if (this.dataGroupId || this.dataGroupId !== '') {
        this.getDataGroupDraftDetails(Number(this.dataGroupId));
      }
    });
  }

  initPageMode() {
    if (this.details()?.approvalStatus === 'REJECTED') {
      this.pageTitle = 'Rejected Data Group';

      this.breadcrumb = viewDataGroupDraftBreadcrumbs.map((item, index) =>
        index === 2 ? { ...item, label: 'Rejected Data Group' } : item,
      );

      return;
    }

    if (this.details()?.requestType === 'CREATE') {
      this.pageTitle = 'Create New Data Group';

      this.breadcrumb = viewDataGroupDraftBreadcrumbs.map((item, index) =>
        index === 2 ? { ...item, label: 'Create New Data Group' } : item,
      );

      return;
    }

    if (
      this.details()?.requestType === 'UPDATE' &&
      this.details()?.approvalStatus !== 'REJECTED'
    ) {
      this.pageTitle = 'Edit Data Group';

      this.breadcrumb = viewDataGroupDraftBreadcrumbs.map((item, index) =>
        index === 2 ? { ...item, label: 'Edit Data Group' } : item,
      );

      return;
    }

    if (this.details()?.requestType === 'DELETE') {
      this.pageTitle = 'Delete Data Group';

      this.breadcrumb = viewDataGroupDraftBreadcrumbs.map((item, index) =>
        index === 2 ? { ...item, label: 'Delete Data Group' } : item,
      );

      return;
    }
  }

  getDataGroupDraftDetails(id: number) {
    this.ngxLoader.start();

    this.dataGroupService.draftDetails(id).subscribe({
      next: (res: any) => {
        this.details.set(mapDataGroupDetailsApprovalApiToDomain(res['data']));
        this.detailValues.set(this.details()?.detailValues ?? []);
        if (res['data'] && res['data'].list_files?.length > 0) {
          this.listFiles.set(
            res['data'].list_files.map((x: any) => ({
              extension: x.extension,
              originalName: x.original_name,
              generatedName: x.generated_name,
            })),
          );
        }

        if (this.details()?.dataGroupId) {
          this.getRuleRelationList(this.details()?.dataGroupId ?? '', {
            ...this.pageParams,
            page: this.pageParams.page - 1,
          });
        }

        this.initPageMode();

        setTimeout(() => {
          this.autogrow(this.autoDescTA.nativeElement);
          this.autogrow(this.autoNameTA.nativeElement);
        }, 100);
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

  back() {
    this.router.navigate(['/home/rule-management/data-group/draft']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  autogrow(textarea: HTMLTextAreaElement) {
    const minHeight = 48;
    const maxHeight = 168;

    textarea.style.height = 'auto';
    let newHeight = textarea.scrollHeight;

    if (newHeight < minHeight) {
      newHeight = minHeight;
    } else if (newHeight > maxHeight) {
      newHeight = maxHeight;
    }

    textarea.style.height = newHeight + 'px';
  }
}
