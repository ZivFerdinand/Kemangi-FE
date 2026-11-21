import { Component, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import {
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { ColumnDef } from '@tanstack/table-core';

import { NotesService } from '../api';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import { NoteParams } from '../domain/models/note.model';

import {
  ContentLayout,
  CustomTabComponent,
  genericTabsV1,
  StickyTableComponent,
} from '../../../../shared';
import { BreadcrumbProps, TabProps, TableState } from '../../../../shared';
import { noteListColumns, notesListBreadcrumb } from '../data';
import { NOTE_LIST_DEFAULT } from '../data';
import { Note } from '../domain/models/note.model';
import { ToastService } from '../../../../core/services/toast.service';
import { SharedDataService } from '../../../../core/services/shared-data.service';
import { PAGE_INFO_INIT } from '../../../../shared';
import { mapNoteParamsDomainToApi } from '../mappers/note.mapper';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: [
    './notes-list.component.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    NgbPaginationModule,
    NgbTooltipModule,
    RouterLink,
    StickyTableComponent,
    ContentLayout,
    CustomTabComponent,
  ],
  providers: [DatePipe],
})
export class NotesListComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = notesListBreadcrumb;

  pageTitle: string = 'Notes';

  tabs: TabProps[] = genericTabsV1;

  activeTab: string = 'current';

  columns: ColumnDef<Note>[] = noteListColumns;

  pageQuery: TableState<NoteParams> = {
    ...NOTE_LIST_DEFAULT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  tableData: Note[] = [];

  columnsPinned: string[] = ['no', 'note', 'description'];

  editPermission: boolean = false;
  createPermission: boolean = false;
  deletePermission: boolean = false;

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly notesService: NotesService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    private sharedData: SharedDataService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.initData();
    this.handlePermission();
  }

  initData() {
    this.getNoteList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handlePermission() {
    this.createPermission = this.checkMenu('create');
    this.deletePermission = this.checkMenu('delete');
    this.editPermission = this.checkMenu('edit');
  }

  checkCreatePermission = computed(() =>
    this.sharedData.checkMenu('MASTER-NOTES-CREATE'),
  );

  checkEditPermission = computed(() =>
    this.sharedData.checkMenu('MASTER-NOTES-UPDATE'),
  );

  checkDeletePermission = computed(() =>
    this.sharedData.checkMenu('MASTER-NOTES-DELETE'),
  );

  checkMenu = (value: string): boolean => {
    if (value === 'create') {
      return this.checkCreatePermission();
    } else if (value === 'edit') {
      return this.checkEditPermission();
    } else {
      return this.checkDeletePermission();
    }
  };

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'current') this.navigateTo('/home/data-master/notes/');
    if (tab === 'requested')
      this.navigateTo('/home/data-master/notes/requested-list');
  }

  getNoteList(param: NoteParams) {
    this.ngxLoader.start();

    this.notesService
      .noteList(mapNoteParamsDomainToApi(param))
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

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageQuery = {
      ...this.pageQuery,
      sort: param === 'lastUpdatedDt' ? 'lastRequestDt' : param,
      sortDir: order,
    };
    this.getNoteList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };
    this.getNoteList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  handleQuery() {
    this.pageQuery = { ...this.pageQuery, page: 1 };
    this.getNoteList({
      ...this.pageQuery,
      page: this.pageQuery.page - 1,
    });
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
