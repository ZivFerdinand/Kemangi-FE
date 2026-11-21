import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { EmailTemplateService } from '../../api';
import { EmailTemplatePayload } from '../../domain/models/email-template.model';
import { mapEmailTemplatePayloadDomainToApi } from '../../mappers/email-template.mapper';
import { createEmailTemplateBreadcrumb } from '../../data';
import { RuleService } from '../../../../rule-management/rule/api/services/rule.service';
import { EmailForm } from '../../components/email-form/email-form';
import {
  BackPage,
  ContentLayout,
  BreadcrumbProps,
} from '../../../../../shared';

@Component({
  selector: 'app-email-template-base-create',
  templateUrl: './create.component.html',
  styleUrls: [
    './create.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, NgbModule, ContentLayout, EmailForm],
  providers: [DatePipe],
})
export class EmailTemplateBaseCreateComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = createEmailTemplateBreadcrumb;

  pageTitle: string = 'Create New Email Template';

  mode: string = 'CREATE';

  productGroupList: any[] = [];

  templateTypeList: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private readonly ngxLoader: NgxUiLoaderService,
    private router: Router,
    public confirmationDialogService: ConfirmationModalService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly ruleService: RuleService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.getProductList();
    this.getTemplateTypeList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //

  create(data: EmailTemplatePayload) {
    this.ngxLoader.start();

    const payload: EmailTemplatePayload = data;

    this.emailTemplateService
      .createEmailTemplate(mapEmailTemplatePayloadDomainToApi(payload))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.toast.success(
            'Create Email Template request has been submitted',
          );

          this.router.navigate([`/home/data-master/email-template`]);
        },
        error: this.handleError(
          'Create Email Template request has been failed',
        ),
      });
  }

  onSubmit(data: EmailTemplatePayload) {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to submit?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.create(data);
          return;
        }
      });
  }

  back(value: BackPage<EmailTemplatePayload>) {
    const currentValue = value?.currentValue;
    const initValue = value?.initValue;

    if (JSON.stringify(currentValue) === JSON.stringify(initValue)) {
      this.router.navigate([`/home/data-master/email-template`]);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure you want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            this.router.navigate([`/home/data-master/email-template`]);
          }
        });
    }
  }

  // fetch API

  getProductList() {
    this.ruleService.ruleMasterProductGroupList().subscribe({
      next: (res: any) => {
        this.productGroupList = res['data'];
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  getTemplateTypeList() {
    this.ruleService.getTemplateTypeList().subscribe({
      next: (res: any) => {
        this.templateTypeList = res['data'];
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  // general

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
