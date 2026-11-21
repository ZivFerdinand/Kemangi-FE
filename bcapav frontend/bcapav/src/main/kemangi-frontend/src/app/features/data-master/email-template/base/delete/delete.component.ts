import { Component, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EmailTemplateDetails } from '../../domain/models/email-template.model';
import {
  ToggleSwitch,
  ContentLayout,
  BreadcrumbProps,
} from '../../../../../shared';
import { FailedModalService } from '../../../../../core/services/failed-modal.service';
import { EmailTemplateService } from '../../api';
import {
  deleteEmailTemplateBreadcrumb,
  EMAIL_TEMPLATE_DETAILS_INIT,
} from '../../data';
import { ToastService } from '../../../../../core/services/toast.service';
import { mapEmailTemplateDetailApiToDomain } from '../../mappers/email-template.mapper';
import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';

@Component({
  selector: 'app-email-template-delete',
  templateUrl: './delete.component.html',
  styleUrls: [
    './delete.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    ToggleSwitch,
    ContentLayout,
  ],
  providers: [DatePipe],
})
export class EmailTemplateBaseDeleteComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = deleteEmailTemplateBreadcrumb;

  pageTitle: string = 'Delete Email Template';

  prevDetails = signal<EmailTemplateDetails>({
    ...EMAIL_TEMPLATE_DETAILS_INIT,
  });

  details = signal<EmailTemplateDetails>({ ...EMAIL_TEMPLATE_DETAILS_INIT });

  emailTemplateId: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly emailTemplateService: EmailTemplateService,
    public confirmationDialogService: ConfirmationModalService,
    public failedDialogService: FailedModalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.emailTemplateId = params.get('id') ?? '';
      if (this.emailTemplateId || this.emailTemplateId !== '') {
        this.initData();
      }
    });
  }

  initData() {
    this.getDetails(this.emailTemplateId);
  }

  // action

  deleteEmailTemplate() {
    this.ngxLoader.start();

    this.emailTemplateService
      .deleteEmailTemplate(Number(this.emailTemplateId))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.toast.success(
            'Delete email template request has been submitted',
          );

          this.router.navigate(['/home/data-master/email-template']);
        },

        error: this.handleError(
          'Delete email template request has been failed',
        ),
      });
  }

  handleDeleteImmediately() {
    if (this.details().activeStatus) {
      setTimeout(() => {
        this.failedDialogService.failed(
          '',
          '400',
          `Sorry! Email Template is Active. Please change the status to Inactive before submitting.`,
        );
      }, 700);

      return;
    }

    this.deleteEmailTemplate();
  }

  handleDeleteConfirmation() {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to submit?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.deleteEmailTemplate();
        }
      });
  }

  back() {
    if (JSON.stringify(this.prevDetails()) === JSON.stringify(this.details())) {
      this.router.navigate(['/home/data-master/email-template']);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            this.router.navigate(['/home/data-master/email-template']);
          }
        });
    }
  }

  // general

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }

  // fetch API

  getDetails(id: string) {
    this.ngxLoader.start();

    this.emailTemplateService
      .emailTemplateDetails(id)
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.prevDetails.set({
            ...mapEmailTemplateDetailApiToDomain(res['data']),
          });
          this.details.set({
            ...mapEmailTemplateDetailApiToDomain(res['data']),
          });
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }
}
