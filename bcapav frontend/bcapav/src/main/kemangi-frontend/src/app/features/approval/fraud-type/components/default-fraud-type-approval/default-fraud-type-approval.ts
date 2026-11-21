import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToggleSwitch } from '../../../../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FraudTypeApprovalDetails } from '../../domain/models/fraud-type-approval.model';
import { FRAUD_TYPE_APPROVAL_DETAILS_DEFAULT } from '../../data';

@Component({
  selector: 'app-default-fraud-type-approval',
  templateUrl: './default-fraud-type-approval.html',
  styleUrls: [
    './default-fraud-type-approval.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, NgbModule, ToggleSwitch],
  providers: [DatePipe],
})
export class DefaultFraudTypeApproval {
  @Input() details: FraudTypeApprovalDetails =
    FRAUD_TYPE_APPROVAL_DETAILS_DEFAULT;

  @Input() pageType: string = '';

  @Input() back!: () => void;

  @Input() reject!: () => void;

  @Input() approve!: () => void;

  isDisabled = true;
}
