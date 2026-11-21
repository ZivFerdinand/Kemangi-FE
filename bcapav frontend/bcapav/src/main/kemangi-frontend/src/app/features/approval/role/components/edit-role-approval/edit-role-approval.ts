import { Component, Input, input, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

import { CapitalizePipe } from '../../../../../shared';
import { ToggleSwitch, approverLevels } from '../../../../../shared';
import { RoleApprovalDetails } from '../../domain/models/role-approval.model';
import {
  transformMenu,
  MenuSection,
} from '../../../../role-management/utils/menu-transform.utils';

@Component({
  selector: 'app-edit-role-approval',
  templateUrl: './edit-role-approval.html',
  styleUrls: [
    './edit-role-approval.scss',
    '../../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    ToggleSwitch,
    CapitalizePipe,
  ],
  providers: [DatePipe],
})
export class EditRoleApproval {
  rawMenuList = input<any[]>([]);

  details = input<RoleApprovalDetails | null>(null);

  prevDetails = input<RoleApprovalDetails | null>(null);

  menuIds = signal<number[]>([]);

  prevMenuIds = signal<number[]>([]);

  menuSections: MenuSection[] = [];

  prevMenuSections: MenuSection[] = [];

  approverLevels: any[] = approverLevels;

  @Input() pageType: string = '';

  @Input() back!: () => void;

  @Input() reject!: () => void;

  @Input() approve!: () => void;

  isDisabled = true;

  constructor() {
    effect(() => {
      const incoming = this.rawMenuList();

      this.menuSections = transformMenu(incoming);
      this.prevMenuSections = transformMenu(incoming);

      const details = this.details();
      const prevDetails = this.prevDetails();

      if (details) {
        this.menuIds.set(details.menuIds);
        this.loadSelectedMenu();
      }

      if (prevDetails) {
        this.prevMenuIds.set(prevDetails.menuIds);
        this.loadPrevSelectedMenu();
      }
    });
  }

  loadSelectedMenu(): void {
    this.menuSections.forEach((section: any) => {
      section.rows.forEach((row: any) => {
        if (section.type === 'dynamic') {
          section.columns.forEach((col: string) => {
            const id = row.ids[col];

            if (this.menuIds().includes(id)) {
              row[col] = true;
            }
          });
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

  loadPrevSelectedMenu(): void {
    this.prevMenuSections.forEach((section: any) => {
      section.rows.forEach((row: any) => {
        if (section.type === 'dynamic') {
          section.columns.forEach((col: string) => {
            const id = row.ids[col];

            if (this.prevMenuIds().includes(id)) {
              row[col] = true;
            }
          });
        }

        if (section.type === 'alert') {
          if (this.prevMenuIds().includes(row.ids.checked)) {
            row.checked = true;
          }
        }

        if (section.type === 'approval') {
          if (this.prevMenuIds().includes(row.ids.Requested)) {
            row.Requested = true;
          }

          if (this.prevMenuIds().includes(row.ids.Task)) {
            row.Task = true;
          }

          if (this.prevMenuIds().includes(row.ids.LV1)) {
            row.selectedLevel = '1';
            row.Task = true;
          }

          if (this.prevMenuIds().includes(row.ids.LV2)) {
            row.selectedLevel = '2';
            row.Task = true;
          }
        }
      });

      this.refreshPrevSection(section);
    });
  }

  refreshPrevSection(section: any): void {
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

  isChanged(row: any, col: string): boolean {
    const id = row.ids[col];

    const wasChecked = this.prevMenuIds().includes(id);
    const isChecked = !!row[col];

    return wasChecked !== isChecked;
  }

  isAlertChanged(row: any): boolean {
    const id = row.ids.checked;

    const wasChecked = this.prevMenuIds().includes(id);
    const isChecked = !!row.checked;

    return wasChecked !== isChecked;
  }

  isApprovalChanged(row: any, col: string): boolean {
    if (col === 'selectedLevel') {
      const prevSection = this.prevMenuSections.find(
        (section) => section.type === 'approval',
      );

      const prevRow = prevSection?.rows?.find(
        (x: any) => x.subMenu === row.subMenu,
      );

      return prevRow?.selectedLevel !== row.selectedLevel;
    }

    const id = row.ids[col];

    const wasChecked = this.prevMenuIds().includes(id);
    const isChecked = !!row[col];

    return wasChecked !== isChecked;
  }
}
