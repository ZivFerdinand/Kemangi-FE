import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { ToggleSwitch } from '../../../../shared';
import { NotesService } from '../api';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../core/services/failed-modal.service';
import { ReasonModalService } from '../../../../core/services/reason-modal.service';

//import { User } from '../../../../core/models/user';
import { BreadcrumbProps } from '../../../../shared';
import { ToastService } from '../../../../core/services/toast.service';
import { deleteNotesBreadcrumb } from '../data';
import { ContentLayout } from '../../../../shared';

@Component({
  selector: 'app-notes-delete',
  templateUrl: './notes-delete.component.html',
  styleUrls: [
    './notes-delete.component.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    ToggleSwitch,
    ContentLayout,
  ],
})
export class NotesDeleteComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = deleteNotesBreadcrumb;

  pageTitle: string = 'Delete Notes';

  initialFormValue: any;

  notesForm: FormGroup;

  noteId: string = '';

  private destroy$ = new Subject<void>();

  @ViewChild('autoDescTA') autoDescTA!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private fb: FormBuilder,
    private readonly notesService: NotesService,
    public confirmationDialogService: ConfirmationModalService,
    public failedDialogService: FailedModalService,
    public reasonDialogService: ReasonModalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;

    this.notesForm = this.fb.group({
      id: [''],
      activeStatus: [true],
      note: [''],
      description: [''],
    });
  }

  ngOnInit(): void {
    //this.initProfileUser();
    this.handleRouteParams();
  }

  // private initProfileUser(): void {
  //   const encoded = localStorage.getItem(btoa('profileUser'));
  //   if (!encoded) return;

  //   try {
  //     const user: User = JSON.parse(atob(encoded));
  //     this.notesForm.get('groupId')?.patchValue(user.groupId);
  //   } catch {
  //     // ignore invalid storage
  //   }
  // }

  private handleRouteParams(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (!id) return;

      this.noteId = id;
      this.getNoteDetails(this.noteId);
      this.notesForm?.get('id')?.setValue(this.noteId);
      this.disableFields();
    });
  }

  private disableFields(): void {
    ['note', 'description'].forEach((key) =>
      this.notesForm.get(key)?.disable(),
    );
  }

  getNoteDetails(id: string) {
    this.ngxLoader.start();
    this.notesService.noteDetails(id).subscribe({
      next: (res: any) => {
        const { note, description, active_status } = res['data'];

        this.notesForm.patchValue({
          activeStatus: active_status,
          note: note,
          description: description,
        });

        this.initialFormValue = this.notesForm.getRawValue();

        setTimeout(() => {
          this.autogrow(this.autoDescTA.nativeElement);
        }, 100);
      },
      error: (e) => {
        this.ngxLoader.stop();
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => this.ngxLoader.stop(),
    });
  }

  deleteNote() {
    this.ngxLoader.start();

    this.notesService.deleteNote(Number(this.noteId)).subscribe({
      next: () => {
        this.toast.success('Delete Notes request has been submitted');

        this.router.navigate(['/home/data-master/notes']);
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Delete Notes request has been failed');
        }

        this.ngxLoader.stop();
      },
      complete: () => {
        this.ngxLoader.stop();
      },
    });
  }

  handleDeleteImmediately() {
    const raw = this.notesForm.getRawValue();
    if (raw.activeStatus) {
      setTimeout(() => {
        this.failedDialogService.failed(
          '',
          '400',
          'Sorry! Notes is active. Please change the status to Inactive before submitting.',
        );
      }, 700);
      return;
    }

    this.deleteNote();
  }

  handleDeleteConfirmation() {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to submit?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.deleteNote();
        }
      });
  }

  getChangedValues(original: any, current: any): any {
    const changes: any = {};
    for (const key in current) {
      if (typeof current[key] === 'object' && current[key] !== null) {
        const nested = this.getChangedValues(original[key] || {}, current[key]);
        if (Object.keys(nested).length > 0) {
          changes[key] = nested;
        }
      } else if (current[key] !== original[key]) {
        changes[key] = { from: original[key], to: current[key] };
      }
    }
    return changes;
  }

  back() {
    const currentValue = this.notesForm.getRawValue();
    const changed = this.getChangedValues(this.initialFormValue, currentValue);

    if (Object.keys(changed).length === 0) {
      this.router.navigate(['/home/data-master/notes']);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            this.router.navigate(['/home/data-master/notes']);
          }
        });
    }
  }

  get f() {
    return this.notesForm.controls;
  }

  autogrow(textarea: HTMLTextAreaElement) {
    const minHeight = 48;
    const maxHeight = 136;

    textarea.style.height = 'auto';
    let newHeight = textarea.scrollHeight;

    if (newHeight < minHeight) {
      newHeight = minHeight;
    } else if (newHeight > maxHeight) {
      newHeight = maxHeight;
    }

    textarea.style.height = newHeight + 'px';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
