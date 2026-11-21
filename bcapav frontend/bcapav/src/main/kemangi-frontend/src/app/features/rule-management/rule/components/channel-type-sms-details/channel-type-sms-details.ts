import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutoActionForm } from '../../domain/rule.model';
import { AUTO_ACTION_FORM_INIT } from '../../../../approval/rule/data';
import { timeUnits } from '../../../../../shared';
import {
  DropdownSmsTemplate,
  DropdownSubRuleParameter,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import { AUTO_ACTION_SMS_DETAILS_INIT } from '../../data';

@Component({
  selector: 'app-channel-type-sms-details',
  templateUrl: './channel-type-sms-details.html',
  styleUrls: [
    './channel-type-sms-details.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  providers: [],
})
export class ChannelTypeSmsDetails implements OnChanges {
  @ViewChild('autoContent') autoContent!: ElementRef<HTMLTextAreaElement>;
  @Input() dropdownSmsTemplate: DropdownSmsTemplate[] = [];
  @Input() dropdownParameter: DropdownSubRuleParameter[] = [];
  @Input() autoActionData: AutoActionForm = { ...AUTO_ACTION_FORM_INIT };

  templateContent: DropdownSmsTemplate = { ...AUTO_ACTION_SMS_DETAILS_INIT };

  timeUnits: any[] = timeUnits;

  ngOnChanges(changes: SimpleChanges): void {
    if ('autoActionData' in changes) {
      const value = changes['autoActionData'].currentValue;

      if (value && value.templateId) {
        const findData = this.dropdownSmsTemplate.find(
          (x) => x.smsId === value.templateId,
        );

        if (findData) {
          this.templateContent = findData;
        }
      }
    }
  }
}
