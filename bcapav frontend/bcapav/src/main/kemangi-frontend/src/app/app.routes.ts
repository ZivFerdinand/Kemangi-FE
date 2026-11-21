import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './core/layouts/home/home.component';
import { AuthGuard } from './core/guard/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ReportComponent } from './features/report/report.component';
import {
  RoleManagementDetailComponent,
  RoleManagementFormComponent,
  RoleManagementListComponent,
  RoleManagementRequestedListComponent,
  RoleManagementDeleteComponent,
  RoleApprovalRequestedListDetailComponent,
} from './features/role-management';
import {
  AlertQueueCreateComponent,
  AlertQueueCurrentListComponent,
  AlertQueueDetailsComponent,
  AlertQueueRequestedDetailsComponent,
  AlertQueueRequestedListComponent,
  AlertQueueUpdateComponent,
  AlertQueueDeleteComponent,
} from './features/alert-queue-management';
import {
  DataGroupApprovalTaskListComponent,
  DataGroupApprovalTaskViewComponent,
  DataGroupApprovalRequestedListComponent,
  DataGroupApprovalRequestedListViewComponent,
  RuleApprovalTaskListComponent,
  RuleApprovalTaskDetailsComponent,
  RuleApprovalRequestedListComponent,
  RuleApprovalRequestedDetailsComponent,
  RoleApprovalTaskListComponent,
  RoleApprovalTaskListViewComponent,
  RoleApprovalRequestedListComponent,
  RoleApprovalRequestedListViewComponent,
  FraudTypeApprovalTaskListComponent,
  FraudTypeApprovalTaskListViewComponent,
  FraudTypeApprovalRequestedListComponent,
  FraudTypeApprovalRequestedViewComponent,
  NotesApprovalTaskListComponent,
  NotesApprovalTaskListViewComponent,
  NotesApprovalRequestedListComponent,
  NotesApprovalRequestedViewComponent,
  EmailTemplateApprovalTaskListComponent,
  EmailTemplateTaskViewComponent,
  EmailTemplateApprovalRequestedListComponent,
  EmailTemplateRequestedViewComponent,
  BinApprovalTaskListComponent,
  BinTaskViewComponent,
  BinApprovalRequestedListComponent,
  BinRequestedViewComponent,
  BlockUnblockApprovalRequestedListComponent,
  BlockUnblockApprovalTaskListComponent,
  BlockUnblockApprovalTaskDetailsComponent,
  BlockUnblockApprovalRequestedDetailsComponent,
  BlockUnblockAccountBalanceApprovalTaskListComponent,
  BlockUnblockAccountBalanceApprovalTaskDetailsComponent,
  BlockUnblockAccountBalanceApprovalRequestedDetailsComponent,
  BlockUnblockAccountBalanceApprovalRequestedListComponent,
  AlertQueueApprovalRequestedListComponent,
  AlertQueueApprovalRequestedDetailsComponent,
  AlertQueueApprovalTaskListComponent,
  AlertQueueApprovalTaskDetailsComponent,
  SmcApprovalRequestedListComponent,
  SmcApprovalRequestedDetailsComponent,
  SmcApprovalTaskListComponent,
  SmcApprovalTaskDetailsComponent,
} from './features/approval';

import {
  DataGroupCurrentListComponent,
  DataGroupDraftListComponent,
  DataGroupRequestedListComponent,
  DataGroupDetailsRequestedComponent,
  DataGroupFormComponent,
  DataGroupDetailsComponent,
  DataGroupDraftDetailsComponent,
  DataGroupDraftFormComponent,
  DataGroupDeleteComponent,
  RuleCurrentListV2Component,
  RuleTaskListComponent,
  RuleTaskDetailsComponent,
  RuleExpiredSoonListV2Component,
  RuleBaseCreateComponent,
  RuleBaseDeleteComponent,
  RuleRequestedListV2Component,
  RuleRequestedDetailsComponent,
  RuleDetailsV2Component,
  RuleBaseUpdateComponent,
  RuleTaskUpdateComponent,
} from './features/rule-management/';
import {
  FraudTypeDetailComponent,
  FraudTypeFormComponent,
  FraudTypeListComponent,
  FraudTypeDeleteComponent,
  FraudTypeRequestedListComponent,
  FraudTypeDetailRequestedComponent,
  NotesListComponent,
  NotesFormComponent,
  NotesDetailComponent,
  NotesDeleteComponent,
  NotesRequestedListComponent,
  NotesDetailRequestedComponent,
  BinListComponent,
  BinFormComponent,
  BinDetailComponent,
  BinDeleteComponent,
  BinRequestedListComponent,
  BinDetailRequestedComponent,
  EmailTemplateRequestedListComponent,
  EmailTemplateDetailRequestedComponent,
  EmailTemplateBaseCreateComponent,
  EmailTemplateBaseUpdateComponent,
  EmailTemplateBaseDeleteComponent,
  EmailTemplateBaseDetailComponent,
  EmailTemplateBaseListComponent,
} from './features/data-master';
import {
  BlockUnblockUploadComponent,
  BlockUnblockUploadDetailsComponent,
  BlockUnblockRequestedListComponent,
  BlockUnblockRequestedDetailsComponent,
  BlockUnblockAccountBalanceUploadComponent,
  BlockUnblockAccountBalanceRequestedListComponent,
  BlockUnblockAccountBalanceRequestedDetailsComponent,
  BlockUnblockAccountBalanceUploadDetailsComponent,
  SmcUploadComponent,
  SmcDetailsComponent,
  SmcRequestedListComponent,
  SmcRequestedDetailsComponent,
} from './features/action';
import { PreviewExcelComponent } from './features/preview-excel/preview-excel.component';

import { InquiryComponent } from './features/alert/inquiry/inquiry.component';
import { ThresholdCurrentListComponent } from './features/machine-learning-management/threshold-score/threshold-current-list/threshold-current-list.component';
import { ThresholdDetailsComponent } from './features/machine-learning-management/threshold-score/threshold-details/threshold-details.component';
import { ThresholdRequestedListComponent } from './features/machine-learning-management/threshold-score/requested-list/threshold-requested-list.component';
import { ThresholdFormComponent } from './features/machine-learning-management/threshold-score/threshold-form/threshold-form.component';
import { ThresholdApprovalRequestedListViewComponent } from './features/machine-learning-management/threshold-score/requested-list/threshold-requested-list-view/threshold-requested-list-view.component';
import { ThresholdApprovalRequestedListComponent } from './features/approval/threshold-score/threshold-requested-list/threshold-approval-requested-list.component';
import { ApprovalRequestedListViewComponent } from './features/approval/threshold-score/threshold-requested-list/approval-requested-list-view/approval-requested-list-view.component';
import { ThresholdApprovalTaskListComponent } from './features/approval/threshold-score/threshold-task/threshold-approval-task-list.component';
import { ApprovalTaskListViewComponent } from './features/approval/threshold-score/threshold-task/approval-task-list-view/approval-task-list-view.component';

import {
  PaymentIdHistoryListComponent,
  PaymentIdHistoryDetailsComponent,
  PaymentIdTaskListComponent,
  PaymentIdTaskDetailsComponent,
} from './features/payment-id';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'role-management',
        component: RoleManagementListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'ROLEMANAGEMENT-ROLE-VIEW',
            'ROLEMANAGEMENT-ROLE-UPDATE',
            'ROLEMANAGEMENT-ROLE-CREATE',
            'ROLEMANAGEMENT-ROLE-DELETE',
          ],
        },
      },
      {
        path: 'role-management/requested-list',
        component: RoleManagementRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'ROLEMANAGEMENT-ROLE-VIEW',
            'ROLEMANAGEMENT-ROLE-UPDATE',
            'ROLEMANAGEMENT-ROLE-CREATE',
            'ROLEMANAGEMENT-ROLE-DELETE',
          ],
        },
      },
      {
        path: 'role-management/create',
        component: RoleManagementFormComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ROLEMANAGEMENT-ROLE-CREATE',
        },
      },
      {
        path: 'role-management/:id/edit',
        component: RoleManagementFormComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ROLEMANAGEMENT-ROLE-UPDATE',
        },
      },
      {
        path: 'role-management/:id/delete',
        component: RoleManagementDeleteComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ROLEMANAGEMENT-ROLE-DELETE',
        },
      },
      {
        path: 'role-management/:id',
        component: RoleManagementDetailComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'ROLEMANAGEMENT-ROLE-VIEW',
            'ROLEMANAGEMENT-ROLE-UPDATE',
            'ROLEMANAGEMENT-ROLE-CREATE',
            'ROLEMANAGEMENT-ROLE-DELETE',
          ],
        },
      },
      {
        path: 'role-management/requested-list/:id',
        component: RoleApprovalRequestedListDetailComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'ROLEMANAGEMENT-ROLE-VIEW',
            'ROLEMANAGEMENT-ROLE-UPDATE',
            'ROLEMANAGEMENT-ROLE-CREATE',
            'ROLEMANAGEMENT-ROLE-DELETE',
          ],
        },
      },

      {
        path: 'rule-management/data-group/current',
        component: DataGroupCurrentListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'RULEMANAGEMENT-DATAGROUP-VIEW',
            'RULEMANAGEMENT-DATAGROUP-CREATE',
            'RULEMANAGEMENT-DATAGROUP-UPDATE',
            'RULEMANAGEMENT-DATAGROUP-DELETE',
          ],
        },
      },
      {
        path: 'rule-management/data-group/draft',
        component: DataGroupDraftListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'RULEMANAGEMENT-DATAGROUP-VIEW',
            'RULEMANAGEMENT-DATAGROUP-CREATE',
            'RULEMANAGEMENT-DATAGROUP-UPDATE',
            'RULEMANAGEMENT-DATAGROUP-DELETE',
          ],
        },
      },
      {
        path: 'rule-management/data-group/draft/:id',
        component: DataGroupDraftDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'RULEMANAGEMENT-DATAGROUP-VIEW',
            'RULEMANAGEMENT-DATAGROUP-CREATE',
            'RULEMANAGEMENT-DATAGROUP-UPDATE',
            'RULEMANAGEMENT-DATAGROUP-DELETE',
          ],
        },
      },
      {
        path: 'rule-management/data-group/requested',
        component: DataGroupRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'RULEMANAGEMENT-DATAGROUP-VIEW',
            'RULEMANAGEMENT-DATAGROUP-CREATE',
            'RULEMANAGEMENT-DATAGROUP-UPDATE',
            'RULEMANAGEMENT-DATAGROUP-DELETE',
          ],
        },
      },
      {
        path: 'rule-management/data-group/create',
        component: DataGroupFormComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'RULEMANAGEMENT-DATAGROUP-CREATE',
        },
      },
      {
        path: 'rule-management/data-group/:id/edit',
        component: DataGroupFormComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'RULEMANAGEMENT-DATAGROUP-UPDATE',
        },
      },
      {
        path: 'rule-management/data-group/:id/delete',
        component: DataGroupDeleteComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'RULEMANAGEMENT-DATAGROUP-DELETE',
        },
      },
      {
        path: 'rule-management/data-group/:id',
        component: DataGroupDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'RULEMANAGEMENT-DATAGROUP-VIEW',
            'RULEMANAGEMENT-DATAGROUP-CREATE',
            'RULEMANAGEMENT-DATAGROUP-UPDATE',
            'RULEMANAGEMENT-DATAGROUP-DELETE',
          ],
        },
      },

      {
        path: 'rule-management/data-group/draft/:id/edit',
        component: DataGroupDraftFormComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'RULEMANAGEMENT-DATAGROUP-UPDATE',
        },
      },

      {
        path: 'rule-management/data-group/requested/:id',
        component: DataGroupDetailsRequestedComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'RULEMANAGEMENT-DATAGROUP-VIEW',
            'RULEMANAGEMENT-DATAGROUP-CREATE',
            'RULEMANAGEMENT-DATAGROUP-UPDATE',
            'RULEMANAGEMENT-DATAGROUP-DELETE',
          ],
        },
      },

      {
        path: 'rule-management/rule/current',
        component: RuleCurrentListV2Component,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'RULEMANAGEMENT-RULE-VIEW',
            'RULEMANAGEMENT-RULE-CREATE',
            'RULEMANAGEMENT-RULE-UPDATE',
            'RULEMANAGEMENT-RULE-DELETE',
          ],
        },
      },
      {
        path: 'rule-management/rule/expired-soon',
        component: RuleExpiredSoonListV2Component,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'RULEMANAGEMENT-RULE-VIEW',
            'RULEMANAGEMENT-RULE-CREATE',
            'RULEMANAGEMENT-RULE-UPDATE',
            'RULEMANAGEMENT-RULE-DELETE',
          ],
        },
      },
      {
        path: 'rule-management/rule/requested',
        component: RuleRequestedListV2Component,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'RULEMANAGEMENT-RULE-VIEW',
            'RULEMANAGEMENT-RULE-CREATE',
            'RULEMANAGEMENT-RULE-UPDATE',
            'RULEMANAGEMENT-RULE-DELETE',
          ],
        },
      },
      {
        path: 'rule-management/rule/task',
        component: RuleTaskListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'RULEMANAGEMENT-RULE-VIEW',
            'RULEMANAGEMENT-RULE-CREATE',
            'RULEMANAGEMENT-RULE-UPDATE',
            'RULEMANAGEMENT-RULE-DELETE',
          ],
        },
      },
      {
        path: 'rule-management/rule/create',
        component: RuleBaseCreateComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: ['RULEMANAGEMENT-RULE-CREATE'],
        },
      },
      {
        path: 'rule-management/rule/:id/delete',
        component: RuleBaseDeleteComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'RULEMANAGEMENT-RULE-DELETE',
        },
      },
      {
        path: 'rule-management/rule/:id',
        component: RuleDetailsV2Component,
        data: {
          menuCode: [
            'RULEMANAGEMENT-RULE-VIEW',
            'RULEMANAGEMENT-RULE-CREATE',
            'RULEMANAGEMENT-RULE-UPDATE',
            'RULEMANAGEMENT-RULE-DELETE',
          ],
        },
      },
      {
        path: 'rule-management/rule/:id/edit',
        component: RuleBaseUpdateComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: ['RULEMANAGEMENT-RULE-UPDATE'],
        },
      },
      {
        path: 'rule-management/rule/task/:id',
        component: RuleTaskDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'RULEMANAGEMENT-RULE-VIEW',
            'RULEMANAGEMENT-RULE-CREATE',
            'RULEMANAGEMENT-RULE-UPDATE',
            'RULEMANAGEMENT-RULE-DELETE',
          ],
        },
      },

      {
        path: 'rule-management/rule/requested/:id',
        component: RuleRequestedDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'RULEMANAGEMENT-RULE-VIEW',
            'RULEMANAGEMENT-RULE-CREATE',
            'RULEMANAGEMENT-RULE-UPDATE',
            'RULEMANAGEMENT-RULE-DELETE',
          ],
        },
      },

      {
        path: 'rule-management/rule/task/:id/edit',
        component: RuleTaskUpdateComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'RULEMANAGEMENT-RULE-UPDATE',
        },
      },

      {
        path: 'machine-learning/threshold-score/current',
        component: ThresholdCurrentListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MLM-THRESHOLDSCORE-VIEW',
            'MLM-THRESHOLDSCORE-UPDATE',
            'MLM-THRESHOLDSCORE-DELETE',
          ],
        },
      },
      {
        path: 'machine-learning/threshold-score/requested',
        component: ThresholdRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MLM-THRESHOLDSCORE-VIEW',
            'MLM-THRESHOLDSCORE-UPDATE',
            'MLM-THRESHOLDSCORE-DELETE',
          ],
        },
      },
      {
        path: 'machine-learning/threshold-score/current/:id',
        component: ThresholdDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MLM-THRESHOLDSCORE-VIEW',
            'MLM-THRESHOLDSCORE-UPDATE',
            'MLM-THRESHOLDSCORE-DELETE',
          ],
        },
      },
      {
        path: 'machine-learning/threshold-score/current/:id/edit',
        component: ThresholdFormComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: ['MLM-THRESHOLDSCORE-UPDATE'],
        },
      },
      {
        path: 'machine-learning/threshold-score/current/:id/delete',
        component: ThresholdFormComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: ['MLM-THRESHOLDSCORE-DELETE'],
        },
      },
      {
        path: 'machine-learning/threshold-score/requested-list/:id',
        component: ThresholdApprovalRequestedListViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MLM-THRESHOLDSCORE-VIEW',
            'MLM-THRESHOLDSCORE-UPDATE',
            'MLM-THRESHOLDSCORE-DELETE',
          ],
        },
      },
      {
        path: 'approval/threshold-score/requested-list',
        component: ThresholdApprovalRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: ['APPROVAL-THRESHOLDSCORE-REQUESTED'],
        },
      },
      {
        path: 'approval/threshold-score/task-list',
        component: ThresholdApprovalTaskListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'APPROVAL-THRESHOLDSCORE-TASK-LV1',
            'APPROVAL-THRESHOLDSCORE-TASK-LV2',
          ],
        },
      },
      {
        path: 'approval/threshold-score/requested-list/:id',
        component: ApprovalRequestedListViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: ['APPROVAL-THRESHOLDSCORE-REQUESTED'],
        },
      },

      {
        path: 'approval/threshold-score/task-list/:id',
        component: ApprovalTaskListViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'APPROVAL-THRESHOLDSCORE-TASK-LV1',
            'APPROVAL-THRESHOLDSCORE-TASK-LV2',
          ],
        },
      },

      {
        path: 'approval/data-group/task-list',
        component: DataGroupApprovalTaskListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'APPROVAL-DATAGROUP-TASK-LV1',
            'APPROVAL-DATAGROUP-TASK-LV2',
          ],
        },
      },
      {
        path: 'approval/data-group/task-list/:id',
        component: DataGroupApprovalTaskViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'APPROVAL-DATAGROUP-TASK-LV1',
            'APPROVAL-DATAGROUP-TASK-LV2',
          ],
        },
      },
      {
        path: 'approval/data-group/requested-list',
        component: DataGroupApprovalRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-DATAGROUP-REQUESTED',
        },
      },
      {
        path: 'approval/data-group/requested-list/:id',
        component: DataGroupApprovalRequestedListViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-DATAGROUP-REQUESTED',
        },
      },
      {
        path: 'approval/rule/task-list',
        component: RuleApprovalTaskListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: ['APPROVAL-RULE-TASK-LV1', 'APPROVAL-RULE-TASK-LV2'],
        },
      },
      {
        path: 'approval/rule/task-list/:id',
        component: RuleApprovalTaskDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: ['APPROVAL-RULE-TASK-LV1', 'APPROVAL-RULE-TASK-LV2'],
        },
      },
      {
        path: 'approval/rule/requested-list',
        component: RuleApprovalRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-RULE-REQUESTED',
        },
      },
      {
        path: 'approval/rule/requested-list/:id',
        component: RuleApprovalRequestedDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-RULE-REQUESTED',
        },
      },
      {
        path: 'approval/role/task-list',
        component: RoleApprovalTaskListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-ROLE-TASK',
        },
      },
      {
        path: 'approval/role/task-list/:id',
        component: RoleApprovalTaskListViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-ROLE-TASK',
        },
      },
      {
        path: 'approval/role/requested-list',
        component: RoleApprovalRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-ROLE-REQUESTED',
        },
      },
      {
        path: 'approval/role/requested-list/:id',
        component: RoleApprovalRequestedListViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-ROLE-REQUESTED',
        },
      },
      {
        path: 'approval/fraud-type/task-list',
        component: FraudTypeApprovalTaskListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-FRAUDTYPE-TASK',
        },
      },
      {
        path: 'approval/fraud-type/task-list/:id',
        component: FraudTypeApprovalTaskListViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-FRAUDTYPE-TASK',
        },
      },
      {
        path: 'approval/fraud-type/requested-list',
        component: FraudTypeApprovalRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-FRAUDTYPE-REQUESTED',
        },
      },
      {
        path: 'approval/fraud-type/requested-list/:id',
        component: FraudTypeApprovalRequestedViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-FRAUDTYPE-REQUESTED',
        },
      },
      {
        path: 'approval/notes/task-list',
        component: NotesApprovalTaskListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-NOTES-TASK',
        },
      },
      {
        path: 'approval/notes/task-list/:id',
        component: NotesApprovalTaskListViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-NOTES-TASK',
        },
      },
      {
        path: 'approval/notes/requested-list',
        component: NotesApprovalRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-NOTES-REQUESTED',
        },
      },
      {
        path: 'approval/notes/requested-list/:id',
        component: NotesApprovalRequestedViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-NOTES-REQUESTED',
        },
      },
      {
        path: 'approval/bin/task-list',
        component: BinApprovalTaskListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-BINNUMBER-TASK',
        },
      },
      {
        path: 'approval/bin/task-list/:id',
        component: BinTaskViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-BINNUMBER-TASK',
        },
      },
      {
        path: 'approval/bin/requested-list',
        component: BinApprovalRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-BINNUMBER-REQUESTED',
        },
      },
      {
        path: 'approval/bin/requested-list/:id',
        component: BinRequestedViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-BINNUMBER-REQUESTED',
        },
      },
      {
        path: 'approval/email-template/task-list',
        component: EmailTemplateApprovalTaskListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-EMAILTEMPLATE-TASK',
        },
      },
      {
        path: 'approval/email-template/task-list/:id',
        component: EmailTemplateTaskViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-EMAILTEMPLATE-TASK',
        },
      },
      {
        path: 'approval/email-template/requested-list',
        component: EmailTemplateApprovalRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-EMAILTEMPLATE-REQUESTED',
        },
      },
      {
        path: 'approval/email-template/requested-list/:id',
        component: EmailTemplateRequestedViewComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-EMAILTEMPLATE-REQUESTED',
        },
      },
      {
        path: 'approval/block-unblock-account/task-list',
        component: BlockUnblockApprovalTaskListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-BLOCKUNBLOCK-TASK',
        },
      },
      {
        path: 'approval/block-unblock-account/task-list/:id',
        component: BlockUnblockApprovalTaskDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-BLOCKUNBLOCK-TASK',
        },
      },
      {
        path: 'approval/block-unblock-account/requested-list',
        component: BlockUnblockApprovalRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-BLOCKUNBLOCK-REQUESTED',
        },
      },
      {
        path: 'approval/block-unblock-account/requested-list/:id',
        component: BlockUnblockApprovalRequestedDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-BLOCKUNBLOCK-REQUESTED',
        },
      },
      {
        path: 'approval/block-unblock-account-balance/task-list',
        component: BlockUnblockAccountBalanceApprovalTaskListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-BLOCKUNBLOCKBALANCE-TASK',
        },
      },
      {
        path: 'approval/block-unblock-account-balance/task-list/:id',
        component: BlockUnblockAccountBalanceApprovalTaskDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-BLOCKUNBLOCKBALANCE-TASK',
        },
      },
      {
        path: 'approval/block-unblock-account-balance/requested-list',
        component: BlockUnblockAccountBalanceApprovalRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-BLOCKUNBLOCKBALANCE-REQUESTED',
        },
      },
      {
        path: 'approval/block-unblock-account-balance/requested-list/:id',
        component: BlockUnblockAccountBalanceApprovalRequestedDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-BLOCKUNBLOCKBALANCE-REQUESTED',
        },
      },
      //
      {
        path: 'approval/smc/task-list',
        component: SmcApprovalTaskListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-SMC-TASK',
        },
      },
      {
        path: 'approval/smc/task-list/:id',
        component: SmcApprovalTaskDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-SMC-TASK',
        },
      },
      {
        path: 'approval/smc/requested-list',
        component: SmcApprovalRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-SMC-REQUESTED',
        },
      },
      {
        path: 'approval/smc/requested-list/:id',
        component: SmcApprovalRequestedDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-SMC-REQUESTED',
        },
      },
      ///
      {
        path: 'approval/alert-queue/task-list',
        component: AlertQueueApprovalTaskListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'APPROVAL-ALERTQUEUE-TASK-LV1',
            'APPROVAL-ALERTQUEUE-TASK-LV2',
          ],
        },
      },
      {
        path: 'approval/alert-queue/task-list/:id',
        component: AlertQueueApprovalTaskDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'APPROVAL-ALERTQUEUE-TASK-LV1',
            'APPROVAL-ALERTQUEUE-TASK-LV2',
          ],
        },
      },

      {
        path: 'approval/alert-queue/requested-list',
        component: AlertQueueApprovalRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-ALERTQUEUE-REQUESTED',
        },
      },
      {
        path: 'approval/alert-queue/requested-list/:id',
        component: AlertQueueApprovalRequestedDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'APPROVAL-ALERTQUEUE-REQUESTED',
        },
      },

      {
        path: 'report',
        component: ReportComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'REPORT-REPORTUSERACTIVITY-ALLUSERS',
            'REPORT-REPORTUSERACTIVITY-OWNUSER',
          ],
        },
      },
      {
        path: 'alert/inquiry',
        component: InquiryComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ALERTDETAIL-INQUIRY-',
        },
      },

      {
        path: 'data-master/fraud-type',
        component: FraudTypeListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-FRAUDTYPE-VIEW',
            'MASTER-FRAUDTYPE-CREATE',
            'MASTER-FRAUDTYPE-UPDATE',
            'MASTER-FRAUDTYPE-DELETE',
          ],
        },
      },
      {
        path: 'data-master/fraud-type/requested-list',
        component: FraudTypeRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-FRAUDTYPE-VIEW',
            'MASTER-FRAUDTYPE-CREATE',
            'MASTER-FRAUDTYPE-UPDATE',
            'MASTER-FRAUDTYPE-DELETE',
          ],
        },
      },
      {
        path: 'data-master/fraud-type/requested-list/:id',
        component: FraudTypeDetailRequestedComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-FRAUDTYPE-VIEW',
            'MASTER-FRAUDTYPE-CREATE',
            'MASTER-FRAUDTYPE-UPDATE',
            'MASTER-FRAUDTYPE-DELETE',
          ],
        },
      },
      {
        path: 'data-master/fraud-type/create',
        component: FraudTypeFormComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'MASTER-FRAUDTYPE-CREATE',
        },
      },
      {
        path: 'data-master/fraud-type/:id/edit',
        component: FraudTypeFormComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'MASTER-FRAUDTYPE-UPDATE',
        },
      },
      {
        path: 'data-master/fraud-type/:id/delete',
        component: FraudTypeDeleteComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'MASTER-FRAUDTYPE-DELETE',
        },
      },
      {
        path: 'data-master/fraud-type/:id',
        component: FraudTypeDetailComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-FRAUDTYPE-VIEW',
            'MASTER-FRAUDTYPE-CREATE',
            'MASTER-FRAUDTYPE-UPDATE',
            'MASTER-FRAUDTYPE-DELETE',
          ],
        },
      },

      {
        path: 'data-master/notes',
        component: NotesListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-NOTES-VIEW',
            'MASTER-NOTES-CREATE',
            'MASTER-NOTES-UPDATE',
            'MASTER-NOTES-DELETE',
          ],
        },
      },
      {
        path: 'data-master/notes/requested-list',
        component: NotesRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-NOTES-VIEW',
            'MASTER-NOTES-CREATE',
            'MASTER-NOTES-UPDATE',
            'MASTER-NOTES-DELETE',
          ],
        },
      },
      {
        path: 'data-master/notes/requested-list/:id',
        component: NotesDetailRequestedComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-NOTES-VIEW',
            'MASTER-NOTES-CREATE',
            'MASTER-NOTES-UPDATE',
            'MASTER-NOTES-DELETE',
          ],
        },
      },
      {
        path: 'data-master/notes/create',
        component: NotesFormComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'MASTER-NOTES-CREATE',
        },
      },
      {
        path: 'data-master/notes/:id/edit',
        component: NotesFormComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'MASTER-NOTES-UPDATE',
        },
      },
      {
        path: 'data-master/notes/:id/delete',
        component: NotesDeleteComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'MASTER-NOTES-DELETE',
        },
      },
      {
        path: 'data-master/notes/:id',
        component: NotesDetailComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-NOTES-VIEW',
            'MASTER-NOTES-CREATE',
            'MASTER-NOTES-UPDATE',
            'MASTER-NOTES-DELETE',
          ],
        },
      },

      {
        path: 'data-master/bin',
        component: BinListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-BINNUMBER-VIEW',
            'MASTER-BINNUMBER-CREATE',
            'MASTER-BINNUMBER-UPDATE',
            'MASTER-BINNUMBER-DELETE',
          ],
        },
      },
      {
        path: 'data-master/bin/requested-list',
        component: BinRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-BINNUMBER-VIEW',
            'MASTER-BINNUMBER-CREATE',
            'MASTER-BINNUMBER-UPDATE',
            'MASTER-BINNUMBER-DELETE',
          ],
        },
      },
      {
        path: 'data-master/bin/requested-list/:id',
        component: BinDetailRequestedComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-BINNUMBER-VIEW',
            'MASTER-BINNUMBER-CREATE',
            'MASTER-BINNUMBER-UPDATE',
            'MASTER-BINNUMBER-DELETE',
          ],
        },
      },
      {
        path: 'data-master/bin/create',
        component: BinFormComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'MASTER-BINNUMBER-CREATE',
        },
      },
      {
        path: 'data-master/bin/:id/edit',
        component: BinFormComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'MASTER-BINNUMBER-UPDATE',
        },
      },
      {
        path: 'data-master/bin/:id/delete',
        component: BinDeleteComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'MASTER-BINNUMBER-DELETE',
        },
      },
      {
        path: 'data-master/bin/:id',
        component: BinDetailComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-BINNUMBER-VIEW',
            'MASTER-BINNUMBER-CREATE',
            'MASTER-BINNUMBER-UPDATE',
            'MASTER-BINNUMBER-DELETE',
          ],
        },
      },

      {
        path: 'data-master/email-template',
        component: EmailTemplateBaseListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-EMAILTEMPLATE-VIEW',
            'MASTER-EMAILTEMPLATE-CREATE',
            'MASTER-EMAILTEMPLATE-UPDATE',
            'MASTER-EMAILTEMPLATE-DELETE',
          ],
        },
      },
      {
        path: 'data-master/email-template/requested-list',
        component: EmailTemplateRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-EMAILTEMPLATE-VIEW',
            'MASTER-EMAILTEMPLATE-CREATE',
            'MASTER-EMAILTEMPLATE-UPDATE',
            'MASTER-EMAILTEMPLATE-DELETE',
          ],
        },
      },
      {
        path: 'data-master/email-template/requested-list/:id',
        component: EmailTemplateDetailRequestedComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-EMAILTEMPLATE-VIEW',
            'MASTER-EMAILTEMPLATE-CREATE',
            'MASTER-EMAILTEMPLATE-UPDATE',
            'MASTER-EMAILTEMPLATE-DELETE',
          ],
        },
      },
      {
        path: 'data-master/email-template/create',
        component: EmailTemplateBaseCreateComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'MASTER-EMAILTEMPLATE-CREATE',
        },
      },
      {
        path: 'data-master/email-template/:id/edit',
        component: EmailTemplateBaseUpdateComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'MASTER-EMAILTEMPLATE-UPDATE',
        },
      },
      {
        path: 'data-master/email-template/:id/delete',
        component: EmailTemplateBaseDeleteComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'MASTER-EMAILTEMPLATE-DELETE',
        },
      },
      {
        path: 'data-master/email-template/:id',
        component: EmailTemplateBaseDetailComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'MASTER-EMAILTEMPLATE-VIEW',
            'MASTER-EMAILTEMPLATE-CREATE',
            'MASTER-EMAILTEMPLATE-UPDATE',
            'MASTER-EMAILTEMPLATE-DELETE',
          ],
        },
      },

      {
        path: 'action/block-unblock-account/upload',
        component: BlockUnblockUploadComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ACTION-BLOCKUNBLOCK-UPLOAD',
        },
      },

      {
        path: 'action/block-unblock-account/upload/:id',
        component: BlockUnblockUploadDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ACTION-BLOCKUNBLOCK-UPLOAD',
        },
      },
      {
        path: 'action/block-unblock-account/requested',
        component: BlockUnblockRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ACTION-BLOCKUNBLOCK-VIEW',
        },
      },
      {
        path: 'action/block-unblock-account/requested/:id',
        component: BlockUnblockRequestedDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ACTION-BLOCKUNBLOCK-VIEW',
        },
      },

      {
        path: 'action/block-unblock-account-balance/upload',
        component: BlockUnblockAccountBalanceUploadComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ACTION-BLOCKUNBLOCKBALANCE-UPLOAD',
        },
      },

      {
        path: 'action/block-unblock-account-balance/upload/:id',
        component: BlockUnblockAccountBalanceUploadDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ACTION-BLOCKUNBLOCKBALANCE-UPLOAD',
        },
      },

      {
        path: 'action/block-unblock-account-balance/requested',
        component: BlockUnblockAccountBalanceRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ACTION-BLOCKUNBLOCKBALANCE-VIEW',
        },
      },
      {
        path: 'action/block-unblock-account-balance/requested/:id',
        component: BlockUnblockAccountBalanceRequestedDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ACTION-BLOCKUNBLOCKBALANCE-VIEW',
        },
      },
      {
        path: 'action/smc/upload',
        component: SmcUploadComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ACTION-SMC-UPLOAD',
        },
      },
      {
        path: 'action/smc/upload/:id',
        component: SmcDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ACTION-SMC-UPLOAD',
        },
      },
      {
        path: 'action/smc/requested',
        component: SmcRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ACTION-SMC-VIEW',
        },
      },
      {
        path: 'action/smc/requested/:id',
        component: SmcRequestedDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ACTION-SMC-VIEW',
        },
      },
      {
        path: 'alert-queue-management',
        component: AlertQueueCurrentListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'ALERTQUEUE-ALERTQUEUE-VIEW',
            'ALERTQUEUE-ALERTQUEUE-CREATE',
            'ALERTQUEUE-ALERTQUEUE-UPDATE',
            'ALERTQUEUE-ALERTQUEUE-DELETE',
          ],
        },
      },
      {
        path: 'alert-queue-management/create',
        component: AlertQueueCreateComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ALERTQUEUE-ALERTQUEUE-CREATE',
        },
      },
      {
        path: 'alert-queue-management/requested',
        component: AlertQueueRequestedListComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'ALERTQUEUE-ALERTQUEUE-VIEW',
            'ALERTQUEUE-ALERTQUEUE-CREATE',
            'ALERTQUEUE-ALERTQUEUE-UPDATE',
            'ALERTQUEUE-ALERTQUEUE-DELETE',
          ],
        },
      },
      {
        path: 'alert-queue-management/:id/edit',
        component: AlertQueueUpdateComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ALERTQUEUE-ALERTQUEUE-UPDATE',
        },
      },
      {
        path: 'alert-queue-management/:id/delete',
        component: AlertQueueDeleteComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: 'ALERTQUEUE-ALERTQUEUE-DELETE',
        },
      },
      {
        path: 'alert-queue-management/:id',
        component: AlertQueueDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'ALERTQUEUE-ALERTQUEUE-VIEW',
            'ALERTQUEUE-ALERTQUEUE-CREATE',
            'ALERTQUEUE-ALERTQUEUE-UPDATE',
            'ALERTQUEUE-ALERTQUEUE-DELETE',
          ],
        },
      },
      {
        path: 'alert-queue-management/requested/:id',
        component: AlertQueueRequestedDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          menuCode: [
            'ALERTQUEUE-ALERTQUEUE-VIEW',
            'ALERTQUEUE-ALERTQUEUE-CREATE',
            'ALERTQUEUE-ALERTQUEUE-UPDATE',
            'ALERTQUEUE-ALERTQUEUE-DELETE',
          ],
        },
      },
      {
        path: 'payment-id/task',
        component: PaymentIdTaskListComponent,
        // canActivate: [AuthGuard],
        // data: {
        //   menuCode: [
        //     'ALERTQUEUE-ALERTQUEUE-VIEW',
        //     'ALERTQUEUE-ALERTQUEUE-CREATE',
        //     'ALERTQUEUE-ALERTQUEUE-UPDATE',
        //     'ALERTQUEUE-ALERTQUEUE-DELETE',
        //   ],
        // },
      },
      {
        path: 'payment-id/task/:id',
        component: PaymentIdTaskDetailsComponent,
        // canActivate: [AuthGuard],
        // data: {
        //   menuCode: [
        //     'ALERTQUEUE-ALERTQUEUE-VIEW',
        //     'ALERTQUEUE-ALERTQUEUE-CREATE',
        //     'ALERTQUEUE-ALERTQUEUE-UPDATE',
        //     'ALERTQUEUE-ALERTQUEUE-DELETE',
        //   ],
        // },
      },
      {
        path: 'payment-id/history',
        component: PaymentIdHistoryListComponent,
        // canActivate: [AuthGuard],
        // data: {
        //   menuCode: [
        //     'ALERTQUEUE-ALERTQUEUE-VIEW',
        //     'ALERTQUEUE-ALERTQUEUE-CREATE',
        //     'ALERTQUEUE-ALERTQUEUE-UPDATE',
        //     'ALERTQUEUE-ALERTQUEUE-DELETE',
        //   ],
        // },
      },
      {
        path: 'payment-id/history/:id',
        component: PaymentIdHistoryDetailsComponent,
        // canActivate: [AuthGuard],
        // data: {
        //   menuCode: [
        //     'ALERTQUEUE-ALERTQUEUE-VIEW',
        //     'ALERTQUEUE-ALERTQUEUE-CREATE',
        //     'ALERTQUEUE-ALERTQUEUE-UPDATE',
        //     'ALERTQUEUE-ALERTQUEUE-DELETE',
        //   ],
        // },
      },
    ],
  },
  { path: 'preview-excel', component: PreviewExcelComponent },
];
