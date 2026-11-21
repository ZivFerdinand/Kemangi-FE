import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

interface User {
  userId: string;
  userName: string;
  roleName: string;
  roleId: string;
}

@Component({
  selector: 'app-user-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbPaginationModule],
  templateUrl: './assign-to-table-action.html',
  styleUrls: ['./assign-to-table-action.scss'],
})
export class AssignToTableComponent implements OnChanges {
  @Input() users: User[] = [];
  @Input() selectedUsers: string[] = [];
  @Output() assignToTableChange = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges): void {
    const dataSelectedUsersChanges = changes['selectedUsers'];
    if (dataSelectedUsersChanges) {
      if (dataSelectedUsersChanges.currentValue) {
        const value = dataSelectedUsersChanges.currentValue;
        this.selectedUserIds = new Set(value);
      }
    }
  }

  pageSize = 5;
  currentPage = 1;

  selectedUserIds = new Set<string>();

  get totalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  get pagedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  rowNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }

  isSelected(userId: string): boolean {
    return this.selectedUserIds.has(userId);
  }

  toggleRow(userId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedUserIds.add(userId);
    } else {
      this.selectedUserIds.delete(userId);
    }

    this.emitSelection();
  }

  get allSelected(): boolean {
    return (
      this.pagedUsers.length > 0 &&
      this.pagedUsers.every((u) => this.selectedUserIds.has(u.userId))
    );
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.pagedUsers.forEach((u) => {
      if (checked) {
        this.selectedUserIds.add(u.userId);
      } else {
        this.selectedUserIds.delete(u.userId);
      }
    });

    this.emitSelection();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  get totalElements(): number {
    return this.users.length;
  }

  get startIndex(): number {
    if (this.totalElements === 0) return 0;
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    const end = this.currentPage * this.pageSize;
    return Math.min(end, this.totalElements);
  }

  private emitSelection(): void {
    const userIds = Array.from(this.selectedUserIds);
    this.assignToTableChange.emit(userIds);
  }
}
