import { Component, Input, input } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ToggleSwitch } from '../../../../../shared';
import {
  DropdownRuleFunction,
  DropdownRuleOperator,
  DropdownHistorical,
  RuleApprovalDetails,
} from '../../domain/models/rule-approval.model';
import { RULE_APPROVAL_DETAILS_INIT } from '../../data';
import { CapitalizePipe } from '../../../../../shared';
import {
  DropdownEmailTemplate,
  DropdownDataGroup,
} from './../../domain/models/rule-approval.model';
import { SubruleDetails } from '../../../../rule-management/rule/components/subrule-details/subrule-details';

@Component({
  selector: 'app-rule-appr-details-type-i',
  templateUrl: './rule-appr-details-type-i.html',
  styleUrls: [
    './rule-appr-details-type-i.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    CapitalizePipe,
    ToggleSwitch,
    SubruleDetails,
  ],
  providers: [DatePipe],
})
export class RuleApprDetailsTypeI {
  @Input() type: 'requested' | 'task' = 'requested';
  @Input() taskLevel: '1' | '2' = '1';
  @Input() dropdownRuleOperator: DropdownRuleOperator[] = [];
  @Input() dropdownRuleFunction: DropdownRuleFunction[] = [];
  @Input() dropdownEmailTemplate: DropdownEmailTemplate[] = [];
  @Input() dropdownDataGroup: DropdownDataGroup[] = [];
  @Input() dropdownHistorical: DropdownHistorical[] = [];
  @Input() ref: string = '';

  @Input() data: RuleApprovalDetails = { ...RULE_APPROVAL_DETAILS_INIT };
  @Input() prevData: RuleApprovalDetails = { ...RULE_APPROVAL_DETAILS_INIT };

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  handleDownload(url: string, extension: string) {
    if (extension === '.pdf') {
      this.http
        .get(url, {
          responseType: 'blob',
        })
        .subscribe((res) => {
          const blob = new Blob([res], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
          return;
        });

      return;
    }

    if (extension === '.txt') {
      this.http
        .get(url, {
          responseType: 'blob',
        })
        .subscribe((res) => {
          const blob = new Blob([res], { type: 'application/txt' });
          const fileURL = URL.createObjectURL(blob);
          const fileName = new URL(url).pathname.split('/').pop();

          const link = document.createElement('a');
          link.href = fileURL;

          link.download = fileName ?? '';

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(fileURL);
        });

      return;
    }

    const scriptUrl = this.router.serializeUrl(
      this.router.createUrlTree(['/preview-excel'], {
        queryParams: {
          ref: url,
        },
      }),
    );

    const finalUrl = scriptUrl.includes('#') ? scriptUrl : '/#' + scriptUrl;

    window.open(window.location.origin + finalUrl, '_blank');
  }
}
