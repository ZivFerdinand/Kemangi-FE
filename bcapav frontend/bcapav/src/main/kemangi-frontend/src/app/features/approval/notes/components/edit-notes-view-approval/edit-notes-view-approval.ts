import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CapitalizePipe } from '../../../../../shared';
import { ToggleSwitch } from '../../../../../shared';
import { NoteApprovalDetails } from '../../domain/models/notes-approval.model';
import { NOTE_APPROVAL_DETAILS_DEFAULT } from '../../data';

@Component({
  selector: 'app-edit-notes-view-approval',
  templateUrl: './edit-notes-view-approval.html',
  styleUrls: [
    './edit-notes-view-approval.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    ToggleSwitch,
    CapitalizePipe,
  ],
  providers: [DatePipe],
})
export class EditNotesViewApproval {
  @Input() details: NoteApprovalDetails = NOTE_APPROVAL_DETAILS_DEFAULT;

  @Input() prevDetails: NoteApprovalDetails = NOTE_APPROVAL_DETAILS_DEFAULT;

  @Input() back!: () => void;

  isDisabled = true;
}
