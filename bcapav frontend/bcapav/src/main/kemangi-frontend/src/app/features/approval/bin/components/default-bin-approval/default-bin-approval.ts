import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToggleSwitch } from '../../../../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { BinApprovalDetails } from '../../domain/models/bin-approval.model';
import { BIN_APPROVAL_DETAILS_INIT } from '../../data';

@Component({
  selector: 'app-default-bin-approval',
  templateUrl: './default-bin-approval.html',
  styleUrls: [
    './default-bin-approval.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, NgbModule, ToggleSwitch],
  providers: [DatePipe],
})
export class DefaultBinApproval {
  @Input() details: BinApprovalDetails = { ...BIN_APPROVAL_DETAILS_INIT };

  @Input() pageType: string = '';

  @Input() back!: () => void;

  @Input() reject!: () => void;

  @Input() approve!: () => void;

  isDisabled = true;
}
