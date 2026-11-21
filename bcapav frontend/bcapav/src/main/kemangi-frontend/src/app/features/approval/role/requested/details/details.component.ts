import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

import { DefaultRoleApproval, EditRoleApproval } from '../../components';
import { ApiService } from '../../../../../core/services/api.service';
import { RoleApprovalService } from '../..';
import { BreadcrumbProps } from '../../../../../shared/interfaces';
import { roleApprovalRequestedListBreadcrumb } from '../../data';
import { ContentLayout } from '../../../../../shared';
import { ToastService } from '../../../../../core/services/toast.service';
import { mapRoleApprovalDetailsApiToDomain } from '../../../../role-management/mappers/role.mapper';
import { RoleApprovalDetails } from '../../../../role-management/domain/models/role.model';
@Component({
  selector: 'app-role-approval-requested-list-view',
  templateUrl: './details.component.html',
  styleUrls: [
    './details.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    DefaultRoleApproval,
    EditRoleApproval,
    ContentLayout,
  ],
})
export class RoleApprovalRequestedListViewComponent
  implements OnInit, OnDestroy
{
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  rawMenuList = signal<any[]>([]);

  details = signal<RoleApprovalDetails | null>(null);

  prevDetails = signal<RoleApprovalDetails | null>(null);

  isDisabled: boolean = true;
  apprRoleId: string | null = '';
  prevApprRoleId: string | null = '';
  roleActionType: string | null = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly roleApprovalService: RoleApprovalService,
    private readonly toast: ToastService,
    private readonly apiService: ApiService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.getMenuList();
      this.apprRoleId = params.get('id');

      this.getApprovalRoleDetails();
    });
  }

  setPageTitle(action: string) {
    if (action === 'CREATE') {
      this.pageTitle = 'New Role Approval';
      this.breadcrumb = [
        ...roleApprovalRequestedListBreadcrumb,
        { label: 'New Role Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit Role Approval';
      this.breadcrumb = [
        ...roleApprovalRequestedListBreadcrumb,
        { label: 'Edit Role Approval', url: '' },
      ];
    } else {
      this.pageTitle = 'Delete Role Approval';
      this.breadcrumb = [
        ...roleApprovalRequestedListBreadcrumb,
        { label: 'Delete Role Approval', url: '' },
      ];
    }
  }

  getApprovalRoleDetails() {
    this.ngxLoader.start();
    this.roleApprovalService
      .roleApprovalDetails(Number(this.apprRoleId))
      .subscribe({
        next: (res: any) => {
          this.details.set(mapRoleApprovalDetailsApiToDomain(res['data']));

          this.prevApprRoleId = res['data']['last_appr_role_id'];

          this.roleActionType = this.details()?.requestType ?? '';

          this.setPageTitle(this.roleActionType ?? '');
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e?.status !== 400) {
            this.toast.error('Something went wrong while loading data');
          }
        },
        complete: () => {
          this.ngxLoader.stop();

          if (this.details()?.requestType === 'UPDATE') {
            this.getPrevApprovalRoleDetails();
          }
        },
      });
  }

  getPrevApprovalRoleDetails() {
    this.roleApprovalService
      .roleApprovalDetails(Number(this.prevApprRoleId))
      .subscribe({
        next: (res: any) => {
          this.prevDetails.set(mapRoleApprovalDetailsApiToDomain(res['data']));
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e?.status !== 400) {
            this.toast.error('Something went wrong while loading data');
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
  }

  getMenuList() {
    this.apiService.getMenuList().subscribe({
      next: (res: any) => {
        this.rawMenuList.set(res['data']);
      },
      error: (e) => {
        if (e?.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
    });
  }

  back() {
    this.router.navigate(['/home/approval/role/requested-list']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
