import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CapitalizePipe } from '../../../../../shared';
import { ToggleSwitch } from '../../../../../shared';
import { FraudTypeApprovalDetails } from '../../domain/models/fraud-type-approval.model';
import { FRAUD_TYPE_APPROVAL_DETAILS_DEFAULT } from '../../data';

@Component({
  selector: 'app-edit-fraud-type-approval',
  templateUrl: './edit-fraud-type-approval.html',
  styleUrls: [
    './edit-fraud-type-approval.scss',
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
export class EditFraudTypeApproval {
  @Input() details: FraudTypeApprovalDetails =
    FRAUD_TYPE_APPROVAL_DETAILS_DEFAULT;

  @Input() prevDetails: FraudTypeApprovalDetails =
    FRAUD_TYPE_APPROVAL_DETAILS_DEFAULT;

  @Input() pageType: string = '';

  @Input() back!: () => void;

  @Input() reject!: () => void;

  @Input() approve!: () => void;

  isDisabled = true;
}
