import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';

import { ToggleSwitch } from './../../../../../shared/components/toggle-switch/toggle-switch';
import { placeholderValidator } from '../../../../../core/validators/placeholder.validator';
import { environment } from './../../../../../environments/environment';
import { ToastService } from '../../../../../core/services/toast.service';
import { EmailTemplateService } from '../../api';
import {
  EmailTemplateDetails,
  EmailTemplatePayload,
} from '../../domain/models/email-template.model';
import { RuleService } from '../../../../rule-management/rule/api/services/rule.service';
import { mapPlaceholderIIToPlaceholderI } from '../../mappers/email-template.mapper';
import {
  CustomCkeditor,
  FileProps,
  MultiInputTextComponent,
  BackPage,
} from '../../../../../shared';

const BASE_URL = environment.API_KEY;

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.html',
  styleUrls: ['./email-form.scss', '../../../../../shared/styles/index.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ToggleSwitch,
    NgSelectModule,
    MultiInputTextComponent,
    CustomCkeditor,
  ],
  providers: [],
})
export class EmailForm implements OnInit, OnChanges {
  form!: FormGroup;

  @Input() mode: string = '';
  @Input() initialData: EmailTemplateDetails | null = null;
  @Input() templateTypeList: any[] = [];
  @Input() productGroupList: any[] = [];

  @Output() handleBackPage = new EventEmitter<BackPage<EmailTemplatePayload>>();
  @Output() handleSubmit = new EventEmitter<EmailTemplatePayload>();

  eventTypeList: any[] = [];
  placeholderList: any[] = [];

  initialFormValue: any = null;
  emailTemplateId: string = '';

  placeholderError: string = '';

  content: string = '';

  eventTypeRequired: Boolean | null = null;

  selectedField: { key: string | null; name: string | null } = {
    key: '',
    name: '',
  };

  uploadURL = `${BASE_URL}/email-template/resource/upload`;

  @ViewChild('templateTypeSelect') templateTypeSelect!: NgSelectComponent;
  @ViewChild('eventTypeSelect') eventTypeSelect!: NgSelectComponent;
  @ViewChild('productSelect') productSelect!: NgSelectComponent;
  @ViewChild('attachment') attachment!: ElementRef<HTMLInputElement>;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private readonly toast: ToastService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly ruleService: RuleService,
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const modeChanges = changes['mode'];
    const initialDataChanges = changes['initialData'];

    if (modeChanges && modeChanges.currentValue) {
      const value = modeChanges.currentValue;

      if (value) {
        this.initPageMode(value);
      }
    }

    if (initialDataChanges && initialDataChanges.currentValue) {
      const value = initialDataChanges.currentValue;

      if (value) {
        this.loadData(value);
      }
    }
  }

  // form

  get f() {
    return this.form.controls;
  }

  initForm() {
    this.form = this.fb.group({
      id: [null],
      activeStatus: [true],
      templateId: [null],
      templateName: ['', [Validators.required]],
      templateType: [null, [Validators.required]],
      productType: [null, { updateOn: 'change' }, [Validators.required]],
      eventType: [null, [Validators.required]],
      placeholder: [null],
      emailSubject: [{ value: '', disabled: false }],
      emailTo: [{ value: [], disabled: false }, [placeholderValidator]],
      emailCc: [{ value: [], disabled: false }, [placeholderValidator]],
      emailBcc: [{ value: [], disabled: false }, [placeholderValidator]],
      emailBody: ['', [Validators.required]],
      emailParameter: [''],
      listResources: this.fb.array([]),
    });
  }

  private disableFields(): void {
    ['templateId'].forEach((key) => this.form.get(key)?.disable());
  }

  private initPageMode(mode: string): void {
    if (mode === 'CREATE') {
      this.initForm();
      this.subscribeForm();
      this.initialFormValue = this.form.getRawValue();
    } else {
      this.initForm();
      this.subscribeForm();
      this.disableFields();
    }
  }

  private subscribeForm() {
    this.form.get('productType')?.valueChanges.subscribe((value) => {
      this.onProductTypeChange(value);
    });

    this.form.get('templateType')?.valueChanges.subscribe((value) => {
      this.onTemplateTypeChange(value);
    });

    this.form.get('eventType')?.valueChanges.subscribe((value) => {
      if (value) {
        this.onEventTypeChange(value);
      }
    });
  }

  // event type change

  onTemplateTypeChange(value: any) {
    const selectedValue: any = this.templateTypeList.find(
      (x: any) => x.template_type === value,
    );

    if (selectedValue) {
      const eventTypeControl = this.form.get('eventType');
      const emailParameterControl = this.form.get('emailParameter');

      if (this.eventTypeRequired !== selectedValue.use_event_type) {
        this.eventTypeRequired = selectedValue.use_event_type;
      }

      if (!this.eventTypeRequired) {
        eventTypeControl?.clearValidators();
        emailParameterControl?.clearValidators();
        eventTypeControl?.setValue(null);
        emailParameterControl?.setValue('');

        const productType = this.form.get('productType')?.value;

        if (productType) {
          this.form.get('placeholder')?.setValue(null);
          this.getPlaceholderListNonEventType(productType);
        }
      } else {
        eventTypeControl?.setValidators([Validators.required]);
        emailParameterControl?.setValidators([Validators.required]);

        if (eventTypeControl?.value) {
          this.form.get('placeholder')?.setValue(null);
          this.getPlaceholderListEventType(eventTypeControl.value);
        }
      }

      eventTypeControl?.updateValueAndValidity();
      emailParameterControl?.updateValueAndValidity();
    }
  }

  onProductTypeChange(value: any) {
    if (this.eventTypeRequired === false) {
      this.form.get('placeholder')?.setValue(null);
      this.getPlaceholderListNonEventType(value);
    } else {
      const eventType = this.form.get('eventType')?.value;

      if (eventType) {
        this.form.get('placeholder')?.setValue(null);
        this.getPlaceholderListEventType(eventType);
      }
    }

    this.getEventTypeList(value);
  }

  onEventTypeChange(value: any) {
    this.form.get('placeholder')?.setValue(null);
    this.getPlaceholderListEventType(value);
  }

  // load data

  loadData(data: EmailTemplateDetails) {
    this.loadForm(data);

    this.loadFiles(data);

    if (data.hasActiveRuleRelation) {
      this.form.get('activeStatus')?.disable();
    } else {
      this.form.get('activeStatus')?.enable();
    }
  }

  loadForm(data: EmailTemplateDetails) {
    this.form.patchValue({
      id: data.id,
      templateId: data.templateId,
      templateType: data.templateType,
      productType: data.productType,
      eventType: data.eventType,
      templateName: data.templateName,
      activeStatus: data.activeStatus,
      emailTo: data.emailTo,
      emailBcc: data.emailBcc,
      emailCc: data.emailCc,
      emailSubject: data.emailSubject,
      emailBody: data.emailBody,
      emailParameter: data.emailParameter,
    });
  }

  loadFiles(data: EmailTemplateDetails) {
    let formArray;

    if (data.listResources && data.listResources?.length > 0) {
      formArray = this.fb.array(
        data.listResources.map((res: any) =>
          this.fb.group({
            originalName: [res?.originalName],
            extension: [res?.extension],
            generatedName: [res?.generatedName],
          }),
        ),
      );

      this.form.setControl('listResources', formArray);
    }

    this.initialFormValue = this.form.getRawValue();
  }

  // fetch API

  getPlaceholderListNonEventType(productType: string) {
    this.ruleService.getPlaceholderListNonEventType(productType).subscribe({
      next: (res: any) => {
        this.placeholderList = res['data'];
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getPlaceholderListEventType(eventType: string) {
    this.ruleService.getPlaceholderListEventType(eventType).subscribe({
      next: (res: any) => {
        this.placeholderList = res['data'].map((x: any) =>
          mapPlaceholderIIToPlaceholderI(x),
        );
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getEventTypeList(productType: string) {
    this.ruleService.ruleMasterParameterTypeList(productType).subscribe({
      next: (res: any) => {
        this.eventTypeList = res['data'];
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  // general

  getImageData(data: FileProps) {
    const items = this.form.get('listResources') as FormArray;

    items.push(
      this.fb.group({
        extension: data.extension,
        generatedName: data.generatedName,
        originalName: data.originalName,
      }),
    );
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }

  onKeyDown(event: KeyboardEvent, controlName: string) {
    let control;

    control = this.form.get(controlName);

    const value = control?.value ?? '';
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];

    if (value.length >= 201 && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  // action

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.initialFormValue,
      ...this.form.getRawValue(),
    };

    this.handleSubmit.emit(payload);
  }

  back() {
    const data: BackPage<EmailTemplatePayload> = {
      initValue: this.initialFormValue,
      currentValue: this.form.getRawValue(),
    };

    this.handleBackPage.emit(data);
  }

  // handle CC, TO, Placeholder and more ...

  changeField(name: string, key: string) {
    this.selectedField = { name: name, key: key };
  }

  add() {
    if (!this.form.get('placeholder')?.value) {
      this.placeholderError = 'Please select a placeholder';

      return;
    }

    if (!this.selectedField.key) {
      setTimeout(() => {
        this.placeholderError = 'Please select a field to add';
      }, 500);

      return;
    }

    const control = this.form.get(this.selectedField.key);

    const placeholderValue = this.form.get('placeholder')?.value;

    if (!control) {
      console.error('Form control not found:', this.selectedField);
      return;
    }

    if (this.selectedField.key === 'emailBody') {
      let newValue = control.value + `<p>%%${placeholderValue}%%</p>`;
      control.setValue(newValue);

      return;
    }

    if (
      this.selectedField.key === 'emailTo' ||
      this.selectedField.key === 'emailCc' ||
      this.selectedField.key === 'emailBcc'
    ) {
      if (!control.value.includes(`%%${placeholderValue}%%`)) {
        let newValue = [...control.value, `%%${placeholderValue}%%`];
        control.setValue(newValue);
      }

      return;
    }

    let newValue = control.value + `%%${this.form.get('placeholder')?.value}%%`;

    control.setValue(newValue);

    this.placeholderError = '';
  }
}
