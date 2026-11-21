import { ColumnDef } from '@tanstack/angular-table';
import {
  PaymentId,
  PaymentIdAccount,
  PaymentIdCreditCard,
  PaymentIdSakuku,
} from '../domain/model/payment-id.model';
import { formatDateId } from '../../../shared/utils/date.util';

export const paymentIdTaskListColumns: ColumnDef<PaymentId>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'requestDate',
    header: 'Request Date',
    size: 250,
    meta: {
      align: 'left',
      sortable: true,
    },
    cell: (info) => {
      const value = info.getValue<string | Date | number>();
      return value ? formatDateId(value) : '-';
    },
  },
  {
    accessorKey: 'requestType',
    header: 'Request Type',
    size: 150,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'lastActionDate',
    header: 'Last Action Date',
    size: 250,
    meta: {
      align: 'left',
      sortable: true,
    },
    cell: (info) => {
      const value = info.getValue<string | Date | number>();
      return value ? formatDateId(value) : '-';
    },
  },
  {
    accessorKey: 'paymentId',
    header: 'Payment ID',
    size: 150,
    meta: {
      align: 'left',
      sortable: true,
    },
  },
  {
    accessorKey: 'customerName',
    header: 'Customer Name',
    size: 200,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'bankName',
    header: 'Bank Name',
    size: 240,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'productList',
    header: 'Product List',
    size: 220,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    id: 'detailProduct',
    header: 'Detail Product',
    cell: ({ row }) => row.original,
    size: 240,
    meta: {
      align: 'center',
    },
  },
];

export const paymentIdHistoryListColumns: ColumnDef<PaymentId>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'requestDate',
    header: 'Request Date',
    size: 250,
    meta: {
      align: 'left',
      sortable: true,
    },
    cell: (info) => {
      const value = info.getValue<string | Date | number>();
      return value ? formatDateId(value) : '-';
    },
  },
  {
    accessorKey: 'requestType',
    header: 'Request Type',
    size: 150,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'lastActionDate',
    header: 'Last Action Date',
    size: 250,
    meta: {
      align: 'left',
      sortable: true,
    },
    cell: (info) => {
      const value = info.getValue<string | Date | number>();
      return value ? formatDateId(value) : '-';
    },
  },
  {
    accessorKey: 'lastActionStatus',
    header: 'Last Action Status',
    size: 200,
    meta: {
      align: 'left',
      sortable: true,
    },
  },
  {
    accessorKey: 'paymentId',
    header: 'Payment ID',
    size: 150,
    meta: {
      align: 'left',
      sortable: true,
    },
  },
  {
    accessorKey: 'cin',
    header: 'CIN',
    size: 150,
    meta: {
      align: 'left',
      sortable: true,
    },
  },
  {
    accessorKey: 'customerName',
    header: 'Customer Name',
    size: 200,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'bankName',
    header: 'Bank Name',
    size: 240,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    id: 'detailProduct',
    header: 'Detail Product',
    cell: ({ row }) => row.original,
    size: 240,
    meta: {
      align: 'center',
    },
  },
];

export const accountListColumns: ColumnDef<PaymentIdAccount>[] = [
  {
    accessorKey: 'accountNo',
    header: 'Account No',
    size: 200,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 228,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'statusKhusus',
    header: 'Status Khusus',
    size: 180,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'statusBiasa',
    header: 'Status Biasa',
    size: 180,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'failedReason',
    header: 'Reason',
    size: 228,
    meta: { align: 'left' },
  },
];

export const creditCardListColumns: ColumnDef<PaymentIdCreditCard>[] = [
  {
    accessorKey: 'cardNo',
    header: 'Card No',
    size: 200,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 228,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'productStatus',
    header: 'Product Status',
    size: 180,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    size: 228,
    meta: { align: 'left' },
  },
];

export const sakukuListColumns: ColumnDef<PaymentIdSakuku>[] = [
  {
    accessorKey: 'phoneNo',
    header: 'Phone No',
    size: 200,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 228,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'productStatus',
    header: 'Product Status',
    size: 180,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'reason',
    header: 'Reason',
    size: 228,
    meta: { align: 'left' },
  },
];

export const historyColumns = [
  {
    key: 'actionDate',
    label: 'Action Date',
    width: '350px',
    sortable: true,
  },
  {
    key: 'actionType',
    label: 'Action Type',
    width: '200px',
    sortable: true,
  },
  {
    key: 'product',
    label: 'Product',
    width: '360px',
    sortable: true,
    align: 'center',
  },
  {
    key: 'userName',
    label: 'Username',
    width: '300px',
  },
  {
    key: 'userGroup',
    label: 'User Group',
    width: '300px',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    width: '250px',
    sortable: true,
  },
];

export const detailProductColumns = [
  {
    key: 'product',
    label: 'Product',
    width: '180px',
    sortable: true,
  },
  {
    key: 'identifier',
    label: 'Identifier',
    width: '200px',
    sortable: true,
  },
  {
    key: 'actionStatus',
    label: 'Action Status',
    width: '170px',
    sortable: true,
    align: 'center',
  },
  {
    key: 'failedReason',
    label: 'Reason',
    width: '286px',
  },
];
