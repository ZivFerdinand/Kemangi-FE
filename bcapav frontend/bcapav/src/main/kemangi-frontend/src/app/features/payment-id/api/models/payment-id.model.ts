import { TableQueryApi } from '../../../../shared';

export interface PaymentIdApi {
  request_date: string | null;
  request_type: string | null;
  last_action_date: string | null;
  last_action_status: string | null;
  payment_id: string | null;
  customer_name: string | null;
  bank_name: string | null;
  product_list: string | null;
}

export interface PaymentIdQueryApi extends TableQueryApi {
  payment_id: string | null;
  customer_name: string | null;
  bank_name: string | null;
  product_type: string | null;
  request_type: string | null;
  action_status: string | null;
  request_date_from?: string | null;
  request_date_to?: string | null;
  action_date_from?: string | null;
  action_date_to?: string | null;
  cin: string | null;
}

export interface PaymentIdDetailsApi {
  id: number;
  request_date: string;
  request_type: string;
  last_action_date: string;
  payment_id: string;
  cin: string;
  customer_name: string;
  bank_name: string;
  product_list: any;
  action_status: string;
  action_account_failed_count: number;
  action_credit_card_failed_count: number;
  action_sakuku_failed_count: number;
}
