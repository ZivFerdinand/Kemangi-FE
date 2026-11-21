import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import {
  DefaultNotesViewApproval,
  EditNotesViewApproval,
} from '../../../../approval/notes/components';
import { BreadcrumbProps } from '../../../../../shared/interfaces';
import { ContentLayout } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { NotesApprovalService } from '../../../../approval/notes/api/services/note-approval.service';
import { detailNotesRequestedBreadcrumb } from '../../data';
import { mapNoteApprovalDetailsApiToDomain } from '../../../../approval/notes/mappers/notes-approval.mapper';
import { NoteApprovalDetails } from '../../../../approval/notes/domain/models/notes-approval.model';
import { NOTE_APPROVAL_DETAILS_DEFAULT } from '../../../../approval/notes/data';

@Component({
  selector: 'app-notes-detail-requested',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    ContentLayout,
    DefaultNotesViewApproval,
    EditNotesViewApproval,
  ],
})
export class NotesDetailRequestedComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  details = signal<NoteApprovalDetails>({ ...NOTE_APPROVAL_DETAILS_DEFAULT });

  prevDetails = signal<NoteApprovalDetails>({
    ...NOTE_APPROVAL_DETAILS_DEFAULT,
  });

  isDisabled: boolean = true;
  apprId: string | null = '';
  prevApprId: string | null = '';
  actionType: string | null = '';
  pageType: string = 'requested list';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly notesApprovalService: NotesApprovalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.apprId = params.get('id');

      this.getNoteApprovalDetails();
    });
  }

  initPageMode(action: string) {
    if (action === 'CREATE') {
      this.pageTitle = 'New Notes Approval';
      this.breadcrumb = [
        ...detailNotesRequestedBreadcrumb,
        { label: 'New Notes Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit Notes Approval';
      this.breadcrumb = [
        ...detailNotesRequestedBreadcrumb,
        { label: 'Edit Notes Approval', url: '' },
      ];
    } else {
      this.pageTitle = 'Delete Notes Approval';
      this.breadcrumb = [
        ...detailNotesRequestedBreadcrumb,
        { label: 'Delete Notes Approval', url: '' },
      ];
    }
  }

  getNoteApprovalDetails() {
    this.ngxLoader.start();
    this.notesApprovalService
      .noteApprovalDetails(Number(this.apprId))
      .subscribe({
        next: (res: any) => {
          this.details.set(mapNoteApprovalDetailsApiToDomain(res['data']));
          this.prevApprId = res['data']['last_appr_id'] ?? '';
          this.actionType = res['data']['request_type'];
          this.initPageMode(this.actionType ?? '');
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e?.status !== 400) {
            this.toast.error('Something went wrong while loading data');
          }
        },
        complete: () => {
          if (this.prevApprId) {
            this.getPrevNoteApprovalDetails();
            return;
          }

          this.ngxLoader.stop();
        },
      });
  }

  getPrevNoteApprovalDetails() {
    this.notesApprovalService
      .noteApprovalDetails(Number(this.prevApprId))
      .subscribe({
        next: (res: any) => {
          this.prevDetails.set(mapNoteApprovalDetailsApiToDomain(res['data']));
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e?.status !== 400) {
            this.toast.error('Something went wrong while loading data');
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
  }

  back() {
    this.router.navigate(['/home/data-master/notes/requested-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
