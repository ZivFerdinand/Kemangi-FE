import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  align?: string;
}

@Component({
  selector: 'app-rule-table',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule],
  templateUrl: './rule-table.html',
  styleUrls: ['./rule-table.scss'],
})
export class RuleTable {
  @Input() columns: TableColumn[] = [];
  @Input() cellTemplates: { [key: string]: any } = {};
  @Input() data: any[] = [];
  @Input() additionalData: any[] = [];

  @Input() pageInfo: any;
  @Input() pageParams: any;

  @Input() showPageInfo: any = false;
  @Input() showLimitSize: boolean = false;
  @Input() showNoData: boolean = true;
  @Input() pagination: boolean = true;

  @Output() pageChange = new EventEmitter<any>();

  @Output() sort = new EventEmitter<{
    direction: 'asc' | 'desc';
    key: string;
  }>();

  @Output() limitChange = new EventEmitter<any>();

  constructor(private datePipe: DatePipe) {}

  formatCellValue(row: any, col: any): string {
    const value = row[col.key];

    // Handle empty value only for: null, undefined, ""
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    // Handle date columns using Angular DatePipe
    if (col.type === 'date') {
      const formatted = this.datePipe.transform(value, 'dd-MMM-yyyy HH:mm:ss');
      return formatted || '-';
    }

    // Default
    return value;
  }

  get startIndex() {
    return (this.pageParams.page - 1) * this.pageParams.limit;
  }

  get endIndex() {
    const end = this.startIndex + this.data?.length;
    return end > this.pageInfo.totalElements
      ? this.pageInfo.totalElements
      : end;
  }

  onLimitChange(page: any) {
    this.limitChange.emit(page);
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onSort(direction: 'asc' | 'desc', key: string) {
    this.sort.emit({ direction, key });
  }
}
