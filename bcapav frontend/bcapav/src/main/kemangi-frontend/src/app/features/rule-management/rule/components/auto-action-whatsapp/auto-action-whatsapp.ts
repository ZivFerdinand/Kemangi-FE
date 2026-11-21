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
import { timeUnits } from '../../../../../shared';
import {
  DropdownWaTemplate,
  DropdownSubRuleParameter,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import { AUTO_ACTION_WA_DETAILS_INIT } from '../../data';

interface AutoActionUpdate {
  key: string;
  value: any;
}

@Component({
  selector: 'app-auto-action-whatsapp',
  templateUrl: './auto-action-whatsapp.html',
  styleUrls: [
    './auto-action-whatsapp.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  providers: [],
})
export class AutoActionWhatsapp implements OnChanges {
  @ViewChild('autoContent') autoContent!: ElementRef<HTMLTextAreaElement>;
  @Input() mode: string = '';
  @Input() dropdownWaTemplate: DropdownWaTemplate[] = [];
  @Input() dropdownParameter: DropdownSubRuleParameter[] = [];
  @Input() autoActionData: AutoActionForm = { ...AUTO_ACTION_FORM_INIT };

  @Output() updateAutoAction = new EventEmitter<AutoActionUpdate>();

  timeUnits: any[] = timeUnits;

  selectedTemplate: DropdownWaTemplate = { ...AUTO_ACTION_WA_DETAILS_INIT };

  handleDownload(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    a.target = '_blank';
    a.click();
  }

  updateValue(key: string, value: any) {
    if (key === 'waTemplateId') {
      this.selectedTemplate = { ...value };
      const data = {
        key: 'templateId',
        value: {
          templateId: value?.waId ?? null,
          description: value?.template ?? '',
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
        const findData = this.dropdownWaTemplate.find(
          (x) => x.waId === value.templateId,
        );

        if (findData) {
          this.selectedTemplate = findData;
        }
      }
    }
  }
}
