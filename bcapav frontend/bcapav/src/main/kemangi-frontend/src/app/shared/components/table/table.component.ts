import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

export interface CellHighlightRule {
  when: (value: any, row: any) => boolean;
  class?: string;
  style?: { [key: string]: string };
}

export type CellHighlightConfig =
  | CellHighlightRule[]
  | ((
      value: any,
      row: any,
    ) => { class?: string; style?: { [key: string]: string } } | null);
export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  align?: string;
  bodyCellClass?: string | ((row: any, value: any) => string);
  dateFormat?: string;
  type?: string;
  highlight?: CellHighlightConfig;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule],
  providers: [DatePipe],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
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
  @Input() squared: boolean = false;
  @Input() dateFormat = 'dd-MMM-yyyy HH:mm:ss';

  @Output() pageChange = new EventEmitter<any>();

  @Output() sort = new EventEmitter<{
    direction: 'asc' | 'desc';
    key: string;
  }>();

  @Output() limitChange = new EventEmitter<any>();

  constructor(private datePipe: DatePipe) {}

  formatCellValue(row: any, col: any): string {
    try {
      if (!row || !col || !col.key) {
        return '-';
      }

      const value = row[col.key];

      if (value === null || value === undefined || value === '') {
        return '-';
      }

      if (col.type === 'date') {
        const date = new Date(value);

        if (isNaN(date.getTime())) {
          return '-';
        }

        return (
          this.datePipe.transform(date, col.dateFormat || this.dateFormat) ??
          '-'
        );
      }

      if (typeof value === 'object') {
        return JSON.stringify(value);
      }

      return String(value);
    } catch (err) {
      console.error('formatCellValue error', {
        row,
        col,
        err,
      });

      return '-';
    }
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

  getCellStyle(row: any, col: TableColumn): { [key: string]: string } | null {
    const value = row?.[col.key];
    const highlightResult = this.resolveHighlight(col.highlight, row, value);
    return highlightResult?.style ?? null;
  }

  getCellClass(row: any, col: TableColumn): string | null {
    const value = row?.[col.key];

    let baseClass: string | null =
      typeof col.bodyCellClass === 'function'
        ? col.bodyCellClass(row, value)
        : (col.bodyCellClass ?? null);

    const highlightResult = this.resolveHighlight(col.highlight, row, value);

    if (highlightResult?.class) {
      baseClass = baseClass
        ? `${baseClass} ${highlightResult.class}`
        : highlightResult.class;
    }

    return baseClass;
  }

  private resolveHighlight(
    highlight: TableColumn['highlight'],
    row: any,
    value: any,
  ): { class?: string; style?: { [key: string]: string } } | null {
    if (!highlight) return null;

    if (typeof highlight === 'function') {
      return highlight(value, row);
    }

    if (Array.isArray(highlight)) {
      const rule = highlight.find((r) => {
        try {
          return r.when(value, row);
        } catch {
          return false;
        }
      });
      return rule ? { class: rule.class, style: rule.style } : null;
    }

    return null;
  }
}
