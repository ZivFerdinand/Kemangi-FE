import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { ContentLayout, BreadcrumbProps } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { EmailTemplateApprovalService } from '../../../../approval/email-template/api/services/email-template-approval.service';
import { EmailTemplateApprovalDetails } from '../../../../approval/email-template/domain/email-approval.model';

import { mapEmailTemplateDetailsApprovalApiToDomain } from '../../../../approval/email-template/mappers/email-template-approval.mapper';
import { EMAIL_TEMPL_APPROVAL_DETAILS_INIT } from '../../../../approval/email-template/data';
import { EmailTemplateViewApprovalI } from '../../../../approval/email-template/components/view-approval-i/view-approval-i';
import { EmailTemplateViewApprovalII } from '../../../../approval/email-template/components/view-approval-ii/view-approval-ii';
import { emailTemplateRequestedListBreadcrumb } from '../../data';

@Component({
  selector: 'app-email-template-detail-requested',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ContentLayout,
    EmailTemplateViewApprovalI,
    EmailTemplateViewApprovalII,
  ],
})
export class EmailTemplateDetailRequestedComponent
  implements OnInit, OnDestroy
{
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  details = signal<EmailTemplateApprovalDetails>({
    ...EMAIL_TEMPL_APPROVAL_DETAILS_INIT,
  });

  prevDetails = signal<EmailTemplateApprovalDetails>({
    ...EMAIL_TEMPL_APPROVAL_DETAILS_INIT,
  });

  isDisabled: boolean = true;
  apprId: string | null = '';
  prevApprId: string | null = '';
  actionType: string | null = '';

  pageType: string = 'requested list';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly emailTemplateApprovalService: EmailTemplateApprovalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.apprId = params.get('id');
      this.getDetails();
    });
  }

  initPageMode(action: string) {
    if (action === 'CREATE') {
      this.pageTitle = 'New Email Template Approval';
      this.breadcrumb = [
        ...emailTemplateRequestedListBreadcrumb,
        { label: 'New Email Template Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit Email Template Approval';
      this.breadcrumb = [
        ...emailTemplateRequestedListBreadcrumb,
        { label: 'Edit Email Template Approval', url: '' },
      ];
    } else {
      this.pageTitle = 'Delete Email Template Approval';
      this.breadcrumb = [
        ...emailTemplateRequestedListBreadcrumb,
        { label: 'Delete Email Template Approval', url: '' },
      ];
    }
  }

  getDetails() {
    this.ngxLoader.start();
    this.emailTemplateApprovalService
      .details(this.apprId ? this.apprId.toString() : '')
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.details.set(
            mapEmailTemplateDetailsApprovalApiToDomain(res['data']),
          );
          this.prevApprId = res['data']['last_appr_id'] ?? '';
          this.actionType = res['data']['request_type'];
          this.initPageMode(this.actionType ?? '');
        },
        error: this.handleError('Something went wrong while loading data'),
        complete: () => {
          if (this.details().requestType === 'UPDATE') {
            this.getPrevDetails();
            return;
          }
        },
      });
  }

  getPrevDetails() {
    this.ngxLoader.start();
    this.emailTemplateApprovalService
      .details(this.prevApprId ? this.prevApprId.toString() : '')
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.prevDetails.set(
            mapEmailTemplateDetailsApprovalApiToDomain(res['data']),
          );
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  back() {
    this.router.navigate(['/home/data-master/email-template/requested-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // general

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }
}
