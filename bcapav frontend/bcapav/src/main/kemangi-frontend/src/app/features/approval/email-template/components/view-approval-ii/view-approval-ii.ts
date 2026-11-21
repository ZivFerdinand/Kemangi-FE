import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

import { EmailTemplateApprovalDetails } from '../../domain/email-approval.model';

import { EMAIL_TEMPL_APPROVAL_DETAILS_INIT } from '../../data/init';
import { CapitalizePipe } from '../../../../../shared';
import { ToggleSwitch } from '../../../../../shared';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { highlightHtmlDiff } from '../../utils/html-diff.util';

@Component({
  selector: 'app-email-template-view-approval-ii',
  templateUrl: './view-approval-ii.html',
  styleUrls: [
    './view-approval-ii.scss',
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
export class EmailTemplateViewApprovalII {
  private _details = EMAIL_TEMPL_APPROVAL_DETAILS_INIT;
  private _prevDetails = EMAIL_TEMPL_APPROVAL_DETAILS_INIT;

  highlighted!: SafeHtml;

  nonHighlighted!: SafeHtml;

  isDisabled = true;

  constructor(private sanitizer: DomSanitizer) {}

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
    this.updateHighlight();
    this.updateNonHighlight();
  }

  get prevDetails() {
    return this._prevDetails;
  }

  private updateHighlight(): void {
    if (!this._details?.emailBody || !this._prevDetails?.emailBody) {
      this.highlighted = '';
      return;
    }

    const raw = highlightHtmlDiff(
      this._prevDetails.emailBody,
      this._details.emailBody,
    );

    this.highlighted = this.sanitizer.bypassSecurityTrustHtml(raw);
  }

  private updateNonHighlight(): void {
    if (!this._prevDetails?.emailBody) {
      this.highlighted = '';
      return;
    }

    this.nonHighlighted = this.sanitizer.bypassSecurityTrustHtml(
      this._prevDetails.emailBody,
    );
  }

  isEqualArray(arr1: any, arr2: any) {
    const isEqual =
      arr1.length === arr2.length &&
      arr1.every((val: any, index: any) => val === arr2[index]);

    return isEqual;
  }
}
