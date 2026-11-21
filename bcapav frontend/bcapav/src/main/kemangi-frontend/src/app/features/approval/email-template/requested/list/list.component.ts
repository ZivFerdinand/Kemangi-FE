import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { ColumnDef } from '@tanstack/table-core';

import {
  CustomTabComponent,
  ContentLayout,
  PAGE_INFO_INIT,
  approvalTabs,
  TableState,
  StickyTableComponent,
} from '../../../../../shared';
import { BreadcrumbProps, TabProps } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import {
  EmailTemplateApprovalQuery,
  EmailTemplateApproval,
} from '../../domain/email-approval.model';
import { mapEmailTemplateApprovalQueryDomainToApi } from '../../mappers/email-template-approval.mapper';
import { EmailTemplateApprovalService } from '../../api/services/email-template-approval.service';
import { EmailRequestedFilter } from '../../components/email-requested-filter/email-requested-filter';
import {
  emailTemplateApprovalRequestedListBreadcrumb,
  emailTemplateApprRequestedListColumns,
  EMAIL_TEMPL_REQUESTED_TABLE_QUERY_INIT,
  EMAIL_TEMPL_REQUESTED_LIST_DISPLAY_INIT,
} from '../../data';
import { CapitalizePipe } from '../../../../../shared';
import { FiltersDisplayStruct } from '../../../../../shared';
import {
  DropdownEmailTemplate,
  DropdownTemplateType,
  DropdownProductGroup,
} from '../../../rule/domain/models/rule-approval.model';
import {
  mapDropdownEmailTemplateApiToDomain,
  mapDropdownTemplateTypeApiToDomain,
  mapDropdownProductGroupApiToDomain,
} from '../../../rule/mappers/rule-approval.mapper';
import { SharedDataService } from '../../../../../core/services/shared-data.service';

@Component({
  selector: 'app-email-template-approval-requested-list',
  standalone: true,
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  imports: [
    ContentLayout,
    CustomTabComponent,
    CommonModule,
    NgSelectModule,
    NgbDatepickerModule,
    NgbModule,
    EmailRequestedFilter,
    CapitalizePipe,
    RouterLink,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class EmailTemplateApprovalRequestedListComponent implements OnInit {
  breadcrumb: BreadcrumbProps[] = emailTemplateApprovalRequestedListBreadcrumb;

  currentUrl: string = '';

  pageTitle: string = 'Email Template Approval';

  columns: ColumnDef<EmailTemplateApproval>[] =
    emailTemplateApprRequestedListColumns;

  pageQuery: TableState<EmailTemplateApprovalQuery> = {
    ...EMAIL_TEMPL_REQUESTED_TABLE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: EmailTemplateApproval[] = [];

  columnsPinned: string[] = ['no', 'templateId', 'templateType'];

  filterDisplay = signal<FiltersDisplayStruct[]>([
    ...EMAIL_TEMPL_REQUESTED_LIST_DISPLAY_INIT,
  ]);

  tabs: TabProps[] = approvalTabs;

  activeTab: string = 'requested';

  showFilter: boolean = false;

  submitFilter: boolean = false;

  users: any[] = [];

  emailTemplates: DropdownEmailTemplate[] = [];

  productTypes: DropdownProductGroup[] = [];

  templateTypes: DropdownTemplateType[] = [];

  visibleFilterInfo = computed(() => {
    return this.filterDisplay().filter(
      (item) =>
        item.value !== null && item.value !== '' && item.value !== undefined,
    );
  });

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly toast: ToastService,
    private readonly emailTemplateApprovalService: EmailTemplateApprovalService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initData();
    this.getUserList();
    this.getDropdownEmailTemplate();
    this.getDropdownProductType();
    this.getDropdownTemplateType();
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

  initData() {
    this.getData({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  // handle page

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageQuery = { ...this.pageQuery, sort: param, sortDir: order };

    this.initData();
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };
    this.initData();
  }

  handleFilter(data: any) {
    this.submitFilter = true;
    this.showFilter = false;
    this.pageQuery = { ...this.pageQuery, ...data?.filterBy };

    const temp = data?.filterDisplayTemp;

    const dateRange = (from?: string | null, to?: string | null) =>
      `${from ?? ''}${to ? ' - ' + to : ''}`;

    const labelValueMap: Record<string, any> = {
      'Template ID': temp.templateId,
      'Template Type': temp.templateType,
      'Template Name': temp.name,
      Product: temp.product,
      'Requested By': temp.requestedBy,
      'Requested Date': dateRange(temp.requestDateFrom, temp.requestDateTo),
      'Reviewed By': temp.reviewedBy,
      'Reviewed Date': dateRange(temp.approvalDateFrom, temp.approvalDateTo),
      'Approval Status': temp.approvalStatus,
      'Action Type': temp.requestType,
    };

    const mappingData = this.filterDisplay().map((item) => ({
      ...item,
      value:
        item.label in labelValueMap ? labelValueMap[item.label] : item.value,
    }));

    this.filterDisplay.set(mappingData);

    this.initData();
  }

  resetFilter() {
    this.showFilter = false;
    this.submitFilter = false;

    this.filterDisplay.set([...EMAIL_TEMPL_REQUESTED_LIST_DISPLAY_INIT]);

    this.pageQuery = { ...EMAIL_TEMPL_REQUESTED_TABLE_QUERY_INIT };

    this.getData({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  // fetch API

  getData(query: any) {
    this.ngxLoader.start();
    this.emailTemplateApprovalService
      .list(mapEmailTemplateApprovalQueryDomainToApi(query))
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

  getUserList() {
    this.emailTemplateApprovalService.getUserList().subscribe({
      next: (res: any) => {
        this.users = res['data'];
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getDropdownEmailTemplate() {
    this.emailTemplateApprovalService.dropdownEmailTemplate().subscribe({
      next: (res: any) => {
        this.emailTemplates = res['data'].map((x: any) =>
          mapDropdownEmailTemplateApiToDomain(x),
        );
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getDropdownProductType() {
    this.emailTemplateApprovalService.dropdownProductType().subscribe({
      next: (res: any) => {
        this.productTypes = res['data'].map((x: any) =>
          mapDropdownProductGroupApiToDomain(x),
        );
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getDropdownTemplateType() {
    this.emailTemplateApprovalService.dropdownTemplateType().subscribe({
      next: (res: any) => {
        this.templateTypes = res['data'].map((x: any) =>
          mapDropdownTemplateTypeApiToDomain(x),
        );
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
