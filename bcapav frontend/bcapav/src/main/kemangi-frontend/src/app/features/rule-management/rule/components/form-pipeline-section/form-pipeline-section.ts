import {
  Input,
  Component,
  inject,
  TemplateRef,
  OnChanges,
  Output,
  SimpleChanges,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NgbModalRef, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../../../core/services/toast.service';
import { RuleService } from '../../api/services/rule.service';
import { SubRuleTabComponent } from '../sub-rule-tab/sub-rule-tab';
import { DetailRuleTabComponent } from '../detail-tab/detail-rule-tab';
import {
  pipelineColumnsV2Aggregation,
  pipelineColumnsV2GetBalance,
  pipelineColumnsV2GetHistorical,
  pipelineColumnsV2RealTimeHistorical,
  pipelineColumnsV2Journey,
  pipelineColumnsV2Watchlist,
  pipelineColumnsV2Null,
} from '../../../../../features/approval/rule/data';
import { PIPELINE_FORM_INIT } from '../../data';
import { SetToVarHolderItemBackup, TabItem } from '../../domain/rule.model';
import { SelectOption } from '../../../../../shared';
import { PipelineTableV2 } from '../pipeline-table-v2/pipeline-table-v2';
import {
  DropdownPipelineType,
  DropdownRuleFunction,
  DropdownRuleOperator,
  DropdownRulePipeline,
  DropdownSubRuleParameter,
  DropdownDataGroup,
  DropdownRule,
  DropdownHistorical,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import {
  enumBoolean,
  timeUnits,
  ttlTypes,
  CustomSelectTypeAComponent,
} from '../../../../../shared';
import {
  mapDropdownSubRuleParameterApiToDomain,
  mapDropdownDataGroupApiToDomain,
  mapDropdownHistoricalFieldApiToDomain,
} from '../../../../approval/rule/mappers/rule-approval.mapper';
import { balanceTimings, valueOperations, valueOperations2 } from '../../data';
import {
  PIPELINE_DETAILS_FORM_INIT,
  DROPDOWN_EVENT_TYPE_GROUPED_OPTIONS,
  SUB_RULE_FORM_INIT,
} from '../../data';
import {
  RuleDetailsSubrulesForm,
  PipelineForm,
  SetToVarHolderItem,
} from '../../domain/rule.model';
import { generateId } from '../../../../../shared/utils/general';
import { SubruleAndVarList } from '../../domain/rule.model';

@Component({
  selector: 'app-form-pipeline-section',
  standalone: true,
  templateUrl: './form-pipeline-section.html',
  styleUrls: [
    './form-pipeline-section.scss',
    '../../../../../shared/styles/index.scss',
  ],
  imports: [
    NgSelectModule,
    CommonModule,
    SubRuleTabComponent,
    FormsModule,
    PipelineTableV2,
    CustomSelectTypeAComponent,
    DetailRuleTabComponent,
    NgbModule,
  ],
})
export class FormPipelineSection implements OnChanges, OnInit {
  @Input() mode: string = '';
  @Input() dropdownPipelineType: DropdownPipelineType[] = [];
  @Input() dropdownFunction: DropdownRuleFunction[] = [];
  @Input() dropdownOperator: DropdownRuleOperator[] = [];
  @Input() dropdownPipeline: DropdownRulePipeline[] = [];
  @Input() dropdownRule: DropdownRule[] = [];
  @Input() dropdownHistorical: DropdownHistorical[] = [];
  @Input() dataVar: string[] = [];
  @Input() subruleForm: RuleDetailsSubrulesForm = {
    ...SUB_RULE_FORM_INIT,
  };
  @Input() hasPipeline: boolean = false;
  @Input() pipelinesData: any[] = [];

  @Output() getDropdownPipeline = new EventEmitter<string>();
  @Output() updateSubruleForm = new EventEmitter<RuleDetailsSubrulesForm>();
  @Output() getVarListAndSubrule = new EventEmitter<SubruleAndVarList>();

  subruleData: any = null;

  setToVarholder = new Map<string, SetToVarHolderItem>();

  columnsTableModal: any[] = [];
  columnsTable: any[] = [];
  tableData: any[] = [];
  displayPipelineCustomData: any = null;
  pipelineCustomDataError: string | null = null;

  enumBoolean = enumBoolean;
  timeUnits = timeUnits;
  ttlTypes = ttlTypes;
  balanceTimings = balanceTimings;
  valueOperations2 = valueOperations2;
  valueOperations = valueOperations;

  dropdownEventTypeGroupedOptions = DROPDOWN_EVENT_TYPE_GROUPED_OPTIONS;

  dropdownDataGroup: DropdownDataGroup[] = [];
  dropdownFunctions: DropdownRuleFunction[] = [];
  dropdownsFunctionTypeB: DropdownRuleFunction[] = [];
  dropdownParameter: DropdownSubRuleParameter[] = [];
  dropdownSetToVar: SelectOption[] = [];
  dropdownSetToVarPipeline: SelectOption[] = [];

  tabs: TabItem[] = [];
  activeTab: string = '';

  pipelineForm: PipelineForm = { ...PIPELINE_FORM_INIT };

  pipelineTempForm: PipelineForm = { ...PIPELINE_FORM_INIT };

  initPipelineTempForm: PipelineForm = { ...PIPELINE_FORM_INIT };

  pipelineDetailsForm: any[] = [];

  pipelineDetailsFormBackup: any[] = [];

  pipelines: PipelineForm[] = [];

  subRuleFormLocal: RuleDetailsSubrulesForm = { ...SUB_RULE_FORM_INIT };

  modalRef!: NgbModalRef;

  private modalService = inject(NgbModal);

  @ViewChild('customTA') customTA!: ElementRef<HTMLTextAreaElement>;

  constructor(
    public confirmationDialogService: ConfirmationModalService,
    private readonly ruleService: RuleService,
    private readonly toast: ToastService,
  ) {}

  getDropdownDataGroup() {
    this.ruleService.ruleMasterDataGroupList(true).subscribe({
      next: (res: any) => {
        this.dropdownDataGroup = res['data'].map((x: any) =>
          mapDropdownDataGroupApiToDomain(x),
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

  getDropdownHistoricalField(historicalId: string, uiId: string) {
    this.ruleService.dropdownHistoricalFieldList(historicalId).subscribe({
      next: (res: any) => {
        const index = this.pipelineDetailsForm.findIndex(
          (x) => x.uiId === uiId,
        );

        if (index !== -1) {
          this.pipelineDetailsForm[index] = {
            ...this.pipelineDetailsForm[index],
            historicalFieldOptions: res['data'].map((y: any) =>
              mapDropdownHistoricalFieldApiToDomain(y),
            ),
          };
        }
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {},
    });
  }

  // pipeline nav :: begin

  addPipeline() {
    const existingIds = new Set(
      this.subRuleFormLocal.pipelines.map((s) => s.uiId),
    );

    let uiId = generateId();

    while (existingIds.has(uiId)) {
      uiId = generateId();
    }

    let number = this.tabs.length + 1;

    while (this.tabs.some((tab) => tab.label === `Pipeline ${number}`)) {
      number++;
    }

    const label = `Pipeline ${number}`;

    this.tabs = [...this.tabs, { label, value: uiId }];

    const tempData = {
      ...this.subruleData,
      pipelines: [
        ...this.subruleData.pipelines,
        {
          uiId: uiId,
          pipelineType: null,
          pipelineDetails: [],
          skipIfExists: false,
          varName: null,
          pipelineCustomData: null,
        },
      ],
    };

    this.subruleData = structuredClone(tempData);

    const freshData = structuredClone(tempData);

    this.updateSubruleForm.emit({
      ...freshData,
    });

    this.handleTabChange(uiId);
  }

  removePipeline(index: number) {
    const removedTab = this.tabs[index];
    if (!removedTab) return;

    const newTabs = this.tabs.filter((_, i) => i !== index);

    if (newTabs.length > 0) {
      const nextIndex = Math.min(index, newTabs.length - 1);

      this.handleTabChange(newTabs[nextIndex].value);
    }

    this.tabs = newTabs;

    const tempData = {
      ...this.subruleData,
      pipelines: this.subruleData.pipelines.filter(
        (p: any) => p.uiId !== removedTab.value,
      ),
    };

    const freshData = structuredClone(tempData);

    this.subruleData = { ...freshData };

    this.updateSubruleForm.emit({
      ...freshData,
    });

    if (freshData.pipelines.length === 0) {
      this.addPipeline();
    }
  }

  loadPipeline(data: any) {
    this.tabs = data.pipelines.map((pipeline: any, index: number) => {
      return {
        label:
          pipeline.pipelineType === 'CUSTOM'
            ? `Pipeline ${index + 1}`
            : pipeline.pipelineType || `Pipeline ${index + 1}`,
        value: pipeline.uiId,
      };
    });

    this.handleTabChange(this.tabs[0].value);
  }

  clonePipeline(index: number) {
    const existingIds = new Set(
      this.subruleData.pipelines.map((s: any) => s.uiId),
    );

    let uiId = generateId();

    while (existingIds.has(uiId)) {
      uiId = generateId();
    }

    const findData = this.subruleData.pipelines[index];

    this.tabs = [
      ...this.tabs,
      {
        label:
          findData.pipelineType === 'CUSTOM'
            ? `Pipeline ${this.tabs.length + 1}`
            : findData.pipelineType || `Pipeline ${this.tabs.length + 1}`,
        value: uiId,
      },
    ];

    const tempData = {
      ...this.subruleData,
      pipelines: [
        ...this.subruleData.pipelines,
        {
          ...findData,
          uiId: uiId,
        },
      ],
    };

    const freshData = structuredClone(tempData);

    this.subruleData = { ...freshData };

    this.updateSubruleForm.emit({
      ...freshData,
    });
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    this.handleContentChange(tab);
  }

  handleContentChange(tab: string) {
    const findData = this.subruleData.pipelines.find(
      (item: any) => item.uiId === tab,
    );

    if (findData) {
      const tempData = {
        ...findData,
        pipelineDetails: findData.pipelineDetails
          ? this.mappingPipelineDetailsForm(findData)
          : [],
      };

      this.pipelineForm = { ...structuredClone(tempData) };
    }

    if (findData?.pipelineCustomData) {
      this.loadPipelineCustomData(findData.pipelineCustomData);
    }

    if (findData?.pipelineType) {
      this.setTableMode(findData.pipelineType);
    }

    if (this.subruleData?.eventType) {
      this.getDropdownSubRuleParameter(this.subruleData?.eventType);
    }

    const selectedVarNames = new Set(
      this.pipelineForm.pipelineDetails.map((type) => type.varName),
    );

    this.dropdownSetToVarPipeline = this.dropdownSetToVar.filter(
      (item) => !selectedVarNames.has(item.value),
    );

    this.createTable();
  }

  // pipeline nav ::end

  open(content: TemplateRef<any>) {
    if (!this.pipelineForm.pipelineType?.includes('Pipeline')) {
      this.initPipelineTempForm = { ...structuredClone(this.pipelineForm) };
      this.pipelineTempForm = { ...structuredClone(this.pipelineForm) };
      this.pipelineDetailsForm = structuredClone(
        this.pipelineForm.pipelineDetails ?? [],
      );
      this.pipelineDetailsFormBackup = structuredClone(
        this.pipelineForm.pipelineDetails ?? [],
      );

      if (this.pipelineTempForm.pipelineType === 'GETHISTORICAL') {
        const pipeline = structuredClone([...this.pipelineDetailsForm]);

        pipeline.forEach((x) => {
          this.getDropdownHistoricalField(x.criteria.CONTEXT, x.uiId);
        });
      }
    }

    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-pipeline',
      centered: true,
      size: 'xl',
    });

    if (this.pipelineTempForm.pipelineType === 'CUSTOM') {
      setTimeout(() => {
        this.autogrow(this.customTA.nativeElement);
      }, 100);
    }
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  removePipelineDetail(uiId: number) {
    this.pipelineDetailsForm = this.pipelineDetailsForm.filter(
      (x) => x.uiId !== uiId,
    );

    this.pipelineTempForm = {
      ...this.pipelineTempForm,
      pipelineDetails: this.pipelineDetailsForm,
    };
  }

  resetPipelineForm() {
    this.tabs = [];
    this.pipelineForm = { ...PIPELINE_FORM_INIT };

    this.columnsTableModal = [];
    this.columnsTable = [];
    this.tableData = [];
  }

  clearFormTemp() {
    this.pipelineTempForm = { ...PIPELINE_FORM_INIT };
    this.initPipelineTempForm = { ...PIPELINE_FORM_INIT };
    this.pipelineDetailsForm = [];
  }

  setTableMode(pipelineType: string) {
    switch (pipelineType) {
      case 'AGGREGATION':
        this.columnsTableModal = pipelineColumnsV2Aggregation;
        this.columnsTable = pipelineColumnsV2Aggregation;

        break;

      case 'GETBALANCE':
        this.columnsTableModal = pipelineColumnsV2GetBalance;
        this.columnsTable = pipelineColumnsV2GetBalance;

        break;

      case 'GETHISTORICAL':
        this.columnsTableModal = pipelineColumnsV2GetHistorical;
        this.columnsTable = pipelineColumnsV2GetHistorical;

        break;

      case 'REALTIMEHISTORICAL':
        this.columnsTableModal = pipelineColumnsV2RealTimeHistorical;
        this.columnsTable = pipelineColumnsV2RealTimeHistorical;

        break;

      case 'JOURNEY':
        this.columnsTableModal = pipelineColumnsV2Journey;
        this.columnsTable = pipelineColumnsV2Journey;

        break;

      case 'WATCHLIST':
        this.columnsTableModal = pipelineColumnsV2Watchlist;
        this.columnsTable = pipelineColumnsV2Watchlist;

        break;

      default:
        this.columnsTableModal = pipelineColumnsV2Null;
        this.columnsTable = pipelineColumnsV2Null;
    }
  }

  getChangedValues(original: any, current: any): any {
    const changes: any = {};

    for (const key in current) {
      const originalValue = original?.[key];
      const currentValue = current[key];

      if (Array.isArray(currentValue)) {
        if (JSON.stringify(originalValue) !== JSON.stringify(currentValue)) {
          changes[key] = {
            from: originalValue,
            to: currentValue,
          };
        }

        continue;
      }

      if (typeof currentValue === 'object' && currentValue !== null) {
        const nested = this.getChangedValues(originalValue || {}, currentValue);

        if (Object.keys(nested).length > 0) {
          changes[key] = nested;
        }

        continue;
      }

      if (currentValue !== originalValue) {
        changes[key] = {
          from: originalValue,
          to: currentValue,
        };
      }
    }

    for (const key in original) {
      if (!(key in current)) {
        changes[key] = {
          from: original[key],
          to: undefined,
        };
      }
    }

    return changes;
  }

  cancel() {
    const { pipelineType, skipIfExists, varName, ...currentValue } =
      this.pipelineTempForm;
    const {
      pipelineType: __,
      skipIfExists: _,
      varName: ___,
      ...initValue
    } = this.initPipelineTempForm;

    const currentValueFiltered = { ...currentValue };
    const initValueFiltered = { ...initValue };

    const changed = this.getChangedValues(
      initValueFiltered,
      currentValueFiltered,
    );

    if (Object.keys(changed).length === 0) {
      this.close();
      this.pipelineTempForm = { ...PIPELINE_FORM_INIT };
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure you want to discard all changes?')
        .then((confirmed) => {
          if (!confirmed) return;

          if (confirmed) {
            this.close();
            this.pipelineTempForm = { ...PIPELINE_FORM_INIT };
          }
        });
    }
  }

  updatePipelineDetail(param: string, value: any, uiId: any) {
    switch (param) {
      case 'accountnumber':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId
            ? {
                ...detail,
                criteria: {
                  ...detail.criteria,
                  ACCOUNTNUMBER: value,
                },
              }
            : detail,
        );

        break;

      case 'context':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) => {
          if (detail.uiId === uiId) {
            return {
              ...detail,
              criteria: {
                ...detail.criteria,
                CONTEXT: value,
              },
            };
          }

          return detail;
        });

        if (this.pipelineTempForm.pipelineType === 'GETHISTORICAL') {
          this.getDropdownHistoricalField(value, uiId);
        }

        break;

      case 'function':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId
            ? {
                ...detail,
                [param]: value.functionName,
                isMultiParam: value.isMultiParam,
                dataType: value.dataType,
                functionFormulaArg: this.getInputType(value.functionFormula),
              }
            : detail,
        );

        break;

      case 'varName':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId
            ? { ...detail, varName: value.target.value }
            : detail,
        );

        break;

      case 'groupBy':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId ? { ...detail, [param]: value } : detail,
        );

        break;

      case 'value':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId
            ? { ...detail, [param]: value.target.value }
            : detail,
        );

        break;

      case 'boolvalue':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId ? { ...detail, value: value.id } : detail,
        );

        break;

      case 'operator':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId
            ? { ...detail, [param]: value.operatorName }
            : detail,
        );

        break;

      case 'outcome':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId
            ? { ...detail, [param]: value.fieldHistorical }
            : detail,
        );

        break;

      case 'outcomeExtra':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId ? { ...detail, [param]: value } : detail,
        );

        break;

      case 'period':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId
            ? { ...detail, [param]: value.target.value }
            : detail,
        );

        break;

      case 'unit':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId ? { ...detail, [param]: value.value } : detail,
        );

        break;

      case 'ttlType':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId ? { ...detail, [param]: value.value } : detail,
        );

        break;

      case 'eventType':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId ? { ...detail, [param]: value } : detail,
        );

        break;

      case 'eventTypeExtra':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId
            ? {
                ...detail,
                [param]: value,
              }
            : detail,
        );
        break;

      case 'key':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId
            ? {
                ...detail,
                criteria: {
                  ...detail.criteria,
                  KEY: value,
                },
              }
            : detail,
        );

        break;

      case 'operation':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId
            ? {
                ...detail,
                criteria: {
                  ...detail.criteria,
                  OPERATION: value,
                },
              }
            : detail,
        );

        break;

      case 'previousContext':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId
            ? {
                ...detail,
                criteria: {
                  ...detail.criteria,
                  PREVIOUSCONTEXT: value,
                },
              }
            : detail,
        );
        break;

      case 'criteriaValue':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId
            ? {
                ...detail,
                criteria: {
                  ...detail.criteria,
                  VALUE: value,
                },
              }
            : detail,
        );
        break;

      case 'group':
        this.pipelineDetailsForm = this.pipelineDetailsForm.map((detail) =>
          detail.uiId === uiId
            ? {
                ...detail,
                criteria: {
                  ...detail.criteria,
                  GROUP: value,
                },
              }
            : detail,
        );

        break;
    }

    this.pipelineTempForm = {
      ...this.pipelineTempForm,
      pipelineDetails: this.pipelineDetailsForm,
    };
  }

  saveDataVarChanges() {
    const validData = this.dataVar.filter(
      (x) => typeof x === 'string' && x.replace(/\s/g, '').length > 0,
    );

    this.dropdownSetToVar = validData.map((x) => ({
      label: x.trim(),
      value: x.trim(),
    }));

    const newItemsV2 = validData.map((x) => ({
      name: x.trim(),
      value: x.trim(),
    }));

    this.dropdownEventTypeGroupedOptions = (
      this.dropdownEventTypeGroupedOptions || []
    ).map((group) => {
      if (group.group === 'SET TO VAR') {
        return { ...group, items: [...newItemsV2] };
      }
      return group;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dropdownFunction']) {
      if (changes['dropdownFunction'].currentValue) {
        this.dropdownsFunctionTypeB = this.dropdownFunction.filter(
          (x) => x.isAggregation,
        );
        this.dropdownFunctions = this.dropdownFunction;
      }
    }

    if (changes['dataVar']) {
      if (changes['subruleForm'].currentValue) {
        this.saveDataVarChanges();
      }
    }

    if (changes['subruleForm']) {
      if (changes['subruleForm'].currentValue) {
        const data = changes['subruleForm'].currentValue;

        if (JSON.stringify(data) === JSON.stringify(this.subruleData)) {
          return;
        }

        this.tabs = [];
        this.activeTab = '';
        this.subruleData = data;

        if (data.hasPipeline && data.pipelines.length === 0) {
          this.addPipeline();
        }

        if (data.hasPipeline && data.pipelines.length > 0) {
          this.loadPipeline(data);
        }
      }
    }
  }

  ngOnInit(): void {
    this.getDropdownDataGroup();
  }

  updatePipeline(param: string, value: any) {
    if (param === 'pipelineType') {
      this.pipelineDetailsForm = [];

      this.pipelineTempForm = {
        ...this.pipelineTempForm,
        pipelineDetails: this.pipelineDetailsForm,
        pipelineType: value,
      };

      if (value === 'WATCHLIST') {
        this.getDropdownDataGroup();
      }

      this.setTableMode(value);

      return;
    }

    this.pipelineTempForm = { ...this.pipelineTempForm, [param]: value };
  }

  addPipelineDetail() {
    const type = this.pipelineTempForm.pipelineType;
    const base = {
      ...PIPELINE_DETAILS_FORM_INIT,
      criteria: { ...PIPELINE_DETAILS_FORM_INIT.criteria },
      uiId: generateId(),
    };

    let newPipelineDetails: any = base;

    switch (type) {
      case 'GETBALANCE':
        newPipelineDetails = {
          ...base,
          criteria: {
            ...base.criteria,
            CURRTRXAMOUNT: '%%AMOUNT%%',
            CONTEXT: 'BEFORETRX',
          },
          outcome: 'BALANCE',
        };
        break;
      case 'JOURNEY':
        newPipelineDetails = {
          ...base,
          outcome: 'VALIDJOURNEY',
          operator: '=',
        };
        break;
      case 'REALTIMEHISTORICAL':
        newPipelineDetails = { ...base, outcome: 'VALUE' };
        break;
      case 'WATCHLIST':
        newPipelineDetails = { ...base, outcome: 'VERDICT', operator: '=' };
        break;
    }

    this.pipelineDetailsForm = [
      ...this.pipelineDetailsForm,
      newPipelineDetails,
    ];

    this.pipelineTempForm = {
      ...this.pipelineTempForm,
      pipelineDetails: this.pipelineDetailsForm,
    };
  }

  validInput(input: string): Boolean {
    let data = input;

    try {
      const parsed = JSON.parse(`[${data}]`);

      if (
        !Array.isArray(parsed) ||
        !parsed.every(
          (item) =>
            item !== null && typeof item === 'object' && !Array.isArray(item),
        )
      ) {
        this.pipelineCustomDataError = 'Input must contain JSON objects only';
        return false;
      }
    } catch {
      this.pipelineCustomDataError = 'Invalid JSON object format';
      return false;
    }

    return true;
  }

  submit() {
    if (this.pipelineTempForm.pipelineCustomData) {
      if (!this.validInput(this.pipelineTempForm.pipelineCustomData)) {
        return;
      }
      this.pipelineCustomDataError = null;
    }

    this.pipelineForm = {
      ...this.pipelineForm,
      pipelineType: this.pipelineTempForm.pipelineType,
      pipelineDetails: this.pipelineTempForm.pipelineDetails,
      skipIfExists: this.pipelineTempForm.skipIfExists,
      varName: this.pipelineTempForm.varName,
      pipelineCustomData: this.pipelineTempForm.pipelineCustomData,
    };

    const existingIndex = this.subruleData.pipelines.findIndex(
      (p: any) => p.uiId === this.pipelineForm.uiId,
    );

    const pipelines =
      existingIndex >= 0
        ? this.subruleData.pipelines.map((p: any) =>
            p.uiId === this.pipelineForm.uiId
              ? { ...p, ...this.pipelineForm }
              : p,
          )
        : [...this.subruleData.pipelines, this.pipelineForm];

    const tempData = {
      ...this.subruleData,
      pipelines: [...pipelines],
    };

    this.subruleData = structuredClone(tempData);

    this.pipelineDetailsFormBackup.forEach((x) => {
      const current = this.setToVarholder.get(x.uiId);
      if (current) {
        current.oldValue = x.varName;
      }
    });

    const backup: SetToVarHolderItemBackup[] = [
      ...this.setToVarholder.values(),
    ];

    const payload = {
      subrule: structuredClone(this.subruleData),
      varlist: backup,
    };

    this.getVarListAndSubrule.emit(payload);

    this.clearFormTemp();

    this.handleTabChange(this.activeTab);

    const tab = this.tabs.find((x) => x.value === this.activeTab);

    if (tab) {
      if (
        this.pipelineForm.pipelineType &&
        this.pipelineForm.pipelineType !== 'CUSTOM'
      ) {
        tab.label = this.pipelineForm.pipelineType;
      }
    }

    this.close();
  }

  createTable() {
    switch (this.pipelineForm.pipelineType) {
      case 'GETHISTORICAL':
        this.tableData = (this.pipelineForm.pipelineDetails ?? []).map((x) => ({
          ...x,
          criteria: {
            ...x.criteria,
            CONTEXT: this.findLabel('historical', x.criteria?.CONTEXT),
          },
        }));
        break;

      case 'JOURNEY':
        this.tableData = (this.pipelineForm.pipelineDetails ?? []).map((x) => ({
          ...x,
          criteria: {
            ...x.criteria,
          },
          unit: this.findLabel('unit', x.unit),
          ttlType: this.findLabel('ttltype', x.ttlType),
          value:
            x.value === 'true'
              ? 'True'
              : x.value === 'false'
                ? 'False'
                : x.value === true
                  ? 'True'
                  : x.value === false
                    ? 'False'
                    : null,
        }));
        break;

      case 'WATCHLIST':
        this.tableData = (this.pipelineForm.pipelineDetails ?? []).map((x) => ({
          ...x,
          criteria: {
            ...x.criteria,
            GROUP: this.findLabel('datagroup', x.criteria?.GROUP),
          },
          value:
            x.value === 'true'
              ? 'True'
              : x.value === 'false'
                ? 'False'
                : x.value === true
                  ? 'True'
                  : x.value === false
                    ? 'False'
                    : null,
        }));
        break;

      default:
        this.tableData = (this.pipelineForm.pipelineDetails ?? []).map((x) => ({
          ...x,
          unit: x.unit ? this.findLabel('unit', x.unit) : null,
          ttlType: x.ttlType ? this.findLabel('ttltype', x.ttlType) : null,
        }));
    }
  }

  getInputType(str: string): 'single' | 'multiple' {
    const match = str.match(/\{([^}]*)\}/);

    if (!match) return 'single';

    const content = match[1];

    return content.includes(',') ? 'multiple' : 'single';
  }

  onSelect(item: any, key?: string, uiId?: any) {
    this.updatePipelineDetail(key ?? '', item.value, uiId);
  }

  findFunctionEventType(functionName: string): string {
    const findFormula = this.dropdownFunction.find(
      (x) => x.functionName === functionName,
    )?.functionFormula;

    if (findFormula) {
      return this.getInputType(findFormula);
    }

    return 'multiple';
  }

  isInvalid(): boolean {
    if (!this.pipelineTempForm.pipelineType) {
      return true;
    }

    if (this.pipelineTempForm.skipIfExists) {
      if (!this.pipelineTempForm.varName) {
        return true;
      }
    }

    if (this.pipelineTempForm.pipelineType === 'AGGREGATION') {
      const isValid = (this.pipelineTempForm.pipelineDetails ?? []).every(
        this.validateAggregationItem.bind(this),
      );

      return !isValid;
    }

    if (this.pipelineTempForm.pipelineType === 'GETBALANCE') {
      const isValid = (this.pipelineTempForm.pipelineDetails ?? []).every(
        this.validateGetBalanceItem.bind(this),
      );

      return !isValid;
    }

    if (this.pipelineTempForm.pipelineType === 'GETHISTORICAL') {
      const isValid = (this.pipelineTempForm.pipelineDetails ?? []).every(
        this.validateGetHistoricalItem.bind(this),
      );

      return !isValid;
    }

    if (this.pipelineTempForm.pipelineType === 'REALTIMEHISTORICAL') {
      const isValid = (this.pipelineTempForm.pipelineDetails ?? []).every(
        this.validateRealTimeHistoricalItem.bind(this),
      );

      return !isValid;
    }

    if (this.pipelineTempForm.pipelineType === 'JOURNEY') {
      const isValid = (this.pipelineTempForm.pipelineDetails ?? []).every(
        this.validateJourneyItem.bind(this),
      );

      return !isValid;
    }

    if (this.pipelineTempForm.pipelineType === 'WATCHLIST') {
      const isValid = (this.pipelineTempForm.pipelineDetails ?? []).every(
        this.validateWatchlistItem.bind(this),
      );

      return !isValid;
    }

    if (this.pipelineTempForm.pipelineType === 'NULL') {
      const isValid = (this.pipelineTempForm.pipelineDetails ?? []).every(
        this.validateNullItem.bind(this),
      );

      return !isValid;
    }

    if (this.pipelineTempForm.pipelineType === 'CUSTOM') {
      const isValid = this.validateCustomItem(this.pipelineTempForm);

      return !isValid;
    }

    return true;
  }

  validateAggregationItem(item: any) {
    const requiredFields = [
      'eventType',
      'value',
      'operator',
      'period',
      'unit',
      'ttlType',
      'function',
    ];

    for (const field of requiredFields) {
      if (!item[field]) {
        return false;
      }
    }

    if (item.functionFormulaArg === 'multiple' && !item.eventType) {
      return false;
    }

    return true;
  }

  validateGetBalanceItem(item: any) {
    const requiredFields = ['value', 'operator'];

    for (const field of requiredFields) {
      if (!item[field]) {
        return false;
      }
    }

    if (!item.criteria?.ACCOUNTNUMBER) return false;

    if (!item.criteria?.CONTEXT) return false;

    return true;
  }

  validateGetHistoricalItem(item: any) {
    const requiredFields = ['value', 'operator', 'varName', 'outcome'];

    for (const field of requiredFields) {
      if (!item[field]) {
        return false;
      }
    }

    if (!item.criteria?.CONTEXT) return false;

    if (!item.criteria?.KEY) return false;

    return true;
  }

  validateRealTimeHistoricalItem(item: any) {
    const requiredFields = ['value', 'operator', 'period', 'unit', 'ttlType'];

    for (const field of requiredFields) {
      if (!item[field]) {
        return false;
      }
    }

    return true;
  }

  validateJourneyItem(item: any) {
    const requiredFields = ['value', 'period', 'unit', 'ttlType'];

    for (const field of requiredFields) {
      const val = item[field];

      if (val === null || val === undefined || val === '') {
        return false;
      }
    }

    if (!item.criteria?.CONTEXT) return false;

    return true;
  }

  validateWatchlistItem(item: any) {
    const requiredFields = ['value'];

    for (const field of requiredFields) {
      const val = item[field];

      if (val === null || val === undefined || val === '') {
        return false;
      }
    }

    if (!item.criteria?.VALUE) return false;
    if (!item.criteria?.OPERATION) return false;
    if (!item.criteria?.GROUP) return false;

    return true;
  }

  validateNullItem(item: any) {
    const requiredFields = ['function', 'value', 'operator', 'eventType'];

    for (const field of requiredFields) {
      if (!item[field]) {
        return false;
      }
    }

    return true;
  }

  validateCustomItem(item: any) {
    const requiredFields = ['pipelineCustomData'];

    for (const field of requiredFields) {
      if (!item[field]) {
        return false;
      }
    }

    return true;
  }

  generateSetToVarOptions(data: any[]) {
    const validData = data.filter(
      (x) =>
        typeof x.varName === 'string' &&
        x.varName.replace(/\s/g, '').length > 0,
    );

    const newItems = validData.map((x) => ({
      label: x.varName.trim(),
      value: x.varName.trim(),
    }));

    const newItemsV2 = validData.map((x) => ({
      name: x.varName.trim(),
      value: x.varName.trim(),
    }));

    if (newItemsV2.length > 0) {
      const dropdownEventTypeGroupedOptionsTemp = (
        this.dropdownEventTypeGroupedOptions || []
      ).map((group) => {
        if (group.group === 'SET TO VAR') {
          const existingItems = group.items || [];
          const mergedItems = [...existingItems];

          newItemsV2.forEach((newItem) => {
            const index = mergedItems.findIndex(
              (item) => item.value === newItem.value,
            );

            if (index !== -1) {
              mergedItems[index] = { ...mergedItems[index], ...newItem };
            } else {
              mergedItems.push(newItem);
            }
          });

          return { ...group, items: mergedItems };
        }

        return group;
      });

      this.dropdownEventTypeGroupedOptions = [
        ...dropdownEventTypeGroupedOptionsTemp,
      ];
    }

    if (newItems.length > 0) {
      newItems.forEach((newItem) => {
        const existingIndex = this.dropdownSetToVar.findIndex(
          (item: any) => item.value === newItem.value,
        );

        if (existingIndex !== -1) {
          this.dropdownSetToVar[existingIndex] = {
            ...this.dropdownSetToVar[existingIndex],
            ...newItem,
          };
        } else {
          this.dropdownSetToVar.push(newItem);
        }
      });
    }
  }

  findLabel(key: string, value: any) {
    switch (key) {
      case 'rule':
        return (
          this.dropdownRule.find((x) => x.ruleId === value)?.ruleName ?? value
        );

      case 'historical':
        return (
          this.dropdownHistorical.find((x) => x.historicalId === value)
            ?.tableHistorical ?? value
        );

      case 'datagroup':
        return (
          this.dropdownDataGroup.find((x) => x.dataGroupId === value)
            ?.dataGroupName ?? value
        );

      case 'unit':
        return this.timeUnits.find((x) => x.value === value)?.label ?? value;

      case 'ttltype':
        return this.ttlTypes.find((x) => x.value === value)?.label ?? value;
    }
  }

  private getDropdownSubRuleParameter(parameterType: string): Promise<void> {
    return new Promise((resolve) => {
      this.ruleService.ruleMasterParameterList(parameterType).subscribe({
        next: (res: any) => {
          this.dropdownParameter = res['data'].map((x: any) =>
            mapDropdownSubRuleParameterApiToDomain(x),
          );

          this.dropdownEventTypeGroupedOptions = (
            this.dropdownEventTypeGroupedOptions || []
          ).map((group) => {
            if (group.group === 'Event Type') {
              return {
                ...group,
                items: (this.dropdownParameter || []).map((param) => ({
                  name: param?.parameterValue ?? '',
                  value: param?.parameterValue ?? '',
                })),
              };
            }
            return group;
          });
        },
        error: (e) => {
          if (e.status !== 400) {
            this.toast.error('Something went wrong while loading data');
          }
          resolve();
        },
        complete: () => {
          if (this.dataVar && this.dataVar.length > 0) {
            this.saveDataVarChanges();
          }

          resolve();
        },
      });
    });
  }

  autogrow(textarea: HTMLTextAreaElement) {
    const minHeight = 300;
    const maxHeight = 1224;

    textarea.style.height = 'auto';
    let newHeight = textarea.scrollHeight;

    if (newHeight < minHeight) {
      newHeight = minHeight;
    } else if (newHeight > maxHeight) {
      newHeight = maxHeight;
    }

    textarea.style.height = newHeight + 'px';
  }

  // ====

  loadPipelineCustomData(data: any) {
    const cleanedData = data.trim().replace(/^"|"$/g, '');

    this.displayPipelineCustomData = JSON.parse(`[${cleanedData}]`)
      .map((item: any) => JSON.stringify(item, null, 2))
      .join(',\n');
  }

  mappingPipelineDetailsForm(data: any) {
    switch (data.pipelineType) {
      case 'AGGREGATION':
        return data.pipelineDetails.map((y: any) => {
          const functionType = y.function
            ? this.findFunctionEventType(y.function)
            : null;

          const splitEvent = y.eventType ? y.eventType.split(',') : [];

          return {
            ...y,
            uiId: y.uiId || generateId(),
            functionFormulaArg: functionType,
            eventType: splitEvent[0] ?? null,

            groupBy:
              y.groupBy?.length > 0
                ? y.groupBy
                : splitEvent.length > 1
                  ? splitEvent.slice(1)
                  : null,
          };
        });

      case 'GETHISTORICAL':
        return data.pipelineDetails.map((y: any) => {
          const splitOutcome = y.outcome ? y.outcome.split(',') : [];

          return {
            ...y,
            uiId: y.uiId || generateId(),

            outcome: splitOutcome.length > 0 ? splitOutcome[0] : null,
            outcomeExtra: y.outcomeExtra
              ? y.outcomeExtra
              : splitOutcome.length > 1
                ? splitOutcome[1]
                : null,
          };
        });

      case 'REALTIMEHISTORICAL':
        return data.pipelineDetails.map((y: any) => {
          const validValues = new Set(
            this.dropdownEventTypeGroupedOptions.flatMap((group) =>
              group.items.map((item) => item.value),
            ),
          );

          const key = y.criteria.KEY;
          const value = y.criteria.VALUE;
          const isValidValue = validValues.has(value);
          const isValidKey = validValues.has(key);

          return {
            ...y,
            uiId: y.uiId || generateId(),
            criteria: {
              ...y.criteria,
              KEY: isValidKey ? y.criteria.KEY : null,
              VALUE: isValidValue ? y.criteria.VALUE : null,
            },
          };
        });

      case 'NULL':
        return data.pipelineDetails.map((y: any) => {
          const validValues = new Set(
            this.dropdownEventTypeGroupedOptions.flatMap((group) =>
              group.items.map((item) => item.value),
            ),
          );

          const eventType = y.eventType;

          const eventTypeExtra = y.eventTypeExtra;

          const isValidEventType = validValues.has(eventType);
          const isValidEventTypeExtra = eventTypeExtra
            ? validValues.has(eventTypeExtra)
            : false;

          return {
            ...y,
            uiId: y.uiId || generateId(),

            eventType: isValidEventType ? eventType : null,
            eventTypeExtra: isValidEventTypeExtra ? eventTypeExtra : null,
          };
        });

      default:
        return data.pipelineDetails.map((y: any) => ({
          ...y,
          uiId: y.uiId || generateId(),
        }));
    }
  }

  onInput(uiId: string, value: string) {
    this.setToVarholder.set(uiId, {
      uiId: uiId,
      newValue: value,
      oldValue: null,
    });
  }
}
