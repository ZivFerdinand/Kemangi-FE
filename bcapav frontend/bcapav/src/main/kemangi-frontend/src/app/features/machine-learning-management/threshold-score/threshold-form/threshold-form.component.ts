import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  inject,
  ElementRef,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbPaginationModule,
  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormArray,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  ContentLayout,
  TableComponent,
  BreadcrumbProps,
  ToggleSwitch,
  TableParams,
  BadgeUploadedDoc,
} from '../../../../shared';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../core/services/failed-modal.service';
import {
  deleteThresholdBreadcrumbs,
  editThresholdBreadcrumbs,
} from '../data/breadcrumb';

import { requiredTrimmed } from '../../../../core/validators/required-trimmed.validator';
import { thresholdScoreDetailFormListColumns, thresholdScoreDetailListColumns, thresholdScoreDetailViewListColumns } from '../data/column';
import { MLThresholdService } from '../services/ml-threshold.service';
import { EditedThresholdIdData, ThresholdIdDetailParams } from '../interfaces';
import { TruncateOrDashPipe } from "../../../../shared/pipes/truncate-or-dash.pipe";
import { DataGroupUploadFile, MLThresholdUploadFileApi } from '../services/ml-threshold.model';
export function thresholdScoreValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  // Allow empty value (optional, remove if required)
  if (value === null || value === undefined || value === '') {
    return { required: true };
  }

  // Check if value is a number
  const num = Number(value);
  if (isNaN(num)) {
    return { notNumber: true };
  }

  // Check range
  if (num > 1) {
    return { positiveValue: true };
  }
  // Check range
  if (num <= 0) {
    return { negativeValue: true };
  }

  // Check max 3 digits after decimal
  const decimalPart = value.toString().split('.')[1];
  if (decimalPart && decimalPart.length > 4) {
    return { decimal: true };
  }

  return null;
}
@Component({
  selector: 'app-threshold-form',
  templateUrl: './threshold-form.component.html',
  styleUrls: [
    './threshold-form.component.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    ContentLayout,
    ToggleSwitch,
    TableComponent,
    BadgeUploadedDoc
],
  providers: [DatePipe],
})
export class ThresholdFormComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  columns = thresholdScoreDetailFormListColumns;
  columnsThresholdIdDetail = thresholdScoreDetailViewListColumns;

  tableDataThresholdIdDetail: any[] = [];

  
  listFiles = signal<DataGroupUploadFile[]>([]);

  pageParams = {
    limit: 5,
    page: 1,
    sort: '',
    sort_dir: 'asc',
    id: '',

  };

  pageInfo = {
    totalElements: 31,
    totalPages: 1,
  };

  pageParamsThresholdIdDetail: ThresholdIdDetailParams = {
    limit: 5,
    page: 1,
    sort: '',
    sort_dir: 'asc',
    id: '',
    model_id: ''
  };
  pageInfoThresholdIdDetail = {
    totalElements: 31,
    totalPages: 1,
  };


  tableData: any[] = [];

  selectedTableRowValue: any;

  thresholdModelForm: FormGroup;
  thresholdIdDetailForm: FormGroup;

  id: string = '';

  initialFormValue: any;

  from: string = '';

  private destroy$ = new Subject<void>();

  private modalService = inject(NgbModal);

  @ViewChild('autoDescTA') autoDescTA!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('autoNameTA') autoNameTA!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private fb: FormBuilder,
    private readonly mlThresholdService: MLThresholdService,
    private readonly toastr: ToastrService,
    public confirmationDialogService: ConfirmationModalService,
    public failedDialogService: FailedModalService
  ) {
    this.currentUrl = this.router.url;

    this.thresholdModelForm = this.fb.group({
      active_status: [true],
      model_id: [''],
      model_name: [''],
      model_description: ['', [requiredTrimmed, Validators.maxLength(255)]],
      product_type: [''],
      afris_type: [''],
      event_type: [''],
      detection_type: [''],
      role_group: [''],
    });

    this.thresholdIdDetailForm = this.fb.group({
      active_status: [true],
      id: [''],
      threshold_name: [''],
      threshold_description: ['', [requiredTrimmed, Validators.maxLength(255)]],
      threshold_score: ['', [thresholdScoreValidator]],
      alert: [true]
    })
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.id = params.get('id') ?? '';
      if (this.id || this.id !== '') {
        this.getModelDetail(Number(this.id));

        this.pageParams.id = this.id;
        
      } else {
        this.initialFormValue = this.thresholdModelForm?.getRawValue();
      }
    });

    this.route.queryParams.subscribe((params) => {
      this.from = params['from'] ?? '';
    });

    this.thresholdModelForm.get('data_group_id')?.disable();

    if (this.currentUrl.includes('edit')) {
      this.breadcrumb = editThresholdBreadcrumbs;
      this.pageTitle = 'Edit Threshold Score';
    } else {
      this.breadcrumb = deleteThresholdBreadcrumbs;
      this.pageTitle = 'Delete Threshold Score';
    }
  }

  getModelDetail(id: number) {
    this.ngxLoader.start();
    this.mlThresholdService.modelIdDetail(id).subscribe({
      next: (res: any) => {
        this.loadData(res['data']);
      },
      error: (e: any) => {
        this.ngxLoader.stop();
        if (e?.status !== 400) {
          this.toastr.show(
            `<div class="toast-custom toast-failed">
                <div class="info">
                  <div class="icon">
                    <img src="./assets/img/ic-times-rounded.svg" alt="error" />
                  </div>
                  <div class="description">
                    Something went wrong while loading data
                  </div>
                </div>

                <button class="close-btn">
                  <img src="./assets/img/ic-times.svg" alt="close" />
                </button>
            </div>`,
            '',
            { enableHtml: true }
          );
        }
      },
      complete: () => this.ngxLoader.stop(),
    });
    this.ngxLoader.stop();
  }
  

  loadData(data: any) {
    this.thresholdModelForm.patchValue({
      active_status: data?.activeStatus,
      model_name: data?.modelName,
      model_description: data?.modelDescription,
      product_type: data?.productType,
      afris_type: data?.afrisType,
      event_type: data?.eventType,
      detection_type: data?.detectionType,
      model_id: data?.modelId ?? null,
      role_group: data?.roleGroup
    });

    
    this.tableDataThresholdIdDetail = data?.thresholdDetails;
    this.pageParamsThresholdIdDetail.page = 1; // reset to first page
    this.pageParamsThresholdIdDetail.limit = 5; // set page size

    this.updatePageInfoThresholdIdDetail();

    this.initialFormValue = this.thresholdModelForm.getRawValue();

    setTimeout(() => {
      this.autogrow(this.autoDescTA.nativeElement);
      this.autogrow(this.autoNameTA.nativeElement);
    }, 100);
  }

  
  thresholdIdOnSave(c: Function) {
    if(this.g['threshold_score']?.invalid)
    {
      return;
    }
    const foundData = this.tableDataThresholdIdDetail.find(item => item.id === this.selectedTableRowValue.id);
    if(foundData)
    {
      foundData.activeStatus = this.thresholdIdDetailForm.get('active_status')?.value;
      foundData.thresholdScore = this.thresholdIdDetailForm.get('threshold_score')?.value;
      foundData.alert = this.thresholdIdDetailForm.get('alert')?.value
    }

    c('close');
  }

  openModal(event: Event, content: any, i: any): void {
    event.preventDefault();
    this.selectedTableRowValue = i;
    
    this.thresholdIdDetailForm.patchValue({
      id: i['id'],
      active_status: i['activeStatus'],
      threshold_name: i['thresholdName'],
      threshold_description: i['thresholdDescription'],
      threshold_score: i['thresholdScore']
    });
    if (this.pageTitle === 'Delete Threshold Score') {
      this.thresholdIdDetailForm.get('alert')?.disable();
    } else {
      this.thresholdIdDetailForm.get('alert')?.enable();
    }

    this.modalService.open(content, {
      scrollable: true,
      size: "l",
      centered: true,
      windowClass: "modal-holder",
    });
  }



  editMLThreshold() {
    this.ngxLoader.start();
    this.mlThresholdService
      .updateThreshold(
        {
          ...this.thresholdModelForm.getRawValue(),
          threshold_details: this.tableDataThresholdIdDetail.map(item =>
            Object.fromEntries(
              Object.entries(item).map(([k, v]) => [k.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`), v])
            )
          ),
          attachment: this.listFiles().map(item =>
            Object.fromEntries(
              Object.entries(item).map(([k, v]) => [k.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`), v])
            )
          ),
        }
      )
      .subscribe({
        next: () => {
          this.toastr.show(
            `<div class="toast-custom toast-success">
            <div class="info">
              <div class="icon">
                <img src="./assets/img/ic-checked-rounded.svg" alt="success" />
              </div>
              <div class="description">
                  Edit threshold request has been submitted
              </div>
            </div>
            <button class="close-btn">
              <img src="./assets/img/ic-times.svg" alt="close" />
            </button>
          </div>`,
            '',
            { enableHtml: true }
          );

          this.router.navigate([
            `/home/machine-learning/threshold-score/current`,
          ]);
        },
        error: (e) => {
          if (e.status !== 400) {
            this.toastr.show(
              `<div class="toast-custom toast-failed">
                  <div class="info">
                    <div class="icon">
                      <img src="./assets/img/ic-times-rounded.svg" alt="error" />
                    </div>
                    <div class="description">
                      Edit threshold request has been failed
                    </div>
                  </div>
                  <button class="close-btn">
                    <img src="./assets/img/ic-times.svg" alt="close" />
                  </button>
              </div>`,
              '',
              { enableHtml: true }
            );
          }

          this.ngxLoader.stop();
        },
        complete: () => {
          this.ngxLoader.stop();
        },
      });
  }
  deleteMLThreshold() {
    this.ngxLoader.start();
    this.mlThresholdService
      .deleteThreshold(
        {
          ...this.thresholdModelForm.getRawValue(),
          threshold_details: this.tableDataThresholdIdDetail.map(item =>
            Object.fromEntries(
              Object.entries(item).map(([k, v]) => [k.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`), v])
            )
          ),
          attachment: this.listFiles().map(item =>
            Object.fromEntries(
              Object.entries(item).map(([k, v]) => [k.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`), v])
            )
          ),
        }
      )
      .subscribe({
        next: () => {
          this.toastr.show(
            `<div class="toast-custom toast-success">
            <div class="info">
              <div class="icon">
                <img src="./assets/img/ic-checked-rounded.svg" alt="success" />
              </div>
              <div class="description">
                  Delete threshold request has been submitted
              </div>
            </div>
            <button class="close-btn">
              <img src="./assets/img/ic-times.svg" alt="close" />
            </button>
          </div>`,
            '',
            { enableHtml: true }
          );

          this.router.navigate([
            `/home/machine-learning/threshold-score/current`,
          ]);
        },
        error: (e) => {
          if (e.status !== 400) {
            this.toastr.show(
              `<div class="toast-custom toast-failed">
                  <div class="info">
                    <div class="icon">
                      <img src="./assets/img/ic-times-rounded.svg" alt="error" />
                    </div>
                    <div class="description">
                      Delete threshold request has been failed
                    </div>
                  </div>
                  <button class="close-btn">
                    <img src="./assets/img/ic-times.svg" alt="close" />
                  </button>
              </div>`,
              '',
              { enableHtml: true }
            );
          }

          this.ngxLoader.stop();
        },
        complete: () => {
          this.ngxLoader.stop();
        },
      });
  }

  onSubmit() {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to submit?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed && (this.id || this.id !== '')) {
          if(this.pageTitle === 'Edit Threshold Score' && (this.thresholdModelForm.dirty || this.thresholdIdDetailForm.dirty))
          {
            this.editMLThreshold()
            return;
          }
          else if(this.pageTitle === 'Delete Threshold Score')
          {
            this.deleteMLThreshold()
            return;
          }
          
        }
        this.toastr.show(
          `<div class="toast-custom toast-failed">
              <div class="info">
                <div class="icon">
                  <img src="./assets/img/ic-times-rounded.svg" alt="error" />
                </div>
                <div class="description">
                  No changes have been made
                </div>
              </div>
              <button class="close-btn">
                <img src="./assets/img/ic-times.svg" alt="close" />
              </button>
          </div>`,
          '',
          { enableHtml: true }
        );
      });
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

  back() {
    const currentValue = this.thresholdModelForm.getRawValue();
    const changed = this.getChangedValues(this.initialFormValue, currentValue);

    if (Object.keys(changed).length === 0 && !this.thresholdIdDetailForm.dirty) {
      this.router.navigate([`/home/machine-learning/threshold-score/current`]);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure you want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            this.router.navigate([
              `/home/machine-learning/threshold-score/current`,
            ]);
          }
        });
    }
  }

  get f() {
    return this.thresholdModelForm.controls;
  }
  get g() {
    return this.thresholdIdDetailForm.controls;
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

    control = this.thresholdModelForm.get(controlName);

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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  updatePageInfoThresholdIdDetail() {
    const totalElements = this.tableDataThresholdIdDetail.length;
    this.pageInfoThresholdIdDetail = {
      totalElements,
      totalPages: Math.ceil(totalElements / this.pageParamsThresholdIdDetail.limit) || 1,
    };
  }
  get pagedThresholdIdDetail() {
    const start = (this.pageParamsThresholdIdDetail.page - 1) * this.pageParamsThresholdIdDetail.limit;
    const end = start + this.pageParamsThresholdIdDetail.limit;

    return this.tableDataThresholdIdDetail.slice(start, end);
  }
  handlePageChangeThresholdId(e: any) {
    this.pageParamsThresholdIdDetail = { ...this.pageParamsThresholdIdDetail, page: e };
    this.updatePageInfoThresholdIdDetail();
  }

    onFileSelected(event: any) {
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

    this.mlThresholdService.uploadMLThresholdFile(formData).subscribe({
      next: (res) => {
        this.listFiles.update((files) => [
          ...(files ?? []),
          {
            originalName: res?.original_name,
            extension: res?.extension,
            generatedName: res?.generated_name,
          },
        ]);
      },
      error: (e) => {
        if (e?.status !== 400) {
          this.toastr.error('Something went wrong while loading data');
        }
      },
    });
  }

  clearFile(generatedName: string) {
    const findData = [...this.listFiles()].filter(
      (i) => i.generatedName !== generatedName,
    );

    this.listFiles.set(findData);
  }
}
