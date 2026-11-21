import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { ToggleSwitch } from '../../../shared';
import { RoleManagementService } from '../services/role-management.service';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../core/services/failed-modal.service';
import { ReasonModalService } from '../../../core/services/reason-modal.service';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../../../core/models/user';
import { BreadcrumbProps } from '../../../shared';
import { ToastService } from '../../../core/services/toast.service';
import {
  createRoleManagementBreadcrumb,
  editRoleManagementBreadcrumb,
} from '../data';
import { ContentLayout } from '../../../shared';
import { requiredTrimmed } from '../../../core/validators/required-trimmed.validator';
import { transformMenu, MenuSection } from '../utils/menu-transform.utils';
import { NgSelectModule } from '@ng-select/ng-select';
import { approverLevels } from '../../../shared';
@Component({
  selector: 'app-role-management-form',
  templateUrl: './role-management-form.component.html',
  styleUrls: [
    './role-management-form.component.scss',
    '../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbPaginationModule,
    ToggleSwitch,
    ContentLayout,
    NgSelectModule,
  ],
})
export class RoleManagementFormComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = [];

  pageTitle: string = '';

  initialFormValue: any;

  roleForm: FormGroup;

  roleId: string = '';

  menuList: any[] = [];

  approverLevels: any[] = approverLevels;

  menuIds = signal<number[]>([]);

  sections: MenuSection[] = [];

  private destroy$ = new Subject<void>();

  @ViewChild('autoDescTA') autoDescTA!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly ngxLoader: NgxUiLoaderService,
    private fb: FormBuilder,
    private readonly apiService: ApiService,
    private readonly roleManagementService: RoleManagementService,
    public confirmationDialogService: ConfirmationModalService,
    public failedDialogService: FailedModalService,
    public reasonDialogService: ReasonModalService,
    private readonly toast: ToastService,
  ) {
    this.currentUrl = this.router.url;

    this.roleForm = this.fb.group({
      active_status: [true],
      role_id: ['', [Validators.required, Validators.maxLength(20)]],
      role_name: ['', [Validators.required, Validators.maxLength(200)]],
      role_group: [''],
      role_description: ['', [requiredTrimmed, Validators.maxLength(200)]],
      is_reviewer: [false],
      menu_ids: [[]],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem(btoa('profileUser'))) {
      const encodedUser = localStorage.getItem(btoa('profileUser'));
      let parsedUser: User | null = null;
      if (encodedUser) {
        try {
          parsedUser = JSON.parse(atob(encodedUser));
        } catch (e) {
          parsedUser = null;
        }
      }

      this.roleForm.get('role_group')?.patchValue(parsedUser?.groupId);
    }
    this.getMenuList();
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.roleId = params.get('id') ?? '';
      if (this.roleId || this.roleId !== '') {
        this.getRoleDetails(Number(this.roleId));
        this.roleForm.get('role_id')?.disable();
      } else {
        this.initialFormValue = this.roleForm.getRawValue();
      }
    });

    this.pageTitle = this.currentUrl.includes('create')
      ? 'Create New Role'
      : 'Edit Role';

    this.breadcrumb = this.currentUrl.includes('create')
      ? createRoleManagementBreadcrumb
      : editRoleManagementBreadcrumb;
  }

  loadData(data: any) {
    this.roleForm.setValue({
      active_status: data.active_status,
      role_id: data.role_id,
      role_name: data.role_name,
      role_group: data.role_group,
      role_description: data.role_description,
      is_reviewer: data.is_reviewer,
      menu_ids: data.menu_ids,
    });

    this.roleForm.markAllAsTouched();

    this.menuIds.set(data.menu_ids);

    this.initialFormValue = this.roleForm.getRawValue();

    this.loadSelectedMenu();
    this.syncAllSections();

    setTimeout(() => {
      this.autogrow(this.autoDescTA.nativeElement);
    }, 100);
  }

  getRoleDetails(id: number) {
    this.ngxLoader.start();
    this.roleManagementService.roleDetails(id).subscribe({
      next: (res: any) => {
        this.loadData(res['data']);
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
        this.sections = transformMenu(res['data']);
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Something went wrong while loading data');
        }
      },
    });
  }

  createRole() {
    if (this.roleForm.invalid) {
      return;
    }

    this.ngxLoader.start();

    const payload = {
      ...this.roleForm.getRawValue(),
      menu_ids: this.buildPayload()
        .filter((x: any) => x.checked)
        .map((x: any) => x.menu_id),
    };

    this.roleManagementService.createRole(payload).subscribe({
      next: () => {
        this.toast.success('Create Role request has been submitted');

        this.router.navigate(['/home/role-management']);
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Request create role has been failed');
        }

        this.ngxLoader.stop();
      },
      complete: () => {
        this.ngxLoader.stop();
      },
    });
  }

  editRole() {
    if (this.roleForm.invalid) {
      return;
    }

    this.ngxLoader.start();

    const payload = {
      ...this.roleForm.getRawValue(),
      menu_ids: this.buildPayload()
        .filter((x: any) => x.checked)
        .map((x: any) => x.menu_id),
    };

    this.roleManagementService.updateRole(payload).subscribe({
      next: () => {
        this.toast.success('Update Role request has been submitted');

        this.router.navigate(['/home/role-management']);
      },
      error: (e) => {
        if (e.status !== 400) {
          this.toast.error('Request update role has been failed');
        }

        this.ngxLoader.stop();
      },
      complete: () => {
        this.ngxLoader.stop();
      },
    });
  }

  onSubmit() {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to submit?', 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          if (this.roleId || this.roleId !== '') {
            this.editRole();
            return;
          }
          this.createRole();
        }
      });
  }

  getChangedValues(original: any, current: any): any {
    const changes: any = {};
    for (const key in current) {
      if (typeof current[key] === 'object' && current[key] !== null) {
        const nested = this.getChangedValues(original[key] || {}, current[key]);
        if (Object.keys(nested).length > 0) {
          changes[key] = nested;
        }
      } else if (current[key] !== original[key]) {
        changes[key] = { from: original[key], to: current[key] };
      }
    }
    return changes;
  }

  back() {
    const currentValue = {
      ...this.roleForm.getRawValue(),
      menu_ids: this.buildPayload()
        .filter((x: any) => x.checked)
        .map((x: any) => x.menu_id),
    };
    const changed = this.getChangedValues(this.initialFormValue, currentValue);

    if (Object.keys(changed).length === 0) {
      this.router.navigate(['/home/role-management']);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            this.router.navigate(['/home/role-management']);
          }
        });
    }
  }

  get f() {
    return this.roleForm.controls;
  }

  autogrow(textarea: HTMLTextAreaElement) {
    const minHeight = 48;
    const maxHeight = 168;

    textarea.style.height = 'auto';
    let newHeight = textarea.scrollHeight;

    if (newHeight < minHeight) {
      newHeight = minHeight;
    } else if (newHeight > maxHeight) {
      newHeight = maxHeight;
    }

    textarea.style.height = newHeight + 'px';
  }

  onKeyDown(event: KeyboardEvent, controlName: string, index?: number) {
    let control;

    control = this.roleForm.get(controlName);

    const value = control?.value ?? '';
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];

    if (value.length >= 201 && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCheckboxChange(row: any, field: 'Requested' | 'Task', event: any) {
    row[field] = event.target.checked;

    if (field === 'Task' && !row.Task) {
      row.selectedLevel = null;
    }
  }

  onAlertChange(row: any): void {
    row.checked = !row.checked;
  }

  onDynamicChange(row: any, col: string): void {
    row[col] = !row[col];

    const triggers = ['Create', 'Update', 'Delete', 'Upload', 'Edit'];

    const hasTrigger = triggers.some((key) => row[key]);

    if (hasTrigger) {
      row.View = true;
      row.detailLocked = true;
    } else {
      row.detailLocked = false;
    }
  }

  onApprovalRequestedChange(row: any): void {
    row.Requested = !row.Requested;
  }

  onApprovalTaskChange(row: any): void {
    row.Task = !row.Task;
    if (!row.Task) {
      row.selectedLevel = null;
    }
  }

  onApprovalLevelChange(row: any, value: any): void {
    row.selectedLevel = value;
    row.Task = !!value;
  }

  onLevelChange(row: any, value: string) {
    row.selectedLevel = value;
    row.Task = !!value;
  }

  buildPayload(): any {
    const payload: any[] = [];

    this.sections.forEach((section: any) => {
      section.rows.forEach((row: any) => {
        if (section.type === 'dynamic') {
          section.columns.forEach((col: string) => {
            payload.push({
              menu_id: row.ids[col],
              checked: !!row[col],
            });
          });
        }

        if (section.type === 'alert') {
          payload.push({
            menu_id: row.ids.checked,
            checked: !!row.checked,
          });
        }

        if (section.type === 'approval') {
          if (row.ids.Requested) {
            payload.push({
              menu_id: row.ids.Requested,
              checked: !!row.Requested,
            });
          }

          if (row.hasOwnProperty('selectedLevel')) {
            if (row.selectedLevel === '1') {
              payload.push({
                menu_id: row.ids.LV1,
                checked: true,
              });
            }

            if (row.selectedLevel === '2') {
              payload.push({
                menu_id: row.ids.LV2,
                checked: true,
              });
            }
          } else {
            payload.push({
              menu_id: row.ids.Task,
              checked: !!row.Task,
            });
          }
        }
      });
    });

    return payload;
  }

  loadSelectedMenu(): void {
    this.sections.forEach((section: any) => {
      section.rows.forEach((row: any) => {
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

        if (section.type === 'alert') {
          if (this.menuIds().includes(row.ids.checked)) {
            row.checked = true;
          }
        }

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

  toggleSection(section: any, event: Event): void {
    const target = event.target as HTMLInputElement;
    section.selectedAll = target.checked;
    const checked = section.selectedAll;

    section.rows.forEach((row: any) => {
      if (section.type === 'dynamic') {
        section.columns.forEach((col: string) => {
          if (col === 'View' && row.detailLocked) return;

          row[col] = checked;
        });

        this.syncDetail(row);
      }

      if (section.type === 'alert') {
        row.checked = checked;
      }

      if (section.type === 'approval') {
        row.Requested = checked;

        if (row.lv1 || row.lv2) {
          if (checked) {
            row.selectedLevel = row.lv1 ? '1' : '2';
            row.Task = true;
          } else {
            row.selectedLevel = '';
            row.Task = false;
          }
        } else {
          row.Task = checked;
        }
      }
    });
  }

  syncDetail(row: any): void {
    const triggers = ['Create', 'Update', 'Delete', 'Upload', 'Edit'];

    const hasTrigger = triggers.some((key) => !!row[key]);

    if (hasTrigger) {
      row.Detail = true;
      row.detailLocked = true;
    } else {
      row.detailLocked = false;
    }
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

  syncAllSections(): void {
    this.sections.forEach((section: any) => {
      if (section.type === 'dynamic') {
        section.rows.forEach((row: any) => {
          this.syncDetail(row);
        });
      }

      this.refreshSection(section);
    });
  }
}
