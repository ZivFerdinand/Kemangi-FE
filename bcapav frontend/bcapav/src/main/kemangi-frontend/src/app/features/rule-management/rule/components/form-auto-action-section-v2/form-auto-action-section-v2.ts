import {
  Component,
  OnChanges,
  TemplateRef,
  inject,
  Input,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  NgSelectModule,
  NgMultiLabelTemplateDirective,
  NgSelectComponent,
} from '@ng-select/ng-select';

import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { RuleTable } from '../rule-table/rule-table';
import { autoActionListColumns, SUB_RULE_FORM_INIT } from '../../data';
import { DetailRuleTabComponent } from '../detail-tab/detail-rule-tab';
import { AutoActionEmail } from '../auto-action-email/auto-action-email';
import { AutoActionSms } from '../auto-action-sms/auto-action-sms';
import { AutoActionWhatsapp } from './../auto-action-whatsapp/auto-action-whatsapp';
import { AutoActionMbca } from '../auto-action-mbca/auto-action-mbca';
import { AutoActionAutoBlock } from '../auto-action-auto-block/auto-action-auto-block';
import { ToastService } from '../../../../../core/services/toast.service';

import { AutoActionForm } from '../../domain/rule.model';
import {
  AUTO_ACTION_FORM_INIT,
  AUTO_ACTION_INIT,
} from '../../../../approval/rule/data';
import {
  DropdownEmailTemplate,
  DropdownSmsTemplate,
  DropdownWaTemplate,
  DropdownMbNotif,
  DropdownAb,
  DropdownSubRuleParameter,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import { RuleService } from '../../api/services/rule.service';
import { TabItem } from '../../domain/rule.model';
import { channelType } from './../../../../approval/rule/data/enum';
import { RuleApprovalService } from '../../../../approval/rule/api/services/rule-approval.service';
import {
  mapDropdownSubRuleParameterApiToDomain,
  mapDropdownSmsApiToDomain,
  mapDropdownWaApiToDomain,
  mapDropdownMbNotifApiToDomain,
  mapDropdownEmailTemplateApiToDomain,
} from '../../../../approval/rule/mappers/rule-approval.mapper';
import { RuleDetailsSubrulesForm } from '../../domain/rule.model';

@Component({
  selector: 'app-form-auto-action-section-v2',
  templateUrl: './form-auto-action-section-v2.html',
  styleUrls: [
    './form-auto-action-section-v2.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgSelectComponent,
    NgMultiLabelTemplateDirective,
    RuleTable,
    DetailRuleTabComponent,
    AutoActionEmail,
    AutoActionSms,
    AutoActionWhatsapp,
    AutoActionMbca,
    AutoActionAutoBlock,
  ],
  providers: [],
})
export class FormAutoActionSectionV2 implements OnChanges {
  @Input() mode: string = '';
  @Input() dropdownMbNotif: DropdownMbNotif[] = [];
  @Input() dropdownAb: DropdownAb[] = [];
  @Input() initialData: RuleDetailsSubrulesForm[] = [];
  @Input() productType: string = '';

  @Output() saveSubrule = new EventEmitter<RuleDetailsSubrulesForm[]>();

  subrulesForm: RuleDetailsSubrulesForm[] = [];
  subrulesTempForm: RuleDetailsSubrulesForm[] = [];
  initSubrulesTempForm: RuleDetailsSubrulesForm[] = [];

  subruleForm: RuleDetailsSubrulesForm = { ...SUB_RULE_FORM_INIT };

  autoActionForm: AutoActionForm = { ...AUTO_ACTION_FORM_INIT };

  dropdownChannelType = channelType;
  dropdownEmailTemplate: DropdownEmailTemplate[] = [];
  dropdownParameter: DropdownSubRuleParameter[] = [];
  dropdownSmsTemplate: DropdownSmsTemplate[] = [];
  dropdownWaTemplate: DropdownWaTemplate[] = [];
  tableData: any[] = [];
  columns: any[] = autoActionListColumns;

  subruleTabs: TabItem[] = [];
  subruleTabActive = '';

  autoActionTabs = [];
  autoActionTabActive = '';

  selectedValues: any[] = [];

  modalRef!: NgbModalRef;
  private modalService = inject(NgbModal);

  constructor(
    private readonly ruleService: RuleService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    private readonly ruleApprovalService: RuleApprovalService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('initialData' in changes) {
      const value = changes['initialData'].currentValue;
      if (value.length) {
        this.loadSubrulesForm(value);
      }
    }
  }

  resetSubrulesForm() {
    this.subruleTabs = [];
    this.subruleTabActive = '';
    this.subruleForm = { ...SUB_RULE_FORM_INIT };
    this.tableData = [];
  }

  resetSubruleForm() {
    this.subruleForm = { ...SUB_RULE_FORM_INIT };
    this.tableData = [];
  }

  loadSubrulesForm(data: RuleDetailsSubrulesForm[]) {
    if (!data.length) return;

    this.subrulesForm = data;

    this.generateTable();
  }

  handleTabChange(tab: string) {
    this.subruleTabActive = tab;

    this.handleContentChange(tab);
  }

  handleContentChange(tab: string) {
    const findData = this.subrulesTempForm.find((item) => item.uiId === tab);

    if (!findData) {
      console.warn('Subrule not found for tab:', tab);
      return;
    }

    this.subruleForm = findData;

    this.getDropdown(findData.eventType ?? '');

    this.selectedValues = (this.subruleForm.autoAction ?? []).map((x) => {
      return {
        label:
          x.channelType === 'AUTOBLOCK'
            ? 'AUTO BLOCK'
            : x.channelType === 'MBNOTIF'
              ? 'MBCA'
              : x.channelType,
        value: x.channelType,
      };
    });

    this.autoActionForm = { ...AUTO_ACTION_INIT };

    this.autoActionTabActive = '';
  }

  getUpdateAutoAction(data: any) {
    this.updateAutoAction(data?.key, data?.value);
  }

  updateAutoAction(key: string, value: any) {
    switch (key) {
      case 'channelType':
        this.subruleForm = {
          ...this.subruleForm,
          autoAction: value.map((newItem: any) => {
            const existing = this.subruleForm?.autoAction?.find(
              (x) => x.channelType === newItem.value,
            );

            return existing
              ? { ...existing, channelType: newItem.value }
              : { ...AUTO_ACTION_FORM_INIT, channelType: newItem.value };
          }),
        };

        break;

      case 'unit':
        this.autoActionForm.unit = value.value;

        this.subruleForm = {
          ...this.subruleForm,
          autoAction: this.subruleForm.autoAction.map((item) => {
            const existing =
              item.channelType === this.autoActionForm.channelType;
            return existing
              ? { ...item, unit: this.autoActionForm.unit }
              : item;
          }),
        };

        break;

      case 'period':
        this.autoActionForm.period = value;

        this.subruleForm = {
          ...this.subruleForm,
          autoAction: this.subruleForm.autoAction.map((item) => {
            const existing =
              item.channelType === this.autoActionForm.channelType;
            return existing
              ? { ...item, period: this.autoActionForm.period }
              : item;
          }),
        };

        break;

      case 'threshold':
        this.autoActionForm.threshold = value;

        this.subruleForm = {
          ...this.subruleForm,
          autoAction: this.subruleForm.autoAction.map((item) => {
            const existing =
              item.channelType === this.autoActionForm.channelType;
            return existing
              ? { ...item, threshold: this.autoActionForm.threshold }
              : item;
          }),
        };

        break;

      case 'templateId':
        this.autoActionForm.templateId = value?.templateId;

        this.subruleForm = {
          ...this.subruleForm,
          autoAction: this.subruleForm.autoAction.map((item) => {
            const existing =
              item.channelType === this.autoActionForm.channelType;
            return existing
              ? {
                  ...item,
                  templateId: this.autoActionForm.templateId,
                  description: value.description,
                }
              : item;
          }),
        };

        break;

      case 'limit':
        this.autoActionForm.limitFlag = value;
        this.autoActionForm.unit = this.autoActionForm.limitFlag
          ? 'SECOND'
          : null;

        this.subruleForm = {
          ...this.subruleForm,
          autoAction: this.subruleForm.autoAction.map((item) => {
            const existing =
              item.channelType === this.autoActionForm.channelType;
            return existing
              ? {
                  ...item,
                  limitFlag: this.autoActionForm.limitFlag,
                  unit: this.autoActionForm.unit,
                }
              : item;
          }),
        };

        break;

      case 'key':
        this.autoActionForm.key = value;

        this.subruleForm = {
          ...this.subruleForm,
          autoAction: this.subruleForm.autoAction.map((item) => {
            const existing =
              item.channelType === this.autoActionForm.channelType;
            return existing ? { ...item, key: this.autoActionForm.key } : item;
          }),
        };

        break;
    }

    this.subrulesTempForm = this.subrulesTempForm.map((item) =>
      item.uiId === this.subruleForm?.uiId
        ? { ...item, ...this.subruleForm }
        : item,
    );

    this.initSubrulesTempForm = this.initSubrulesTempForm.map((initItem) => {
      const currentItem = this.subrulesTempForm.find(
        (x) => x.uiId === initItem.uiId,
      );

      if (!currentItem) {
        return initItem;
      }

      const newActions = currentItem.autoAction.filter(
        (currentAction) =>
          !initItem.autoAction.some(
            (initAction) =>
              initAction.channelType === currentAction.channelType,
          ),
      );

      return {
        ...initItem,
        autoAction: [...initItem.autoAction, ...structuredClone(newActions)],
      };
    });
  }

  clearAutoActionForm() {
    this.autoActionForm = { ...AUTO_ACTION_INIT };
  }

  handleActionTypeActive(type: string) {
    this.autoActionTabActive = type;
    this.handleActionTypeContentChange(type);
  }

  handleActionTypeContentChange(type: string) {
    this.clearAutoActionForm();

    const typeValue =
      type === 'AUTO BLOCK' ? 'AUTOBLOCK' : type === 'MBCA' ? 'MBNOTIF' : type;

    const findData = this.subruleForm?.autoAction?.find(
      (x) => x.channelType === typeValue,
    );

    if (findData) {
      this.autoActionForm = {
        ...findData,
        channelType: findData.channelType ?? '',
        description: findData.description ?? '',
        threshold: findData.threshold ?? null,
        period: findData.period ?? null,
        key: findData.key ?? null,
        unit: findData.unit ?? 'SECOND',
      };
    }
  }

  handleDeleteActionType(type: string) {
    this.selectedValues = this.selectedValues.filter(
      (item) => item.value !== type,
    );

    this.subruleForm = {
      ...this.subruleForm,
      autoAction: this.subruleForm.autoAction.filter(
        (x) => x.channelType !== type,
      ),
    };

    this.subrulesTempForm = this.subrulesTempForm.map((item) =>
      item.uiId === this.subruleForm?.uiId
        ? { ...item, ...this.subruleForm }
        : item,
    );
  }

  findLabel(key: string, value: any): string {
    switch (key) {
      case 'channelType':
        return (
          this.dropdownChannelType.find((item) => item.value === value.value)
            ?.label ?? ''
        );

      default:
        return '';
    }
  }

  generateTable() {
    this.tableData = this.subrulesForm.flatMap((item) =>
      (item.autoAction ?? [])
        .filter((action) => action.channelType)
        .map((action) => {
          const splittedName = item.subruleName?.split('-') ?? [];

          return {
            subrule: `Sub-Rule ${splittedName[1] ?? ''}`,
            channel:
              action.channelType === 'AUTOBLOCK'
                ? 'AUTO BLOCK'
                : action.channelType === 'MBNOTIF'
                  ? 'MBCA'
                  : action.channelType,
            description: action.description,
          };
        }),
    );
  }

  initForm() {
    this.initSubrulesTempForm = [...this.subrulesForm];
    this.subrulesTempForm = [...this.subrulesForm];

    this.subruleTabs = this.subrulesForm
      .map((s) => {
        const label = s.uiId?.split('-');

        return label
          ? {
              label: `${label[0]}-${label[1]} ${label[2] ?? ''}`,
              value: s.uiId ?? '',
            }
          : null;
      })
      .filter((x): x is TabItem => x !== null);

    if (this.subruleTabs.length > 0) {
      this.handleTabChange(this.subruleTabs[0].value);
    }
  }

  getChangedValues(original: any, current: any): any {
    const changes: any = {};
    for (const key in current) {
      if (typeof current[key] === 'object' && current[key] !== null) {
        const nested = this.getChangedValues(original[key] || {}, current[key]);
        if (Object.keys(nested).length > 0) {
          changes[key] = nested;
        }
      } else if (current[key] !== original[key]) {
        changes[key] = { from: original[key], to: current[key] };
      }
    }
    return changes;
  }

  cancel() {
    const currentValue = this.subrulesTempForm.map((x) => {
      return {
        ...x,
        autoAction: x.autoAction.map((y) => {
          const { channelType, ...restValue } = y;
          return restValue;
        }),
      };
    });

    const initValue = this.initSubrulesTempForm.map((x) => {
      return {
        ...x,
        autoAction: x.autoAction.map((y) => {
          const { channelType, ...restValue } = y;
          return restValue;
        }),
      };
    });

    const changed = this.getChangedValues(initValue, currentValue);

    if (Object.keys(changed).length === 0) {
      this.close();
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure you want to discard all changes?')
        .then((confirmed) => {
          if (!confirmed) return;

          if (confirmed) {
            this.close();
            this.subrulesTempForm = [];
            this.initSubrulesTempForm = [];
          }
        });
    }
  }

  submit() {
    this.subrulesForm = this.subrulesTempForm.map((item) => ({
      ...item,
      autoAction: item.autoAction?.map((a) => ({ ...a })) ?? [],
    }));

    this.saveSubrule.emit(this.subrulesForm);
    this.close();
  }

  validateAutoActionItem(action: any): boolean {
    const requiredFields = ['templateId'];

    for (const field of requiredFields) {
      if (!action[field] || action[field].trim() === '') {
        return false;
      }
    }

    return true;
  }

  validateSubrulesTempForm(): boolean {
    return this.subrulesTempForm.every((item) =>
      item.autoAction.every((action: any) =>
        this.validateAutoActionItem(action),
      ),
    );
  }

  isInvalid(): boolean {
    return !this.validateSubrulesTempForm();
  }

  getDropdownEmailTemplate(productType: string, eventType: string) {
    this.ruleService
      .ruleMasterEmailTemplateList(productType, eventType)
      .subscribe({
        next: (res: any) => {
          this.dropdownEmailTemplate = res['data'].map((x: any) =>
            mapDropdownEmailTemplateApiToDomain(x),
          );
        },
        error: (e) => {
          if (e.status !== 400) {
            this.toast.error('Something went wrong while loading data');
          }
        },
        complete: () => {},
      });
  }

  getDropdownParameter(eventType: string) {
    this.ruleService.ruleMasterParameterList(eventType).subscribe({
      next: (res: any) => {
        this.dropdownParameter = res['data'].map((x: any) =>
          mapDropdownSubRuleParameterApiToDomain(x),
        );
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {},
    });
  }

  getDropdownSmsTemplate(eventType: string) {
    this.ruleApprovalService.dropdownSmsTemplate(eventType).subscribe({
      next: (res: any) => {
        this.dropdownSmsTemplate = res['data'].map((x: any) =>
          mapDropdownSmsApiToDomain(x),
        );
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {},
    });
  }

  getDropdownWaTemplate(eventType: string) {
    this.ruleApprovalService.dropdownWaTemplate(eventType).subscribe({
      next: (res: any) => {
        this.dropdownWaTemplate = res['data'].map((x: any) =>
          mapDropdownWaApiToDomain(x),
        );
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {},
    });
  }

  getDropdownMbNotif(eventType: string) {
    this.ruleApprovalService.dropdownMbTemplate(eventType).subscribe({
      next: (res: any) => {
        this.dropdownMbNotif = res['data'].map((x: any) =>
          mapDropdownMbNotifApiToDomain(x),
        );
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {},
    });
  }

  getDropdown(eventType: string) {
    if (eventType) {
      this.getDropdownEmailTemplate(this.productType, eventType);
      this.getDropdownParameter(eventType);
      this.getDropdownSmsTemplate(eventType);
      this.getDropdownWaTemplate(eventType);
      this.getDropdownMbNotif(eventType);
    }
  }

  handleSortChange(direction: 'asc' | 'desc', key: string) {
    this.tableData = [...this.tableData].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (valueA == null) return 1;
      if (valueB == null) return -1;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return direction === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }

  open(content: TemplateRef<any>) {
    this.initForm();
    this.modalRef = this.modalService.open(content, {
      centered: true,
      size: 'xl',
    });
  }

  close() {
    this.modalRef?.close();
  }
}
