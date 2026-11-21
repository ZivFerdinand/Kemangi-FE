import { ColumnDef } from '@tanstack/table-core';
import { BinApproval } from '../domain/models/bin-approval.model';

export const binApprRequestedListColumns: ColumnDef<BinApproval>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'center' },
  },
  {
    accessorKey: 'binNumber',
    header: 'BIN',
    size: 224,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'binDescription',
    header: 'Description',
    size: 224,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'requesterName',
    header: 'Requested By',
    size: 170,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'createdDt',
    header: 'Requested Date',
    size: 185,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'approvalStatus',
    header: 'Approval Status',
    size: 142,
    meta: {
      align: 'center',
    },
  },
  {
    accessorKey: 'rejectionNote',
    header: 'Rejection Notes',
    size: 170,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'approverName',
    header: 'Reviewed By',
    size: 170,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'approvalDate',
    header: 'Reviewed Date',
    size: 190,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'requestType',
    header: 'Action Type',
    size: 150,
    meta: {
      align: 'left',
    },
  },
  {
    id: 'view',
    header: 'View',
    cell: ({ row }) => row.original,
    size: 90,
    meta: {
      align: 'center',
    },
  },
];

export const binApprTaskListColumns: ColumnDef<BinApproval>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'center' },
  },
  {
    accessorKey: 'binNumber',
    header: 'BIN',
    size: 224,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'binDescription',
    header: 'Description',
    size: 224,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'requesterName',
    header: 'Requested By',
    size: 170,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'createdDt',
    header: 'Requested Date',
    size: 185,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'requestType',
    header: 'Action Type',
    size: 150,
    meta: {
      align: 'left',
    },
  },
  {
    id: 'view',
    header: 'View',
    cell: ({ row }) => row.original,
    size: 90,
    meta: {
      align: 'center',
    },
  },
];
