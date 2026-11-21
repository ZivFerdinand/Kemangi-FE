import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  inject,
  ViewChild,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';

import {
  TableComponent,
  PageInfo,
  PAGE_INFO_INIT,
  TableQuery,
  PAGE_QUERY_INIT,
} from '../../../../shared';

import {
  assignToDisplayListColumns,
  filterKeys,
  USER_MASTER_DATA_QUERY_INIT,
} from '../../data';
import { AssignToTableComponent } from '../assign-to-table-action/assign-to-table-action';
import { ToastService } from '../../../../core/services/toast.service';
import { AlertQueueService } from '../../api/services/alert-queue.service';
import { ConfirmationModalService } from '../../../../core/services/confirmation-modal.service';
import { UserMasterDataFilterQuery } from '../../domain/alert-queue.model';
import { mapUserMasterDataFilterQueryDomainToApi } from '../../mappers/alert-queue.mapper';

@Component({
  selector: 'app-alert-queue-assign-to',
  templateUrl: './alert-queue-assign-to.html',
  styleUrls: [
    './alert-queue-assign-to.scss',
    '../../../../shared/styles/index.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableComponent,
    NgSelectModule,
    AssignToTableComponent,
  ],
})
export class AlertQueueAssignTo implements OnInit, OnChanges {
  private initialDataReady = false;
  private usersReady = false;

  @Input() mode: string = '';
  @Output() handleAssignToData = new EventEmitter<string[]>();
  @Input() set initialData(initialData: string[] | null | undefined) {
    if (!initialData) return;

    this.initialSelectedIds = initialData;
    this.initialDataReady = true;

    this.tryGenerateTable();
  }

  fullTableData: any[] = [];
  tableData: any[] = [];
  columns: any[] = assignToDisplayListColumns;
  pageInfo: PageInfo = { ...PAGE_INFO_INIT };
  pageQuery: TableQuery = { ...PAGE_QUERY_INIT };

  userQuery: UserMasterDataFilterQuery = {
    ...USER_MASTER_DATA_QUERY_INIT,
  };

  filterKeySelected: keyof typeof this.userQuery | null = null;

  filterKeys: any[] = filterKeys;

  filterSearchQuery: string | null = null;

  users: any[] = [];

  modalRef!: NgbModalRef;
  initialSelectedIds: string[] = [];
  currentSelectedIds: string[] = [];

  private modalService = inject(NgbModal);

  @ViewChild('filterKeySelect') filterKeySelect!: NgSelectComponent;

  constructor(
    private readonly alertQueueService: AlertQueueService,
    private readonly toast: ToastService,
    public confirmationDialogService: ConfirmationModalService,
  ) {}

  ngOnInit(): void {
    this.getUserMasterData();
  }

  private tryGenerateTable(): void {
    if (!this.initialDataReady || !this.usersReady) {
      return;
    }

    this.generateTable();
  }

  handleDataFillingTable(data: string[]) {
    this.currentSelectedIds = [...data];
  }

  ngOnChanges(changes: SimpleChanges): void {}

  getUserMasterData() {
    this.alertQueueService
      .userMasterData(mapUserMasterDataFilterQueryDomainToApi(this.userQuery))
      .subscribe({
        next: (res: any) => {
          this.users = res['data'];

          this.usersReady = true;

          this.tryGenerateTable();
        },
        error: this.handleError('Something went wrong!'),
      });
  }

  cancel() {
    const prevValue = [...this.initialSelectedIds];

    const currentValue = [...this.currentSelectedIds];

    const isSame =
      currentValue.length === prevValue.length &&
      currentValue.every((id) => prevValue.includes(id));

    if (isSame) {
      this.close();
    } else {
      this.confirmationDialogService
        .confirm('', 'Are you sure you want to discard all changes?')
        .then((confirmed) => {
          if (!confirmed) return;
          if (confirmed) {
            this.close();
          }
        });
    }
  }

  save() {
    this.initialSelectedIds = [...this.currentSelectedIds];
    this.currentSelectedIds = [];
    this.generateTable();
    this.close();
    this.emitSelection();
  }

  applyPagination() {
    const start = (this.pageQuery.page - 1) * this.pageQuery.limit;
    const end = start + this.pageQuery.limit;

    this.tableData = this.fullTableData.slice(start, end) ?? [];
  }

  handleSortChange(direction: 'asc' | 'desc', key: string) {
    this.tableData = [...this.tableData].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return 1;
      if (valueB == null) return -1;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      }

      return direction === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });

    this.applyPagination();
  }

  handlePageChange(e: any) {
    this.pageQuery = { ...this.pageQuery, page: e };

    this.applyPagination();
  }

  open(content: TemplateRef<any>) {
    this.currentSelectedIds = this.initialSelectedIds;

    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-assign-to',
      centered: true,
      size: 'xl',
    });
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  generateTable() {
    const selectedUsers = this.users.filter((u) =>
      this.initialSelectedIds.includes(u.userId),
    );

    this.fullTableData = selectedUsers;

    const totalElements = selectedUsers.length;

    this.pageInfo = {
      totalElements,
      totalPages: Math.ceil(totalElements / this.pageQuery.limit),
    };

    this.applyPagination();
  }

  handleSearch() {
    this.userQuery = { ...USER_MASTER_DATA_QUERY_INIT };
    if (this.filterKeySelected) {
      this.userQuery[this.filterKeySelected] = this.filterSearchQuery;
    }

    this.getUserMasterData();
  }

  handleReset() {
    this.userQuery = { ...USER_MASTER_DATA_QUERY_INIT };

    this.filterKeySelected = null;
    this.filterSearchQuery = null;

    this.filterKeySelect.clearModel();

    this.getUserMasterData();
  }

  private handleError(message: string) {
    return (e: any) => {
      if (e.status !== 400) this.toast.error(message);
    };
  }

  private emitSelection(): void {
    this.handleAssignToData.emit(this.initialSelectedIds);
  }
}
