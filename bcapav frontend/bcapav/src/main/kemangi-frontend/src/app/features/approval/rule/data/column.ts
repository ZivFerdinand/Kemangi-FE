import { ColumnDef } from '@tanstack/table-core';
import { RuleApproval } from '../domain/models/rule-approval.model';

export const ruleApprTaskListColumns: ColumnDef<RuleApproval>[] = [
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
    size: 100,
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

export const ruleApprRequestedListColumns: ColumnDef<RuleApproval>[] = [
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

export const ruleApprovalRequestedListColumns = [
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
    label: 'Short Description',
    width: '210px',
  },
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
    key: 'requesterName',
    label: 'Requested By',
    width: '180px',
    sortable: true,
  },
  {
    key: 'requestDate',
    label: 'Requested Date',
    width: '185px',
    sortable: true,
    type: 'date',
  },
  {
    key: 'approvalStatus',
    label: 'Approval Status',
    width: '170px',
  },
  {
    key: 'rejectionNote',
    label: 'Rejection Notes',
    width: '170px',
  },
  {
    key: 'approver1Name',
    label: 'Review 1 By',
    width: '180px',
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
    width: '185px',
    sortable: true,
    type: 'date',
  },
  {
    key: 'requestType',
    label: 'Action Type',
    width: '150px',
  },
  {
    key: 'view',
    label: 'View',
    width: '100px',
    align: 'center',
  },
];

export const ruleApprovalTaskListType2Columns = [
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
    label: 'Short Description',
    width: '210px',
  },
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
    key: 'requesterName',
    label: 'Requested By',
    width: '180px',
    sortable: true,
  },
  {
    key: 'requestDate',
    label: 'Requested Date',
    width: '185px',
    sortable: true,
    type: 'date',
  },
  {
    key: 'approver1Name',
    label: 'Review 1 By',
    width: '180px',
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
    key: 'requestType',
    label: 'Action Type',
    width: '150px',
  },
  {
    key: 'activeStatus',
    label: 'On/Off',
    width: '100px',
    align: 'center',
  },
  {
    key: 'view',
    label: 'View',
    width: '100px',
    align: 'center',
  },
];

export const subRuleTableParamColumns = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
  },
  {
    key: 'functionName',
    label: 'Function',
    width: '20%',
    sortable: false,
  },
  {
    key: 'parameter1',
    label: 'Parameter',
    width: '15%',
    sortable: false,
  },
  {
    key: 'parameter2',
    label: 'Parameter',
    width: '15%',
    sortable: false,
  },
  {
    key: 'operator',
    label: 'Operator',
    width: '22%',
    sortable: false,
  },
  {
    key: 'value',
    label: 'Value',
    width: '22%',
  },
  {
    key: 'dataGroupName',
    label: 'Data Group',
    width: '21%',
    sortable: false,
  },
];

export const autoActionListColumns = [
  {
    key: 'no',
    label: 'No',
    width: '50px',
  },
  { key: 'subruleName', label: 'Sub Rule', width: '30%', sortable: false },
  { key: 'action', label: 'Action', width: '30%', sortable: false },
  { key: 'description', label: 'Description' },
];

export const pipelineColumnsV2Aggregation = [
  { key: 'no', label: 'No', sortable: false, width: '50px' },
  {
    label: 'Parameter Criteria',
    children: [
      {
        key: 'function',
        label: 'Function',
        sortable: false,
        width: '250px',
        align: 'left',
        bodyClass: 'custom-style-i',
      },
      {
        key: 'fieldEventType',
        label: 'Field Event Type',
        sortable: false,
        width: '250px',
        align: 'left',
        bodyClass: 'custom-style-i',
      },
      {
        key: 'parameter',
        label: 'Parameter',
        sortable: false,
        width: '250px',
        bodyClass: 'custom-padding-i',
        align: 'left',
      },
      {
        key: 'parameterValue',
        label: 'Parameter Value',
        sortable: false,
        width: '450px',
        bodyClass: 'custom-padding-i',
        align: 'left',
      },
    ],
  },
  {
    label: 'Evaluation',
    children: [
      {
        key: 'operator',
        label: 'Operator',
        sortable: false,
        width: '250px',
        align: 'left',
        bodyClass: 'custom-style-i',
      },
      {
        key: 'value',
        label: 'Value',
        sortable: false,
        width: '250px',
        align: 'left',
        bodyClass: 'custom-style-i',
      },
    ],
  },
  {
    key: 'setToVar',
    label: 'SET TO VAR',
    sortable: false,
    width: '250px',
    align: 'left',
    bodyClass: 'custom-style-i',
  },
];

export const pipelineColumnsV2GetBalance = [
  { key: 'no', label: 'No', sortable: false, width: '50px' },
  {
    label: 'Parameter Criteria',
    children: [
      {
        key: 'parameter',
        label: 'Parameter',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-padding-i',
        width: '280px',
      },
      {
        key: 'parameterValue',
        label: 'Parameter Value',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-padding-i',
        width: '320px',
      },
    ],
  },
  {
    label: 'Evaluation',
    children: [
      {
        key: 'pipelineOutcome1',
        label: 'Pipeline Outcome',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-style-i',
        width: '172px',
      },
      {
        key: 'operator',
        label: 'Operator',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-style-i',
        width: '206px',
      },
      {
        key: 'value',
        label: 'Value',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-style-i',
        width: '222px',
      },
    ],
  },
  {
    key: 'setToVar',
    label: 'SET TO VAR',
    sortable: false,
    align: 'left',
    width: '260px',
    bodyClass: 'custom-style-i',
  },
];

export const pipelineColumnsV2GetHistorical = [
  { key: 'no', label: 'No', sortable: false, width: '50px' },
  {
    label: 'Parameter Criteria',
    children: [
      {
        key: 'parameter',
        label: 'Parameter',
        sortable: false,
        align: 'left',
        width: '160px',
        bodyClass: 'custom-padding-i',
      },
      {
        key: 'parameterValue',
        label: 'Parameter Value',
        sortable: false,
        align: 'left',
        width: '240px',
        bodyClass: 'custom-style-i',
      },
    ],
  },
  {
    label: 'Evaluation',
    children: [
      {
        key: 'function',
        label: 'Function',
        sortable: false,
        align: 'left',
        width: '240px',
        bodyClass: 'custom-style-i',
      },
      {
        key: 'pipelineOutcome1',
        label: 'Pipeline Outcome 1',
        sortable: false,
        align: 'left',
        width: '320px',
        bodyClass: 'custom-style-i',
      },
      {
        key: 'pipelineOutcome2',
        label: 'Pipeline Outcome 2',
        sortable: false,
        align: 'left',
        width: '320px',
        bodyClass: 'custom-style-i',
      },
      {
        key: 'operator',
        label: 'Operator',
        sortable: false,
        align: 'left',
        width: '120px',
        bodyClass: 'custom-style-i',
      },
      {
        key: 'value',
        label: 'Value',
        sortable: false,
        align: 'left',
        width: '120px',
        bodyClass: 'custom-style-i',
      },
    ],
  },
  {
    key: 'setToVar',
    label: 'SET TO VAR',
    sortable: false,
    align: 'left',
    width: '220px',
    bodyClass: 'custom-style-i',
  },
];

export const pipelineColumnsV2RealTimeHistorical = [
  { key: 'no', label: 'No', sortable: false, width: '50px' },
  {
    label: 'Parameter Criteria',
    children: [
      {
        key: 'parameter',
        label: 'Parameter',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-padding-i',
        width: '120px',
      },
      {
        key: 'parameterValue',
        label: 'Parameter Value',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-padding-i',
        width: '480px',
      },
    ],
  },
  {
    label: 'Evaluation',
    children: [
      {
        key: 'pipelineOutcome1',
        label: 'Pipeline Outcome',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-style-i',
        width: '160px',
      },

      {
        key: 'operator',
        label: 'Operator',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-style-i',
        width: '160px',
      },
      {
        key: 'value',
        label: 'Value',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-style-i',
        width: '160px',
      },
    ],
  },
  {
    key: 'setToVar',
    label: 'SET TO VAR',
    sortable: false,
    align: 'left',
    bodyClass: 'custom-style-i',
    width: '300px',
  },
];

export const pipelineColumnsV2Journey = [
  { key: 'no', label: 'No', sortable: false, width: '50px' },
  {
    label: 'Parameter Criteria',
    children: [
      {
        key: 'parameter',
        label: 'Parameter',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-padding-i',
      },
      {
        key: 'parameterValue',
        label: 'Parameter Value',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-padding-i',
      },
      {
        key: 'empty',
        label: '',
        sortable: false,
        align: 'left',
      },
    ],
  },
  {
    label: 'Evaluation',
    children: [
      {
        key: 'field',
        label: 'Field',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-style-i',
      },
      {
        key: 'value',
        label: 'Value',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-style-i',
      },
    ],
  },
  {
    key: 'setToVar',
    label: 'SET TO VAR',
    sortable: false,
    align: 'left',
    bodyClass: 'custom-style-i',
  },
];

export const pipelineColumnsV2Watchlist = [
  { key: 'no', label: 'No', sortable: false, width: '50px' },
  {
    label: 'Parameter Criteria',
    children: [
      {
        key: 'parameter',
        label: 'Parameter',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-padding-i',
        width: '160px',
      },
      {
        key: 'parameterValue',
        label: 'Parameter Value',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-padding-i',
        width: '240px',
      },
    ],
  },
  {
    label: 'Evaluation',
    children: [
      {
        key: 'pipelineOutcome1',
        label: 'Pipeline Outcome',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-style-i',
        width: '160px',
      },
      {
        key: 'value',
        label: 'Value',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-style-i',
        width: '160px',
      },
    ],
  },
  {
    key: 'setToVar',
    label: 'SET TO VAR',
    sortable: false,
    align: 'left',
    bodyClass: 'custom-style-i',
    width: '300px',
  },
];

export const pipelineColumnsV2Null = [
  { key: 'no', label: 'No', sortable: false, width: '50px' },
  {
    label: 'Parameter Criteria',
    children: [
      {
        key: 'function',
        label: 'Function',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-style-i',
        width: '240px',
      },
      {
        key: 'fieldEventType',
        label: 'Field Event Type',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-style-i',
        width: '400px',
      },
    ],
  },
  {
    label: 'Evaluation',
    children: [
      {
        key: 'operator',
        label: 'Operator',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-style-i',
        width: '160px',
      },
      {
        key: 'value',
        label: 'Value',
        sortable: false,
        align: 'left',
        bodyClass: 'custom-style-i',
        width: '160px',
      },
    ],
  },
  {
    key: 'setToVar',
    label: 'SET TO VAR',
    sortable: false,
    align: 'left',
    bodyClass: 'custom-style-i',
    width: '300px',
  },
];

export const pipelineColumnsV3GetBalance = [
  { key: 'no', label: 'No', sortable: false, width: '50px' },
  {
    label: 'Parameter Criteria',
    children: [
      {
        key: 'parameter',
        label: 'Parameter',
        sortable: false,
        align: 'left',
        width: '280px',
        bodyClass: 'custom-padding-i',
      },
      {
        key: 'parameterValue',
        label: 'Parameter Value',
        sortable: false,
        align: 'left',
        width: '320px',
        bodyClass: 'custom-padding-i',
      },
    ],
  },
  {
    label: 'Evaluation',
    children: [
      {
        key: 'pipelineOutcome',
        label: 'Pipeline Outcome',
        sortable: false,
        align: 'left',
      },
      {
        key: 'operator',
        label: 'Operator',
        sortable: false,
        width: '250px',
        align: 'left',
      },
      {
        key: 'value',
        label: 'Value',
        sortable: false,
        width: '250px',
        align: 'left',
      },
    ],
  },
  { key: 'setToVar', label: 'SET TO VAR', sortable: false, align: 'left' },
];
