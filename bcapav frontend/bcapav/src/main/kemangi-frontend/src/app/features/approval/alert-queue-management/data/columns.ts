import { ColumnDef } from '@tanstack/table-core';
import { AlertQueueApproval } from '../domain/alert-queue.model';

export const alertQueueManagementApprovalTaskListColumns = [
  {
    key: 'queueId',
    label: 'Queue ID',
    width: '120px',
  },
  {
    key: 'name',
    label: 'Queue Name',
    width: '180px',
  },
  {
    key: 'description',
    label: 'Queue Description',
    width: '200px',
  },
  {
    key: 'assignTo',
    label: 'Assign To',
    width: '90px',
    align: 'center',
  },
  {
    key: 'requesterName',
    label: 'Requested By',
    width: '150px',
    sortable: true,
  },
  {
    key: 'requestDate',
    label: 'Requested Date',
    width: '192px',
    type: 'date',
    sortable: true,
  },

  {
    key: 'approver1Name',
    label: 'Review 1 By',
    width: '150px',
    sortable: true,
  },
  {
    key: 'approval1Date',
    label: 'Review 1 Date',
    width: '192px',
    type: 'date',
    sortable: true,
  },

  {
    key: 'requestType',
    label: 'Action Type',
    width: '115px',
  },
  {
    key: 'activeStatus',
    label: 'On/Off',
    width: '100px',
    sortable: true,
  },
  {
    key: 'view',
    label: 'View',
    width: '60px',
  },
];

export const alertQueueManagementApprovalRequestedListColumns = [
  {
    key: 'queueId',
    label: 'Queue ID',
    width: '120px',
  },
  {
    key: 'name',
    label: 'Queue Name',
    width: '180px',
  },
  {
    key: 'description',
    label: 'Queue Description',
    width: '200px',
  },
  {
    key: 'assignTo',
    label: 'Assign To',
    width: '90px',
    align: 'center',
  },
  {
    key: 'requesterName',
    label: 'Requested By',
    width: '150px',
    sortable: true,
  },
  {
    key: 'requestDate',
    label: 'Requested Date',
    width: '192px',
    type: 'date',
    sortable: true,
  },
  {
    key: 'approvalStatus',
    label: 'Approval Status',
    width: '160px',
  },
  {
    key: 'rejectionNote',
    label: 'Rejection Notes',
    width: '140px',
  },
  {
    key: 'approver1Name',
    label: 'Review 1 By',
    width: '150px',
    sortable: true,
  },
  {
    key: 'approval1Date',
    label: 'Review 1 Date',
    width: '192px',
    type: 'date',
    sortable: true,
  },
  {
    key: 'approver2Name',
    label: 'Review 2 By',
    width: '150px',
    sortable: true,
  },
  {
    key: 'approval2Date',
    label: 'Review 2 Date',
    width: '192px',
    type: 'date',
    sortable: true,
  },
  {
    key: 'requestType',
    label: 'Action Type',
    width: '100px',
  },
  {
    key: 'view',
    label: 'View',
    width: '60px',
  },
];

export const alertQueueApprovalTaskListColumns: ColumnDef<AlertQueueApproval>[] =
  [
    {
      accessorKey: 'queueId',
      header: 'Queue ID',
      size: 120,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'name',
      header: 'Queue Name',
      size: 180,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'description',
      header: 'Queue Description',
      size: 200,
      meta: { align: 'left' },
    },
    {
      id: 'assignTo',
      header: 'Assign To',
      cell: ({ row }) => row.original,
      size: 90,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'requesterName',
      header: 'Requested By',
      size: 150,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'requestDate',
      header: 'Requested Date',
      size: 192,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'approver1Name',
      header: 'Review 1 By',
      size: 150,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'approval1Date',
      header: 'Review 1 Date',
      size: 192,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'requestType',
      header: 'Action Type',
      size: 115,
      meta: {
        align: 'left',
      },
    },
    {
      accessorKey: 'activeStatus',
      header: 'On/Off',
      size: 100,
      meta: {
        align: 'left',
      },
    },
    {
      id: 'view',
      header: 'View',
      cell: ({ row }) => row.original,
      size: 60,
      meta: {
        align: 'left',
      },
    },
  ];

export const alertQueueApprovalRequestedListColumns: ColumnDef<AlertQueueApproval>[] =
  [
    {
      accessorKey: 'queueId',
      header: 'Queue ID',
      size: 120,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'name',
      header: 'Queue Name',
      size: 180,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'description',
      header: 'Queue Description',
      size: 200,
      meta: { align: 'left' },
    },
    {
      id: 'assignTo',
      header: 'Assign To',
      cell: ({ row }) => row.original,
      size: 90,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'requesterName',
      header: 'Requested By',
      size: 150,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'requestDate',
      header: 'Requested Date',
      size: 192,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'approvalStatus',
      header: 'Approval Status',
      size: 160,
      meta: {
        align: 'left',
      },
    },
    {
      accessorKey: 'rejectionNote',
      header: 'Rejection Notes',
      size: 140,
      meta: {
        align: 'left',
      },
    },
    {
      accessorKey: 'approver1Name',
      header: 'Review 1 By',
      size: 150,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'approval1Date',
      header: 'Review 1 Date',
      size: 192,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'approver2Name',
      header: 'Review 2 By',
      size: 150,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'approval2Date',
      header: 'Review 2 Date',
      size: 192,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'requestType',
      header: 'Action Type',
      size: 120,
      meta: {
        align: 'left',
      },
    },
    {
      id: 'view',
      header: 'View',
      cell: ({ row }) => row.original,
      size: 60,
      meta: {
        align: 'left',
      },
    },
  ];
