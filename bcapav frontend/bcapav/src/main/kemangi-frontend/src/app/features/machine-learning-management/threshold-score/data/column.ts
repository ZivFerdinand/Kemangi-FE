import { ColumnDef } from '@tanstack/table-core';
import { Threshold, ThresholdApproval } from '../interfaces';

export const thresholdScoreListColumns: ColumnDef<Threshold>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'modelName',
    header: 'Model Name',
    size: 150,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'modelDescription',
    header: 'Model Description',
    size: 300,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'productType',
    header: 'Product Type',
    size: 200,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'threshold',
    header: 'Threshold',
    size: 80,
    meta: {
      align: 'center',
    },
  },
  {
    accessorKey: 'lastApproval2Dt',
    header: 'Reviewer 2 Date',
    size: 185,
    meta: {
      sortable: true,
      align: 'center',
    },
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => row.original,
    size: 90,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'activeStatus',
    header: 'On/Off',
    size: 100,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
];

export const thresholdScoreReqListColumns: ColumnDef<ThresholdApproval>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'modelName',
    header: 'Model Name',
    size: 150,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'modelDescription',
    header: 'Model Description',
    size: 180,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'productType',
    header: 'Product Type',
    size: 240,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'threshold',
    header: 'Threshold',
    size: 140,
    meta: {
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
    header: 'Reject Notes',
    size: 180,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'approval2Date',
    header: 'Reviewer 2 Date',
    size: 185,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'requestType',
    header: 'Action Type',
    size: 180,
    meta: {
      align: 'left',
    },
  },
  {
    id: 'view',
    header: 'View',
    cell: ({ row }) => row.original,
    size: 80,
    meta: {
      align: 'left',
    },
  },
];

export const thresholdScoreApprRequestedListColumns: ColumnDef<ThresholdApproval>[] =
  [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.original,
      size: 50,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'modelName',
      header: 'Model Name',
      size: 150,
      meta: {
        align: 'left',
      },
    },
    {
      accessorKey: 'modelDescription',
      header: 'Model Description',
      size: 180,
      meta: {
        align: 'left',
      },
    },
    {
      accessorKey: 'productType',
      header: 'Product Type',
      size: 240,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'threshold',
      header: 'Threshold',
      size: 140,
      meta: {
        align: 'left',
      },
    },
    {
      accessorKey: 'requesterDate',
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
      size: 160,
      meta: {
        align: 'left',
      },
    },
    {
      accessorKey: 'rejectionNote',
      header: 'Reject Notes',
      size: 180,
      meta: {
        align: 'left',
      },
    },
    {
      accessorKey: 'approval1Date',
      header: 'Reviewer 1 Date',
      size: 185,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'approval2Date',
      header: 'Reviewer 2 Date',
      size: 185,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'requestType',
      header: 'Action Type',
      size: 180,
      meta: {
        align: 'left',
      },
    },
    {
      id: 'view',
      header: 'View',
      cell: ({ row }) => row.original,
      size: 80,
      meta: {
        align: 'left',
      },
    },
  ];

export const thresholdScoreApprTaskListColumns: ColumnDef<ThresholdApproval>[] =
  [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.original,
      size: 50,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'modelName',
      header: 'Model Name',
      size: 150,
      meta: {
        align: 'left',
      },
    },
    {
      accessorKey: 'modelDescription',
      header: 'Model Description',
      size: 180,
      meta: {
        align: 'left',
      },
    },
    {
      accessorKey: 'productType',
      header: 'Product Type',
      size: 240,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'threshold',
      header: 'Threshold',
      size: 140,
      meta: {
        align: 'left',
      },
    },
    {
      accessorKey: 'requesterName',
      header: 'Requested By',
      size: 185,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'requesterDate',
      header: 'Requested Date',
      size: 185,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'approval1Name',
      header: 'Reviewer 1 By',
      size: 185,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'approval1Date',
      header: 'Reviewer 1 Date',
      size: 185,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'requestType',
      header: 'Action Type',
      size: 180,
      meta: {
        align: 'left',
      },
    },
    {
      id: 'view',
      header: 'View',
      cell: ({ row }) => row.original,
      size: 80,
      meta: {
        align: 'left',
      },
    },
  ];

export const thresholdScoreDetailViewListColumns = [
  { key: 'no', label: 'No.', width: '50px', align: 'start' },
  {
    key: 'thresholdName',
    label: 'Threshold Name',
    width: '150px',
    align: 'start',
  },
  {
    key: 'thresholdDescription',
    label: 'Description',
    width: '185px',
  },
  {
    key: 'thresholdScore',
    label: 'Threshold Score',
    width: '135px',
  },
  {
    key: 'alert',
    label: 'Alert',
    width: '60px',
  },
  { key: 'activeStatus', label: 'On/Off', width: '100px' },
];

export const thresholdScoreDetailFormListColumns = [
  { key: 'no', label: 'No.', width: '50px', align: 'start' },
  {
    key: 'thresholdName',
    label: 'Threshold Name',
    width: '150px',
    align: 'start',
  },
  {
    key: 'thresholdDescription',
    label: 'Description',
    width: '185px',
  },
  {
    key: 'thresholdScore',
    label: 'Threshold Score',
    width: '135px',
  },
  {
    key: 'alert',
    label: 'Alert',
    width: '60px',
  },
  { key: 'activeStatus', label: 'On/Off', width: '100px' },
  { key: 'action', label: 'Action', width: '80px' },
];

export const thresholdScoreDetailListColumns = [
  { key: 'id', label: 'No.', width: '50px', align: 'start' },
  {
    key: 'thresholdName',
    label: 'Threshold Name',
    width: '150px',
    align: 'start',
  },
  {
    key: 'thresholdDescription',
    label: 'Description',
    width: '185px',
  },
  {
    key: 'thresholdScore',
    label: 'Threshold Score',
    width: '135px',
  },
  {
    key: 'alert',
    label: 'Alert',
    width: '60px',
  },
  { key: 'activeStatus', label: 'On/Off', width: '100px', sortable: true },
  { key: 'action', label: 'Action', width: '80px' },
];
