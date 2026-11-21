import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  align?: string;
  type?: 'date' | 'text';
  bodyClass?: 'string';
  children?: TableColumn[];
}

@Component({
  selector: 'app-pipeline-table-v2',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule],
  templateUrl: './pipeline-table-v2.html',
  styleUrls: ['./pipeline-table-v2.scss'],
})
export class PipelineTableV2 {
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
  @Input() marginTopPageInfo: number = 30;

  @Output() pageChange = new EventEmitter<any>();

  @Output() sort = new EventEmitter<{
    direction: 'asc' | 'desc';
    key: string;
  }>();

  @Output() limitChange = new EventEmitter<any>();

  constructor(private datePipe: DatePipe) {}

  getNestedValue(obj: any, path?: string) {
    if (!path) return null;

    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  formatCellValue(row: any, col: TableColumn): string {
    const value = this.getNestedValue(row, col.key);

    if (value === null || value === undefined || value === '') {
      return '-';
    }

    if (col.type === 'date') {
      const formatted = this.datePipe.transform(value, 'dd-MMM-yyyy HH:mm:ss');
      return formatted || '-';
    }

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

  get hasGroupedHeader(): boolean {
    return this.columns?.some((col) => col.children?.length);
  }

  get leafColumns(): TableColumn[] {
    return (
      this.columns?.flatMap((col) =>
        col.children?.length ? col.children : [col],
      ) || []
    );
  }
}
