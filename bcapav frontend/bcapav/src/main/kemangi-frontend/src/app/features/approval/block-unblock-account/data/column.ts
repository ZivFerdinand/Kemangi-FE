import { ColumnDef } from '@tanstack/angular-table';
import { BlockUnblockAccountApproval } from '../domain/models/block-unblock-approval.model';

export const blockUnblockDetailsDoneRequestedListColumns = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
  },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '200px',
    sortable: true,
  },
  {
    key: 'statusType',
    label: 'Status Type',
    width: '200px',
  },
  {
    key: 'statusCode',
    label: 'Status Code',
    width: '200px',
  },
  {
    key: 'statusReason',
    label: 'Account Status Reason',
    width: '243px',
  },
  {
    key: 'additionalInformation',
    label: 'Additional Information',
    width: '288px',
  },
  {
    key: 'processStatus',
    label: 'Status',
    width: '168px',
  },
  {
    key: 'processReason',
    label: 'Status Description',
    width: '440px',
  },
];

export const blockUnblockDetailsPendingRequestedListColumns = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
  },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '224px',
  },
  {
    key: 'statusType',
    label: 'Status Type',
    width: '224px',
  },
  {
    key: 'statusCode',
    label: 'Status Code',
    width: '170px',
  },
  {
    key: 'statusReason',
    label: 'Account Status Reason',
    width: '380px',
  },
  {
    key: 'additionalInformation',
    label: 'Additional Information',
    width: '380px',
  },
  {
    key: 'invalidReason',
    label: 'Invalid Reason',
    width: '381px',
  },
];

export const blockUnblockDetailsRejectedRequestedListColumns = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
  },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '224px',
  },
  {
    key: 'statusType',
    label: 'Status Type',
    width: '224px',
  },
  {
    key: 'statusCode',
    label: 'Status Code',
    width: '170px',
  },
  {
    key: 'statusReason',
    label: 'Account Status Reason',
    width: '380px',
  },
  {
    key: 'additionalInformation',
    label: 'Additional Information',
    width: '380px',
  },
  {
    key: 'invalidReason',
    label: 'Invalid Reason',
    width: '381px',
  },
];

export const blockUnblockAccountApprRequestedListColumns: ColumnDef<BlockUnblockAccountApproval>[] =
  [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.original,
      size: 50,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      size: 171,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'fileName',
      header: 'File Name',
      size: 204,
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
      size: 180,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'totalInvalidData',
      header: 'Invalid Records',
      size: 152,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'approvalStatus',
      header: 'Approval Status',
      size: 180,
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
      size: 180,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'totalFailedData',
      header: 'Failed Records',
      size: 150,
      meta: {
        align: 'left',
        highlight: (row: BlockUnblockAccountApproval) =>
          row.processStatus === 'DONE' &&
          row.retryFlag === true &&
          (row.totalFailedData ?? 0) > 0,
      },
    },
    {
      accessorKey: 'rejectionNote',
      header: 'Rejection Note',
      size: 191,
      meta: { align: 'left' },
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
      accessorKey: 'approverName',
      header: 'Reviewed By',
      size: 150,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'approvalDate',
      header: 'Reviewed Date',
      size: 192,
      meta: {
        sortable: true,
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

export const blockUnblockAccountApprTaskListColumns: ColumnDef<BlockUnblockAccountApproval>[] =
  [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.original,
      size: 50,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      size: 171,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'fileName',
      header: 'File Name',
      size: 204,
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
      size: 180,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'totalInvalidData',
      header: 'Invalid Records',
      size: 152,
      meta: { align: 'left' },
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
      id: 'view',
      header: 'View',
      cell: ({ row }) => row.original,
      size: 90,
      meta: {
        align: 'center',
      },
    },
  ];
