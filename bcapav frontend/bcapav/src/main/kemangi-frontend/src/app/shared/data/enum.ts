export const requestType = [
  { id: 'CREATE', name: 'New' },
  {
    id: 'UPDATE',
    name: 'Edit',
  },
  { id: 'DELETE', name: 'Delete' },
];

export const actionBlockType = [
  { id: 'BLOCK', name: 'Block' },
  { id: 'UNBLOCK', name: 'Unblock' },
];

export const approvalStatus = [
  { id: 'PENDING', name: 'Pending' },
  {
    id: 'APPROVED',
    name: 'Approved',
  },
  { id: 'REJECTED', name: 'Rejected' },
];

export const approvalStatusDraft = [
  { id: 'REJECTED', name: 'Rejected' },
  { id: 'DRAFT', name: 'Draft' },
];

export const processStatus = [
  { id: 'PENDING_APPROVAL', name: 'Pending Approval' },
  { id: 'IN_PROGRESS', name: 'In Progress' },
  {
    id: 'DONE',
    name: 'Done',
  },
  { id: 'WAITING', name: 'Waiting' },
  { id: 'REJECTED', name: 'Rejected' },
];

export const processStatusAccountBalance = [
  { id: 'PENDING', name: 'Pending' },
  { id: 'IN_PROGRESS', name: 'In Progress' },
  {
    id: 'DONE',
    name: 'Done',
  },
  { id: 'WAITING', name: 'Waiting' },
];

export const activeStatus = [
  { id: true, name: 'On' },
  { id: false, name: 'Off' },
];

export const enumBoolean = [
  { id: true, name: 'True' },
  { id: false, name: 'False' },
];

export const pageSize = [
  { id: 10, name: '10' },
  { id: 30, name: '30' },
  { id: 50, name: '50' },
  { id: 100, name: '100' },
];

export const fontFamilies = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Comic Sans MS', value: 'Comic Sans MS' },
];

export const fontSizes = [
  { label: '10', value: '10px' },
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '24', value: '24px' },
  { label: '32', value: '32px' },
];

export const headingOptions = [
  { label: 'Paragraph', value: 'paragraph' },
  { label: 'Heading 1', value: 'heading1' },
  { label: 'Heading 2', value: 'heading2' },
  { label: 'Heading 3', value: 'heading3' },
  { label: 'Heading 4', value: 'heading4' },
  { label: 'Heading 5', value: 'heading5' },
  { label: 'Heading 6', value: 'heading6' },
];

export const sectionOptions = [
  { label: 'EMAIL', value: 'EMAIL' },
  { label: 'SMS', value: 'SMS' },
  { label: 'WA', value: 'WA' },
  { label: 'MBCA', value: 'MBCA' },
  { label: 'AUTO BLOCK', value: 'AUTOBLOCK' },
];

export const timeUnits = [
  { label: 'Second', value: 'SECOND' },
  { label: 'Minute', value: 'MINUTE' },
  { label: 'Hour', value: 'HOUR' },
  { label: 'Day', value: 'DAY' },
  { label: 'Week', value: 'WEEK' },
  { label: 'Month', value: 'MONTH' },
];

export const ttlTypes = [
  { label: 'Session', value: 'SESSION' },
  { label: 'Sliding', value: 'SLIDING' },
  { label: 'SessionUpdate', value: 'SESSIONUPDATE' },
];

export const approverLevels = [
  { label: 'Approver 1', value: '1' },
  { label: 'Approver 2', value: '2' },
];

export const accountTypes = [
  { id: 'ACCOUNT', name: 'Account' },
  { id: 'POCKET', name: 'Pocket' },
];

export const productType = [
  { id: 'Account', name: 'Account' },
  { id: 'Credit', name: 'Credit Card' },
  { id: 'Sakuku', name: 'Sakuku' },
];

export const bankList = [
  { id: 'bank1', name: 'bank1' },
  { id: 'bank2', name: 'bank2' },
];

export const actionStatus = [
  { id: 'FAILED', name: 'Failed' },
  { id: 'SUCCESS', name: 'Success' },
];
