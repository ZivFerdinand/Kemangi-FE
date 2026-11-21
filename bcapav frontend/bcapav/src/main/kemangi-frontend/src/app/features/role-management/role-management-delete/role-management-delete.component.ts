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
import { Subject, finalize } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { approverLevels, ToggleSwitch } from '../../../shared';
import { RoleManagementService } from '../services/role-management.service';
import { ConfirmationModalService } from '../../../core/services/confirmation-modal.service';
import { FailedModalService } from '../../../core/services/failed-modal.service';
import { ReasonModalService } from '../../../core/services/reason-modal.service';
import { ApiService } from '../../../core/services/api.service';
import { BreadcrumbProps } from '../../../shared';
import { ToastService } from '../../../core/services/toast.service';
import { deleteRoleManagementBreadcrumb } from '../data';
import { ContentLayout } from '../../../shared';
import { requiredTrimmed } from '../../../core/validators/required-trimmed.validator';
import { transformMenu, MenuSection } from '../utils/menu-transform.utils';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-role-management-delete',
  templateUrl: './role-management-delete.component.html',
  styleUrls: [
    './role-management-delete.component.scss',
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
export class RoleManagementDeleteComponent implements OnInit, OnDestroy {
  currentUrl: string = '';

  breadcrumb: BreadcrumbProps[] = deleteRoleManagementBreadcrumb;

  pageTitle: string = 'Delete Role';

  initialFormValue: any;

  roleForm!: FormGroup;

  roleId: string = '';

  approverLevels: any[] = approverLevels;

  menuSections: MenuSection[] = [];

  menuIds = signal<number[]>([]);

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
  }

  ngOnInit(): void {
    this.initForm();
    this.getMenuList();

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.roleId = params.get('id') ?? '';
      if (this.roleId || this.roleId !== '') {
        this.disableFields();
        this.getRoleDetails(Number(this.roleId));
      }
    });
  }

  initForm() {
    this.roleForm = this.fb.group({
      active_status: [true],
      role_id: ['', [Validators.required, Validators.maxLength(255)]],
      role_name: ['', [Validators.required, Validators.maxLength(255)]],
      role_group: [''],
      role_description: ['', [requiredTrimmed, Validators.maxLength(255)]],
      is_reviewer: [false],
      menu_ids: [[]],
    });
  }

  private disableFields(): void {
    ['role_id', 'role_name', 'role_description', 'is_reviewer'].forEach((key) =>
      this.roleForm.get(key)?.disable(),
    );
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

    this.menuIds.set(data.menu_ids);
    this.loadSelectedMenu();

    this.initialFormValue = this.roleForm.getRawValue();

    setTimeout(() => {
      this.autogrow(this.autoDescTA.nativeElement);
    }, 100);
  }

  getRoleDetails(id: number) {
    this.ngxLoader.start();
    this.roleManagementService
      .roleDetails(id)
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: (res: any) => {
          this.loadData(res['data']);
        },
        error: this.handleError('Something went wrong while loading data'),
      });
  }

  getMenuList() {
    this.apiService.getMenuList().subscribe({
      next: (res: any) => {
        this.menuSections = transformMenu(res['data']);
      },
      error: this.handleError('Something went wrong while loading data'),
    });
  }

  deleteRole() {
    this.ngxLoader.start();

    this.roleManagementService
      .deleteRole(Number(this.roleId))
      .pipe(finalize(() => this.ngxLoader.stop()))
      .subscribe({
        next: () => {
          this.toast.success('Delete Role request has been submitted');

          this.router.navigate(['/home/role-management']);
        },
        error: this.handleError('Request delete role has been failed'),
      });
  }

  onSubmit() {
    this.confirmationDialogService
      .confirm('', 'Are you sure you want to submit?', 'Yes', 'No')
      .then((confirmed) => {
        if (!confirmed) return;

        if (confirmed) {
          if (this.roleForm.getRawValue().active_status) {
            setTimeout(() => {
              this.failedDialogService.failed(
                '',
                '400',
                'Sorry! Role  is active. Please change the status to Inactive before submitting.',
              );
            }, 700);

            return;
          }

          this.deleteRole();
        }
      });
  }

  back() {
    const currentValue = this.roleForm.getRawValue();

    if (
      JSON.stringify(currentValue) === JSON.stringify(this.initialFormValue)
    ) {
      this.router.navigate(['/home/role-management']);
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure you want to discard all changes?')
        .then((confirmed) => {
          if (confirmed) {
            if (confirmed) {
              this.router.navigate(['/home/role-management']);
            }
          }
        });
    }
  }

  get f() {
    return this.roleForm.controls;
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

    if (value.length >= 256 && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
