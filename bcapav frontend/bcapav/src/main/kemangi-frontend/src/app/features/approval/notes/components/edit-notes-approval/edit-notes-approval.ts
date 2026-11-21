import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ToggleSwitch } from '../../../../../shared';
import { NoteApprovalDetails } from '../../domain/models/notes-approval.model';
import { NOTE_APPROVAL_DETAILS_DEFAULT } from '../../data';

@Component({
  selector: 'app-edit-notes-approval',
  templateUrl: './edit-notes-approval.html',
  styleUrls: [
    './edit-notes-approval.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, NgbModule, ToggleSwitch],
  providers: [DatePipe],
})
export class EditNotesApproval {
  @Input() details: NoteApprovalDetails = NOTE_APPROVAL_DETAILS_DEFAULT;

  @Input() prevDetails: NoteApprovalDetails = NOTE_APPROVAL_DETAILS_DEFAULT;

  @Input() pageType: string = '';

  @Input() back!: () => void;

  @Input() reject!: () => void;

  @Input() approve!: () => void;

  isDisabled = true;
}
