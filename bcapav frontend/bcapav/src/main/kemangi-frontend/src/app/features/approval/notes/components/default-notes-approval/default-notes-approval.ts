import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToggleSwitch } from '../../../../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { NoteApprovalDetails } from '../../domain/models/notes-approval.model';
import { NOTE_APPROVAL_DETAILS_DEFAULT } from '../../data';

@Component({
  selector: 'app-default-notes-approval',
  templateUrl: './default-notes-approval.html',
  styleUrls: [
    './default-notes-approval.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, NgbModule, ToggleSwitch],
  providers: [DatePipe],
})
export class DefaultNotesApproval {
  @Input() details: NoteApprovalDetails = NOTE_APPROVAL_DETAILS_DEFAULT;

  @Input() pageType: string = '';

  @Input() back!: () => void;

  @Input() reject!: () => void;

  @Input() approve!: () => void;

  isDisabled = true;
}
