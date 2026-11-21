import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import {
  mapAlertQueueDetailsApiToDomain,
  mapAlertQueuePayloadDomainToApi,
} from '../../mappers/alert-queue.mapper';
import { AlertQueueService } from '../../api/services/alert-queue.service';
import { BreadcrumbProps, ContentLayout } from '../../../../shared';
import {
  ALERT_QUEQUE_DETAILS_INIT_2,
  alertQueueManagementUpdateBreadcrumb,
} from '../../data';
import { AlertQueueForm } from '../../components/alert-queue-form/alert-queue-form';
import {
  AlertQueueDetails,
  AlertQueuePayload,
  AlertQueuePayloadValueComparator,
} from '../../domain/alert-queue.model';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../core/services/failed-modal.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-alert-queue-update',
  templateUrl: './update.component.html',
  styleUrls: [
    './update.component.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [ContentLayout, AlertQueueForm],
})
export class AlertQueueUpdateComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = alertQueueManagementUpdateBreadcrumb;

  pageTitle: string = 'Edit Alert Queue';

  id: string | null = null;

  details: AlertQueueDetails = { ...ALERT_QUEQUE_DETAILS_INIT_2 };

  mode: string = 'UPDATE';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public confirmationDialogService: ConfirmationModalService,
    private router: Router,
    public failedDialogService: FailedModalService,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly alertQueueService: AlertQueueService,
    private readonly toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.handleRouteParams();
  }

  handleRouteParams() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.id = params.get('id');

      if (this.id) {
        this.getDetails(this.id);
      }
    });
  }

  getDetails(id: string) {
    this.ngxLoader.start();
    this.alertQueueService
      .details(Number(id))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.details = mapAlertQueueDetailsApiToDomain(res['data']);
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  update(data: AlertQueuePayload) {
    this.ngxLoader.start();

    this.alertQueueService
      .update(mapAlertQueuePayloadDomainToApi(data))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.toast.success('Request update alert queue has been created');

          this.router.navigate([`/home/alert-queue-management`]);
        },
        error: this.handleError('Request update alert queue has been failed'),
      });
  }

  handleSubmit(data: AlertQueuePayload) {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to submit?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.update(data);
          return;
        }
      });
  }

  handleBack(data: AlertQueuePayloadValueComparator) {
    if (
      JSON.stringify(data.currentValue) === JSON.stringify(data.initialValue)
    ) {
      this.router.navigate([`/home/alert-queue-management`]);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure you want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            this.router.navigate([`/home/alert-queue-management`]);
          }
        });
    }
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
