import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  input,
  Input,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  Column,
  ColumnDef,
  type ColumnOrderState,
  type ColumnPinningState,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  type VisibilityState,
} from '@tanstack/angular-table';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { PageInfo, TableState } from '../../../../shared/interfaces';
import { PAGE_INFO_INIT, pageSize } from '../../../../shared/data';

@Component({
  selector: 'app-payment-id-sticky-table',
  standalone: true,
  imports: [
    FlexRenderDirective,
    NgTemplateOutlet,
    NgStyle,
    NgbPaginationModule,
    NgSelectModule,
    FormsModule,
  ],
  templateUrl: './payment-id-sticky-table.html',
  styleUrls: ['./payment-id-sticky-table.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentIdStickyTable<TRow, TQuery = any> {
  columns = input<ColumnDef<TRow>[]>([]);
  data = input<TRow[]>([]);
  pageInfo = input<PageInfo>(PAGE_INFO_INIT);
  pageQuery = input<TableState<TQuery>>();
  pageSizeList = pageSize;

  readonly initialPinnedLeft = input<string[]>([]);
  readonly initialPinnedRight = input<string[]>([]);
  readonly columnPinning = computed<ColumnPinningState>(() => ({
    left: this.initialPinnedLeft(),
    right: this.initialPinnedRight(),
  }));
  readonly columnVisibility = signal<VisibilityState>({});
  readonly columnOrder = signal<ColumnOrderState>([]);
  readonly split = signal(false);

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

  table = createAngularTable(() => ({
    data: this.data(),
    columns: this.columns(),
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnPinning: this.columnPinning(),
    },
    defaultColumn: {
      minSize: 50,
    },
    // turn these off in production
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
    enableColumnResizing: false,
  }));

  stringifiedColumnPinning = computed(() => {
    return JSON.stringify(this.table.getState().columnPinning);
  });

  /**
   * Sticky offsets + fluid sizing in one place.
   * - Pinned: fixed width so left/right offsets stay correct.
   * - Others: flex-grow = size with basis 0 -> widths are proportional to
   *   `size`, and they can shrink down to `minSize`.
   */
  readonly getCommonPinningStyles = (
    column: Column<TRow>,
  ): Record<string, any> => {
    const isPinned = column.getIsPinned();
    const size = column.getSize();
    const minSize = column.columnDef.minSize ?? 0;

    return {
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      position: isPinned ? 'sticky' : 'relative',
      zIndex: isPinned ? 1 : 0,
      flex: isPinned ? `0 0 ${size}px` : `${size} 1 0px`,
      minWidth: isPinned ? `${size}px` : `${minSize}px`,
    };
  };

  /**
   * Table-level floor: fits any container down to the sum of the minimums,
   * then scrolls inside .table-responsive.
   */
  minTableWidth(): number {
    return this.table
      .getVisibleLeafColumns()
      .reduce(
        (sum, col) =>
          sum +
          (col.getIsPinned() ? col.getSize() : (col.columnDef.minSize ?? 0)),
        0,
      );
  }

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
}
