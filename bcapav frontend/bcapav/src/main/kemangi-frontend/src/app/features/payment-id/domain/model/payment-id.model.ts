import { TableQuery } from '../../../../shared';

export interface PaymentId {
  id: number;
  requestDate: string | null;
  requestType: string | null;
  lastActionDate: string | null;
  paymentId: string | null;
  cin: string | null;
  customerName: string | null;
  bankName: string | null;
  productList: string[] | null;
  actionStatus: string | null;
}

export interface PaymentIdQuery extends TableQuery {
  cin: string | null;
  paymentId: string | null;
  customerName: string | null;
  bankName: string | null;
  productType: string | null;
  requestType: string | null;
  actionStatus: string | null;
  requestDateFrom?: string | null;
  requestDateTo?: string | null;
  actionDateFrom?: string | null;
  actionDateTo?: string | null;
}

export interface PaymentIdQueryFilter {
  cin: string | null;
  paymentId: string | null;
  customerName: string | null;
  bankName: string | null;
  productType: string | null;
  requestType: string | null;
  actionStatus: string | null;
  requestDateFrom?: string | null;
  requestDateTo?: string | null;
  actionDateFrom?: string | null;
  actionDateTo?: string | null;
}

export interface PaymentIdQueryFilterDisplayTemp {
  action: string | null;
  customerName: string | null;
  requestDateFrom: string | null;
  requestDateTo: string | null;
  requestType: string | null;
  actionDateFrom: string | null;
  actionDateTo: string | null;
  bankName: string[] | null;
  paymentId: string | null;
  productType: string | null;
}

export interface PaymentIdDetails {
  id: number;
  requestDate: string;
  requestType: string;
  lastActionDate: string;
  paymentId: string;
  cin: string;
  customerName: string;
  bankName: string;
  productList: any;
  actionStatus: string;
  actionAccountFailedCount: number;
  actionCreditCardFailedCount: number;
  actionSakukuFailedCount: number;
}

export interface PaymentIdAccount {
  accountNo: string | null;
  status: string | null;
  statusKhusus: string | null;
  statusBiasa: string | null;
  failedReason: string | null;
}

export interface PaymentIdSakuku {
  phoneNo: string | null;
  status: string | null;
  productStatus: string | null;
  failedReason: string | null;
}

export interface PaymentIdCreditCard {
  cardNo: string | null;
  status: string | null;
  blockCode: string | null;
  userData: string | null;
  failedReason: string | null;
}
