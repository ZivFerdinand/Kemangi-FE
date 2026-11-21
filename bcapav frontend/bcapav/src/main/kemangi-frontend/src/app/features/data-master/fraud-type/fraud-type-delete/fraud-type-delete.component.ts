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
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { ToggleSwitch } from '../../../../shared';
import { FraudTypeService } from '../api';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../core/services/failed-modal.service';
import { ReasonModalService } from '../../../../core/services/reason-modal.service';

import { User } from '../../../../core/models/user';
import { BreadcrumbProps } from '../../../../shared';
import { ToastService } from '../../../../core/services/toast.service';
import { deleteFraudTypeBreadcrumb } from '../data';
import { ContentLayout } from '../../../../shared';

@Component({
  selector: 'app-fraud-type-delete',
  templateUrl: './fraud-type-delete.component.html',
  styleUrls: [
    './fraud-type-delete.component.scss',
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
export class FraudTypeDeleteComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = deleteFraudTypeBreadcrumb;

  pageTitle: string = 'Delete Fraud Type';

  initialFormValue: any;

  fraudTypeForm: FormGroup;

  fraudTypeId: string = '';

  private destroy$ = new Subject<void>();

  @ViewChild('autoDescTA') autoDescTA!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private fb: FormBuilder,
    private readonly fraudTypeService: FraudTypeService,
    public confirmationDialogService: ConfirmationModalService,
    public failedDialogService: FailedModalService,
    public reasonDialogService: ReasonModalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;

    this.fraudTypeForm = this.fb.group({
      id: [''],
      activeStatus: [true],
      fraudType: [''],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.initProfileUser();
    this.handleRouteParams();
  }

  private initProfileUser(): void {
    const encoded = localStorage.getItem(btoa('profileUser'));
    if (!encoded) return;

    try {
      const user: User = JSON.parse(atob(encoded));
      this.fraudTypeForm.get('groupId')?.patchValue(user.groupId);
    } catch {
      // ignore invalid storage
    }
  }

  private handleRouteParams(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (!id) return;

      this.fraudTypeId = id;
      this.getFraudTypeDetails(this.fraudTypeId);
      this.fraudTypeForm?.get('id')?.setValue(this.fraudTypeId);
      this.disableFields();
    });
  }

  private disableFields(): void {
    ['fraudType', 'description'].forEach((key) =>
      this.fraudTypeForm.get(key)?.disable(),
    );
  }

  getFraudTypeDetails(id: string) {
    this.ngxLoader.start();
    this.fraudTypeService.fraudTypeDetails(id).subscribe({
      next: (res: any) => {
        const { fraud_type, description, active_status } = res['data'];

        this.fraudTypeForm.patchValue({
          activeStatus: active_status,
          fraudType: fraud_type,
          description: description,
        });

        this.initialFormValue = this.fraudTypeForm.getRawValue();

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

  deleteFraudType() {
    this.ngxLoader.start();

    this.fraudTypeService.deleteFraudType(Number(this.fraudTypeId)).subscribe({
      next: () => {
        this.toast.success('Delete Fraud Type request has been submitted');

        this.router.navigate(['/home/data-master/fraud-type']);
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Delete Fraud Type request has been failed');
        }

        this.ngxLoader.stop();
      },
      complete: () => {
        this.ngxLoader.stop();
      },
    });
  }

  handleDeleteImmediately() {
    const raw = this.fraudTypeForm.getRawValue();

    if (raw.activeStatus) {
      setTimeout(() => {
        this.failedDialogService.failed(
          '',
          '400',
          'Sorry! Fraud type is active. Please change the status to Inactive before submitting.',
        );
      }, 700);

      return;
    }

    this.deleteFraudType();
  }

  handleDeleteConfirmation() {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to submit?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.deleteFraudType();
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
    const currentValue = this.fraudTypeForm.getRawValue();
    const changed = this.getChangedValues(this.initialFormValue, currentValue);

    if (Object.keys(changed).length === 0) {
      this.router.navigate(['/home/data-master/fraud-type']);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            this.router.navigate(['/home/data-master/fraud-type']);
          }
        });
    }
  }

  get f() {
    return this.fraudTypeForm.controls;
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
