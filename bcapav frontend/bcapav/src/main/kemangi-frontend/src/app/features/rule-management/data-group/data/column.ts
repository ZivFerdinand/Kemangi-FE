import { DataGroup } from '../domain/models/data-group.model';
import { DataGroupApproval } from '../../../approval/data-group/domain/models/data-group-approval.model';
import { ColumnDef } from '@tanstack/table-core';

export const dataGroupListColumns: ColumnDef<DataGroup>[] = [
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
    size: 180,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'description',
    header: 'Data Group Description',
    size: 240,
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
    size: 200,
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
    size: 90,
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
];

export const dataGroupDraftListColumns: ColumnDef<DataGroupApproval>[] = [
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
    size: 180,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'description',
    header: 'Data Group Description',
    size: 240,
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
    accessorKey: 'requestDate',
    header: 'Requested Date',
    size: 200,
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
    size: 130,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'approvalStatus',
    header: 'Status',
    size: 125,
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
    size: 80,
    meta: {
      align: 'left',
    },
  },
];

export const dataGroupReqListColumns: ColumnDef<DataGroupApproval>[] = [
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
    size: 180,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'description',
    header: 'Data Group Description',
    size: 240,
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
    size: 200,
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
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'rejectionNote',
    header: 'Reject Notes',
    size: 180,
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
    size: 130,
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
  {
    accessorKey: 'activeStatus',
    header: 'On/Off',
    size: 80,
    meta: {
      align: 'left',
    },
  },
];

export const ruleRelationListColumns = [
  { key: 'no', label: 'No.', width: '70px', align: 'start' },
  {
    key: 'ruleName',
    label: 'Rule Name',
    width: 'auto',
    sortable: true,
  },
  { key: 'activeStatus', label: 'Status', width: '200px', sortable: true },
];

export const valueListColumns = [
  { key: 'no', label: 'No.', width: '70px', align: 'start' },
  {
    key: 'value',
    label: 'Value',
    width: 'auto',
    sortable: true,
  },
];

export const valuesColumns = [
  { key: 'no', label: 'No.', width: '70px', align: 'start' },
  {
    key: 'value',
    label: 'Value',
    width: 'auto',
    sortable: true,
  },
  {
    key: 'action',
    label: 'Action',
    width: '90px',
  },
];

export const valuesColumnsDataGroupDetails = [
  { key: 'no', label: 'No.', width: '70px', align: 'start' },
  {
    key: 'value',
    label: 'Value',
    width: 'auto',
    sortable: true,
  },
];
