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

import { requiredTrimmed } from '../../../../../core/validators/required-trimmed.validator';
import {
  ContentLayout,
  TableComponent,
  BreadcrumbProps,
  ToggleSwitch,
} from '../../../../../shared';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../../core/services/failed-modal.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ruleRelationListColumns } from '../../data/column';

import { DataGroupService } from '../../api/services/data-group.service';
import {
  editDataGroupDraftBreadcrumbs,
  editDataGroupRejectedDraftBreadcrumbs,
} from '../../data/breadcrumb';

import {
  mapRuleRelationDomainToApi,
  mapDataGroupFormDomainToApi,
} from '../../mappers/data-group.mapper';
import { PAGE_INFO_INIT, PAGE_QUERY_INIT } from '../../../../../shared';
import { DataGroupFormDetailValueComponent } from '../../components/data-group-form-detail-value/data-group-form-detail-value';
import { camelToSnake } from '../../../../../shared/utils/string.util';
import { BadgeUploadedDoc, CapitalizePipe } from '../../../../../shared';
import { mapDataGroupDetailsApprovalApiToDomain } from '../../../../approval/data-group/mappers/data-group-approval.mapper';
import { DataGroupApprovalDetails } from '../../../../approval/data-group/domain/models/data-group-approval.model';

@Component({
  selector: 'app-data-group-draft-form',
  templateUrl: './update.component.html',
  styleUrls: [
    './update.component.scss',
    '../../../../../shared/styles/index.scss',
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
    CapitalizePipe,
  ],
  providers: [DatePipe],
})
export class DataGroupDraftFormComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  columns: any[] = ruleRelationListColumns;

  pageParams = {
    ...PAGE_QUERY_INIT,
  };

  pageInfo = { ...PAGE_INFO_INIT };

  details = signal<DataGroupApprovalDetails | null>(null);

  tableData: any[] = [];

  dataGroupForm!: FormGroup;

  draftId: string = '';

  initialFormValue: any;

  fileInputOpened = false;

  detailValues = signal<string[] | null>(null);

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
      this.draftId = params.get('id') ?? '';
      if (this.draftId || this.draftId !== '') {
        this.getDataGroupDraftDetails(Number(this.draftId));
      }
    });

    this.dataGroupForm.get('dataGroupId')?.disable();
  }

  getDataGroupDraftDetails(id: number) {
    this.ngxLoader.start();

    this.dataGroupService.draftDetails(id).subscribe({
      next: (res: any) => {
        this.loadData(res['data']);
        this.details.set(mapDataGroupDetailsApprovalApiToDomain(res['data']));
        this.setPageState();
      },
      error: (e) => {
        this.ngxLoader.stop();
        if (e?.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => {
        this.ngxLoader.stop();
        if (this.details()?.dataGroupId) {
          this.getRuleRelationList(this?.details()?.dataGroupId ?? '', {
            ...this.pageParams,
            page: this.pageParams.page - 1,
          });
        }
      },
    });
  }

  loadData(data: any) {
    this.dataGroupForm.patchValue({
      apprId: data.appr_id,
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

    if (data.approval_status !== 'REJECTED') {
      if (data && data.list_files?.length > 0) {
        this.loadFiles(data);
      }
    }

    this.initialFormValue = {
      ...this.dataGroupForm.getRawValue(),
    };

    setTimeout(() => {
      this.autogrow(this.autoDescTA.nativeElement);
      this.autogrow(this.autoNameTA.nativeElement);
    }, 100);
  }

  setPageState() {
    if (this.details()?.approvalStatus !== 'REJECTED') {
      this.breadcrumb = editDataGroupDraftBreadcrumbs;
      this.pageTitle = 'Draft Data Group';
    } else {
      this.breadcrumb = editDataGroupRejectedDraftBreadcrumbs;
      this.pageTitle = 'Draft Rejected Data Group';
    }
  }

  getRuleRelationList(id: string, param: any) {
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
        error: (e) => {
          this.ngxLoader.stop();
          if (e?.status !== 400) {
            this.toast.error('Something went wrong while loading data');
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
  }

  handleSortChange(order: 'asc' | 'desc', param: string) {
    this.pageParams = {
      ...this.pageParams,
      sort: camelToSnake(param),
      sortDir: order,
    };
    this.getRuleRelationList(this?.details()?.dataGroupId ?? '', {
      ...this.pageParams,
      page: this.pageParams.page - 1,
    });
  }

  handlePageChange(e: any) {
    this.pageParams = { ...this.pageParams, page: e };
    this.getRuleRelationList(this?.details()?.dataGroupId ?? '', {
      ...this.pageParams,
      page: this.pageParams.page - 1,
    });
  }

  saveDraft() {
    this.ngxLoader.start();
    const payload = {
      ...this.dataGroupForm.getRawValue(),
      detailValues: this.detailValues(),
    };
    this.dataGroupService
      .createDraft(mapDataGroupFormDomainToApi(payload))
      .subscribe({
        next: () => {
          this.toast.success('Draft data group has been updated');

          this.router.navigate(['/home/rule-management/data-group/draft']);
        },
        error: (e) => {
          if (e.status !== 400) {
            this.toast.error('Draft data group has been failed to update');
          }

          this.ngxLoader.stop();
        },
        complete: () => {
          this.ngxLoader.stop();
        },
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

          this.router.navigate(['/home/rule-management/data-group/draft']);
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

          this.router.navigate(['/home/rule-management/data-group/draft']);
        },
        error: (e) => {
          this.ngxLoader.stop();

          if (e.status !== 400 && e.status !== 409) {
            this.toast.error('Request update data group has been failed');
          }

          if (e.status === 409) {
            this.failedDialogService
              .failed('', '409', e?.error.message)
              .then((confirmed) => {
                if (confirmed) {
                  this.router.navigate([
                    '/home/rule-management/data-group/draft',
                  ]);
                }
              });
          }
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
          if (this.details()?.requestType === 'CREATE') {
            this.createDataGroup();
            return;
          }
          this.editDataGroup();
        }
      });
  }

  onSubmitDraft() {
    this.confirmationDialogService
      .confirm('', 'Are you sure want to save as draft?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.saveDraft();
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
      detailValues: this.detailValues() || [],
    };
    const changed = this.getChangedValues(this.initialFormValue, currentValue);

    if (Object.keys(changed).length === 0) {
      this.router.navigate(['/home/rule-management/data-group/draft']);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            this.router.navigate(['/home/rule-management/data-group/draft']);
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onKeyDown(event: KeyboardEvent, controlName: string) {
    const control = this.dataGroupForm.get(controlName);
    const value = control?.value ?? '';
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];

    if (value.length > 256 && !allowedKeys.includes(event.key)) {
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

  loadFiles(data: any) {
    let formArray;

    if (data.list_files && data.list_files?.length > 0) {
      formArray = this.fb.array(
        data.list_files.map((res: any) =>
          this.fb.group({
            originalName: [res?.original_name],
            extension: [res?.extension],
            generatedName: [res?.generated_name],
          }),
        ),
      );

      this.dataGroupForm.setControl('listFiles', formArray);
    }
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
}
