import {
  ChangeDetectionStrategy,
  Component,
  computed,
  untracked,
  Input,
  input,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {
  ColumnDef,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  Cell,
} from '@tanstack/angular-table';
import { TableResizableCell, TableResizableHeader } from './resizable-cell';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { PageInfo } from '../../interfaces';
import { PAGE_INFO_STRUCT, pageSize } from '../../data';
import { TableState } from '../../interfaces';

@Component({
  selector: 'app-resizeable-table',
  standalone: true,
  imports: [
    FlexRenderDirective,
    TableResizableCell,
    TableResizableHeader,
    NgTemplateOutlet,
    NgbPaginationModule,
    NgSelectModule,
    NgSelectComponent,
    FormsModule,
  ],
  templateUrl: './resizable-table.html',
  styleUrls: ['./resizable-table.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResizableTableComponent<TRow, TQuery = any> {
  columns = input<ColumnDef<TRow>[]>([]);
  data = input<TRow[]>([]);
  pageInfo = input<PageInfo>(PAGE_INFO_STRUCT);
  pageQuery = input<TableState<TQuery>>();
  pageSizeList = pageSize;

  @Input() cellTemplates: Record<string, TemplateRef<any>> = {};
  @Input() showPageInfo: boolean = false;
  @Input() showPageSize: boolean = false;
  @Input() showPagination: boolean = true;

  @Output() pageSizeChange = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<{
    direction: 'asc' | 'desc';
    key: string;
  }>();

  readonly columnSizingInfo = computed(
    () => this.table.getState().columnSizingInfo,
  );

  readonly columnSizing = computed(() => this.table.getState().columnSizing);

  readonly columnSizeVars = computed(() => {
    void this.columnSizing();
    void this.columnSizingInfo();
    const headers = untracked(() => this.table.getFlatHeaders());
    const colSizes: { [key: string]: number } = {};
    let i = headers.length;
    while (--i >= 0) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  });

  readonly table = createAngularTable(() => ({
    data: this.data(),
    columns: this.columns(),
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 35,
      maxSize: 800,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  }));

  readonly columnSizingDebugInfo = computed(() =>
    JSON.stringify(
      {
        columnSizing: this.table.getState().columnSizing,
      },
      null,
      2,
    ),
  );

  onPageSizeChange(size: any) {
    this.pageSizeChange.emit(size);
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onSort(direction: 'asc' | 'desc', key: string) {
    this.sortChange.emit({ direction, key });
  }

  get startIndex() {
    const page = this.pageQuery()?.page ?? 1;
    const limit = this.pageQuery()?.limit ?? 10;
    return (page - 1) * limit;
  }

  get endIndex() {
    const length = this.data()?.length ?? 0;
    const total = this.pageInfo()?.totalElements ?? 0;
    return Math.min(this.startIndex + length, total);
  }

  get page() {
    return this.pageQuery()?.page ?? 1;
  }

  get pageSize() {
    return this.pageQuery()?.limit ?? 10;
  }

  getCellClass(cell: Cell<any, any>, row: any): string {
    const cellClass = cell.column.columnDef.meta?.cellClass;

    if (!cellClass) {
      return '';
    }

    if (typeof cellClass === 'function') {
      return cellClass(cell.getValue(), row);
    }

    return cellClass;
  }
}
