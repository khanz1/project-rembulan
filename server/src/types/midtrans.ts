export enum TransactionStatus {
  AUTHORIZE = 'authorize',
  CAPTURE = 'capture',
  SETTLEMENT = 'settlement',
  DENY = 'deny',
  PENDING = 'pending',
  CANCEL = 'cancel',
  REFUND = 'refund',
  PARTIAL_REFUND = 'partial_refund',
  CHARGEBACK = 'chargeback',
  PARTIAL_CHARGEBACK = 'partial_chargeback',
  EXPIRE = 'expire',
  FAILURE = 'failure',
}

export const MIDTRANS_MAX_TRX_AMOUNT = 99_999_999_999;
