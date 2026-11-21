import { ColumnDef } from '@tanstack/table-core';
import { DataGroupApproval } from '../domain/models/data-group-approval.model';

export const dataGroupApprTaskListColumns: ColumnDef<DataGroupApproval>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'center' },
  },
  {
    accessorKey: 'dataGroupId',
    header: 'Data Group ID',
    size: 160,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'name',
    header: 'Data Group Name',
    size: 210,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'description',
    header: 'Data Group Description',
    size: 380,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'ruleCount',
    header: 'Rule Relation',
    size: 140,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'requesterName',
    header: 'Requested By',
    size: 180,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'requestDate',
    header: 'Requested Date',
    size: 185,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'approver1Name',
    header: 'Review 1 By',
    size: 180,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'approval1Date',
    header: 'Review 1 Date',
    size: 190,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'requestType',
    header: 'Action Type',
    size: 170,
    meta: {
      align: 'left',
    },
  },
  {
    id: 'view',
    header: 'View',
    cell: ({ row }) => row.original,
    size: 100,
    meta: {
      align: 'center',
    },
  },
];

export const dataGroupApprRequestedListColumns: ColumnDef<DataGroupApproval>[] =
  [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.original,
      size: 50,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'dataGroupId',
      header: 'Data Group ID',
      size: 150,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'name',
      header: 'Data Group Name',
      size: 210,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'description',
      header: 'Data Group Description',
      size: 380,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'ruleCount',
      header: 'Rule Relation',
      size: 140,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'dynamicWatchList',
      header: 'Dynamic Watch List',
      size: 185,
      meta: {
        sortable: true,
        align: 'center',
      },
    },
    {
      accessorKey: 'requesterName',
      header: 'Requested By',
      size: 180,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'requestDate',
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
      size: 170,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'rejectionNote',
      header: 'Reject Notes',
      size: 170,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'approver1Name',
      header: 'Review 1 By',
      size: 180,
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
      size: 180,
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
      size: 150,
      meta: {
        align: 'left',
      },
    },
    {
      accessorKey: 'activeStatus',
      header: 'On/Off',
      size: 80,
      meta: {
        align: 'left',
      },
    },
    {
      id: 'view',
      header: 'View',
      cell: ({ row }) => row.original,
      size: 100,
      meta: {
        align: 'center',
      },
    },
  ];

export const dataGroupRuleRelationColumns = [
  { key: 'no', label: 'No.', width: '70px', align: 'start' },
  {
    key: 'name',
    label: 'Rule Name',
    width: 'auto',
    align: 'start',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    width: '200px',
    align: 'start',
    sortable: true,
  },
];

export const dataGroupDetailValueColumns = [
  { key: 'no', label: 'No.', width: '70px', align: 'start' },
  {
    key: 'value',
    label: 'Value',
    width: 'auto',
    align: 'start',
    sortable: true,
  },
];
