import { DropdownEmailTemplate } from '../../../../approval/rule/domain/models/rule-approval.model';
import { Component, Input } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ToggleSwitch } from '../../../../../shared';
import {
  DropdownRuleFunction,
  DropdownDataGroup,
  DropdownRuleOperator,
  DropdownHistorical,
} from '../../../../approval/rule/domain/models/rule-approval.model';

import { RuleDetails } from '../../domain/rule.model';
import { RULE_DETAILS_INIT } from '../../data';
import { SubruleDetails } from '../subrule-details/subrule-details';

@Component({
  selector: 'app-rule-details-type-a',
  templateUrl: './rule-details-type-a.html',
  styleUrls: [
    './rule-details-type-a.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, ToggleSwitch, SubruleDetails],
  providers: [DatePipe],
})
export class RuleDetailsTypeA {
  @Input() dropdownRuleOperator: DropdownRuleOperator[] = [];
  @Input() dropdownRuleFunction: DropdownRuleFunction[] = [];
  @Input() dropdownEmailTemplate: DropdownEmailTemplate[] = [];
  @Input() dropdownDataGroup: DropdownDataGroup[] = [];
  @Input() dropdownHistorical: DropdownHistorical[] = [];

  @Input() data: RuleDetails = { ...RULE_DETAILS_INIT };

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
