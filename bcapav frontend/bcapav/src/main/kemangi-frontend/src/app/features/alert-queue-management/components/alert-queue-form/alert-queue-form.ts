import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';

import { ToggleSwitch } from '../../../../shared';
import { AlertQueueAssignTo } from '../alert-queue-assign-to/alert-queue-assign-to';
import { RuleModelForm } from '../rule-model-form/rule-model-form';
import {
  AlertQueueDetails,
  AlertQueueRuleModel,
} from '../../domain/alert-queue.model';
import { FailedModalService } from '../../../../core/services/failed-modal.service';
@Component({
  selector: 'app-alert-queue-form',
  templateUrl: './alert-queue-form.html',
  styleUrls: [
    './alert-queue-form.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    ToggleSwitch,
    ReactiveFormsModule,
    AlertQueueAssignTo,
    RuleModelForm,
  ],
  providers: [DatePipe],
})
export class AlertQueueForm implements OnInit, OnChanges {
  @Output() handleBackPage = new EventEmitter<any>();
  @Output() handleSubmitDraft = new EventEmitter<any>();
  @Output() handleSubmit = new EventEmitter<any>();
  @Input() mode: string = '';
  @Input() initialData: AlertQueueDetails | null = null;

  initialValue: any = null;
  modelsData: any[] | null = [];

  form!: FormGroup;

  @ViewChild('autoDescTA') autoDescTA!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private fb: FormBuilder,
    public failedDialogService: FailedModalService,
  ) {}

  ngOnInit() {
    if (this.mode === 'CREATE') {
      this.initCreateMode();
    }
  }

  initCreateMode() {
    this.initForm();
    this.initialValue = this.form.getRawValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const initialdata = changes['initialData'];
    if (initialdata) {
      if (initialdata.currentValue) {
        this.loadDetails(initialdata.currentValue);
      }
    }
  }

  getDataAssignTo(data: any) {
    const formArray = this.fb.control<string[]>(data ?? []);

    this.form.setControl('assignTo', formArray);
  }

  getDataRuleModels(data: any) {
    this.modelsData = [...data];

    const result = data.flatMap((a: any) =>
      a.levels.flatMap((b: any) =>
        b.items.map((c: any, i: any) => {
          return {
            priorityType: a.name === 'High' ? 1 : a.name === 'Medium' ? 2 : 3,
            priorityLevel:
              b.name === 'Priority 1' ? 1 : b.name === 'Priority 2' ? 2 : 3,
            prioritySeq: i + 1,
            productType: c.branchName,
            itemType: c.sourceName.toLocaleUpperCase(),
            itemId: c.id,
          };
        }),
      ),
    );

    let formArray;

    if (result && result.length > 0) {
      formArray = this.fb.array(
        result.map((res: any) =>
          this.fb.group({
            ...res,
          }),
        ),
      );

      this.form.setControl('details', formArray);
    } else {
      (this.form.get('details') as FormArray).clear();
    }
  }

  initForm() {
    this.form = this.fb.group({
      queueId: [null],
      activeStatus: [true],
      name: [null, [Validators.required, Validators.maxLength(255)]],
      description: [null, [Validators.required, Validators.maxLength(255)]],
      details: this.fb.array([]),
      assignTo: this.fb.array([]),
    });
  }

  assignToValidator(): Boolean {
    const data = this.form.getRawValue().assignTo;
    if (data.length === 0) {
      return false;
    }

    return true;
  }

  ruleThresholdValidator(): Boolean {
    const data = this.form.getRawValue();

    const isValid = data.details.length > 0 ? true : false;

    return isValid;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.mode !== 'DELETE') {
      if (!this.assignToValidator()) {
        this.failedDialogService.failed(
          '',
          '400',
          'Sorry! Please assign at least one user.',
        );

        return;
      }

      if (!this.ruleThresholdValidator()) {
        this.failedDialogService.failed(
          '',
          '400',
          'Sorry! Please assign at least one rule or threshold to a priority level.',
        );

        return;
      }
    }

    const payload = {
      ...this.form.getRawValue(),
    };

    this.handleSubmit.emit(payload);
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

    if (value.length >= 256 && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  back() {
    const data = {
      initialValue: this.initialValue,
      currentValue: this.form.getRawValue(),
    };

    this.handleBackPage.emit(data);
  }

  loadDetails(data: AlertQueueDetails) {
    this.initForm();

    this.form.patchValue({
      queueId: data.queueId,
      activeStatus: data.activeStatus,
      name: data.name,
      description: data.description,
    });

    const dataAssignTo = this.fb.control<string[]>(data.assignTo ?? []);
    const dataDetails = this.fb.control<AlertQueueRuleModel[]>(
      data.details ?? [],
    );

    this.form.setControl('assignTo', dataAssignTo);
    this.form.setControl('details', dataDetails);

    this.initialValue = this.form.getRawValue();

    if (this.mode !== 'DELETE') {
      setTimeout(() => {
        this.autogrow(this.autoDescTA.nativeElement);
      }, 100);
    }
  }

  get f() {
    return this.form.controls;
  }
}
