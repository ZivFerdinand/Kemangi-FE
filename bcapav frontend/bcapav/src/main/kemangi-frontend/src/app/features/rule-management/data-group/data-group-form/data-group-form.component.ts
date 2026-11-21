import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  ContentLayout,
  TableComponent,
  BreadcrumbProps,
  ToggleSwitch,
  TableQuery,
  BadgeUploadedDoc,
} from '../../../../shared';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../core/services/failed-modal.service';
import { ruleRelationListColumns } from '../data/column';
import { ToastService } from '../../../../core/services/toast.service';
import { DataGroupService } from '../api/services/data-group.service';
import {
  createDataGroupBreadcrumbs,
  editDataGroupBreadcrumbs,
} from '../data/breadcrumb';

import { requiredTrimmed } from '../../../../core/validators/required-trimmed.validator';
import { DataGroupFormDetailValueComponent } from '../components/data-group-form-detail-value/data-group-form-detail-value';

import {
  DataGroupDetails,
  DataGroupUploadFile,
} from '../domain/models/data-group.model';
import {
  mapDataGroupDetailsApiToDomain,
  mapRuleRelationDomainToApi,
  mapDataGroupFormDomainToApi,
} from '../mappers/data-group.mapper';
import { PAGE_QUERY_INIT, PAGE_INFO_INIT } from '../../../../shared';

@Component({
  selector: 'app-data-group-form',
  templateUrl: './data-group-form.component.html',
  styleUrls: [
    './data-group-form.component.scss',
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
    DataGroupFormDetailValueComponent,
    BadgeUploadedDoc,
  ],
  providers: [DatePipe],
})
export class DataGroupFormComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  columns: any[] = ruleRelationListColumns;

  pageParams = {
    ...PAGE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  details = signal<DataGroupDetails | null>(null);

  tableData: any[] = [];

  dataGroupForm!: FormGroup;

  id: string = '';

  initialFormValue: any;

  from: string = '';

  detailValues = signal<string[] | null>(null);

  fileInputOpened = false;

  private destroy$ = new Subject<void>();

  @ViewChild('autoDescTA') autoDescTA!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('autoNameTA') autoNameTA!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private fb: FormBuilder,
    private readonly dataGroupService: DataGroupService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    public failedDialogService: FailedModalService,
  ) {
    this.initForm();

    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.id = params.get('id') ?? '';
      if (this.id || this.id !== '') {
        this.getDataGroupDetails(Number(this.id));
      } else {
        this.initialFormValue = this.dataGroupForm?.getRawValue();
      }
    });

    this.route.queryParams.subscribe((params) => {
      this.from = params['from'] ?? '';
    });

    this.dataGroupForm.get('dataGroupId')?.disable();

    if (this.currentUrl.includes('create')) {
      this.breadcrumb = createDataGroupBreadcrumbs;
      this.breadcrumb[1].url = `/home/rule-management/data-group/${this.from}`;
      this.pageTitle = 'Create New Data Group';
    } else {
      this.breadcrumb = editDataGroupBreadcrumbs;
      this.pageTitle = 'Edit Data Group';
    }
  }

  getDataGroupDetails(id: number) {
    this.ngxLoader.start();
    this.dataGroupService.details(id).subscribe({
      next: (res: any) => {
        this.details.set(mapDataGroupDetailsApiToDomain(res['data']));
        this.loadData(res['data']);
        if (this.details()?.dataGroupId) {
          this.getRuleRelationList(this.details()?.dataGroupId ?? '', {
            ...this.pageParams,
            page: this.pageParams.page - 1,
          });
        }
      },
      error: () => {
        this.ngxLoader.stop();
        this.toast.error('Something went wrong while loading data');
      },
      complete: () => this.ngxLoader.stop(),
    });
  }

  loadData(data: any) {
    this.dataGroupForm.patchValue({
      // apprId: data?.appr_id ?? null,
      activeStatus: data.active_status,
      dataGroupId: data.data_group_id,
      name: data.name,
      description: data.description,
      dynamicWatchList: data.dynamic_watch_list,
    });

    if (data.has_active_rule_relation) {
      this.dataGroupForm.get('activeStatus')?.disable();
      this.dataGroupForm.get('dynamicWatchList')?.disable();
    } else {
      this.dataGroupForm.get('activeStatus')?.enable();
      this.dataGroupForm.get('dynamicWatchList')?.enable();
    }

    if (data.detail_values && data.detail_values.length > 0) {
      this.dataGroupForm.get('detailValues')?.setValue([...data.detail_values]);

      this.detailValues.set(data.detail_values);
    }

    this.initialFormValue = this.dataGroupForm.getRawValue();

    setTimeout(() => {
      this.autogrow(this.autoDescTA.nativeElement);
      this.autogrow(this.autoNameTA.nativeElement);
    }, 100);
  }

  getRuleRelationList(id: string, param: TableQuery) {
    this.ngxLoader.start();
    this.dataGroupService
      .ruleRelationList(id, mapRuleRelationDomainToApi(param))
      .subscribe({
        next: (res: any) => {
          this.tableData = res['data']['content'];
          this.pageInfo = {
            ...this.pageInfo,
            totalElements: res['data']['totalElements'],
            totalPages: res['data']['totalPages'],
          };
        },
        error: () => {
          this.ngxLoader.stop();
          this.toast.error('Something went wrong while loading data');
        },
        complete: () => this.ngxLoader.stop(),
      });
    this.ngxLoader.stop();
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageParams = { ...this.pageParams, sort: param, sortDir: order };

    this.getRuleRelationList(this.details()?.dataGroupId ?? '', {
      ...this.pageParams,
      page: this.pageParams.page - 1,
    });
  }

  handlePageChange(e: any) {
    this.pageParams = { ...this.pageParams, page: e };
    this.getRuleRelationList(this.details()?.dataGroupId ?? '', {
      ...this.pageParams,
      page: this.pageParams.page - 1,
    });
  }

  createDataGroup() {
    this.ngxLoader.start();
    const payload = {
      ...this.dataGroupForm.getRawValue(),
      detailValues: this.detailValues(),
    };

    this.dataGroupService
      .create(mapDataGroupFormDomainToApi(payload))
      .subscribe({
        next: () => {
          this.toast.success('Request create data group has been created');

          this.router.navigate([
            `/home/rule-management/data-group/${this.from}`,
          ]);
        },
        error: (e) => {
          if (e.status !== 400) {
            this.toast.error('Request create data group has been failed');
          }

          this.ngxLoader.stop();
        },
        complete: () => {
          this.ngxLoader.stop();
        },
      });
  }

  createDraft() {
    this.ngxLoader.start();

    const payload = {
      ...this.dataGroupForm.getRawValue(),
      detailValues: this.detailValues(),
    };

    this.dataGroupService
      .createDraft(mapDataGroupFormDomainToApi(payload))
      .subscribe({
        next: () => {
          this.toast.success('Draft data group has been created');

          this.router.navigate(['/home/rule-management/data-group/draft']);
        },
        error: (e) => {
          if (e.status !== 400) {
            this.toast.error('Draft data group has been failed');
          }

          this.ngxLoader.stop();
        },
        complete: () => {
          this.ngxLoader.stop();
        },
      });
  }

  editDataGroup() {
    this.ngxLoader.start();
    const payload = {
      ...this.dataGroupForm.getRawValue(),
      detailValues: this.detailValues(),
    };
    this.dataGroupService
      .update(mapDataGroupFormDomainToApi(payload))
      .subscribe({
        next: () => {
          this.toast.success('Request update data group has been created');

          this.router.navigate([
            `/home/rule-management/data-group/${this.from}`,
          ]);
        },
        error: (e) => {
          if (e.status !== 400) {
            this.toast.error('Request update data group has been failed');
          }

          this.ngxLoader.stop();
        },
        complete: () => {
          this.ngxLoader.stop();
        },
      });
  }

  onSubmit() {
    if (this.dataGroupForm.invalid) {
      this.dataGroupForm.markAllAsTouched();
      return;
    }

    this.confirmationDialogService
      .confirm('', 'Are you sure you want to submit?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          if (this.id || this.id !== '') {
            this.editDataGroup();
            return;
          }
          this.createDataGroup();
        }
      });
  }

  onSubmitDraft() {
    this.confirmationDialogService
      .confirm('', 'Are you sure want to save as draft?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.createDraft();
        }
      });
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

  back() {
    const currentValue = {
      ...this.dataGroupForm.getRawValue(),
      detailValues: this.detailValues() || [],
    };

    const changed = this.getChangedValues(this.initialFormValue, currentValue);

    if (Object.keys(changed).length === 0) {
      this.router.navigate([`/home/rule-management/data-group/${this.from}`]);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            this.router.navigate([
              `/home/rule-management/data-group/${this.from}`,
            ]);
          }
        });
    }
  }

  get f() {
    return this.dataGroupForm.controls;
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

    control = this.dataGroupForm.get(controlName);

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

    this.dataGroupService.uploadDataGroupFile(formData).subscribe({
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

  get listFiles(): FormArray {
    return this.dataGroupForm.get('listFiles') as FormArray;
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

  initForm() {
    this.dataGroupForm = this.fb.group({
      activeStatus: [true],
      dataGroupId: [],
      name: ['', [requiredTrimmed, Validators.maxLength(255)]],
      description: ['', [requiredTrimmed, Validators.maxLength(255)]],
      dynamicWatchList: [false],
      detailValues: this.fb.control<any[]>([]),
      listFiles: this.fb.array([], Validators.required),
    });
  }

  onFileInputClick() {
    this.fileInputOpened = true;

    window.addEventListener('focus', this.onWindowFocus.bind(this), {
      once: true,
    });
  }

  onWindowFocus() {
    setTimeout(() => {
      if (this.fileInputOpened) {
        const listFiles = this.dataGroupForm.get('listFiles') as FormArray;
        if (listFiles.length === 0) {
          listFiles.markAsTouched();
        }
        this.fileInputOpened = false;
      }
    }, 300);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
