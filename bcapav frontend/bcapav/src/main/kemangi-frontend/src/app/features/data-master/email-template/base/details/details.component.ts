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
  detailEmailTemplateBreadcrumb,
  EMAIL_TEMPLATE_DETAILS_INIT,
} from '../../data';
import { ToastService } from '../../../../../core/services/toast.service';
import { mapEmailTemplateDetailApiToDomain } from '../../mappers/email-template.mapper';

@Component({
  selector: 'app-email-template-base-detail',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
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
export class EmailTemplateBaseDetailComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = detailEmailTemplateBreadcrumb;

  pageTitle: string = 'View Email Template';

  details = signal<EmailTemplateDetails>({ ...EMAIL_TEMPLATE_DETAILS_INIT });

  emailTemplateId: string = '';

  isDisabled: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly emailTemplateService: EmailTemplateService,
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

  getDetails(id: string) {
    this.ngxLoader.start();

    this.emailTemplateService
      .emailTemplateDetails(id)
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.details.set(mapEmailTemplateDetailApiToDomain(res['data']));
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  // action

  back() {
    this.router.navigate(['/home/data-master/email-template']);
  }

  // general

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
