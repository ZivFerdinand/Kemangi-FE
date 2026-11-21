import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { ContentLayout, BreadcrumbProps } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { EmailTemplateApprovalService } from '../../api/services/email-template-approval.service';
import { EmailTemplateApprovalDetails } from '../../domain/email-approval.model';
import {
  emailTemplateApprovalRequestedListBreadcrumb,
  EMAIL_TEMPL_APPROVAL_DETAILS_INIT,
} from '../../data';
import { mapEmailTemplateDetailsApprovalApiToDomain } from '../../mappers/email-template-approval.mapper';
import { EmailTemplateViewApprovalI } from '../../components/view-approval-i/view-approval-i';
import { EmailTemplateViewApprovalII } from '../../components/view-approval-ii/view-approval-ii';

@Component({
  selector: 'app-email-template-requested-view',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    ContentLayout,
    EmailTemplateViewApprovalI,
    EmailTemplateViewApprovalII,
  ],
})
export class EmailTemplateRequestedViewComponent implements OnInit, OnDestroy {
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

      if (this.apprId) {
        this.getDetails(this.apprId);
      }
    });
  }

  initPageMode(action: string) {
    if (action === 'CREATE') {
      this.pageTitle = 'New Email Template Approval';
      this.breadcrumb = [
        ...emailTemplateApprovalRequestedListBreadcrumb,
        { label: 'New Email Template Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit Email Template Approval';
      this.breadcrumb = [
        ...emailTemplateApprovalRequestedListBreadcrumb,
        { label: 'Edit Email Template Approval', url: '' },
      ];
    } else {
      this.pageTitle = 'Delete Email Template Approval';
      this.breadcrumb = [
        ...emailTemplateApprovalRequestedListBreadcrumb,
        { label: 'Delete Email Template Approval', url: '' },
      ];
    }
  }

  back() {
    this.router.navigate(['/home/approval/email-template/requested-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // fetch API

  getDetails(id: string) {
    this.ngxLoader.start();
    this.emailTemplateApprovalService
      .details(id)
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
            if (this.prevApprId) {
              this.getPrevDetails(this.prevApprId);
              return;
            }
          }
        },
      });
  }

  getPrevDetails(id: string) {
    this.emailTemplateApprovalService.details(id).subscribe({
      next: (res: any) => {
        this.prevDetails.set(
          mapEmailTemplateDetailsApprovalApiToDomain(res['data']),
        );
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
