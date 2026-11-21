import '@tanstack/table-core';

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData, TValue> {
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
    highlight?: (row: TData) => boolean;
    cellClass?: string | ((value: TValue, row: TData) => string);
  }
}
