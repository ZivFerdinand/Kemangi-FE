import { Component, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { ColumnDef } from '@tanstack/table-core';

import { ToastService } from '../../../../../core/services/toast.service';
import {
  CustomTabComponent,
  ContentLayout,
  BreadcrumbProps,
  TabProps,
  StickyTableComponent,
} from '../../../../../shared';
import { approvalTabs, TableState } from '../../../../../shared';
import {
  noteApprTaskListColumns,
  notesApprovalTaskListBreadcrumb,
} from '../../data';
import { NOTES_TASK_LIST_PAGE_QUERY_INIT } from '../../data';
import { PAGE_INFO_INIT } from '../../../../../shared';
import { NotesApprovalService } from '../../api/services/note-approval.service';
import {
  NotesApprovalQuery,
  NoteApproval,
} from '../../domain/models/notes-approval.model';
import { mapNotesApprovalQueryDomainToApi } from '../../mappers/notes-approval.mapper';
import { SharedDataService } from '../../../../../core/services/shared-data.service';
@Component({
  selector: 'app-notes-task-list',
  templateUrl: './list.component.html',
  styleUrls: ['../../../../../shared/styles/index.scss'],
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
    StickyTableComponent,
    ContentLayout,
  ],
  providers: [DatePipe],
})
export class NotesApprovalTaskListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = notesApprovalTaskListBreadcrumb;

  pageTitle: string = 'Notes Approval';

  tabs: TabProps[] = approvalTabs;

  activeTab: string = 'task';

  columns: ColumnDef<NoteApproval>[] = noteApprTaskListColumns;

  pageQuery: TableState<NotesApprovalQuery> = {
    ...NOTES_TASK_LIST_PAGE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: NoteApproval[] = [];

  columnsPinned: string[] = ['no', 'note', 'description'];

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

  getNoteApprovalList(param: NotesApprovalQuery) {
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

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
