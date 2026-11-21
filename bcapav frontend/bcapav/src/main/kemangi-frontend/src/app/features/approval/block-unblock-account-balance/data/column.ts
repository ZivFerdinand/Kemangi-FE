import { ColumnDef } from '@tanstack/angular-table';
import { BlockUnblockAccountBalanceApproval } from '../domain/models/block-unblock-account-balance-approval.model';
import { formatDateId } from '../../../../shared/utils/date.util';

export const blockUnblockAccountBalanceApprTaskListColumns: ColumnDef<BlockUnblockAccountBalanceApproval>[] =
  [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.original,
      size: 50,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'accountType',
      header: 'Account Type',
      size: 150,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      size: 250,
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

export const blockUnblockAccountBalanceApprRequestedListColumns: ColumnDef<BlockUnblockAccountBalanceApproval>[] =
  [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.original,
      size: 50,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'accountType',
      header: 'Account Type',
      size: 150,
      meta: { align: 'left' },
    },
    {
      accessorKey: 'action',
      header: 'Action',
      size: 250,
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
      meta: {
        align: 'left',
        highlight: (row: BlockUnblockAccountBalanceApproval) =>
          row.processStatus === 'DONE' &&
          row.retryFlag === true &&
          (row.totalFailedData ?? 0) > 0,
      },
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
      // cell: (info) => {
      //   const value = info.getValue<string | Date | number>();
      //   return value ? formatDateId(value) : '-';
      // },
    },
    {
      accessorKey: 'approverName',
      header: 'Reviewed By',
      size: 231,
      meta: {
        sortable: true,
        align: 'left',
      },
      // cell: (info) => {
      //   const value = info.getValue<string | null>();
      //   return value ? value : '-';
      // },
    },
    {
      accessorKey: 'approvalDate',
      header: 'Reviewed Date',
      size: 200,
      meta: {
        sortable: true,
        align: 'left',
      },
      // cell: (info) => {
      //   const value = info.getValue<string | Date | number>();
      //   return value ? formatDateId(value) : '-';
      // },
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

export const blockUnblockAccountBalanceDataColumns = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
  },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '1,sortable: true71px',
  },
  {
    key: 'statusType',
    label: 'Status Type',
    width: '204px',
  },
  {
    key: 'statusCode',
    label: 'Status Code',
    width: '180px',
  },
  {
    key: 'reason',
    label: 'Account Status Reason',
    width: '180px',
  },
];

export const blockAccountBalanceDataIdsColumnsTypeII = [
  { key: 'no', label: 'No', width: '50px' },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '213.75px',
    sortable: true,
  },
  { key: 'amount', label: 'Amount', width: '213.75px' },
  { key: 'expiredDate', label: 'Expired Date', width: '213.75px' },
  { key: 'blockReason', label: 'Block Reason', width: '213.75px' },
  { key: 'blockStatus', label: 'Block Status', width: '213.75px' },
  { key: 'status', label: 'Status', width: '213.75px' },
  { key: 'statusDescription', label: 'Status Description', width: '213.75px' },
  { key: 'requestId', label: 'Request ID', width: '213.75px' },
];

export const unblockAccountBalanceDataIdsColumnsTypeII = [
  { key: 'no', label: 'No', width: '50px' },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '244.29px',
    sortable: true,
  },
  { key: 'amount', label: 'Amount', width: '244.29px' },
  { key: 'blockReason', label: 'Block Reason', width: '244.29px' },
  { key: 'blockStatus', label: 'Block Status', width: '244.29px' },
  { key: 'status', label: 'Status', width: '244.29px' },
  { key: 'statusDescription', label: 'Status Description', width: '244.29px' },
  { key: 'requestId', label: 'Request ID', width: '244.29px' },
];

export const blockAccountBalanceDataCellColumnsTypeII = [
  { key: 'no', label: 'No', width: '50px' },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '244.29px',
    sortable: true,
  },
  { key: 'currency', label: 'Currency', width: '244.29px' },
  { key: 'amount', label: 'Amount', width: '244.29px' },
  { key: 'blockReason', label: 'Block Reason', width: '244.29px' },
  { key: 'status', label: 'Status', width: '244.29px' },
  { key: 'statusDescription', label: 'Status Description', width: '244.29px' },
  { key: 'requestId', label: 'Request ID', width: '244.29px' },
];

export const unblockAccountBalanceDataCellColumnsTypeII = [
  { key: 'no', label: 'No', width: '50px' },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '244.29px',
    sortable: true,
  },
  { key: 'currency', label: 'Currency', width: '244.29px' },
  { key: 'amount', label: 'Amount', width: '244.29px' },
  { key: 'blockReason', label: 'Block Reason', width: '350px' },
  { key: 'invalidReason', label: 'Invalid Reason', width: '350px' },
  { key: 'requestId', label: 'Request ID', width: '244.29px' },
];

export const unblockAccountBalanceDataCellColumnsTypeIII = [
  { key: 'no', label: 'No', width: '50px' },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '244.29px',
    sortable: true,
  },
  { key: 'currency', label: 'Currency', width: '244.29px' },
  { key: 'blockReason', label: 'Block Reason', width: '244.29px' },
  { key: 'blockStatus', label: 'Block Status', width: '244.29px' },
  { key: 'status', label: 'Status', width: '244.29px' },
  { key: 'statusReason', label: 'Status Reason', width: '244.29px' },
  { key: 'requestId', label: 'Request ID', width: '244.29px' },
];

export const blockAccountBalanceAccountTypeColumnsTypeI = [
  { key: 'no', label: 'No', width: '50px' },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '244.29px',
    sortable: true,
  },
  { key: 'amount', label: 'Amount', width: '244.29px' },
  { key: 'expiredDate', label: 'Expired Date', width: '244.29px' },
  { key: 'blockReason', label: 'Block Reason', width: '244.29px' },
  { key: 'blockStatus', label: 'Block Status', width: '244.29px' },
  { key: 'status', label: 'Status', width: '244.29px' },
  { key: 'reason', label: 'Status Description', width: '244.29px' },
  { key: 'blockRequestId', label: 'Request ID', width: '244.29px' },
];

export const blockAccountBalanceAccountTypeColumnsTypeII = [
  { key: 'no', label: 'No', width: '50px' },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '244.29px',
    sortable: true,
  },
  { key: 'amount', label: 'Amount', width: '244.29px' },
  { key: 'expiredDate', label: 'Expired Date', width: '244.29px' },
  { key: 'blockReason', label: 'Block Reason', width: '244.29px' },
  { key: 'blockStatus', label: 'Block Status', width: '244.29px' },
  { key: 'reason', label: 'Invalid Reason', width: '350px' },
];

export const unblockAccountBalanceAccountTypeColumnsTypeI = [
  { key: 'no', label: 'No', width: '50px' },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '244.29px',
    sortable: true,
  },
  { key: 'amount', label: 'Amount', width: '244.29px' },
  { key: 'blockReason', label: 'Block Reason', width: '244.29px' },
  { key: 'blockStatus', label: 'Block Status', width: '244.29px' },
  { key: 'status', label: 'Status', width: '244.29px' },
  { key: 'reason', label: 'Status Description', width: '244.29px' },
  { key: 'requestId', label: 'Request ID', width: '244.29px' },
];

export const unblockAccountBalanceAccountTypeColumnsTypeII = [
  { key: 'no', label: 'No', width: '50px' },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '244.29px',
    sortable: true,
  },
  { key: 'amount', label: 'Amount', width: '244.29px' },
  { key: 'blockReason', label: 'Block Reason', width: '244.29px' },
  { key: 'blockStatus', label: 'Block Status', width: '244.29px' },
  { key: 'reason', label: 'Invalid Reason', width: '350px' },
  { key: 'requestId', label: 'Request ID', width: '244.29px' },
];

export const blockAccountBalancePocketTypeColumnsTypeI = [
  { key: 'no', label: 'No', width: '50px' },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '244.29px',
    sortable: true,
  },
  { key: 'currency', label: 'Currency', width: '244.29px' },
  { key: 'amount', label: 'Amount', width: '244.29px' },
  { key: 'blockReason', label: 'Block Reason', width: '244.29px' },
  { key: 'blockStatus', label: 'Block Status', width: '244.29px' },
  { key: 'status', label: 'Status', width: '244.29px' },
  { key: 'reason', label: 'Status Description', width: '244.29px' },
  { key: 'blockRequestId', label: 'Request ID', width: '244.29px' },
];

export const blockAccountBalancePocketTypeColumnsTypeII = [
  { key: 'no', label: 'No', width: '50px' },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '244.29px',
    sortable: true,
  },
  { key: 'currency', label: 'Currency', width: '244.29px' },
  { key: 'amount', label: 'Amount', width: '244.29px' },
  { key: 'blockReason', label: 'Block Reason', width: '244.29px' },
  { key: 'blockStatus', label: 'Block Status', width: '244.29px' },
  { key: 'reason', label: 'Invalid Reason', width: '350px' },
];

export const unblockAccountBalancePocketTypeColumnsTypeI = [
  { key: 'no', label: 'No', width: '50px' },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '244.29px',
    sortable: true,
  },
  { key: 'currency', label: 'Currency', width: '244.29px' },
  { key: 'blockReason', label: 'Block Reason', width: '244.29px' },
  { key: 'reason', label: 'Status Description', width: '244.29px' },
  { key: 'requestId', label: 'Request ID', width: '244.29px' },
];

export const unblockAccountBalancePocketTypeColumnsTypeII = [
  { key: 'no', label: 'No', width: '50px' },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '244.29px',
    sortable: true,
  },
  { key: 'currency', label: 'Currency', width: '244.29px' },

  { key: 'blockReason', label: 'Block Reason', width: '244.29px' },
  { key: 'status', label: 'Status', width: '244.29px' },
  { key: 'reason', label: 'Status Description', width: '244.29px' },
  { key: 'requestId', label: 'Request ID', width: '244.29px' },
];

export const unblockAccountBalancePocketTypeColumnsTypeIII = [
  { key: 'no', label: 'No', width: '50px' },
  {
    key: 'accountNumber',
    label: 'Account Number',
    width: '244.29px',
    sortable: true,
  },
  { key: 'currency', label: 'Currency', width: '244.29px' },
  { key: 'blockReason', label: 'Block Reason', width: '244.29px' },
  { key: 'reason', label: 'Invalid Reason', width: '350px' },
  { key: 'requestId', label: 'Request ID', width: '244.29px' },
];
