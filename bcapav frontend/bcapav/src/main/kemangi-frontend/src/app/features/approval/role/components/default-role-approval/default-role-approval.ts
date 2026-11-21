import { Component, Input, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { approverLevels, ToggleSwitch } from '../../../../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { CapitalizePipe } from '../../../../../shared';
import { RoleApprovalDetails } from '../../domain/models/role-approval.model';
import {
  transformMenu,
  MenuSection,
} from '../../../../role-management/utils/menu-transform.utils';

@Component({
  selector: 'app-default-role-approval',
  templateUrl: './default-role-approval.html',
  styleUrls: [
    './default-role-approval.scss',
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
export class DefaultRoleApproval {
  rawMenuList = input<any[]>([]);

  details = input<RoleApprovalDetails | null>(null);

  menuIds = signal<number[]>([]);

  menuSections: MenuSection[] = [];

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

      const details = this.details();

      if (details) {
        this.menuIds.set(details.menuIds);
        this.loadSelectedMenu();
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
}
