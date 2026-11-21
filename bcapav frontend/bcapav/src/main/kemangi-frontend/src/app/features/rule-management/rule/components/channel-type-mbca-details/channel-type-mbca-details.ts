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
import { AUTO_ACTION_MB_DETAILS_INIT } from '../../data';
import {
  DropdownMbNotif,
  DropdownSubRuleParameter,
} from './../../../../approval/rule/domain/models/rule-approval.model';

@Component({
  selector: 'app-channel-type-mbca-details',
  templateUrl: './channel-type-mbca-details.html',
  styleUrls: [
    './channel-type-mbca-details.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  providers: [],
})
export class ChannelTypeMbcaDetails implements OnChanges {
  @ViewChild('autoContent') autoContent!: ElementRef<HTMLTextAreaElement>;
  @Input() mode: string = '';
  @Input() dropdownMbNotif: DropdownMbNotif[] = [];
  @Input() dropdownParameter: DropdownSubRuleParameter[] = [];
  @Input() autoActionData: AutoActionForm = { ...AUTO_ACTION_FORM_INIT };

  timeUnits: any[] = timeUnits;

  templateContent: DropdownMbNotif = { ...AUTO_ACTION_MB_DETAILS_INIT };

  ngOnChanges(changes: SimpleChanges): void {
    if ('autoActionData' in changes) {
      const value = changes['autoActionData'].currentValue;

      if (value && value.templateId) {
        const findData = this.dropdownMbNotif.find(
          (x) => x.mbnotifId === value.templateId,
        );

        if (findData) {
          this.templateContent = findData;
        }
      }
    }
  }
}
