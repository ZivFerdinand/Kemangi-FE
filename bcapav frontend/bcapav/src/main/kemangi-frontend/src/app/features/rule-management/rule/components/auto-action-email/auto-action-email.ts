import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutoActionForm } from '../../domain/rule.model';
import { AUTO_ACTION_FORM_INIT } from '../../../../approval/rule/data';
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

interface AutoActionUpdate {
  key: string;
  value: any;
}
@Component({
  selector: 'app-auto-action-email',
  templateUrl: './auto-action-email.html',
  styleUrls: [
    './auto-action-email.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  providers: [],
})
export class AutoActionEmail implements OnChanges {
  @ViewChild('autoContent') autoContent!: ElementRef<HTMLTextAreaElement>;
  @Input() mode: string = '';
  @Input() dropdownEmailTemplate: DropdownEmailTemplate[] = [];
  @Input() dropdownParameter: DropdownSubRuleParameter[] = [];
  @Input() autoActionData: AutoActionForm = { ...AUTO_ACTION_FORM_INIT };

  @Output() updateAutoAction = new EventEmitter<AutoActionUpdate>();

  timeUnits: any[] = timeUnits;

  templateContent: EmailTemplateDetails = { ...EMAIL_TEMPLATE_DETAILS_INIT };

  constructor(
    private emailTemplateService: EmailTemplateService,
    public toast: ToastService,
  ) {}

  updateValue(key: string, value: any) {
    if (key === 'emailTemplateId') {
      const data = {
        key: 'templateId',
        value: {
          templateId: value?.templateId ?? null,
          description: value?.templateName ?? '',
        },
      };
      this.getEmailTemplateDetail(value.id);
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
        const findId = this.dropdownEmailTemplate.find(
          (x) => x.templateId === value.templateId,
        );

        if (findId) {
          this.getEmailTemplateDetail(Number(findId?.id));
        }
      }
    }
  }

  findData() {
    return this.dropdownEmailTemplate.find(
      (x) => x.id === Number(this.autoActionData.templateId),
    );
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
