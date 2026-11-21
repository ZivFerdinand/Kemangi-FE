import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormsModule,
  FormArray,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { NgbModule, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RuleService } from '../../api/services/rule.service';
import { requiredTrimmed } from '../../../../../core/validators/required-trimmed.validator';
import { ToggleSwitch } from '../../../../../shared';
import { FormSubRuleSectionV2 } from '../form-subrule-section-v2/form-subrule-section-v2';
import { ToastService } from '../../../../../core/services/toast.service';
import { BadgeUploadedDoc, enumBoolean } from '../../../../../shared';
import { ruleTypes } from '../../data';
import {
  DropdownDataGroup,
  DropdownPipelineType,
  DropdownProductGroup,
  DropdownRuleFunction,
  DropdownRuleOperator,
  DropdownSubRuleParameterType,
  DropdownRulePipeline,
  DropdownEmailTemplate,
  DropdownHistorical,
  DropdownAb,
  DropdownRule,
} from '../../../../approval/rule/domain/models/rule-approval.model';
import {
  RuleDetailsForm,
  RuleDetailsSubrulesForm,
} from './../../domain/rule.model';
import {
  DateRangePickerComponent,
  DatePayload,
} from '../../../../../shared/components/date-range-picker/date-range-picker';

interface BackPage {
  initValue: any;
  currentValue: any;
}
@Component({
  selector: 'app-rule-form',
  templateUrl: './rule-form.html',
  styleUrls: ['./rule-form.scss', '../../../../../shared/styles/index.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ToggleSwitch,
    NgbModule,
    FormSubRuleSectionV2,
    BadgeUploadedDoc,
    DateRangePickerComponent,
  ],
  providers: [DatePipe],
})
export class RuleForm implements OnInit, OnChanges {
  form!: FormGroup;

  @Input() mode: string = 'CREATE';
  @Input() approvalStatus: string = '';
  @Input() requestType: string = '';
  @Input() initDataForm: RuleDetailsForm | null = null;

  @Output() getDropdownPipeline = new EventEmitter<string>();
  @Output() getDropdownSubRuleParameterType = new EventEmitter<string>();
  @Output() getDropdownEmailTemplate = new EventEmitter<string>();
  @Output() handleBackPage = new EventEmitter<BackPage>();
  @Output() handleSubmitDraft = new EventEmitter<any>();
  @Output() handleSubmit = new EventEmitter<any>();

  @Input() dropdownProductGroup: DropdownProductGroup[] = [];
  @Input() dropdownFunction: DropdownRuleFunction[] = [];
  @Input() dropdownDataGroup: DropdownDataGroup[] = [];
  @Input() dropdownOperator: DropdownRuleOperator[] = [];
  @Input() dropdownPipelineType: DropdownPipelineType[] = [];
  @Input() dropdownParameterType: DropdownSubRuleParameterType[] = [];
  @Input() dropdownPipeline: DropdownRulePipeline[] = [];
  @Input() dropdownHistorical: DropdownHistorical[] = [];
  @Input() dropdownEmailTemplate: DropdownEmailTemplate[] = [];
  @Input() dropdownAb: DropdownAb[] = [];
  @Input() dropdownRule: DropdownRule[] = [];

  prefixRuleName: string | null = null;
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;

  enumBoolean = enumBoolean;
  ruleTypes = ruleTypes;

  initialFormValue: any = {};

  ruleForm: RuleDetailsForm | null = null;

  DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

  minDate: NgbDate | null | any;

  @ViewChild('productSelect') productSelect!: NgSelectComponent;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private readonly ngbCalendar: NgbCalendar,
    private ruleService: RuleService,
    private toast: ToastService,
  ) {
    this.initForm();

    this.minDate = ngbCalendar.getToday();
  }

  ngOnInit() {
    if (this.mode === 'DELETE') {
      this.disableFields();
    }

    if (this.mode === 'UPDATE' || this.mode === 'DRAFT UPDATE') {
      this.form.get('ruleId')?.disable();
    }

    this.form.get('productType')?.valueChanges.subscribe((value) => {
      if (value) {
        this.onProductTypeFilled(value);
      }
    });

    this.subscribeForm();
  }

  private subscribeForm() {
    this.form
      .get('ruleName')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.ruleForm = {
          ...this.ruleForm,
          apprId: this.ruleForm?.apprId ?? null,
          id: this.ruleForm?.id ?? null,
          ruleId: this.ruleForm?.ruleId ?? null,
          productType: this.ruleForm?.productType ?? null,
          ruleDescShort: this.ruleForm?.ruleDescShort ?? null,
          ruleDescLong: this.ruleForm?.ruleDescLong ?? null,
          ruleType: this.ruleForm?.ruleType ?? null,
          activeStatus: this.ruleForm?.activeStatus ?? true,
          ruleStart: this.ruleForm?.ruleStart ?? null,
          ruleEnd: this.ruleForm?.ruleEnd ?? null,
          autoBlockFlag: this.ruleForm?.autoBlockFlag ?? false,
          alertFlag: this.ruleForm?.alertFlag ?? true,
          listFiles: this.ruleForm?.listFiles ?? [],
          subrules: this.ruleForm?.subrules ?? [],
          ruleName: value,
        };
      });
  }

  private disableFields(): void {
    [
      'productType',
      'ruleName',
      'ruleDescShort',
      'ruleDescLong',
      'ruleType',
      'ruleStart',
      'ruleEnd',
      'alertFlag',
      'ruleId',
    ].forEach((key) => this.form.get(key)?.disable());
  }

  onProductTypeFilled(value: any) {
    this.getDropdownSubRuleParameterType.emit(value);
    this.getDropdownEmailTemplate.emit(value);
  }

  get subrules(): FormArray {
    return this.form.get('subrules')! as FormArray;
  }

  back() {
    const { ruleEnd, ruleStart } = this.initialFormValue;

    const formattedStartDate = ruleStart
      ? this.datePipe.transform(ruleStart, 'yyyy-MM-dd')
      : null;

    const formattedEndDate = ruleEnd
      ? this.datePipe.transform(ruleEnd, 'yyyy-MM-dd')
      : null;

    const initValue = {
      ...this.initialFormValue,
      ruleStart: formattedStartDate,
      ruleEnd:
        formattedEndDate === formattedStartDate ? null : formattedEndDate,
      listFiles: this.mode !== 'UPDATE' ? this.initialFormValue.listFiles : [],
    };

    const currentValue = {
      ...this.initialFormValue,
      ...this.form.getRawValue(),
      ruleStart: this.form.getRawValue().ruleStart || null,
      ruleEnd: this.form.getRawValue().ruleEnd || null,
      subrules: this.ruleForm?.subrules,
    };

    const data = {
      initValue: initValue,
      currentValue: currentValue,
    };

    this.handleBackPage.emit(data);
  }

  onSubmitDraft() {
    const payload = {
      ...this.initialFormValue,
      ...this.form.getRawValue(),
      autoBlockFlag: this.ruleForm?.autoBlockFlag,
      subrules: this.ruleForm?.subrules,
    };

    this.handleSubmitDraft.emit(payload);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.initialFormValue,
      ...this.form.getRawValue(),
      autoBlockFlag: this.ruleForm?.autoBlockFlag,
      subrules: this.ruleForm?.subrules,
    };

    this.handleSubmit.emit(payload);
  }

  emitDropdownPipeline(pipelineType: string) {
    this.getDropdownPipeline.emit(pipelineType);
  }

  onFileSelected(event: any) {
    window.removeEventListener('focus', this.onWindowFocus);
    this.fileInputOpened = false;

    const file: File = event.target.files[0];

    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF or Excel files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.ruleService.uploadRuleFile(formData).subscribe({
      next: (res) => {
        const formArray = this.listFiles;

        formArray.push(
          this.fb.group({
            originalName: [res?.original_name],
            extension: [res?.extension],
            generatedName: [res?.generated_name],
          }),
        );
      },
      error: (e) => {
        if (e?.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
    });
  }

  get f() {
    return this.form.controls;
  }

  get listFiles(): FormArray {
    return this.form.get('listFiles') as FormArray;
  }

  clearFile(generatedName: string) {
    const formArray = this.listFiles;

    const index = formArray.controls.findIndex(
      (ctrl) => ctrl.value.generatedName === generatedName,
    );

    if (index !== -1) {
      formArray.removeAt(index);
    }
  }

  autogrow(textarea: HTMLTextAreaElement) {
    const minHeight = 48;
    const maxHeight = 168;

    textarea.style.height = 'auto';
    let newHeight = textarea.scrollHeight;

    if (newHeight < minHeight) {
      newHeight = minHeight;
    } else if (newHeight > maxHeight) {
      newHeight = maxHeight;
    }

    textarea.style.height = newHeight + 'px';
  }

  onKeyDown(event: KeyboardEvent, controlName: string, index?: number) {
    let control;

    if (controlName === 'value' && index !== undefined) {
      // control = this.values.at(index);
    } else {
      control = this.form.get(controlName);
    }

    const value = control?.value ?? '';
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];

    if (value.length >= 256 && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  patchDateFromApi(apiStartDate: string | null, apiEndDate: string | null) {
    const formattedStartDate = apiStartDate
      ? this.datePipe.transform(apiStartDate, 'dd/MM/yyyy')
      : null;

    const formattedEndDate = apiEndDate
      ? this.datePipe.transform(apiEndDate, 'dd/MM/yyyy')
      : null;

    if (formattedStartDate && apiStartDate) {
      const start = new Date(apiStartDate);

      this.fromDate = new NgbDate(
        start.getFullYear(),
        start.getMonth() + 1,
        start.getDate(),
      );

      this.f['ruleStart'].setValue(
        this.dateFormatter(this.fromDate, this.DEFAULT_DATE_FORMAT),
      );
    } else {
      this.f['ruleStart'].setValue(null);
    }

    if (formattedEndDate && apiEndDate) {
      if (formattedStartDate === formattedEndDate) {
        return;
      }

      const end = new Date(apiEndDate);

      this.toDate = new NgbDate(
        end.getFullYear(),
        end.getMonth() + 1,
        end.getDate(),
      );

      this.f['ruleEnd'].setValue(
        this.dateFormatter(this.toDate, this.DEFAULT_DATE_FORMAT),
      );
    } else {
      this.f['ruleEnd'].setValue(null);
    }
  }

  dateFormatter(date: NgbDate, format: string) {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    return this.datePipe.transform(jsDate, format);
  }

  //  ===== new changes

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['initDataForm'];

    if (change && change.currentValue) {
      const value = change.currentValue;

      if (value) {
        this.loadData(value);
      }
    }
  }

  loadData(data: RuleDetailsForm) {
    this.initialFormValue = structuredClone({ ...data });
    this.ruleForm = structuredClone({ ...data });

    this.loadForm(data);

    this.loadPrefix(data);

    this.patchDateFromApi(data.ruleStart, data.ruleEnd);

    if (
      this.mode !== 'UPDATE' &&
      this.mode !== 'DELETE' &&
      this.approvalStatus !== 'REJECTED'
    ) {
      this.loadFiles(data);
    }
  }

  loadForm(data: RuleDetailsForm) {
    this.form.patchValue({
      apprId: data.apprId,
      ruleId: data.ruleId,
      productType: data.productType,
      ruleName: data.ruleName,
      ruleDescShort: data.ruleDescShort,
      ruleDescLong: data.ruleDescLong,
      ruleType: data.ruleType,
      activeStatus: data.activeStatus,
      alertFlag: data.alertFlag,
    });
  }

  loadFiles(data: RuleDetailsForm) {
    let formArray;

    if (data.listFiles && data.listFiles?.length > 0) {
      formArray = this.fb.array(
        data.listFiles.map((res: any) =>
          this.fb.group({
            originalName: [res?.originalName],
            extension: [res?.extension],
            generatedName: [res?.generatedName],
          }),
        ),
      );

      this.form.setControl('listFiles', formArray);
    }
  }

  initForm() {
    this.form = this.fb.group({
      apprId: [null],
      ruleId: [null],
      productType: [null, [Validators.required]],
      ruleName: ['', [requiredTrimmed, Validators.maxLength(255)]],
      ruleDescShort: ['', [requiredTrimmed, Validators.maxLength(255)]],
      ruleDescLong: ['', [requiredTrimmed]],
      ruleType: [null, [Validators.required]],
      activeStatus: [true],
      ruleStart: ['', [Validators.required]],
      ruleEnd: [''],
      alertFlag: [true],
      listFiles: this.fb.array([], Validators.required),
      subrules: this.fb.array([]),
    });
  }

  updateSubrules(data: RuleDetailsSubrulesForm[]) {
    if (this.ruleForm) {
      const existingSubrules = this.ruleForm.subrules ?? [];
      const incomingIds = new Set(data.map((s) => s.uiId));

      const mergedSubrules = existingSubrules.filter((s) =>
        incomingIds.has(s.uiId),
      );

      data.forEach((newSubrule) => {
        const index = mergedSubrules.findIndex(
          (s) => s.uiId === newSubrule.uiId,
        );
        if (index >= 0) {
          mergedSubrules[index] = { ...mergedSubrules[index], ...newSubrule };
        } else {
          mergedSubrules.push(newSubrule);
        }
      });

      const hasAutoBlock = mergedSubrules.some((subrule) =>
        subrule.autoAction?.some((a) => a.channelType === 'AUTOBLOCK'),
      );

      this.prefixRuleName = hasAutoBlock ? 'AB-' : null;
      this.ruleForm = structuredClone({
        ...this.ruleForm,
        subrules: mergedSubrules,
        autoBlockFlag: hasAutoBlock ? true : false,
      });
    }
  }

  loadPrefix(data: RuleDetailsForm) {
    const subrules = data.subrules;
    const hasAutoBlock = subrules.some((subrule) =>
      subrule.autoAction?.some((a) => a.channelType === 'AUTOBLOCK'),
    );

    this.prefixRuleName = hasAutoBlock ? 'AB-' : null;
  }

  fileInputOpened = false;

  onFileInputClick() {
    this.fileInputOpened = true;

    window.addEventListener('focus', this.onWindowFocus.bind(this), {
      once: true,
    });
  }

  onWindowFocus() {
    setTimeout(() => {
      if (this.fileInputOpened) {
        const listFiles = this.form.get('listFiles') as FormArray;
        if (listFiles.length === 0) {
          listFiles.markAsTouched();
        }
        this.fileInputOpened = false;
      }
    }, 300);
  }

  onFromDateChange(data: DatePayload | null) {
    this.fromDate = data?.date || null;

    if (this.fromDate) {
      const fromDateFormatted = this.dateFormatter(
        this.fromDate,
        this.DEFAULT_DATE_FORMAT,
      );
      this.f['ruleStart'].setValue(fromDateFormatted);
      return;
    }

    this.f['ruleStart'].setValue(null);
  }

  onToDateChange(data: DatePayload | null) {
    this.toDate = data?.date || null;

    if (this.toDate) {
      const fromDateFormatted = this.dateFormatter(
        this.toDate,
        this.DEFAULT_DATE_FORMAT,
      );
      this.f['ruleEnd'].setValue(fromDateFormatted);
      return;
    }

    this.f['ruleEnd'].setValue(null);
  }

  isInvalid(): boolean {
    const payload = {
      ...this.initialFormValue,
      ...this.form.getRawValue(),
      autoBlockFlag: this.ruleForm?.autoBlockFlag,
      subrules: this.ruleForm?.subrules,
    };

    return !this.validateForm(payload);
  }

  validateForm(form: any): boolean {
    const requiredFields = [
      'productType',
      'ruleName',
      'ruleDescShort',
      'ruleDescLong',
      'ruleType',
      'listFiles',
      'subrules',
      'ruleStart',
    ];

    for (const field of requiredFields) {
      const val = form[field];

      if (val === null || val === undefined || val === '') {
        return false;
      }
    }

    if (!form.subrules?.length) {
      return false;
    }

    return form.subrules.every(this.validateSubruleItem.bind(this));
  }

  validateSubruleItem(subrule: any): boolean {
    const requiredFields = ['eventType', 'parameters'];

    for (const field of requiredFields) {
      const val = subrule[field];

      if (val === null || val === undefined || val === '') {
        return false;
      }
    }

    if (!subrule.parameters?.length) {
      return false;
    }

    return subrule.parameters.every(
      this.validateSubruleParameterItem.bind(this),
    );
  }

  validateSubruleParameterItem(item: any): boolean {
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
}
