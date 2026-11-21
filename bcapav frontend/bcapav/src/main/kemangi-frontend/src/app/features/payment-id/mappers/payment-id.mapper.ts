import {
  PaymentIdQuery,
  PaymentIdDetails,
} from '../domain/model/payment-id.model';
import {
  PaymentIdQueryApi,
  PaymentIdDetailsApi,
} from '../api/models/payment-id.model';

export function mapPaymentIdDetailsApiToDomain(
  data: PaymentIdDetailsApi,
): PaymentIdDetails {
  return {
    id: data.id,
    requestDate: data.request_date,
    requestType: data.request_type,
    lastActionDate: data.last_action_date,
    paymentId: data.payment_id,
    cin: data.cin,
    customerName: data.customer_name,
    bankName: data.bank_name,
    productList: data.product_list,
    actionStatus: data.action_status,
    actionAccountFailedCount: data.action_account_failed_count,
    actionCreditCardFailedCount: data.action_credit_card_failed_count,
    actionSakukuFailedCount: data.action_sakuku_failed_count,
  };
}

export function mapPaymentIdQueryDomainToApi(
  data: PaymentIdQuery,
): PaymentIdQueryApi {
  return {
    limit: data.limit ?? null,
    page: data.page ?? null,
    sort: data.sort ?? null,
    sort_dir: data.sortDir ?? null,
    payment_id: data.paymentId ?? null,
    customer_name: data.customerName ?? null,
    bank_name: data.bankName ?? null,
    product_type: data.productType ?? null,
    request_type: data.requestType ?? null,
    action_status: data.actionStatus ?? null,
    request_date_from: data.requestDateFrom || null,
    request_date_to: data.requestDateTo || data.requestDateFrom || null,
    action_date_from: data.actionDateFrom || null,
    action_date_to: data.actionDateTo || data.actionDateFrom || null,
    cin: data.cin,
  };
}
