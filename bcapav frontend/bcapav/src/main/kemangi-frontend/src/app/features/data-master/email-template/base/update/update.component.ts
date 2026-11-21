import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  Subject,
  forkJoin,
  Observable,
  of,
  catchError,
  tap,
  finalize,
  takeUntil,
} from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { ConfirmationModalService } from '../../../../../core/services/confirmation-modal.service';
import { ToastService } from '../../../../../core/services/toast.service';
import {
  ContentLayout,
  BreadcrumbProps,
  BackPage,
} from '../../../../../shared';
import { EmailTemplateService } from '../../api';
import {
  mapEmailTemplateDetailApiToDomain,
  mapEmailTemplatePayloadDomainToApi,
} from '../../mappers/email-template.mapper';
import { editEmailTemplateBreadcrumb } from '../../data';
import { RuleService } from '../../../../rule-management/rule/api/services/rule.service';
import { EmailForm } from '../../components/email-form/email-form';
import {
  EmailTemplateDetails,
  EmailTemplatePayload,
} from '../../domain/models/email-template.model';

@Component({
  selector: 'app-email-template-base-update',
  templateUrl: './update.component.html',
  styleUrls: [
    './update.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [CommonModule, NgbModule, ContentLayout, EmailForm],
  providers: [DatePipe],
})
export class EmailTemplateBaseUpdateComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = editEmailTemplateBreadcrumb;

  pageTitle: string = 'Edit Email Template';

  mode: string = 'UPDATE';

  productGroupList: any[] = [];

  templateTypeList: any[] = [];

  initialData: EmailTemplateDetails | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly ngxLoader: NgxUiLoaderService,
    private router: Router,
    public confirmationDialogService: ConfirmationModalService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly ruleService: RuleService,
    private readonly toast: ToastService,
    private route: ActivatedRoute,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.ngxLoader.start();

    forkJoin([this.getTemplateTypeList(), this.getProductList()])
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe(() => {
        this.handleRouteParams();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //

  private handleRouteParams(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (!id) return;

      this.getDetails(id);
    });
  }

  update(data: EmailTemplatePayload) {
    this.ngxLoader.start();

    const payload: EmailTemplatePayload = data;

    this.emailTemplateService
      .updateEmailTemplate(mapEmailTemplatePayloadDomainToApi(payload))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.toast.success(
            'Update Email Template request has been submitted',
          );

          this.router.navigate([`/home/data-master/email-template`]);
        },
        error: this.handleError(
          'Update Email Template request has been failed',
        ),
      });
  }

  onSubmit(data: EmailTemplatePayload) {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to submit?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.update(data);
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

  getDetails(id: string) {
    this.ngxLoader.start();

    this.emailTemplateService
      .emailTemplateDetails(id)
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.initialData = mapEmailTemplateDetailApiToDomain(res['data']);
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  getProductList(): Observable<any> {
    return this.ruleService.ruleMasterProductGroupList().pipe(
      tap((res: any) => {
        this.productGroupList = res['data'];
      }),
      catchError((e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
        return of(null);
      }),
    );
  }

  getTemplateTypeList(): Observable<any> {
    return this.ruleService.getTemplateTypeList().pipe(
      tap((res: any) => {
        this.templateTypeList = res['data'];
      }),
      catchError((e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
        return of(null);
      }),
    );
  }

  // general

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
