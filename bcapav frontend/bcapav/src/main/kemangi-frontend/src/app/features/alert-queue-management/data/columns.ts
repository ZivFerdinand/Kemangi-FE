import { ColumnDef } from '@tanstack/angular-table';
import { AlertQueue, AssignTo } from '../domain/alert-queue.model';
import { AlertQueueApproval } from '../../approval/alert-queue-management/domain/alert-queue.model';

export const alertQueueManagementListColumns = [
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
    key: 'lastUpdatedByName',
    label: 'Requested By',
    width: '150px',
    sortable: true,
  },
  {
    key: 'lastUpdatedDt',
    label: 'Requested Date',
    width: '192px',
    type: 'date',
    sortable: true,
  },
  {
    key: 'lastApproval1Name',
    label: 'Review 1 By',
    width: '150px',
    sortable: true,
  },
  {
    key: 'lastApproval1Dt',
    label: 'Review 1 Date',
    width: '192px',
    type: 'date',
    sortable: true,
  },
  {
    key: 'lastApproval2Name',
    label: 'Review 2 By',
    width: '150px',
    sortable: true,
  },
  {
    key: 'lastApproval2Dt',
    label: 'Review 2 Date',
    width: '192px',
    type: 'date',
    sortable: true,
  },
  {
    key: 'action',
    label: 'Action',
    width: '100px',
  },
  {
    key: 'activeStatus',
    label: 'On/Off',
    width: '110px',
    sortable: true,
  },
];

export const alertQueueManagementRequestedListColumns = [
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
    width: '120px',
  },
  {
    key: 'view',
    label: 'View',
    width: '60px',
  },
];

export const assignToDisplayListColumns = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
  },
  {
    key: 'userId',
    label: 'User ID',
    width: '344px',
    sortable: true,
  },
  {
    key: 'userName',
    label: 'User Name',
    width: '344px',
    sortable: true,
  },
  {
    key: 'roleName',
    label: 'Role Name',
    width: '344px',
    sortable: true,
  },
];

export const assignToActionListColumns = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
  },
  {
    key: 'userId',
    label: 'User ID',
    width: '304px',
    sortable: true,
  },
  {
    key: 'userName',
    label: 'User Name',
    width: '304px',
    sortable: true,
  },
  {
    key: 'roleName',
    label: 'Role Name',
    width: '304px',
    sortable: true,
  },
  {
    key: 'checkbox',
    label: 'Checkbox',
    width: '120px',
  },
];

export const alertQueueListColumns: ColumnDef<AlertQueue>[] = [
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
    accessorKey: 'lastUpdatedByName',
    header: 'Requested By',
    size: 150,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'lastUpdatedDt',
    header: 'Requested Date',
    size: 192,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'lastApproval1Name',
    header: 'Review 1 By',
    size: 150,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'lastApproval1Dt',
    header: 'Review 1 Date',
    size: 192,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'lastApproval2Name',
    header: 'Review 2 By',
    size: 150,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'lastApproval2Dt',
    header: 'Review 2 Date',
    size: 192,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => row.original,
    size: 100,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'activeStatus',
    header: 'On/Off',
    size: 110,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
];

export const alertQueueRequestedListColumns: ColumnDef<AlertQueueApproval>[] = [
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

export const assignToColumns: ColumnDef<AssignTo>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'userId',
    header: 'User ID',
    size: 344,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'userName',
    header: 'User Name',
    size: 344,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'roleName',
    header: 'Role Name',
    size: 344,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
];
