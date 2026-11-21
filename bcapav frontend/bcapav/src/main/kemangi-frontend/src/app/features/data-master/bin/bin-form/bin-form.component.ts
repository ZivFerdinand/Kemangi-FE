import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { ToggleSwitch } from '../../../../shared';
import { BinService } from '../api';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../core/services/failed-modal.service';
import { ReasonModalService } from '../../../../core/services/reason-modal.service';

//import { User } from '../../../../core/models/user';
import { BreadcrumbProps } from '../../../../shared';
import { ToastService } from '../../../../core/services/toast.service';
import { createBinBreadcrumb, editBinBreadcrumb } from '../data';
import { ContentLayout } from '../../../../shared';
import { mapBinPayloadDomainToApi } from '../mappers/bin.mapper';

@Component({
  selector: 'app-bin-form',
  templateUrl: './bin-form.component.html',
  styleUrls: [
    './bin-form.component.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    ToggleSwitch,
    ContentLayout,
  ],
})
export class BinFormComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  initialFormValue: any;

  binForm: FormGroup;

  binId: string = '';

  private destroy$ = new Subject<void>();

  @ViewChild('autoDescTA') autoDescTA!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private fb: FormBuilder,
    private readonly binService: BinService,
    public confirmationDialogService: ConfirmationModalService,
    public failedDialogService: FailedModalService,
    public reasonDialogService: ReasonModalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;

    this.binForm = this.fb.group({
      id: [''],
      activeStatus: [true],
      binNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(8),
          Validators.pattern(/^[0-9_]*$/),
        ],
      ],
      binDescription: ['', [Validators.maxLength(200)]],
    });
  }

  ngOnInit(): void {
    this.initPageMode();
    //this.initProfileUser();
    this.handleRouteParams();
  }

  private initPageMode(): void {
    if (this.currentUrl.includes('create')) {
      this.breadcrumb = createBinBreadcrumb;
      this.pageTitle = 'Create New BIN';
      this.initialFormValue = this.binForm.getRawValue();
    } else {
      this.breadcrumb = editBinBreadcrumb;
      this.pageTitle = 'Edit BIN';
    }
  }

  // private initProfileUser(): void {
  //   const encoded = localStorage.getItem(btoa('profileUser'));
  //   if (!encoded) return;

  //   try {
  //     const user: User = JSON.parse(atob(encoded));
  //     this.binForm.get('groupId')?.patchValue(user.groupId);
  //   } catch {
  //     // ignore invalid storage
  //   }
  // }

  private handleRouteParams(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (!id) return;

      this.binId = id;
      this.getBinDetails(this.binId);
      this.binForm?.get('id')?.setValue(this.binId);
    });
  }

  getBinDetails(id: string) {
    this.ngxLoader.start();
    this.binService.binDetails(id).subscribe({
      next: (res: any) => {
        const { bin_number, bin_description, active_status } = res['data'];

        this.binForm.patchValue({
          activeStatus: active_status,
          binNumber: bin_number,
          binDescription: bin_description,
        });

        this.initialFormValue = this.binForm.getRawValue();

        setTimeout(() => {
          this.autogrow(this.autoDescTA.nativeElement);
        }, 100);
      },
      error: (e) => {
        this.ngxLoader.stop();
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => this.ngxLoader.stop(),
    });
  }

  createBin() {
    this.ngxLoader.start();
    this.binService
      .createBin(mapBinPayloadDomainToApi(this.binForm.getRawValue()))
      .subscribe({
        next: () => {
          this.toast.success('Create BIN request has been submitted');

          this.router.navigate(['/home/data-master/bin']);
        },
        error: (e) => {
          if (e.status !== 400) {
            this.toast.error('Create BIN request has been failed');
          }

          this.ngxLoader.stop();
        },
        complete: () => {
          this.ngxLoader.stop();
        },
      });
  }

  editBin() {
    this.ngxLoader.start();

    const raw = this.binForm.getRawValue();

    this.binService.updateBin(mapBinPayloadDomainToApi(raw)).subscribe({
      next: () => {
        this.toast.success('Edit BIN request has been submitted');

        this.router.navigate(['/home/data-master/bin']);
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Edit BIN request has been failed');
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
        if (confirmed) {
          if (this.binId || this.binId !== '') {
            this.editBin();
            return;
          }
          this.createBin();
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
    const currentValue = this.binForm.getRawValue();
    const changed = this.getChangedValues(this.initialFormValue, currentValue);

    if (Object.keys(changed).length === 0) {
      this.router.navigate(['/home/data-master/bin']);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure you want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            this.router.navigate(['/home/data-master/bin']);
          }
        });
    }
  }

  get f() {
    return this.binForm.controls;
  }

  autogrow(textarea: HTMLTextAreaElement) {
    const minHeight = 48;
    const maxHeight = 136;

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

    control = this.binForm.get(controlName);

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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
