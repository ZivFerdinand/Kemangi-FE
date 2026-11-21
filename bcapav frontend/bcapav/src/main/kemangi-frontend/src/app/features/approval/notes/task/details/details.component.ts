import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DefaultNotesApproval } from '../../components';

import { ReasonModalService } from '../../../../../core/services/reason-modal.service';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Input } from '@angular/core';
import { BreadcrumbProps } from '../../../../../shared/interfaces';
import { ContentLayout } from '../../../../../shared';

import { ToastService } from '../../../../../core/services/toast.service';

import { NotesApprovalService } from '../../api/services/note-approval.service';
import { notesApprovalTaskListBreadcrumb } from '../../data/breadcrumb';
import { mapNoteApprovalDetailsApiToDomain } from '../../mappers/notes-approval.mapper';
import { NoteApprovalDetails } from '../../domain/models/notes-approval.model';
import { NOTE_APPROVAL_DETAILS_DEFAULT } from '../../data';
import { EditNotesApproval } from '../../components';

@Component({
  selector: 'app-notes-approval-task-view',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ContentLayout,
    DefaultNotesApproval,
    EditNotesApproval,
  ],
})
export class NotesApprovalTaskListViewComponent implements OnInit, OnDestroy {
  @Input() formGroup!: FormGroup;
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  details = signal<NoteApprovalDetails>(NOTE_APPROVAL_DETAILS_DEFAULT);

  prevDetails = signal<NoteApprovalDetails>(NOTE_APPROVAL_DETAILS_DEFAULT);

  isDisabled: boolean = true;
  apprId: string | null = '';
  prevApprId: string | null = '';
  actionType: string | null = '';
  approvalForm: FormGroup;
  pageType: string = 'task list';

  private destroy$ = new Subject<void>();

  reasonErrorMessages = {
    note: {
      required: () => 'Rejection notes is required',
      minlength: (e: any) => `${e.requiredLength} characters required`,
      maxlength: (e: any) => `Max ${e.requiredLength} characters allowed`,
    },
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly notesApprovalService: NotesApprovalService,
    private reasonDialogService: ReasonModalService,
    private confirmationDialogService: ConfirmationModalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
    this.approvalForm = this.fb.group({
      appr_id: [0],
      approval_status: [''],
      note: [
        '',
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(10),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.apprId = params.get('id');
      this.approvalForm.patchValue({
        appr_id: this.apprId,
      });

      this.getNoteApprovalDetails();
    });
  }

  initPageMode(action: string) {
    if (action === 'CREATE') {
      this.pageTitle = 'New Notes Approval';
      this.breadcrumb = [
        ...notesApprovalTaskListBreadcrumb,
        { label: 'New Notes Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit Notes Approval';
      this.breadcrumb = [
        ...notesApprovalTaskListBreadcrumb,
        { label: 'Edit Notes Approval', url: '' },
      ];
    } else {
      this.pageTitle = 'Delete Notes Approval';
      this.breadcrumb = [
        ...notesApprovalTaskListBreadcrumb,
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
    this.router.navigate(['/home/approval/notes/task-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  approve() {
    this.approvalForm.patchValue({
      appr_id: this.apprId,
    });
    this.ngxLoader.start();
    this.notesApprovalService
      .approveNote(this.approvalForm.getRawValue())
      .subscribe({
        next: () => {
          this.toast.success('Notes request successfully approved');

          this.router.navigate(['/home/approval/notes/task-list']);
        },
        error: (e) => {
          this.ngxLoader.stop();

          if (e.status !== 400) {
            this.toast.error('Notes request failed to approve');
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
  }

  reject() {
    this.approvalForm.patchValue({
      appr_id: this.apprId,
    });
    this.ngxLoader.start();
    this.notesApprovalService
      .rejectNote(this.approvalForm.getRawValue())
      .subscribe({
        next: () => {
          this.toast.success('Notes request successfully rejected');

          this.router.navigate(['/home/approval/notes/task-list']);
        },
        error: (e: any) => {
          this.ngxLoader.stop();
          if (e.status !== 400) {
            this.toast.error('Notes request failed to reject');
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
  }

  handleApprove() {
    this.approvalForm.patchValue({
      approval_status: 'APPROVED',
    });

    this.approvalForm.get('note')?.clearValidators();
    this.approvalForm.get('note')?.updateValueAndValidity();

    this.confirmationDialogService
      .confirm('', 'Are you sure you want to approve this notes?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.approve();
        } else {
          this.approvalForm
            .get('note')
            ?.setValidators([Validators.required, Validators.maxLength(200)]);
          this.approvalForm.get('note')?.updateValueAndValidity();
        }
      });
  }

  handleReject() {
    this.approvalForm.patchValue({
      approval_status: 'REJECTED',
    });

    this.reasonDialogService
      .reason(
        'Are you sure you want to reject this notes?',
        'Yes',
        'No',
        'md',
        this.approvalForm,
        this.reasonErrorMessages,
      )
      .then((confirmed) => {
        if (confirmed) {
          this.reject();
        }
      });
  }
}
