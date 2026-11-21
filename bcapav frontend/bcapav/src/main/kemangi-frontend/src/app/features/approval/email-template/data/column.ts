import { ColumnDef } from '@tanstack/table-core';
import { EmailTemplateApproval } from '../domain/email-approval.model';

export const emailTemplateApprRequestedListColumns: ColumnDef<EmailTemplateApproval>[] =
  [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.original,
      size: 50,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'templateId',
      header: 'Template ID',
      size: 180,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'templateType',
      header: 'Template Type',
      size: 284,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'templateName',
      header: 'Template Name',
      size: 284,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'productType',
      header: 'Product',
      size: 202,
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
      size: 135,
      meta: {
        align: 'center',
      },
    },
    {
      accessorKey: 'rejectionNote',
      header: 'Rejection Notes',
      size: 150,
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

export const emailTemplateApprTaskListColumns: ColumnDef<EmailTemplateApproval>[] =
  [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.original,
      size: 50,
      meta: { align: 'center' },
    },
    {
      accessorKey: 'templateId',
      header: 'Template ID',
      size: 287,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'templateType',
      header: 'Template Type',
      size: 284,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'templateName',
      header: 'Template Name',
      size: 284,
      meta: {
        sortable: true,
        align: 'left',
      },
    },
    {
      accessorKey: 'productType',
      header: 'Product',
      size: 287,
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
      accessorKey: 'requestDate',
      header: 'Requested Date',
      size: 185,
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
