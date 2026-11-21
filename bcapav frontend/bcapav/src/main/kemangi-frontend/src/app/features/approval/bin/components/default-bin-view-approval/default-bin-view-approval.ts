import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToggleSwitch } from '../../../../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { CapitalizePipe } from '../../../../../shared';
import { BinApprovalDetails } from '../../domain/models/bin-approval.model';
import { BIN_APPROVAL_DETAILS_INIT } from '../../data';

@Component({
  selector: 'app-default-bin-view-approval',
  templateUrl: './default-bin-view-approval.html',
  styleUrls: [
    './default-bin-view-approval.scss',
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
export class DefaultBinViewApproval {
  @Input() details: BinApprovalDetails = BIN_APPROVAL_DETAILS_INIT;

  @Input() back!: () => void;

  isDisabled = true;
}
