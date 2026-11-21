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
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { PageInfo, TableState } from '../../interfaces';
import { PAGE_INFO_INIT, pageSize } from '../../data';

@Component({
  selector: 'app-sticky-table',
  standalone: true,
  imports: [
    FlexRenderDirective,
    // SlicePipe,
    NgTemplateOutlet,
    NgStyle,
    NgbPaginationModule,
    NgSelectModule,
    NgSelectComponent,
    FormsModule,
  ],
  templateUrl: './sticky-table.html',
  styleUrls: ['./sticky-table.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StickyTableComponent<TRow, TQuery = any> {
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
  //readonly columnPinning = signal<ColumnPinningState>({});
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
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    //columnResizeMode: 'onChange',
    enableColumnResizing: false,
  }));

  stringifiedColumnPinning = computed(() => {
    return JSON.stringify(this.table.getState().columnPinning);
  });

  readonly getCommonPinningStyles = (
    column: Column<TRow>,
  ): Record<string, any> => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
      isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn =
      isPinned === 'right' && column.getIsFirstColumn('right');
    const size = column.getSize();

    return {
      // boxShadow: isLastLeftPinnedColumn
      //   ? '-4px 0 4px -4px gray inset'
      //   : isFirstRightPinnedColumn
      //     ? '4px 0 4px -4px gray inset'
      //     : undefined,
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      // opacity: isPinned ? 0.95 : 1,
      position: isPinned ? 'sticky' : 'relative',
      flex: isPinned ? `0 0 ${size}px` : `1 1 ${size}px`,
      zIndex: isPinned ? 1 : 0,
    };
  };

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
