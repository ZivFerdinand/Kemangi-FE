import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { ColumnDef } from '@tanstack/table-core';

import {
  CustomTabComponent,
  ContentLayout,
  PAGE_INFO_INIT,
  genericTabsV1,
  FiltersDisplayStruct,
  TableState,
  StickyTableComponent,
} from '../../../../../shared';
import { BreadcrumbProps, TabProps } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import {
  EmailTemplateApprovalQuery,
  EmailTemplateApproval,
} from '../../../../approval/email-template/domain/email-approval.model';
import { mapEmailTemplateApprovalQueryDomainToApi } from '../../../../approval/email-template/mappers/email-template-approval.mapper';
import { EmailTemplateApprovalService } from '../../../../approval/email-template/api/services/email-template-approval.service';
import { EmailRequestedFilter } from '../../../../approval/email-template/components/email-requested-filter/email-requested-filter';
import {
  EMAIL_TEMPL_REQUESTED_TABLE_QUERY_INIT,
  EMAIL_TEMPL_REQUESTED_LIST_DISPLAY_INIT,
} from '../../../../approval/email-template/data';
import { CapitalizePipe } from '../../../../../shared';
import {
  emailTemplateRequestedListBreadcrumb,
  emailTemplateRequestedListColumns,
} from '../../data';
import { RuleService } from '../../../../rule-management/rule/api/services/rule.service';
import {
  mapDropdownEmailTemplateApiToDomain,
  mapDropdownProductGroupApiToDomain,
  mapDropdownTemplateTypeApiToDomain,
} from '../../../../approval/rule/mappers/rule-approval.mapper';
import {
  DropdownEmailTemplate,
  DropdownProductGroup,
  DropdownTemplateType,
} from '../../../../approval/rule/domain/models/rule-approval.model';

@Component({
  selector: 'app-email-template-requested-list',
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
    NgbModule,

    EmailRequestedFilter,
    CapitalizePipe,
    RouterLink,
    StickyTableComponent,
  ],
  providers: [DatePipe],
})
export class EmailTemplateRequestedListComponent implements OnInit {
  breadcrumb: BreadcrumbProps[] = emailTemplateRequestedListBreadcrumb;

  currentUrl: string = '';

  pageTitle: string = 'Email Template';

  columns: ColumnDef<EmailTemplateApproval>[] =
    emailTemplateRequestedListColumns;

  pageQuery: TableState<EmailTemplateApprovalQuery> = {
    ...EMAIL_TEMPL_REQUESTED_TABLE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: EmailTemplateApproval[] = [];

  columnsPinned: string[] = ['no', 'templateId', 'templateType'];

  filterDisplay = signal<FiltersDisplayStruct[]>([
    ...EMAIL_TEMPL_REQUESTED_LIST_DISPLAY_INIT,
  ]);

  tabs: TabProps[] = genericTabsV1;

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
    private readonly ruleService: RuleService,
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

  initData() {
    this.getData({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'current') this.navigateTo('/home/data-master/email-template');
    if (tab === 'requested')
      this.navigateTo('/home/data-master/email-template/requested-list');
  }

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
      error: (e) => {
        if (e?.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
    });
  }

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

    this.initData();
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

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
