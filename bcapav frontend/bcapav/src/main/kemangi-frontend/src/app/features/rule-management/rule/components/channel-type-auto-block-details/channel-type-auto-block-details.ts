import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutoActionForm } from '../../domain/rule.model';
import { AUTO_ACTION_FORM_INIT } from '../../../../approval/rule/data';
import {
  DropdownAb,
  DropdownSubRuleParameter,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import { timeUnits } from '../../../../../shared';
import { AUTO_ACTION_AB_DETAILS_INIT } from '../../data';

interface AutoActionUpdate {
  key: string;
  value: any;
}

@Component({
  selector: 'app-channel-type-auto-block-details',
  templateUrl: './channel-type-auto-block-details.html',
  styleUrls: [
    './channel-type-auto-block-details.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  providers: [],
})
export class ChannelTypeAutoBlockDetails implements OnChanges {
  @ViewChild('autoContent') autoContent!: ElementRef<HTMLTextAreaElement>;
  @Input() mode: string = '';
  @Input() dropdownAbTemplate: DropdownAb[] = [];
  @Input() dropdownParameter: DropdownSubRuleParameter[] = [];
  @Input() autoActionData: AutoActionForm = { ...AUTO_ACTION_FORM_INIT };

  @Output() updateAutoAction = new EventEmitter<AutoActionUpdate>();

  timeUnits: any[] = timeUnits;
  templateContent: DropdownAb = { ...AUTO_ACTION_AB_DETAILS_INIT };

  ngOnChanges(changes: SimpleChanges): void {
    if ('autoActionData' in changes) {
      const value = changes['autoActionData'].currentValue;

      if (value && Number(value.templateId) !== 0) {
        const findData = this.dropdownAbTemplate.find(
          (x) => x.apiId === value.templateId,
        );

        if (findData) {
          this.templateContent = findData;
        }
      }
    }
  }
}
