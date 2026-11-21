import { ColumnDef } from '@tanstack/table-core';
import { Note } from '../domain';
import { NoteApproval } from '../../../approval/notes/domain/models/notes-approval.model';

export const noteListColumns: ColumnDef<Note>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'center' },
  },
  {
    accessorKey: 'note',
    header: 'Notes',
    size: 390,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: 390,
    meta: {
      align: 'left',
    },
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
    size: 185,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'lastApprovalName',
    header: 'Reviewed By',
    size: 160,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'lastApprovalDt',
    header: 'Reviewed Date',
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
    size: 90,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'activeStatus',
    header: 'On/Off',
    size: 110,
    meta: {
      align: 'left',
    },
  },
];

export const noteRequestedListColumns: ColumnDef<NoteApproval>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'center' },
  },
  {
    accessorKey: 'note',
    header: 'Notes',
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
    size: 190,
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
