import { ColumnDef } from '@tanstack/table-core';
import { RoleApproval } from '../domain/models/role-approval.model';

export const roleApprTaskListColumns: ColumnDef<RoleApproval>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'center' },
  },
  {
    accessorKey: 'roleId',
    header: 'Role ID',
    size: 140,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'roleName',
    header: 'Role Name',
    size: 180,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'roleDescription',
    header: 'Description',
    size: 330,
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
    size: 170,
    meta: {
      align: 'left',
    },
  },
  {
    id: 'view',
    header: 'View',
    cell: ({ row }) => row.original,
    size: 120,
    meta: {
      align: 'center',
    },
  },
];

export const roleApprRequestedListColumns: ColumnDef<RoleApproval>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'center' },
  },
  {
    accessorKey: 'roleId',
    header: 'Role ID',
    size: 120,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'roleName',
    header: 'Role Name',
    size: 150,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'roleDescription',
    header: 'Description',
    size: 170,
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
    accessorKey: 'createdDt',
    header: 'Requested Date',
    size: 200,
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
    header: 'Rejection Notes',
    size: 140,
    meta: {
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
    size: 200,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'requestType',
    header: 'Action Type',
    size: 140,
    meta: {
      align: 'left',
    },
  },
  {
    id: 'view',
    header: 'View',
    cell: ({ row }) => row.original,
    size: 110,
    meta: {
      align: 'center',
    },
  },
];
