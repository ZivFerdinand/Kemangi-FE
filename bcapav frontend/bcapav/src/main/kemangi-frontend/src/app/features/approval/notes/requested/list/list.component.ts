import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { ColumnDef } from '@tanstack/table-core';

import {
  requestType,
  approvalStatus,
  approvalTabs,
  PAGE_INFO_INIT,
} from '../../../../../shared/data';
import { BreadcrumbProps, TabProps } from '../../../../../shared/interfaces';
import {
  CustomTabComponent,
  ContentLayout,
  CapitalizePipe,
  TableState,
  StickyTableComponent,
} from '../../../../../shared';
import { SharedDataService } from '../../../../../core/services/shared-data.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { NotesApprovalService } from '../../api/services/note-approval.service';
import { FiltersDisplayStruct } from '../../../../../shared';
import {
  NotesApprovalQuery,
  NoteApproval,
} from '../../domain/models/notes-approval.model';
import { mapNotesApprovalQueryDomainToApi } from '../../mappers/notes-approval.mapper';
import {
  NOTE_APPROVAL_LIST_DISPLAY_STRUCT,
  NOTES_REQUESTED_LIST_PAGE_QUERY_INIT,
  notesApprovalRequestedListBreadcrumb,
  noteApprRequestedListColumns,
} from '../../data';
import { NotesRequestedFilter } from '../../components/notes-requested-filter/notes-requested-filter';

@Component({
  selector: 'app-notes-requested-list',
  templateUrl: './list.component.html',
  styleUrls: [
    './list.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    RouterLink,
    NgSelectModule,
    CustomTabComponent,
    StickyTableComponent,
    ContentLayout,
    FormsModule,
    CapitalizePipe,
    NotesRequestedFilter,
  ],
  providers: [DatePipe],
})
export class NotesApprovalRequestedListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = notesApprovalRequestedListBreadcrumb;

  pageTitle: string = 'Notes Approval';

  tabs: TabProps[] = approvalTabs;

  activeTab: string = 'requested';

  columns: ColumnDef<NoteApproval>[] = noteApprRequestedListColumns;

  pageQuery: TableState<NotesApprovalQuery> = {
    ...NOTES_REQUESTED_LIST_PAGE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: NoteApproval[] = [];

  columnsPinned: string[] = ['no', 'note', 'description'];

  users: any[] = [];

  showFilter: boolean = false;

  submitFilter: boolean = false;

  requestType = requestType;

  approvalStatus = approvalStatus;

  filterDisplay = signal<FiltersDisplayStruct[]>([
    ...NOTE_APPROVAL_LIST_DISPLAY_STRUCT,
  ]);

  visibleFilterInfo = computed(() => {
    return this.filterDisplay().filter(
      (item) =>
        item.value !== null && item.value !== '' && item.value !== undefined,
    );
  });

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly notesApprovalService: NotesApprovalService,
    private readonly toast: ToastService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.getNoteApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });

    this.getUserList();
  }

  menuTask = computed(() => this.sharedData.checkMenu('APPROVAL-NOTES-TASK'));

  menuRequested = computed(() =>
    this.sharedData.checkMenu('APPROVAL-NOTES-REQUESTED'),
  );

  checkMenu = (value: string): boolean => {
    return value === 'task' ? this.menuTask() : this.menuRequested();
  };

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'task') this.navigateTo('/home/approval/notes/task-list');
    if (tab === 'requested')
      this.navigateTo('/home/approval/notes/requested-list');
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageQuery = { ...this.pageQuery, sort: param, sortDir: order };
    this.getNoteApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };
    this.getNoteApprovalList({ ...this.pageQuery, page: e - 1 });
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  handleFilter(data: any) {
    this.submitFilter = true;
    this.showFilter = false;
    this.pageQuery = { ...this.pageQuery, ...data?.filterBy };

    const temp = { ...data.filterDisplayTemp };

    const dateRange = (from?: string | null, to?: string | null) =>
      `${from ?? ''}${to ? ' - ' + to : ''}`;

    const labelValueMap: Record<string, any> = {
      Notes: temp.note,
      Description: temp.description,
      'Requested By': temp.requestedBy,
      'Requested Date': dateRange(temp.requestDateFrom, temp.requestDateTo),
      'Reviewed By': temp.approvedBy,
      'Reviewed Date': dateRange(temp.approvalDateFrom, temp.approvalDateTo),
      'Action Type': temp.requestType,
      'Approval Status': temp.approvalStatus,
    };

    const mappingData = this.filterDisplay().map((item) => ({
      ...item,
      value:
        item.label in labelValueMap ? labelValueMap[item.label] : item.value,
    }));

    this.filterDisplay.set(mappingData);

    this.getNoteApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  resetFilter() {
    this.showFilter = false;
    this.submitFilter = false;

    this.filterDisplay.set([...NOTE_APPROVAL_LIST_DISPLAY_STRUCT]);

    this.pageQuery = { ...NOTES_REQUESTED_LIST_PAGE_QUERY_INIT };

    this.getNoteApprovalList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  getNoteApprovalList(param: any) {
    this.ngxLoader.start();
    this.notesApprovalService
      .noteApprovalList(mapNotesApprovalQueryDomainToApi(param))
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
    this.notesApprovalService.getUserList().subscribe({
      next: (res: any) => {
        this.users = res['data'];
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
