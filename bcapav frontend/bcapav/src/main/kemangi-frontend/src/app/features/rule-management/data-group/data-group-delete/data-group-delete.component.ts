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
import { deleteDataGroupBreadcrumbs } from '../data/breadcrumb';

import { requiredTrimmed } from '../../../../core/validators/required-trimmed.validator';
import { DataGroupViewDetailValueComponent } from '../components/data-group-view-detail-value/data-group-view-detail-value';
import { DataGroupDetails } from '../domain/models/data-group.model';
import {
  mapDataGroupDetailsApiToDomain,
  mapRuleRelationDomainToApi,
  mapDataGroupDeleteDomainToApi,
} from '../mappers/data-group.mapper';
import { PAGE_QUERY_INIT, PAGE_INFO_INIT } from '../../../../shared';

@Component({
  selector: 'app-data-group-delete',
  templateUrl: './data-group-delete.component.html',
  styleUrls: [
    './data-group-delete.component.scss',
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
    DataGroupViewDetailValueComponent,
    BadgeUploadedDoc,
  ],
  providers: [DatePipe],
})
export class DataGroupDeleteComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = deleteDataGroupBreadcrumbs;

  pageTitle: string = 'Delete Data Group';

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
    this.handleRouteParams();
    this.disableFields();
  }

  handleRouteParams(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.id = params.get('id') ?? '';
      if (this.id || this.id !== '') {
        this.getDataGroupDetails(Number(this.id));
      }
    });
  }

  private disableFields(): void {
    ['dataGroupId', 'name', 'description', 'dynamicWatchList'].forEach((key) =>
      this.dataGroupForm.get(key)?.disable(),
    );
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
      activeStatus: data.active_status,
      dataGroupId: data.data_group_id,
      name: data.name,
      description: data.description,
      dynamicWatchList: data.dynamic_watch_list,
    });

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

  deleteDataGroup() {
    this.ngxLoader.start();

    const { dataGroupId, listFiles } = this.dataGroupForm.getRawValue();

    const payload = {
      dataGroupId,
      listFiles,
    };

    this.dataGroupService
      .delete(mapDataGroupDeleteDomainToApi(payload))
      .subscribe({
        next: () => {
          this.toast.success('Request delete datagroup has been created');

          this.router.navigate(['/home/rule-management/data-group/current']);
        },
        error: (e) => {
          if (e.status !== 400) {
            this.toast.error('Request delete datagroup has been failed');
          }

          this.ngxLoader.stop();
        },
        complete: () => {
          this.ngxLoader.stop();
        },
      });
  }

  handleDeleteImmediately() {
    const { activeStatus } = this.dataGroupForm.getRawValue();

    if (activeStatus) {
      setTimeout(() => {
        this.failedDialogService.failed(
          '',
          '400',
          'Sorry! Data Group  is active. Please change the status to Inactive before submitting.',
        );
      }, 700);
      return;
    }

    this.deleteDataGroup();
  }

  handleDeleteConfirmation() {
    if (this.dataGroupForm.invalid) {
      this.dataGroupForm.markAllAsTouched();
      return;
    }

    this.confirmationDialogService
      .confirm('', 'Are you sure you want to submit?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.deleteDataGroup();
        }
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
    const currentValue = {
      ...this.dataGroupForm.getRawValue(),
      detailValues: this.detailValues(),
    };

    const changed = this.getChangedValues(this.initialFormValue, currentValue);

    if (Object.keys(changed).length === 0) {
      this.router.navigate([`/home/rule-management/data-group/current`]);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            this.router.navigate([`/home/rule-management/data-group/current`]);
          }
        });
    }
  }

  get f() {
    return this.dataGroupForm?.controls;
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
