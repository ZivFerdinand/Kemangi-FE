import { ColumnDef } from '@tanstack/angular-table';
import { SMCApproval } from '../domain/models/smc-approval.model';
import { formatDateId } from '../../../../shared/utils/date.util';

export const smcApprTaskListColumns: ColumnDef<SMCApproval>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'fileName',
    header: 'File Name',
    size: 250,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'totalData',
    header: 'Total Records',
    size: 180,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'totalValidData',
    header: 'Valid Records',
    size: 150,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'totalInvalidData',
    header: 'Invalid Records',
    size: 150,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'requesterName',
    header: 'Requested By',
    size: 231,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'requestDate',
    header: 'Requested Date',
    size: 200,
    meta: {
      sortable: true,
      align: 'left',
    },
    cell: (info) => {
      const value = info.getValue<string | Date | number>();
      return value ? formatDateId(value) : '-';
    },
  },
  {
    id: 'view',
    header: 'View',
    cell: ({ row }) => row.original,
    size: 214,
    meta: {
      align: 'center',
    },
  },
];

export const smcApprRequestedListColumns: ColumnDef<SMCApproval>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'fileName',
    header: 'File Name',
    size: 250,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'totalData',
    header: 'Total Records',
    size: 180,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'totalValidData',
    header: 'Valid Records',
    size: 150,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'totalInvalidData',
    header: 'Invalid Records',
    size: 150,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'approvalStatus',
    header: 'Approval Status',
    size: 150,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'processStatus',
    header: 'Process Status',
    size: 150,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'totalSuccessData',
    header: 'Success Records',
    size: 150,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'totalFailedData',
    header: 'Failed Records',
    size: 150,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'rejectionNote',
    header: 'Rejection Note',
    size: 150,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'requesterName',
    header: 'Requested By',
    size: 231,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'requestDate',
    header: 'Requested Date',
    size: 200,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'approverName',
    header: 'Reviewed By',
    size: 231,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'approvalDate',
    header: 'Reviewed Date',
    size: 200,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    id: 'view',
    header: 'View',
    cell: ({ row }) => row.original,
    size: 214,
    meta: {
      align: 'center',
    },
  },
];

// process status PENDING
export const smcDataColumns = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
  },
  {
    key: 'cardNumber',
    label: 'Card Number',
    width: '204px',
    sortable: true,
  },
  {
    key: 'domesticFlag',
    label: 'Domestic Transaction',
    width: '180px',
  },
  {
    key: 'internationalFlag',
    label: 'International Transaction',
    width: '180px',
  },
  {
    key: 'ecommerceFlag',
    label: 'E-commerce Transaction',
    width: '180px',
  },
  {
    key: 'contactlessFlag',
    label: 'Contactless Transaction',
    width: '180px',
  },
  {
    key: 'invalidReason',
    label: 'Invalid Reason',
    width: '180px',
  },
];

// process status DONE
export const smcDataColumnsTypeB = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
  },
  {
    key: 'cardNumber',
    label: 'Card Number',
    width: '204px',
    sortable: true,
  },
  {
    key: 'domesticFlag',
    label: 'Domestic Transaction',
    width: '180px',
  },
  {
    key: 'internationalFlag',
    label: 'International Transaction',
    width: '180px',
  },
  {
    key: 'ecommerceFlag',
    label: 'E-commerce Transaction',
    width: '180px',
  },
  {
    key: 'contactlessFlag',
    label: 'Contactless Transaction',
    width: '180px',
  },
  {
    key: 'processStatus',
    label: 'Status',
    width: '180px',
  },
  {
    key: 'processReason',
    label: 'Status Description',
    width: '180px',
  },
];
