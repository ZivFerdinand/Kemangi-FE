import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  computed,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { finalize } from 'rxjs';

import { ToastService } from '../../../../../core/services/toast.service';
import {
  CustomTabComponent,
  BreadcrumbProps,
  TabProps,
  BadgeUploadedDoc,
} from '../../../../../shared';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { ContentLayout } from '../../../../../shared/layout/content-layout/content-layout';
import {
  blockUnblockAccountBalanceTabs,
  blockUnblockAccountBalanceUploadBreadcrumb,
} from '../../data';
import { FileProps } from '../../../../../shared';
import { BlockUnblockAccountBalanceService } from '../../api/services/block-unblock-account-balance.service';
import { accountTypes } from '../../../../../shared';
import { SharedDataService } from '../../../../../core/services/shared-data.service';
import { FailedModalService } from '../../../../../core/services/failed-modal.service';

@Component({
  selector: 'app-block-unblock-account-balance-upload',
  templateUrl: './upload.component.html',
  styleUrls: [
    './upload.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    NgbTooltipModule,
    ContentLayout,
    CustomTabComponent,
    BadgeUploadedDoc,
    NgSelectModule,
  ],
  providers: [DatePipe],
})
export class BlockUnblockAccountBalanceUploadComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = blockUnblockAccountBalanceUploadBreadcrumb;

  pageTitle: string = 'Block/Unblock Account Balance';

  tabs: TabProps[] = blockUnblockAccountBalanceTabs;

  activeTab = 'upload';

  listFiles: FileProps[] = [];

  uploadForm!: FormGroup;

  selectedFile: File | null = null;

  accountTypes: any = accountTypes;

  submitted: boolean = false;

  errorMessageAction: string = '';
  errorMessageAccountType: string = '';
  errorMessageUpload: string = '';

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly blockUnblockAccountBalanceService: BlockUnblockAccountBalanceService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    private fb: FormBuilder,
    private sharedData: SharedDataService,
    public failedDialogService: FailedModalService,
  ) {
    this.currentUrl = this.router.url;

    this.uploadForm = this.fb.group({
      accountType: [null],
      action: [null],
      file: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  menuUpload = computed(() =>
    this.sharedData.checkMenu('ACTION-BLOCKUNBLOCKBALANCE-UPLOAD'),
  );

  menuView = computed(() =>
    this.sharedData.checkMenu('ACTION-BLOCKUNBLOCKBALANCE-VIEW'),
  );

  checkMenu = (value: string): boolean => {
    return value === 'upload' ? this.menuUpload() : this.menuView();
  };

  get f() {
    return this.uploadForm.controls;
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'upload')
      this.navigateTo('/home/action/block-unblock-account-balance/upload');

    if (tab === 'requested')
      this.navigateTo('/home/action/block-unblock-account-balance/requested');
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onFileSelected(event: Event) {
    const actionInput = this.uploadForm.get('action');
    const accountTypeInput = this.uploadForm.get('accountType');
    const input = event.target as HTMLInputElement;

    if (!actionInput?.value || !accountTypeInput?.value) {
      if (!actionInput?.value) {
        actionInput?.setErrors({ invalid: true });
      }

      if (!accountTypeInput?.value) {
        accountTypeInput?.setErrors({ invalid: true });
      }

      actionInput?.markAsDirty();
      actionInput?.markAsTouched();
      accountTypeInput?.markAsDirty();
      accountTypeInput?.markAsTouched();
    }

    if (actionInput?.invalid || accountTypeInput?.invalid) {
      if (actionInput?.invalid) {
        this.errorMessageAction = 'Please select an action before uploading';
      }

      if (accountTypeInput?.invalid) {
        this.errorMessageAccountType =
          'Please select an account type before uploading';
      }

      input.value = '';
      return;
    }

    if (!input.files?.length) return;

    const file = input.files[0];
    input.value = '';

    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessageUpload = 'File must be .xlsx';
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;

      if (!data) return;

      const workbook = XLSX.read(data, { type: 'array' });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils
        .sheet_to_json(sheet, {
          header: 1,
          blankrows: false,
        })
        .filter((row: any) =>
          row.some(
            (cell: any) =>
              cell !== undefined && cell !== null && String(cell).trim() !== '',
          ),
        );

      const rowCount = rows.length - 2;

      if (rowCount === 0) {
        this.failedDialogService.failed(
          '',
          '400',
          'No record found in the uploaded file. Please review and re-upload',
        );
        this.selectedFile = null;
        this.uploadForm.get('file')?.reset();
        return;
      }

      if (rowCount > 5000) {
        this.errorMessageUpload = 'Maximum 5.000 records allowed in the file';
        this.selectedFile = null;
        this.uploadForm.get('file')?.reset();
        return;
      }

      this.errorMessageUpload = '';
      this.selectedFile = file;
      this.uploadForm.get('file')?.setValue(file);
    };

    reader.readAsArrayBuffer(file);
  }

  clearFile() {
    this.selectedFile = null;
  }

  handleDownload() {
    const actionInput = this.uploadForm.get('action');
    const accountTypeInput = this.uploadForm.get('accountType');

    if (!actionInput?.value || !accountTypeInput?.value) {
      if (!actionInput?.value) {
        actionInput?.setErrors({ invalid: true });
      }

      if (!accountTypeInput?.value) {
        accountTypeInput?.setErrors({ invalid: true });
      }

      actionInput?.markAsDirty();
      actionInput?.markAsTouched();
      accountTypeInput?.markAsDirty();
      accountTypeInput?.markAsTouched();
    }

    if (actionInput?.invalid || accountTypeInput?.invalid) {
      if (actionInput?.invalid) {
        this.errorMessageAction = 'Please select an action before downloading';
      }

      if (accountTypeInput?.invalid) {
        this.errorMessageAccountType =
          'Please select an account type before downloading';
      }

      return;
    }

    this.blockUnblockAccountBalanceService
      .downloadTemplate(actionInput?.value, accountTypeInput?.value)
      .subscribe({
        next: (response) => {
          const blob = response.body!;

          const contentDisposition = response.headers.get(
            'Content-Disposition',
          );
          const fileName = contentDisposition
            ?.split('filename=')[1]
            ?.replace(/"/g, '')
            ?.trim();

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');

          link.href = url;
          link.download =
            fileName || `template-${actionInput?.value?.toLowerCase()}.xlsx`;

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          this.toast.error('Download Failed');
        },
      });
  }

  toggleRadio() {
    this.errorMessageAction = '';
    this.errorMessageUpload = '';
    this.selectedFile = null;
  }

  submit() {
    this.submitted = true;
    if (this.uploadForm.get('action')?.invalid) {
      return;
    }

    const formData = new FormData();

    Object.keys(this.uploadForm.value).forEach((key) => {
      const value = this.uploadForm.get(key)?.value;

      if (value !== null && value !== undefined) {
        const formKey = key === 'accountType' ? 'account_type' : key;
        formData.append(formKey, value);
      }
    });

    this.ngxLoader.start();

    this.blockUnblockAccountBalanceService
      .upload(formData)
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          if (res?.data) {
            this.router.navigate([
              `/home/action/block-unblock-account-balance/upload/${res.data}`,
            ]);
          }
        },
        error: (e) => {
          if (
            e.error.message !==
              'No data found in the uploaded file. Please review and re-upload.' &&
            e.error.message !==
              'The uploaded template does not match the selected account type or action. Please upload the correct template.'
          ) {
            this.toast.error('Something went wrong while loading data');
          }
        },
      });
  }

  discard() {
    this.uploadForm.reset();
    this.errorMessageAction = '';
    this.errorMessageUpload = '';
    this.errorMessageAccountType = '';
    this.fileInput.nativeElement.value = '';
    this.selectedFile = null;
  }

  isFilled(): Boolean {
    const payload = this.uploadForm.getRawValue();

    if (this.selectedFile) {
      return true;
    }

    if (payload.action) {
      return true;
    }

    if (payload.accountType) {
      return true;
    }

    return false;
  }

  downloadSelectedFile(): void {
    if (!this.selectedFile) {
      return;
    }

    try {
      const url = URL.createObjectURL(this.selectedFile);

      const a = document.createElement('a');
      a.href = url;
      a.download = this.selectedFile.name;

      a.click();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }

  handleDiscard() {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to discard all changes?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.discard();
        }
      });
  }
}
