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
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import * as XLSX from 'xlsx';

import { ToastService } from '../../../../../core/services/toast.service';
import {
  CustomTabComponent,
  BreadcrumbProps,
  TabProps,
  BadgeUploadedDoc,
} from '../../../../../shared';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { ContentLayout } from '../../../../../shared/layout/content-layout/content-layout';
import { blockUnblockTabs, blockUnblockUploadBreadcrumb } from './../../data';
import { FileProps } from '../../../../../shared';
import { BlockUnblockService } from '../../api/services/block-unblock.service';
import { SharedDataService } from '../../../../../core/services/shared-data.service';
import { FailedModalService } from '../../../../../core/services/failed-modal.service';

@Component({
  selector: 'app-block-unblock-upload',
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
  ],
  providers: [DatePipe],
})
export class BlockUnblockUploadComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = blockUnblockUploadBreadcrumb;

  pageTitle: string = 'Block/Unblock Account';

  tabs: TabProps[] = blockUnblockTabs;

  activeTab = 'upload';

  listFiles: FileProps[] = [];

  uploadForm!: FormGroup;

  selectedFile: File | null = null;

  submitted: boolean = false;

  errorMessageUpload: string = '';
  errorMessageAction: string = '';

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly blockUnblockService: BlockUnblockService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    private fb: FormBuilder,
    private sharedData: SharedDataService,
    public failedDialogService: FailedModalService,
  ) {
    this.currentUrl = this.router.url;

    this.uploadForm = this.fb.group({
      action: [null, Validators.required],
      file: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  menuUpload = computed(() =>
    this.sharedData.checkMenu('ACTION-BLOCKUNBLOCK-UPLOAD'),
  );

  menuView = computed(() =>
    this.sharedData.checkMenu('ACTION-BLOCKUNBLOCK-VIEW'),
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
      this.navigateTo('/home/action/block-unblock-account/upload');

    if (tab === 'requested')
      this.navigateTo('/home/action/block-unblock-account/requested');
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onFileSelected(event: Event) {
    const actionInput = this.uploadForm.get('action');
    const input = event.target as HTMLInputElement;

    actionInput?.markAsDirty();
    actionInput?.markAsTouched();

    if (actionInput?.invalid) {
      this.errorMessageAction = 'Please select an action before uploading';
      input.value = '';
      return;
    }

    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file) return;

    input.value = '';

    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedTypes.includes(file.type)) {
      this.errorMessageUpload = 'File must be .xlsx';

      input.value = '';

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
    actionInput?.markAsDirty();
    actionInput?.markAsTouched();

    if (actionInput?.invalid) {
      this.errorMessageAction = 'Please select an action before downloading';
      return;
    }

    this.blockUnblockService.downloadTemplate(actionInput?.value).subscribe({
      next: (response) => {
        const blob = response.body!;

        const contentDisposition = response.headers.get('Content-Disposition');
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
        console.error('Download failed:', err);
      },
    });
  }

  toggleRadio() {
    this.errorMessageUpload = '';
    this.errorMessageAction = '';
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
        formData.append(key, value);
      }
    });

    this.ngxLoader.start();

    this.blockUnblockService
      .upload(formData)
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          if (res?.data) {
            this.router.navigate([
              `/home/action/block-unblock-account/upload/${res.data}`,
            ]);
          }
        },
        error: (e) => {
          if (
            e.error.message !==
              'No data found in the uploaded file. Please review and re-upload.' &&
            e.error.message !==
              'The uploaded template does not match the selected action. Please upload the correct template.'
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
