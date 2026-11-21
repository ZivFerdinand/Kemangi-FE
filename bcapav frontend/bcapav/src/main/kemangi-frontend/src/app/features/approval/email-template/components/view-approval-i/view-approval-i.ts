import {
  Component,
  EventEmitter,
  input,
  Output,
  signal,
  ViewChild,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { NgbPaginationModule, NgbDate } from '@ng-bootstrap/ng-bootstrap';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

import { EmailTemplateApprovalDetails } from '../../domain/email-approval.model';

import { EMAIL_TEMPL_APPROVAL_DETAILS_INIT } from './../../data/init';
import { CapitalizePipe } from '../../../../../shared';
import { ToggleSwitch } from '../../../../../shared';

@Component({
  selector: 'app-email-template-view-approval-i',
  templateUrl: './view-approval-i.html',
  styleUrls: [
    './view-approval-i.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    NgbPaginationModule,
    CapitalizePipe,
    ToggleSwitch,
  ],
  providers: [DatePipe],
})
export class EmailTemplateViewApprovalI {
  private _details = EMAIL_TEMPL_APPROVAL_DETAILS_INIT;
  private _prevDetails = EMAIL_TEMPL_APPROVAL_DETAILS_INIT;

  isDisabled = true;

  @Input() pageType = '';

  @Input()
  set details(value: EmailTemplateApprovalDetails) {
    this._details = value;
  }

  get details() {
    return this._details;
  }

  @Input()
  set prevDetails(value: EmailTemplateApprovalDetails) {
    this._prevDetails = value;
  }

  get prevDetails() {
    return this._prevDetails;
  }
}
