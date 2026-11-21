import { Component, input, signal, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { subRuleTableParamColumns } from '../../../../approval/rule/data';
import {
  RULE_APPROVAL_DETAILS_INIT,
  SUB_RULE_APPROVAL_INIT,
} from '../../../../approval/rule/data';
import { RuleApprovalDetails } from './../../../../approval/rule/domain/models/rule-approval.model';
import { SubRule } from '../../domain/rule.model';
import {
  ToggleSwitch,
  TabProps,
  PAGE_INFO_INIT,
  CapitalizePipe,
} from '../../../../../shared';
import {
  DropdownRuleOperator,
  DropdownRuleFunction,
  DropdownEmailTemplate,
  DropdownDataGroup,
  DropdownHistorical,
} from './../../../../approval/rule/domain/models/rule-approval.model';
import { SubruleDetails } from '../subrule-details/subrule-details';

@Component({
  selector: 'app-rule-details-type-b',
  templateUrl: './rule-details-type-b.html',
  styleUrls: [
    './rule-details-type-b.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToggleSwitch,
    CapitalizePipe,
    SubruleDetails,
  ],
  providers: [DatePipe],
})
export class RuleDetailsTypeB {
  @Input() dropdownRuleOperator: DropdownRuleOperator[] = [];
  @Input() dropdownRuleFunction: DropdownRuleFunction[] = [];
  @Input() dropdownEmailTemplate: DropdownEmailTemplate[] = [];
  @Input() dropdownDataGroup: DropdownDataGroup[] = [];
  @Input() dropdownHistorical: DropdownHistorical[] = [];

  data = input<RuleApprovalDetails>({ ...RULE_APPROVAL_DETAILS_INIT });
  localData: RuleApprovalDetails = { ...RULE_APPROVAL_DETAILS_INIT };

  subRule = signal<SubRule>({ ...SUB_RULE_APPROVAL_INIT });
  subRuleTabs: TabProps[] = [];
  subRuleActiveTab = '';

  subRuleTableParamPageQuery = { limit: 1, page: 0 };
  subRuleTableParamColumns = subRuleTableParamColumns;
  subRuleTableParamPageInfo = { ...PAGE_INFO_INIT };
  subRuleTableData: any[] = [];

  subruleCounter = 1;

  constructor(
    private http: HttpClient,
    private router: Router,
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
