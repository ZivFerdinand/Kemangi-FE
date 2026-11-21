import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultThresholdApproval, EditThresholdApproval } from '../../components';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoleApprovalDetails } from '../..';
import { MenuOriginList, Menu } from '../../../../../shared/interfaces';
import { BreadcrumbProps } from '../../../../../shared/interfaces';
import { requestedDetailThresholdBreadcrumbs } from '../../data';
import { ContentLayout } from '../../../../../shared';
import { MLThresholdService } from '../../services/ml-threshold.service';
@Component({
  selector: 'app-threshold-requested-list-view',
  templateUrl: './threshold-requested-list-view.component.html',
  styleUrls: [
    './threshold-requested-list-view.component.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    DefaultThresholdApproval,
    EditThresholdApproval,
    ContentLayout,
  ],
})
export class ThresholdApprovalRequestedListViewComponent
  implements OnInit, OnDestroy
{
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';
  menuOriginList: MenuOriginList[] = [];
  menuList: Menu[] = [];
  apprDetailData: RoleApprovalDetails = {
    role_id: '',
    role_name: '',
    role_group: '',
    role_description: '',
    is_reviewer: true,
    active_status: false,
    menu_ids: [],
    appr_role_id: 0,
    last_appr_role_id: 0,
    request_type: '',
    approval_status: '',
    requester_id: '',
    requester_name: '',
    request_date: '',
    approver_id: null,
    approver_name: null,
    approval_date: null,
    rejection_note: null,
    old_data: {
      role_id: '',
      role_name: '',
      role_group: '',
      role_description: '',
      is_reviewer: true,
      active_status: false,
      menu_ids: [],
      appr_role_id: 0,
      last_appr_role_id: 0,
      request_type: '',
      approval_status: '',
      requester_id: '',
      requester_name: '',
      request_date: '',
      approver_id: null,
      approver_name: null,
      approval_date: null,
      rejection_note: null,
    },
  };

  isDisabled: boolean = true;
  apprRoleId: string | null = '';
  prevApprRoleId: string | null = '';
  roleActionType: string | null = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly mlThresholdService: MLThresholdService,
    private readonly toastr: ToastrService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.apprRoleId = params.get('id');

      this.getApprovalRoleDetails();
    });
  }

  setPageTitle(action: string) {
    if (action === 'CREATE') {
      this.pageTitle = 'New Threshold Approval';
      this.breadcrumb = [
        ...requestedDetailThresholdBreadcrumbs,
        { label: 'New Threshold Approval', url: '' },
      ];
    } else if (action === 'UPDATE') {
      this.pageTitle = 'Edit Threshold Approval';
      this.breadcrumb = [
        ...requestedDetailThresholdBreadcrumbs,
        { label: 'Edit Threshold Approval', url: '' },
      ];
    } else {
      this.pageTitle = 'Delete Threshold Approval';
      this.breadcrumb = [
        ...requestedDetailThresholdBreadcrumbs,
        { label: 'Delete Threshold Approval', url: '' },
      ];
    }
  }

  getApprovalRoleDetails() {
    this.ngxLoader.start();
    this.mlThresholdService
      .thresholdApprovalDetail(Number(this.apprRoleId))
      .subscribe({
        next: (res: any) => {
          this.apprDetailData = {
            ...this.apprDetailData,
            ...res['data'],
          };
          this.prevApprRoleId = res['data']['last_appr_id'];

          this.roleActionType = this?.apprDetailData?.request_type;

          this.setPageTitle(this.roleActionType ?? '');
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e) {
            this.toastr.show(
              `<div class="toast-custom toast-failed">
                <div class="info">
                  <div class="icon">
                    <img src="./assets/img/ic-times-rounded.svg" alt="error" />
                  </div>
                  <div class="description">
                     Something went wrong while loading data.
                  </div>
                </div>

                <button class="close-btn">
                  <img src="./assets/img/ic-times.svg" alt="close" />
                </button>
            </div>`,
              '',
              { enableHtml: true }
            );
          }
        },
        complete: () => {
          if (this.prevApprRoleId) {
            this.getPrevApprovalRoleDetails();
            return;
          }

          this.ngxLoader.stop();
        },
      });
  }

  getPrevApprovalRoleDetails() {
    this.mlThresholdService
      .thresholdApprovalDetail(Number(this.prevApprRoleId))
      .subscribe({
        next: (res: any) => {
          this.apprDetailData = {
            ...this.apprDetailData,
            old_data: res['data'],
          };
        },
        error: (e) => {
          this.ngxLoader.stop();
          if (e) {
            this.toastr.show(
              `<div class="toast-custom toast-failed">
                <div class="info">
                  <div class="icon">
                    <img src="./assets/img/ic-times-rounded.svg" alt="error" />
                  </div>
                  <div class="description">
                    Something went wrong while loading data.
                  </div>
                </div>

                <button class="close-btn">
                  <img src="./assets/img/ic-times.svg" alt="close" />
                </button>
            </div>`,
              '',
              { enableHtml: true }
            );
          }
        },
        complete: () => this.ngxLoader.stop(),
      });
  }


  back() {
    this.router.navigate(['/home/machine-learning/threshold-score/requested']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  mappingStepOne(data: MenuOriginList[]) {
    const temp = data.map((item) => {
      const splitName = item.menu_name.split(' - ');


      return {
        menu_id: item.parent,
        menu_name: splitName[0],
        sub_menu: {
          sub_menu_name: splitName[1],
          sub_sub_menu: {
            sub_sub_menu_id: item.menu_id,
            sub_sub_menu_name: splitName[2],
            sub_sub_menu_position: item.position,
          },
        },
      };
    });

    this.mappingStepTwo(temp);
  }

  mappingStepTwo(data: any) {
    const result = data.reduce((acc: any[], item: any) => {
      let menu = acc.find((m) => m.menu_id === item.menu_id);

      if (!menu) {
        menu = {
          menu_id: item.menu_id,
          menu_name: item.menu_name,
          sub_menu: [],
        };
        acc.push(menu);
      }

      let subMenu = menu.sub_menu.find(
        (s: any) => s.sub_menu_name === item.sub_menu.sub_menu_name
      );

      if (!subMenu) {
        subMenu = {
          sub_menu_name: item.sub_menu.sub_menu_name,
          sub_sub_menu: [],
        };
        menu.sub_menu.push(subMenu);
      }

      subMenu.sub_sub_menu.push({
        id: item.sub_menu.sub_sub_menu.sub_sub_menu_id,
        name: item.sub_menu.sub_sub_menu.sub_sub_menu_name,
        position: item.sub_menu.sub_sub_menu.sub_sub_menu_position,
      });

      return acc;
    }, []);

    this.menuList = result;
  }
}
