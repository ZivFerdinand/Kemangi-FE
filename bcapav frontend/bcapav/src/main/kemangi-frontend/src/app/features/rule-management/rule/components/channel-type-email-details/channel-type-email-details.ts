import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AUTO_ACTION_INIT } from '../../../../approval/rule/data';
import { EMAIL_TEMPLATE_DETAILS_INIT } from '../../../../data-master/email-template/data';
import {
  DropdownEmailTemplate,
  DropdownSubRuleParameter,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import { timeUnits } from '../../../../../shared';
import { EmailTemplateService } from '../../../../data-master/email-template/api';
import { EmailTemplateDetails } from '../../../../data-master/email-template/domain/models/email-template.model';
import { mapEmailTemplateDetailApiToDomain } from '../../../../data-master/email-template/mappers/email-template.mapper';
import { ToastService } from '../../../../../core/services/toast.service';
import { AutoAction } from '../../domain/rule.model';

@Component({
  selector: 'app-channel-type-email-details',
  templateUrl: './channel-type-email-details.html',
  styleUrls: [
    './channel-type-email-details.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  providers: [],
})
export class ChannelTypeEmailDetails implements OnChanges {
  @Input() dropdownEmailTemplate: DropdownEmailTemplate[] = [];
  @Input() dropdownParameter: DropdownSubRuleParameter[] = [];
  @Input() autoActionData: AutoAction = { ...AUTO_ACTION_INIT };

  timeUnits: any[] = timeUnits;

  templateContent: EmailTemplateDetails = { ...EMAIL_TEMPLATE_DETAILS_INIT };

  constructor(
    private emailTemplateService: EmailTemplateService,
    public toast: ToastService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('autoActionData' in changes) {
      const value = changes['autoActionData'].currentValue;

      if (value && value.templateId) {
        const findId = this.dropdownEmailTemplate.find(
          (x) => x.templateId === value.templateId,
        );

        if (findId) {
          this.getEmailTemplateDetail(Number(findId?.id));
        }
      }
    }
  }

  getEmailTemplateDetail(id: number) {
    this.emailTemplateService.emailTemplateDetails(id.toString()).subscribe({
      next: (res: any) => {
        this.templateContent = mapEmailTemplateDetailApiToDomain(res['data']);
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
    });
  }
}
