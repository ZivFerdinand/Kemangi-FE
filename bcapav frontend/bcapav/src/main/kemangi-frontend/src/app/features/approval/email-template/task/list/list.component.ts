import { Component, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PAGE_INFO_INIT } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { finalize } from 'rxjs';
import { ColumnDef } from '@tanstack/table-core';

import {
  CustomTabComponent,
  ContentLayout,
  BreadcrumbProps,
  TabProps,
  TableState,
  StickyTableComponent,
} from '../../../../../shared';

import {
  emailTemplateApprovalTaskListBreadcrumb,
  EMAIL_TEMPL_TASK_TABLE_QUERY_INIT,
  emailTemplateApprTaskListColumns,
} from '../../data';
import { approvalTabs } from '../../../../../shared';
import { EmailTemplateApprovalService } from '../../api/services/email-template-approval.service';
import { mapEmailTemplateApprovalQueryDomainToApi } from '../../mappers/email-template-approval.mapper';
import {
  EmailTemplateApprovalQuery,
  EmailTemplateApproval,
} from '../../domain/email-approval.model';
import { SharedDataService } from '../../../../../core/services/shared-data.service';

@Component({
  selector: 'app-email-temp-task-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss',
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
    RouterLink,
    CustomTabComponent,
    ContentLayout,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class EmailTemplateApprovalTaskListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = emailTemplateApprovalTaskListBreadcrumb;

  pageTitle: string = 'Email Template Approval';

  tabs: TabProps[] = approvalTabs;

  activeTab: string = 'task';

  columns: ColumnDef<EmailTemplateApproval>[] =
    emailTemplateApprTaskListColumns;

  pageQuery: TableState<EmailTemplateApprovalQuery> = {
    ...EMAIL_TEMPL_TASK_TABLE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: EmailTemplateApproval[] = [];

  columnsPinned: string[] = ['no', 'templateId', 'templateType'];

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly emailTemplateApprovalService: EmailTemplateApprovalService,
    private readonly toast: ToastService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.getData({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  menuTask = computed(() =>
    this.sharedData.checkMenu('APPROVAL-EMAILTEMPLATE-TASK'),
  );

  menuRequested = computed(() =>
    this.sharedData.checkMenu('APPROVAL-EMAILTEMPLATE-REQUESTED'),
  );

  checkMenu = (value: string): boolean => {
    return value === 'task' ? this.menuTask() : this.menuRequested();
  };

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'task')
      this.navigateTo('/home/approval/email-template/task-list');
    if (tab === 'requested')
      this.navigateTo('/home/approval/email-template/requested-list');
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageQuery = { ...this.pageQuery, sort: param, sortDir: order };
    this.getData({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };
    this.getData({ ...this.pageQuery, page: e - 1 });
  }

  getData(param: EmailTemplateApprovalQuery) {
    this.ngxLoader.start();
    this.emailTemplateApprovalService
      .list(mapEmailTemplateApprovalQueryDomainToApi(param))
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

  // general

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
