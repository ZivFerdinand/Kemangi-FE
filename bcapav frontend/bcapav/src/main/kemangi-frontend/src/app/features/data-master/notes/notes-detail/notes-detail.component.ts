import { Component, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NoteDetails } from '../domain/models/note.model';
import { ToggleSwitch } from '../../../../shared';
import { FailedModalService } from '../../../../core/services/failed-modal.service';
import { NotesService } from '../api/services/notes.service';
import { ContentLayout } from '../../../../shared';
import { detailNotesBreadcrumb } from '../data';
import { BreadcrumbProps } from '../../../../shared';
import { ToastService } from '../../../../core/services/toast.service';
import { NOTE_DETAILS_DEFAULT } from '../data';
import { mapNoteDetailApiToDomain } from '../mappers/note.mapper';

@Component({
  selector: 'app-notes-detail',
  templateUrl: './notes-detail.component.html',
  styleUrls: [
    './notes-detail.component.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    ToggleSwitch,
    ContentLayout,
  ],
  providers: [DatePipe],
})
export class NotesDetailComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = detailNotesBreadcrumb;

  pageTitle: string = 'View Notes';

  details = signal<NoteDetails>(NOTE_DETAILS_DEFAULT);

  noteId: string = '';

  isDisabled: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly notesService: NotesService,
    public failedDialogService: FailedModalService,
    private readonly toast: ToastService
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.noteId = params.get('id') ?? '';
      if (this.noteId || this.noteId !== '') {
        this.initData();
      }
    });
  }

  initData() {
    this.getNoteDetails(this.noteId);
  }

  getNoteDetails(id: string) {
    this.ngxLoader.start();

    this.notesService.noteDetails(id).subscribe({
      next: (res: any) => {
        this.details.set(mapNoteDetailApiToDomain(res['data']));
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

  back() {
    this.router.navigate(['/home/data-master/notes']);
  }
}
