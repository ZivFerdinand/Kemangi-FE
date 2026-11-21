import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RoleManagementService } from './../services/role-management.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToggleSwitch } from '../../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FailedModalService } from '../../../core/services/failed-modal.service';
import { ApiService } from '../../../core/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ContentLayout, approverLevels } from '../../../shared';
import { detailRoleManagementBreadcrumb } from '../data';
import { BreadcrumbProps } from '../../../shared/interfaces';
import { ToastService } from '../../../core/services/toast.service';
import { transformMenu, MenuSection } from '../utils/menu-transform.utils';

@Component({
  selector: 'app-role-management-detail',
  templateUrl: './role-management-detail.component.html',
  styleUrls: [
    './role-management-detail.component.scss',
    '../../../shared/styles/index.scss',
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
})
export class RoleManagementDetailComponent implements OnInit {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = detailRoleManagementBreadcrumb;

  pageTitle: string = 'View Role';

  roleDetailData: any = {
    active_status: true,
    role_id: '',
    role_name: '',
    role_group: '',
    role_description: '',
    is_reviewer: true,
    menu_ids: [],
  };

  isDisabled: boolean = true;

  approverLevels: any[] = approverLevels;

  menuIds = signal<number[]>([]);

  menuSections: MenuSection[] = [];

  roleId: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private readonly apiService: ApiService,
    private readonly roleManagementService: RoleManagementService,
    public failedDialogService: FailedModalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit(): void {
    this.getMenuList();
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.roleId = params.get('id') ?? '';
      if (this.roleId || this.roleId !== '') {
        this.getRoleDetails(Number(this.roleId));
      }
    });
  }

  getRoleDetails(id: number) {
    this.ngxLoader.start();
    this.roleManagementService.roleDetails(id).subscribe({
      next: (res: any) => {
        this.roleDetailData = res['data'];
        this.menuIds.set(this.roleDetailData.menu_ids);
        this.loadSelectedMenu();
      },
      error: (e) => {
        this.ngxLoader.stop();
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
      complete: () => this.ngxLoader.stop(),
    });
  }

  getMenuList() {
    this.apiService.getMenuList().subscribe({
      next: (res: any) => {
        this.menuSections = transformMenu(res['data']);
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
    });
  }

  back() {
    this.router.navigate(['/home/role-management']);
  }

  loadSelectedMenu(): void {
    this.menuSections.forEach((section: any) => {
      section.rows.forEach((row: any) => {
        // =====================
        // DYNAMIC
        // =====================
        if (section.type === 'dynamic') {
          section.columns.forEach((col: string) => {
            const id = row.ids[col];

            if (this.menuIds().includes(id)) {
              row[col] = true;
            }
          });

          // jalankan auto detail logic
          //this.syncDetail(row);
        }

        // =====================
        // ALERT
        // =====================
        if (section.type === 'alert') {
          if (this.menuIds().includes(row.ids.checked)) {
            row.checked = true;
          }
        }

        // =====================
        // APPROVAL
        // =====================
        if (section.type === 'approval') {
          if (this.menuIds().includes(row.ids.Requested)) {
            row.Requested = true;
          }

          if (this.menuIds().includes(row.ids.Task)) {
            row.Task = true;
          }

          if (this.menuIds().includes(row.ids.LV1)) {
            row.selectedLevel = '1';
            row.Task = true;
          }

          if (this.menuIds().includes(row.ids.LV2)) {
            row.selectedLevel = '2';
            row.Task = true;
          }
        }
      });

      this.refreshSection(section);
    });
  }

  refreshSection(section: any): void {
    if (section.type === 'dynamic') {
      section.selectedAll = section.rows.every((row: any) =>
        section.columns.every((col: string) => !!row[col]),
      );
    }

    if (section.type === 'alert') {
      section.selectedAll = section.rows.every((row: any) => !!row.checked);
    }

    if (section.type === 'approval') {
      section.selectedAll = section.rows.every(
        (row: any) => !!row.Requested && !!row.Task,
      );
    }
  }
}
