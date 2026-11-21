import { PaymentId } from '../domain/model/payment-id.model';

export const paymentIdListMockup: PaymentId[] = [
  {
    requestDate: '2026-04-22T13:03:43',
    requestType: 'Block',
    lastActionDate: '2026-04-22T13:03:43',
    actionStatus: 'Failed',
    paymentId: 'VIP888SAZ',
    customerName: 'John Doe',
    bankName: 'PT Bank Rakyat Indonesia Tbk',
    productList: ['Account, Credit Card'],
    cin: 'CN 01',
    id: 1,
  },
  {
    requestDate: '2026-04-22T13:03:43',
    requestType: 'Unblock',
    lastActionDate: '2026-04-22T13:03:43',
    actionStatus: 'Success',
    paymentId: 'VIP888SAE',
    customerName: 'Jane Smith',
    bankName: 'PT Bank Negara Indonesia Tbk',
    productList: ['Account, Sakuku'],
    cin: 'CN 01',
    id: 2,
  },
];

export const paymentIdCc = [
  {
    id: 1,
    cardNumber: '2511222233334444',
    status: 'Success',
    productStatus: 'D',
    reason: 'No update : Invalid block code',
  },
  {
    id: 2,
    cardNumber: '3511222233335555',
    status: 'Success',
    productStatus: 'W',
    reason: 'No update : Invalid block code',
  },
  {
    id: 3,
    cardNumber: '3511222233335555',
    status: 'Success',
    productStatus: 'X',
    reason: '',
  },
  {
    id: 4,
    cardNumber: '3511222233335555',
    status: 'Success',
    productStatus: 'X',
    reason: '',
  },
  {
    id: 5,
    cardNumber: '3511222233335555',
    status: 'Success',
    productStatus: 'X',
    reason: '',
  },
];

export const paymentIdAccount = [
  {
    id: 1,
    accountNumber: '0301233158',
    status: 'Success',
    productStatus: 'F',
    reason: '',
  },
  {
    id: 2,
    accountNumber: '0301233158',
    status: 'Success',
    productStatus: 'F',
    reason: '',
  },
  {
    id: 3,
    accountNumber: '0901233999',
    status: 'Success',
    productStatus: 'F',
    reason: '',
  },
  {
    id: 4,
    accountNumber: '0901233999',
    status: 'Success',
    productStatus: 'F, J',
    reason: '',
  },
  {
    id: 5,
    accountNumber: '0681233671',
    status: 'Failed',
    productStatus: 'A, B, D',
    reason: `Maximum account status "khusus" limit reached`,
  },
];

export const paymentIdSakuku = [
  {
    id: 1,
    phoneNumber: '081313129535',
    status: 'Success',
    productStatus: 'Open',
    reason: null,
  },
  {
    id: 2,
    phoneNumber: '081313129536',
    status: 'Success',
    productStatus: 'Closed',
    reason: null,
  },
];

export const historyList = [
  {
    id: 1,
    actionDate: '27 Agustus',
    actionType: 'retry',
    userName: 'Yeni',
    userGroup: 'FRM',
    status: 'Failed',
  },
  {
    id: 2,
    actionDate: '26 Agustus',
    actionType: 'system',
    userName: 'Adrianus',
    userGroup: 'CTV',
    status: 'Success',
  },
  {
    id: 3,
    actionDate: '28 Agustus',
    actionType: 'system',
    userName: 'System',
    userGroup: 'System',
    status: 'Success',
  },
];

export const detailProductList = [
  {
    product: 'Account',
    identifier: '0301233158',
    actionStatus: 'Success',
    failedReason: '',
  },
  {
    product: 'Account',
    identifier: '0551233158',
    actionStatus: 'Failed',
    failedReason: 'Timeout',
  },
  {
    product: 'Credit Card',
    identifier: 'CC 01',
    actionStatus: 'Success',
    failedReason: '',
  },
  {
    product: 'Credit Card',
    identifier: 'CC 02',
    actionStatus: 'Success',
    failedReason: '',
  },
  {
    product: 'Credit Card',
    identifier: 'CC 03',
    actionStatus: 'Success',
    failedReason: '',
  },
];
