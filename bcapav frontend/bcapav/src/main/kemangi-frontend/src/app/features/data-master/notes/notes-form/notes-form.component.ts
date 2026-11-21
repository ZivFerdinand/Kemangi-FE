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
  Validators,
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
import { createNotesBreadcrumb, editNotesBreadcrumb } from '../data';
import { ContentLayout } from '../../../../shared';
import { mapNotePayloadDomainToApi } from '../mappers/note.mapper';
@Component({
  selector: 'app-notes-form',
  templateUrl: './notes-form.component.html',
  styleUrls: [
    './notes-form.component.scss',
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
export class NotesFormComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

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
      note: [
        '',
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(5),
          // Validators.pattern(/^[a-zA-Z0-9 ]*$/),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(5),
          // Validators.pattern(/^[a-zA-Z0-9 ]*$/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.initPageMode();
    //this.initProfileUser();
    this.handleRouteParams();
  }

  private initPageMode(): void {
    if (this.currentUrl.includes('create')) {
      this.breadcrumb = createNotesBreadcrumb;
      this.pageTitle = 'Create New Notes';
      this.initialFormValue = this.notesForm.getRawValue();
    } else {
      this.breadcrumb = editNotesBreadcrumb;
      this.pageTitle = 'Edit Notes';
    }
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
    });
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

  createNote() {
    this.ngxLoader.start();
    this.notesService
      .createNote(mapNotePayloadDomainToApi(this.notesForm.getRawValue()))
      .subscribe({
        next: () => {
          this.toast.success('Create Notes request has been submitted');

          this.router.navigate(['/home/data-master/notes']);
        },
        error: (e) => {
          if (e.status !== 400) {
            this.toast.error('Create Notes request has been failed');
          }

          this.ngxLoader.stop();
        },
        complete: () => {
          this.ngxLoader.stop();
        },
      });
  }

  editNote() {
    this.ngxLoader.start();

    const raw = this.notesForm.getRawValue();

    this.notesService.updateNote(mapNotePayloadDomainToApi(raw)).subscribe({
      next: () => {
        this.toast.success('Edit Notes request has been submitted');

        this.router.navigate(['/home/data-master/notes']);
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Edit Notes request has been failed');
        }

        this.ngxLoader.stop();
      },
      complete: () => {
        this.ngxLoader.stop();
      },
    });
  }

  onSubmit() {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to submit?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          if (this.noteId || this.noteId !== '') {
            this.editNote();
            return;
          }
          this.createNote();
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

  onKeyDown(event: KeyboardEvent, controlName: string) {
    let control;

    control = this.notesForm.get(controlName);

    const value = control?.value ?? '';
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];

    if (value.length >= 201 && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
