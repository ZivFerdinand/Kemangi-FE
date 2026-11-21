import { ColumnDef } from '@tanstack/table-core';
import { Rule } from '../domain/rule.model';
import { RuleApproval } from '../../../approval/rule/domain/models/rule-approval.model';

export const ruleCurrentListColumns = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
  },
  { key: 'ruleId', label: 'Rule ID', width: '180px', sortable: true },
  { key: 'ruleName', label: 'Rule Name', width: '180px', sortable: true },
  { key: 'ruleDescShort', label: 'Description', width: '200px' },
  {
    key: 'ruleStart',
    label: 'Start Date',
    width: '190px',
    sortable: true,
    type: 'date',
    dateFormat: 'dd-MMM-yyyy',
  },
  {
    key: 'ruleEnd',
    label: 'End Date',
    width: '190px',
    sortable: true,
    type: 'date',
    dateFormat: 'dd-MMM-yyyy',
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
    width: '200px',
    sortable: true,
    type: 'date',
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
    width: '190px',
    sortable: true,
    type: 'date',
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
    width: '190px',
    sortable: true,
    type: 'date',
  },
  { key: 'action', label: 'Action', width: '90px' },
  { key: 'activeStatus', label: 'On/Off', width: '80px' },
];

export const ruleExpiredSoonListColumns = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
  },
  { key: 'ruleId', label: 'Rule ID', width: '180px', sortable: true },
  { key: 'ruleName', label: 'Rule Name', width: '180px', sortable: true },
  { key: 'ruleDescShort', label: 'Description', width: '200px' },
  {
    key: 'ruleStart',
    label: 'Start Date',
    width: '185px',
    sortable: true,
    type: 'date',
    dateFormat: 'dd-MMM-yyyy',
  },
  {
    key: 'ruleEnd',
    label: 'End Date',
    width: '185px',
    sortable: true,
    type: 'date',
    dateFormat: 'dd-MMM-yyyy',
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
    width: '200px',
    sortable: true,
    type: 'date',
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
    width: '190px',
    sortable: true,
    type: 'date',
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
    width: '190px',
    sortable: true,
    type: 'date',
  },
  { key: 'action', label: 'Action', width: '90px' },
  { key: 'activeStatus', label: 'On/Off', width: '80px' },
];

export const ruleTasksListColumns = [
  { key: 'no', label: 'No.', width: '70px', align: 'start' },
  {
    key: 'ruleId',
    label: 'Rule ID',
    width: '160px',
    sortable: true,
  },
  {
    key: 'ruleName',
    label: 'Rule Name',
    width: '210px',
    sortable: true,
  },
  {
    key: 'ruleDescShort',
    label: 'Description',
    width: '210px',
  },
  {
    key: 'ruleStart',
    label: 'Start Date',
    width: '120px',
    sortable: true,
    type: 'date',
    dateFormat: 'dd-MMM-yyyy',
  },
  {
    key: 'ruleEnd',
    label: 'End Date',
    width: '120px',
    sortable: true,
    type: 'date',
    dateFormat: 'dd-MMM-yyyy',
  },
  {
    key: 'requesterName',
    label: 'Requested By',
    width: '180px',
    sortable: true,
  },
  {
    key: 'requestDate',
    label: 'Requested Date',
    width: '170px',
    sortable: true,
    type: 'date',
  },
  {
    key: 'approver1Name',
    label: 'Review 1 By',
    width: '170px',
    sortable: true,
  },
  {
    key: 'approval1Date',
    label: 'Review 1 Date',
    width: '185px',
    sortable: true,
    type: 'date',
  },
  {
    key: 'approver2Name',
    label: 'Review 2 By',
    width: '180px',
    sortable: true,
  },
  {
    key: 'approval2Date',
    label: 'Review 2 Date',
    width: '170px',
    sortable: true,
    type: 'date',
  },
  {
    key: 'requestType',
    label: 'Action Type',
    width: '130px',
  },
  {
    key: 'approvalStatus',
    label: 'Status',
    width: '160px',
  },
  { key: 'action', label: 'Action', width: '90px' },
  { key: 'activeStatus', label: 'On/Off', width: '80px' },
];

export const autoActionListColumns = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
  },
  { key: 'subrule', label: 'Sub Rule', width: '30%', sortable: true },
  { key: 'channel', label: 'Channel', width: '30%', sortable: true },
  { key: 'description', label: 'Description' },
];

export const subruleParamDisplayColumns = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
  },
  {
    key: 'function',
    label: 'Function',
    width: '285px',
  },
  {
    key: 'parameter1',
    label: 'Parameter 1',
    width: '285px',
  },
  {
    key: 'parameter2',
    label: 'Parameter 2',
    width: '285px',
  },
  {
    key: 'operator',
    label: 'Operator',
    width: '285px',
  },
  {
    key: 'value',
    label: 'Value',
    width: '285px',
  },
  {
    key: 'dataGroup',
    label: 'Data Group',
    width: '285px',
  },
];

export const subruleParamModalColumns = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
    bodyCellClass: 'custom-cell-class',
  },
  {
    key: 'function',
    label: 'Function',
    width: '220px',
    bodyCellClass: 'custom-cell-class',
  },
  {
    key: 'parameter1',
    label: 'Parameter 1',
    width: '200px',
    bodyCellClass: 'custom-cell-class',
  },
  {
    key: 'parameter2',
    label: 'Parameter 2',
    width: '200px',
    bodyCellClass: 'custom-cell-class',
  },
  {
    key: 'operator',
    label: 'Operator',
    width: '200px',
    bodyCellClass: 'custom-cell-class',
  },
  {
    key: 'value',
    label: 'Value',
    width: '210px',
    bodyCellClass: 'custom-cell-class',
  },
  {
    key: 'dataGroup',
    label: 'Data Group',
    width: '200px',
    bodyCellClass: 'custom-cell-class',
  },
  {
    key: 'action',
    label: '',
    width: '56px',
    bodyCellClass: 'custom-cell-class',
  },
];

export const ruleListColumns: ColumnDef<Rule>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'center' },
  },
  {
    accessorKey: 'ruleId',
    header: 'Rule ID',
    size: 180,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'ruleName',
    header: 'Rule Name',
    size: 180,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'ruleDescShort',
    header: 'Description',
    size: 200,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'ruleStart',
    header: 'Start Date',
    size: 190,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'ruleEnd',
    header: 'End Date',
    size: 190,
    meta: {
      sortable: true,
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

export const ruleTaskListColumns: ColumnDef<RuleApproval>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'center' },
  },
  {
    accessorKey: 'ruleId',
    header: 'Rule ID',
    size: 160,
    meta: { align: 'left', sortable: true },
  },
  {
    accessorKey: 'ruleName',
    header: 'Rule Name',
    size: 210,
    meta: { align: 'left', sortable: true },
  },
  {
    accessorKey: 'ruleDescShort',
    header: 'Description',
    size: 210,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'ruleStart',
    header: 'Start Date',
    size: 140,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'ruleEnd',
    header: 'End Date',
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
    size: 192,
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
    accessorKey: 'approvalStatus',
    header: 'Status',
    size: 160,
    meta: {
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

export const ruleRequestedListColumns: ColumnDef<RuleApproval>[] = [
  {
    id: 'no',
    header: 'No',
    cell: ({ row }) => row.original,
    size: 50,
    meta: { align: 'center' },
  },
  {
    accessorKey: 'ruleId',
    header: 'Rule ID',
    size: 160,
    meta: { align: 'left', sortable: true },
  },
  {
    accessorKey: 'ruleName',
    header: 'Rule Name',
    size: 210,
    meta: { align: 'left', sortable: true },
  },
  {
    accessorKey: 'ruleDescShort',
    header: 'Short Description',
    size: 210,
    meta: { align: 'left' },
  },
  {
    accessorKey: 'ruleStart',
    header: 'Start Date',
    size: 190,
    meta: {
      sortable: true,
      align: 'left',
    },
  },
  {
    accessorKey: 'ruleEnd',
    header: 'End Date',
    size: 190,
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
    size: 192,
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
      align: 'left',
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
    id: 'view',
    header: 'View',
    cell: ({ row }) => row.original,
    size: 100,
    meta: {
      align: 'center',
    },
  },
];
