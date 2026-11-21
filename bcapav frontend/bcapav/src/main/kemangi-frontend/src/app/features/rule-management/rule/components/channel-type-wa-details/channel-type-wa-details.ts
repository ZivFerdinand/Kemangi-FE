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
  DropdownWaTemplate,
  DropdownSubRuleParameter,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import { AUTO_ACTION_WA_DETAILS_INIT } from '../../data';

@Component({
  selector: 'app-channel-type-wa-details',
  templateUrl: './channel-type-wa-details.html',
  styleUrls: [
    './channel-type-wa-details.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  providers: [],
})
export class ChannelTypeWaDetails implements OnChanges {
  @ViewChild('autoContent') autoContent!: ElementRef<HTMLTextAreaElement>;

  @Input() dropdownWaTemplate: DropdownWaTemplate[] = [];
  @Input() dropdownParameter: DropdownSubRuleParameter[] = [];
  @Input() autoActionData: AutoActionForm = { ...AUTO_ACTION_FORM_INIT };

  timeUnits: any[] = timeUnits;

  templateContent: DropdownWaTemplate = { ...AUTO_ACTION_WA_DETAILS_INIT };

  handleDownload(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    a.target = '_blank';
    a.click();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('autoActionData' in changes) {
      const value = changes['autoActionData'].currentValue;

      if (value && value.templateId) {
        const findData = this.dropdownWaTemplate.find(
          (x) => x.waId === value.templateId,
        );

        if (findData) {
          this.templateContent = findData;
        }
      }
    }
  }
}
