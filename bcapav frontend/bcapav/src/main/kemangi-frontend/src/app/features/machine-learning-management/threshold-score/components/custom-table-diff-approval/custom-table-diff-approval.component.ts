import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  align?: string; // literal types
}

@Component({
  selector: 'app-custom-table-diff-approval',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule],
  templateUrl: './custom-table-diff-approval.component.html',
  styleUrls: ['./custom-table-diff-approval.component.scss'],
})
export class CustomTableDiffApprovalComponent {
  @Input() columns: TableColumn[] = [];
  @Input() cellTemplates: { [key: string]: any } = {};
  @Input() data: any[] = [];
  @Input() comparisonData: any[] = [];

  @Input() pageInfo: any;
  @Input() isAfterData: boolean = false;
  @Input() prevData: any[] = [];
  @Input() pageParams: any;

  @Input() showPageInfo: any = false;
  @Input() showLimitSize: boolean = false;
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

  checkDataDiff(i: any, key: any) {
    if (!this.isAfterData || this.prevData === undefined) return false;

    // console.log(i, key)
    // console.log(this.prevData[0]['thresholdId'],i['thresholdId'])
    const foundOldDataIndex = this.prevData.findIndex(
      (item) => item['thresholdId'] === i['thresholdId'],
    );
    if (foundOldDataIndex === -1) return true;
    else {
      if (this.prevData[foundOldDataIndex][key] !== i[key]) return true;
      return false;
    }
  }

  isDifferent(rowIndex: number, key: string): boolean {
    return (
      this.comparisonData &&
      this.comparisonData[rowIndex] &&
      this.comparisonData[rowIndex][key] !== this.data[rowIndex][key]
    );
  }

  isRowDifferent(rowIndex: number): boolean {
    if (!this.comparisonData || !this.comparisonData[rowIndex]) return false;

    return this.columns.some(
      (col) =>
        this.comparisonData[rowIndex][col.key] !== this.data[rowIndex][col.key],
    );
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
    this.limitChange.emit(Number(page));
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onSort(direction: 'asc' | 'desc', key: string) {
    this.sort.emit({ direction, key });
  }
}
