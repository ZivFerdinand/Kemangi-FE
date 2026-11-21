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
  selector: 'app-auto-action-auto-block',
  templateUrl: './auto-action-auto-block.html',
  styleUrls: [
    './auto-action-auto-block.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  providers: [],
})
export class AutoActionAutoBlock implements OnChanges {
  @ViewChild('autoContent') autoContent!: ElementRef<HTMLTextAreaElement>;
  @Input() mode: string = '';
  @Input() dropdownAbTemplate: DropdownAb[] = [];
  @Input() dropdownParameter: DropdownSubRuleParameter[] = [];
  @Input() autoActionData: AutoActionForm = { ...AUTO_ACTION_FORM_INIT };

  @Output() updateAutoAction = new EventEmitter<AutoActionUpdate>();

  timeUnits: any[] = timeUnits;
  selectedTemplate: DropdownAb = { ...AUTO_ACTION_AB_DETAILS_INIT };

  updateValue(key: string, value: any) {
    if (key === 'abTemplateId') {
      this.selectedTemplate = { ...value };
      const data = {
        key: 'templateId',
        value: {
          templateId: value?.apiId ?? null,
          description: value?.apiName ?? '',
        },
      };
      this.updateAutoAction.emit(data);
      return;
    }

    const data = { key: key, value: value };
    this.updateAutoAction.emit(data);
  }

  autogrow(textarea: HTMLTextAreaElement) {
    const minHeight = 288;
    const maxHeight = 288;

    textarea.style.height = 'auto';
    let newHeight = textarea.scrollHeight;

    if (newHeight < minHeight) {
      newHeight = minHeight;
    } else if (newHeight > maxHeight) {
      newHeight = maxHeight;
    }

    textarea.style.height = newHeight + 'px';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('autoActionData' in changes) {
      const value = changes['autoActionData'].currentValue;

      if (value && value.templateId) {
        const findData = this.dropdownAbTemplate.find(
          (x) => x.apiId === value.templateId,
        );

        if (findData) {
          this.selectedTemplate = findData;
        }
      }
    }
  }
}
