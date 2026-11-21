import {
  Input,
  Component,
  inject,
  TemplateRef,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgbModalRef, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { SubRuleTabComponent } from '../sub-rule-tab/sub-rule-tab';
import { DetailRuleTabComponent } from '../detail-tab/detail-rule-tab';
import { FormsModule } from '@angular/forms';

import { SUB_RULE_FORM_INIT } from '../../data';

import { TableComponent } from '../../../../../shared';
import {
  subruleParamModalColumns,
  subruleParamDisplayColumns,
} from '../../data';
import { FormPipelineSection } from '../form-pipeline-section/form-pipeline-section';
import { enumBoolean } from '../../../../../shared';
import { SubruleAndVarList, TabItem } from '../../domain/rule.model';
import {
  DropdownRuleFunction,
  DropdownDataGroup,
  DropdownRuleOperator,
  DropdownPipelineType,
  DropdownSubRuleParameterType,
  DropdownSubRuleParameter,
  DropdownRulePipeline,
  DropdownEmailTemplate,
  DropdownHistorical,
  DropdownSmsTemplate,
  DropdownWaTemplate,
  DropdownMbNotif,
  DropdownAb,
  DropdownRule,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import { RuleService } from '../../api/services/rule.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { mapDropdownSubRuleParameterApiToDomain } from '../../../../approval/rule/mappers/rule-approval.mapper';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { FormAutoActionSectionV2 } from '../form-auto-action-section-v2/form-auto-action-section-v2';
import { RuleDetailsSubrulesForm } from '../../domain/rule.model';
import { generateId } from '../../../../../shared/utils/general';
@Component({
  selector: 'app-form-subrule-section-v2',
  standalone: true,
  templateUrl: './form-subrule-section-v2.html',
  styleUrls: [
    './form-subrule-section-v2.scss',
    '../../../../../shared/styles/index.scss',
  ],
  imports: [
    NgSelectModule,
    CommonModule,
    SubRuleTabComponent,
    DetailRuleTabComponent,
    FormsModule,
    TableComponent,
    FormPipelineSection,
    FormAutoActionSectionV2,
    NgbModule,
  ],
})
export class FormSubRuleSectionV2 implements OnChanges {
  @Input() mode: string = '';
  @Input() productType: string = '';
  @Input() initialData: RuleDetailsSubrulesForm[] = [];
  @Input() dropdownFunction: DropdownRuleFunction[] = [];
  @Input() dropdownDataGroup: DropdownDataGroup[] = [];
  @Input() dropdownOperator: DropdownRuleOperator[] = [];
  @Input() dropdownPipelineType: DropdownPipelineType[] = [];
  @Input() dropdownParameterType: DropdownSubRuleParameterType[] = [];
  @Input() dropdownPipeline: DropdownRulePipeline[] = [];
  @Input() dropdownHistorical: DropdownHistorical[] = [];
  @Input() dropdownEmailTemplate: DropdownEmailTemplate[] = [];
  @Input() dropdownSmsTemplate: DropdownSmsTemplate[] = [];
  @Input() dropdownWaTemplate: DropdownWaTemplate[] = [];
  @Input() dropdownMbNotif: DropdownMbNotif[] = [];
  @Input() dropdownAb: DropdownAb[] = [];
  @Input() dropdownRule: DropdownRule[] = [];

  @Output() updateSubrules = new EventEmitter<RuleDetailsSubrulesForm[]>();

  @Output() getDropdownPipeline = new EventEmitter<string>();

  varList = new Map<string, string>();
  dataVar: string[] = [];
  dropdownParameter: DropdownSubRuleParameter[] = [];
  dropdownFunctionTypeF: DropdownRuleFunction[] = [];
  dropdownFunctionTypeT: DropdownRuleFunction[] = [];
  columnsTableModal = subruleParamModalColumns;
  columnsTableDisplay = subruleParamDisplayColumns;

  enumBoolean = enumBoolean;

  tableData: any[] = [];

  subrulesForm: RuleDetailsSubrulesForm[] = [];
  subruleForm: RuleDetailsSubrulesForm = { ...SUB_RULE_FORM_INIT };
  subruleTempForm: RuleDetailsSubrulesForm = { ...SUB_RULE_FORM_INIT };
  initSubruleTempForm: RuleDetailsSubrulesForm = {
    ...SUB_RULE_FORM_INIT,
  };

  tabs: TabItem[] = [];
  activeTab: string = '';

  tabHistory: string = '';

  modalRef!: NgbModalRef;

  private modalService = inject(NgbModal);

  private subruleCounterUiId = 1;

  constructor(
    public confirmationDialogService: ConfirmationModalService,
    private readonly ruleService: RuleService,
    private readonly toast: ToastService,
  ) {}

  generateSubruleUiId() {
    return `${this.subruleCounterUiId++}`;
  }

  open(content: TemplateRef<any>) {
    this.addSubruleTempForm();

    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-subrule',
      centered: true,
      size: 'xl',
    });
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const dataChanges = changes['initialData'];

    if (dataChanges && dataChanges.currentValue) {
      const value = dataChanges.currentValue;

      if (value) {
        this.loadSubrulesForm(value);
      }
    }

    if ('dropdownFunction' in changes) {
      const value = changes['dropdownFunction'].currentValue;
      if (!value || value.length === 0) {
        return;
      } else {
        this.dropdownFunctionTypeF = this.dropdownFunction.filter(
          (x) => !x.isAggregation,
        );

        this.dropdownFunctionTypeT = this.dropdownFunction.filter(
          (x) => x.isAggregation,
        );
      }
    }
  }

  addSubruleForm() {
    const existingIds = new Set(this.subrulesForm.map((s) => s.uiId));

    let uiId = this.generateSubruleUiId();
    let fullUiId = `Sub-Rule-${uiId}`;

    while (existingIds.has(fullUiId)) {
      uiId = this.generateSubruleUiId();
      fullUiId = `Sub-Rule-${uiId}`;
    }

    this.tabs = [...this.tabs, { label: `Sub-Rule ${uiId}`, value: fullUiId }];

    this.subrulesForm = [
      ...this.subrulesForm,
      {
        uiId: fullUiId,
        subruleId: null,
        subruleName: `SUSPECTED-${uiId}`,
        eventType: null,
        parameters: [],
        hasPipeline: false,
        pipelines: [],
        autoAction: [],
      },
    ];

    this.sortSubrulesByUiId();

    this.updateSubrules.emit(this.subrulesForm);

    this.handleTabChange(fullUiId);
  }

  private sortSubrulesByUiId() {
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base',
    });

    this.subrulesForm = [...this.subrulesForm].sort((a, b) =>
      collator.compare(a.uiId ?? '', b.uiId ?? ''),
    );

    this.tabs = [...this.tabs].sort((a, b) =>
      collator.compare(a.value ?? '', b.value ?? ''),
    );
  }

  updateSubruleForm(param: string, value: any) {
    if (param === 'eventType') {
      this.getDropdownSubRuleParameter(value);

      this.subruleTempForm.eventType = value;
      this.subruleTempForm.parameters = this.subruleTempForm.parameters.map(
        (p) => ({
          ...p,
          parameter1: null,
          parameter2: null,
        }),
      );
      return;
    }

    if (param === 'hasPipeline') {
      this.subruleForm = {
        ...this.subruleForm,
        hasPipeline: value,
      };

      if (!this.subruleForm.hasPipeline) {
        this.subruleForm = { ...this.subruleForm, pipelines: [] };
      }

      this.subrulesForm = this.subrulesForm.map((item) =>
        item.uiId === this.subruleForm.uiId
          ? { ...item, ...this.subruleForm }
          : item,
      );

      this.updateSubrules.emit(this.subrulesForm);

      return;
    }
  }

  removeSubruleForm(index: number) {
    this.tabs = this.tabs.filter((_, i) => i !== index);
    this.subrulesForm = this.subrulesForm.filter((_, i) => i !== index);

    this.updateSubrules.emit(this.subrulesForm);
  }

  cloneSubruleForm(index: number) {
    const uiId = this.generateSubruleUiId();
    const findSubRule = this.subrulesForm[index];

    this.tabs = [
      ...this.tabs,
      { label: `Sub-Rule ${uiId}`, value: `Sub-Rule-${uiId}` },
    ];

    const clone = structuredClone(findSubRule);

    this.subrulesForm = [
      ...this.subrulesForm,
      {
        uiId: `Sub-Rule-${uiId}`,
        subruleId: clone.subruleId,
        subruleName: `SUSPECTED-${uiId}`,
        eventType: clone.eventType,
        parameters: clone.parameters,
        hasPipeline: clone.hasPipeline,
        pipelines: clone.pipelines,
        autoAction: clone.autoAction,
      },
    ];

    this.updateSubrules.emit(this.subrulesForm);

    this.handleTabChange(`Sub-Rule-${uiId}`);
  }

  resetSubrulesForm() {
    this.tabs = [];
    this.activeTab = '';
    this.subruleCounterUiId = 1;

    this.subruleForm = { ...SUB_RULE_FORM_INIT };
    this.tableData = [];
  }

  resetSubruleForm() {
    this.subruleForm = { ...SUB_RULE_FORM_INIT };
    this.tableData = [];
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    this.handleContentChange(tab);
  }

  handleContentChange(tab: string) {
    const findData = this.subrulesForm.find((item) => item.uiId === tab);

    if (!findData) {
      console.warn('Subrule not found for tab:', tab);
      return;
    }

    this.subruleForm = findData;

    this.subruleForm = {
      ...this.subruleForm,
      parameters: this.subruleForm.parameters.map((row) => {
        const findFunction: DropdownRuleFunction | null =
          this.dropdownFunction?.find(
            (x) => x.functionName === row.functionName,
          ) ?? null;

        if (findFunction) {
          return {
            ...row,
            functionName: findFunction.functionName,
            isMultiParam: findFunction.isMultiParam,
            returnType: findFunction.returnType,
          };
        }

        return row;
      }),
    };

    if (this.subruleForm.eventType) {
      this.getDropdownSubRuleParameter(this.subruleForm.eventType);
    }

    this.generateTable();
  }

  addSubruleTempForm() {
    this.subruleTempForm = structuredClone({
      ...this.subruleForm,
      parameters: this.subruleForm.parameters.map((x) => {
        return {
          ...x,
          dataGroupValue: x.dataGroupSample
            ? x.dataGroupSample.map((n) => `"${n}"`).join(',')
            : x.dataGroupId
              ? this.findLabel('dataGroupSample', x.dataGroupId)
              : null,
        };
      }),
    });

    this.initSubruleTempForm = structuredClone({ ...this.subruleTempForm });
  }

  resetSubruleTempForm() {
    this.subruleTempForm = { ...SUB_RULE_FORM_INIT };
    this.initSubruleTempForm = { ...SUB_RULE_FORM_INIT };
  }

  addSubruleParameterTempForm() {
    this.subruleTempForm = {
      ...this.subruleTempForm,
      parameters: [
        ...(this.subruleTempForm.parameters ?? []),
        {
          uiId: generateId(),
          functionName: null,
          parameter1: null,
          parameter2: null,
          operator: null,
          value: null,
          dataGroupId: null,
          dataGroupName: null,
          dataGroupValue: null,
          dataGroupSample: null,
          returnType: null,
          isMultiParam: false,
        },
      ],
    };
  }

  cancelSubruleTempForm() {
    const {
      uiId,
      eventType,
      hasPipeline,
      pipelines,
      autoAction,
      ...currentValue
    } = this.subruleTempForm;

    const {
      uiId: __,
      eventType: _,
      hasPipeline: ___,
      pipelines: ____,
      autoAction: _____,
      ...initValue
    } = this.initSubruleTempForm;

    const changed = this.getChangedValues(initValue, currentValue);

    if (Object.keys(changed).length === 0) {
      this.close();
      this.resetSubruleTempForm();
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure you want to discard all changes?')
        .then((confirmed) => {
          if (!confirmed) return;

          if (confirmed) {
            this.close();
            this.resetSubruleTempForm();
          }
        });
    }
  }

  updateSubruleParameterTempForm(param: string, value: any, id: string) {
    switch (param) {
      case 'functionName':
        this.subruleTempForm = {
          ...this.subruleTempForm,
          parameters: this.subruleTempForm.parameters
            ? this.subruleTempForm.parameters.map((p) =>
                p.uiId === id
                  ? {
                      ...p,
                      functionName: value?.functionName,
                      isMultiParam: value?.isMultiParam,
                      returnType: value?.returnType,
                    }
                  : p,
              )
            : [],
        };
        break;

      case 'parameter1':
        this.subruleTempForm = {
          ...this.subruleTempForm,
          parameters: this.subruleTempForm.parameters
            ? this.subruleTempForm.parameters.map((p) =>
                p.uiId === id
                  ? {
                      ...p,
                      parameter1: value.parameterValue,
                    }
                  : p,
              )
            : [],
        };
        break;

      case 'parameter2':
        this.subruleTempForm = {
          ...this.subruleTempForm,
          parameters: this.subruleTempForm.parameters
            ? this.subruleTempForm.parameters.map((p) =>
                p.uiId === id
                  ? {
                      ...p,
                      parameter2: value.parameterValue,
                    }
                  : p,
              )
            : [],
        };
        break;

      case 'operator':
        this.subruleTempForm = {
          ...this.subruleTempForm,
          parameters: this.subruleTempForm.parameters
            ? this.subruleTempForm.parameters.map((p) =>
                p.uiId === id
                  ? {
                      ...p,
                      operator: value.operatorName,
                    }
                  : p,
              )
            : [],
        };
        break;

      case 'dataGroupId':
        this.subruleTempForm = {
          ...this.subruleTempForm,
          parameters: this.subruleTempForm.parameters
            ? this.subruleTempForm.parameters.map((p) => {
                if (p.uiId === id) {
                  let dataCount = value.detailCount;
                  let dataValue =
                    dataCount > 2
                      ? value.detailSample
                          .slice(0, 2)
                          .map((s: any) => `"${s}"`)
                          .join(',') + ',...'
                      : value.detailSample.map((s: any) => `"${s}"`).join(',');

                  return {
                    ...p,
                    dataGroupId: value.dataGroupId,
                    dataGroupName: value.dataGroupName,
                    dataGroupValue: dataValue,
                  };
                } else {
                  return p;
                }
              })
            : [],
        };

        break;

      case 'value':
        this.subruleTempForm = {
          ...this.subruleTempForm,
          parameters: this.subruleTempForm.parameters
            ? this.subruleTempForm.parameters.map((p) =>
                p.uiId === id
                  ? {
                      ...p,
                      value: value,
                    }
                  : p,
              )
            : [],
        };

        break;
    }
  }

  saveSubruleTempForm() {
    this.subruleForm = { ...this.subruleForm, ...this.subruleTempForm };
    this.subrulesForm = this.subrulesForm.map((item) =>
      item.uiId === this.subruleForm.uiId
        ? { ...item, ...this.subruleForm }
        : item,
    );

    this.updateSubrules.emit(this.subrulesForm);

    this.resetSubruleTempForm();
    this.close();

    this.generateTable();
  }

  removeSubruleParameterTempForm(id: any) {
    this.subruleTempForm = {
      ...this.subruleTempForm,
      parameters: (this.subruleTempForm.parameters ?? []).filter(
        (s) => s.uiId !== id,
      ),
    };
  }

  findLabel(key: string, value: any): string {
    switch (key) {
      case 'function':
        return (
          this.dropdownFunction.find((item) => item.functionId === value)
            ?.functionName ?? ''
        );

      case 'parameter1':
        return (
          this.dropdownParameter.find((item) => item.parameterValue === value)
            ?.parameterName ?? ''
        );

      case 'parameter2':
        return (
          this.dropdownParameter.find((item) => item.parameterValue === value)
            ?.parameterName ?? ''
        );

      case 'dataGroup':
        return (
          this.dropdownDataGroup.find((item) => item.dataGroupId === value)
            ?.dataGroupName ?? value
        );

      case 'dataGroupSnapShot':
        return (
          this.dropdownDataGroup.find((item) => item.dataGroupId === value)
            ?.detailSnapshot ?? ' '
        );

      case 'dataGroupSample':
        const findData = this.dropdownDataGroup.find(
          (item) => item.dataGroupId === value,
        );

        if (findData) {
          let dataCount = findData.detailCount;
          let dataValue =
            dataCount > 2
              ? findData.detailSample
                  .slice(0, 2)
                  .map((s: any) => `"${s}"`)
                  .join(',') + ',...'
              : findData.detailSample.map((s: any) => `"${s}"`).join(',');

          return dataValue;
        }

        return '';

      case 'operator':
        return (
          this.dropdownOperator.find((item) => item.operatorId === value)
            ?.operatorName ?? ''
        );

      default:
        return '';
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

  getDropdownSubRuleParameter(parameterType: string) {
    this.ruleService.ruleMasterParameterList(parameterType).subscribe({
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

  emitDropdownPipeline(pipelineType: string) {
    this.getDropdownPipeline.emit(pipelineType);
  }

  updatePipelineDetail(data: RuleDetailsSubrulesForm) {
    this.subruleForm = { ...this.subruleForm, pipelines: data.pipelines };

    this.subrulesForm = this.subrulesForm.map((item) =>
      item.uiId === this.subruleForm.uiId
        ? { ...item, ...this.subruleForm }
        : item,
    );

    this.updateSubrules.emit(this.subrulesForm);
  }

  updateAutoAction(data: RuleDetailsSubrulesForm[]) {
    const dataMap = new Map(data.map((item) => [item.uiId, item]));

    this.subrulesForm = this.subrulesForm.map((oldItem) => {
      const newItem = dataMap.get(oldItem.uiId);
      return newItem ? { ...oldItem, ...newItem } : oldItem;
    });

    this.updateSubrules.emit(this.subrulesForm);

    this.handleTabChange(this.activeTab);
  }

  validateSubruleParameterItem(item: any) {
    const requiredFields = ['parameter1', 'operator'];

    if (
      item.dataGroupId === null ||
      item.dataGroupId === undefined ||
      item.dataGroupId === ''
    ) {
      requiredFields.push('value');
    }

    for (const field of requiredFields) {
      const val = item[field];

      if (val === null || val === undefined || val === '') {
        return false;
      }
    }

    return true;
  }

  isInvalid(): boolean {
    if (!this.subruleTempForm.eventType) {
      return true;
    }

    if (!this.subruleTempForm.parameters?.length) {
      return true;
    }

    const isValid = (this.subruleTempForm.parameters ?? []).every(
      this.validateSubruleParameterItem.bind(this),
    );

    return !isValid;
  }

  getVarOptions() {
    const gather = [
      ...new Set(
        this.subrulesForm
          .flatMap((subrule) =>
            subrule.pipelines.flatMap((pipeline) => [
              ...pipeline.pipelineDetails.map((detail: any) => detail.varName),
            ]),
          )
          .filter(Boolean),
      ),
    ];

    this.dataVar = gather;
  }

  // =====

  private extractUiIdNumber(uiId: string | null | undefined): number {
    if (!uiId) return 0;
    const match = uiId.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  }

  loadSubrulesForm(data: any) {
    if (!data.length) {
      this.subrulesForm = [];
      this.tabs = [];
      this.activeTab = '';
      return;
    }

    this.subrulesForm = data;

    const used = this.subrulesForm
      .map((s) => this.extractUiIdNumber(s.uiId))
      .filter((n) => n > 0);

    this.subruleCounterUiId = used.length ? Math.max(...used) + 1 : 1;

    this.getVarOptions();

    this.tabs = this.subrulesForm.map((s) => {
      const splitted = s.uiId?.split('-') ?? [];

      return {
        label: splitted[0] + '-' + splitted[1] + ' ' + splitted[2],
        value: s.uiId || '',
      };
    });

    const currentStillExists = this.tabs.some(
      (t) => t.value === this.activeTab,
    );

    if (currentStillExists) {
      return;
    }

    const fallback =
      this.tabHistory && this.tabs.some((t) => t.value === this.tabHistory)
        ? this.tabHistory
        : this.tabs[0].value;

    this.handleTabChange(fallback);
  }

  generateTable() {
    this.tableData =
      this.subruleForm.parameters?.map((x) => ({
        function: x.functionName || ' ',
        parameter1: x.parameter1,
        parameter2: x.parameter2 || ' ',
        operator: x.operator,
        value: x.dataGroupSample
          ? x.dataGroupSample.map((n) => `"${n}"`).join(',')
          : x.dataGroupId
            ? this.findLabel('dataGroupSample', x.dataGroupId)
            : x.value === false
              ? 'False'
              : x.value === true
                ? 'True'
                : x.value
                  ? x.value
                  : ' ',
        dataGroup:
          x.dataGroupName || this.findLabel('dataGroup', x.dataGroupId) || ' ',
      })) ?? [];
  }

  onFilterInput(event: Event, row: any, field: string, allowedPattern: string) {
    if (!allowedPattern) {
      row[field] = (event.target as HTMLInputElement).value;
      return;
    }

    const input = event.target as HTMLInputElement;
    const regex = new RegExp(`[^${allowedPattern}]`, 'g');
    const filtered = input.value.replace(regex, '');

    if (input.value !== filtered) {
      input.value = filtered;
    }
    row[field] = filtered;
  }

  updatePipelineAndSetToVar(data: SubruleAndVarList) {
    this.subruleForm = {
      ...this.subruleForm,
      pipelines: data.subrule.pipelines,
    };

    this.subrulesForm = this.subrulesForm.map((item) =>
      item.uiId === this.subruleForm.uiId
        ? { ...item, ...this.subruleForm }
        : item,
    );

    this.varList = new Map(
      data.varlist
        .filter(({ oldValue }) => oldValue !== null)
        .map(({ oldValue, newValue }) => [oldValue, newValue]),
    );

    const merge = this.subrulesForm.map((subrule) => ({
      ...subrule,
      pipelines: subrule.pipelines.map((pipeline) => ({
        ...pipeline,
        varName: pipeline.varName
          ? (this.varList.get(pipeline.varName) ?? pipeline.varName)
          : null,
      })),
    }));

    this.subrulesForm = structuredClone(merge);

    this.handleTabChange(this.activeTab);

    this.updateSubrules.emit(structuredClone(merge));
  }
}
