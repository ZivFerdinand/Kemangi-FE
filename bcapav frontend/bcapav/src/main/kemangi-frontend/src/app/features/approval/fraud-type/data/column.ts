import { ColumnDef } from '@tanstack/table-core';
import { FraudTypeApproval } from '../domain/models/fraud-type-approval.model';

export const fraudTypeApprRequestedListColumns: ColumnDef<FraudTypeApproval>[] =
  [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.original,
      size: 50,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'fraudType',
      header: 'Fraud Type',
      size: 224,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'description',
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

export const fraudTypeApprTaskListColumns: ColumnDef<FraudTypeApproval>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'center' },
  },
  {
    accessorKey: 'fraudType',
    header: 'Fraud Type',
    size: 509,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: 509,
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
