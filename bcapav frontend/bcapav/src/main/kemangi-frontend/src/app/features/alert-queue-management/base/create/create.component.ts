import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { mapAlertQueuePayloadDomainToApi } from '../../mappers/alert-queue.mapper';
import { AlertQueueService } from '../../api/services/alert-queue.service';
import { BreadcrumbProps, ContentLayout } from '../../../../shared';
import { alertQueueManagementCreateBreadcrumb } from '../../data';
import { AlertQueueForm } from '../../components/alert-queue-form/alert-queue-form';
import {
  AlertQueuePayload,
  AlertQueuePayloadValueComparator,
} from '../../domain/alert-queue.model';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../../core/services/failed-modal.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-alert-queue-create',
  templateUrl: './create.component.html',
  styleUrls: [
    './create.component.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [ContentLayout, AlertQueueForm],
})
export class AlertQueueCreateComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = alertQueueManagementCreateBreadcrumb;

  pageTitle: string = 'Create New Alert Queue';

  mode: string = 'CREATE';

  from: string = '';

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
    this.handleQueryParams();
  }

  private handleQueryParams(): void {
    this.route.queryParams.subscribe(
      (params) => (this.from = params['from'] ?? ''),
    );
  }

  create(data: AlertQueuePayload) {
    this.ngxLoader.start();

    this.alertQueueService
      .create(mapAlertQueuePayloadDomainToApi(data))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.toast.success('Request create alert queue has been created');

          this.router.navigate([`/home/alert-queue-management/${this.from}`]);
        },
        error: this.handleError('Request create alert queue has been failed'),
      });
  }

  handleSubmit(data: AlertQueuePayload) {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to submit?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.create(data);
          return;
        }
      });
  }

  handleBack(data: AlertQueuePayloadValueComparator) {
    if (
      JSON.stringify(data.currentValue) === JSON.stringify(data.initialValue)
    ) {
      this.router.navigate([`/home/alert-queue-management/${this.from}`]);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure you want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            this.router.navigate([`/home/alert-queue-management/${this.from}`]);
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
