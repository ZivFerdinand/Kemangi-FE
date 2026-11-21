import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CapitalizePipe } from '../../../../../shared';
import { ToggleSwitch } from '../../../../../shared';
import { BinApprovalDetails } from '../../domain/models/bin-approval.model';
import { BIN_APPROVAL_DETAILS_INIT } from '../../data';

@Component({
  selector: 'app-edit-bin-approval',
  templateUrl: './edit-bin-approval.html',
  styleUrls: [
    './edit-bin-approval.scss',
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
export class EditBinApproval {
  @Input() details: BinApprovalDetails = BIN_APPROVAL_DETAILS_INIT;

  @Input() prevDetails: BinApprovalDetails = BIN_APPROVAL_DETAILS_INIT;

  @Input() pageType: string = '';

  @Input() back!: () => void;

  @Input() reject!: () => void;

  @Input() approve!: () => void;

  isDisabled = true;
}
