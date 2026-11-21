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

import { ToastService } from '../../../../../core/services/toast.service';
import {
  CustomTabComponent,
  BreadcrumbProps,
  TabProps,
  BadgeUploadedDoc,
} from '../../../../../shared';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { ContentLayout } from '../../../../../shared/layout/content-layout/content-layout';
import { smcTabs, smcUploadBreadcrumb } from './../../data';
import { FileProps } from '../../../../../shared';
import { MenuService } from '../../../../../core/services/menu.service';
import { SMCService } from '../../api/services/smc.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-smc-upload',
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
export class SmcUploadComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = smcUploadBreadcrumb;

  pageTitle: string = 'Secure My Card (SMC)';

  tabs: TabProps[] = smcTabs;

  activeTab = 'upload';

  listFiles: FileProps[] = [];

  uploadForm!: FormGroup;

  selectedFile: File | null = null;

  submitted: boolean = false;

  errorMessageDownload: string = '';
  errorMessageUpload: string = '';

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly smcService: SMCService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
    private fb: FormBuilder,
    private menu: MenuService,
  ) {
    this.currentUrl = this.router.url;

    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  menuUpload = computed(() => this.menu.checkMenu('ACTION-SMC-UPLOAD'));

  menuView = computed(() => this.menu.checkMenu('ACTION-SMC-VIEW'));

  checkMenu = (value: string): boolean => {
    return value === 'upload' ? this.menuUpload() : this.menuView();
  };

  get f() {
    return this.uploadForm.controls;
  }

  handleTabChange(tab: string) {
    this.activeTab = tab;

    if (tab === 'upload') this.navigateTo('/home/action/smc/upload');

    if (tab === 'requested') this.navigateTo('/home/action/smc/requested');
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

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

    if (file) {
      this.selectedFile = file;
      this.uploadForm.get('file')?.setValue(file);
    }
  }

  clearFile() {
    this.selectedFile = null;
  }

  handleDownload() {
    this.smcService.downloadTemplate().subscribe({
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
        link.download = fileName || 'template.xlsx';

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
    this.errorMessageDownload = '';
    this.errorMessageUpload = '';
    this.selectedFile = null;
  }

  submit() {
    this.submitted = true;

    const formData = new FormData();

    Object.keys(this.uploadForm.value).forEach((key) => {
      const value = this.uploadForm.get(key)?.value;

      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    this.ngxLoader.start();

    this.smcService
      .upload(formData)
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          if (res?.data) {
            this.router.navigate([`/home/action/smc/upload/${res.data}`]);
          }
        },
        error: (e) => {
          if (
            e.error.message !==
            'No data found in the uploaded file. Please review and re-upload.'
          ) {
            this.toast.error('Something went wrong while loading data');
          }
        },
      });
  }

  discard() {
    this.uploadForm.reset();
    this.errorMessageDownload = '';
    this.errorMessageUpload = '';
    this.fileInput.nativeElement.value = '';
    this.selectedFile = null;
  }

  isFilled(): Boolean {
    if (this.selectedFile) {
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
