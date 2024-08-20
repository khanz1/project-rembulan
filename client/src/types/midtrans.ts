interface TransactionResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  bank: string;
  card_type: string;
  finish_redirect_url: string;
  fraud_status: string;
  masked_card: string;
  payment_type: string;
  transaction_status: string;
  transaction_time: string;
}

interface TransactionError {
  status_code: string;
  status_message: string;
  finish_redirect_url: string;
}

type SnapInitOptions = {
  onSuccess?: (result: TransactionResult) => void;
  onPending?: (result: any) => void;
  onError?: (result: TransactionError) => void;
  onClose?: (result: any) => void;
  skipOrderSummary?: boolean;
  autoCloseDelay?: number;
  language?: string;
  enabledPayments?: string[];
  skipCustomerDetails?: boolean;
  showOrderId?: boolean;
  isDemoMode?: boolean;
  creditCardNumber?: string;
  creditCardCvv?: string;
  creditCardExpiry?: string;
  customerEmail?: string;
  customerPhone?: string;
  uiMode?: string;
  gopayMode?: string;
  selectedPaymentType?: string;
  embedId?: string;
};

export type SnapWindow = Window &
  typeof globalThis & {
    snap: {
      show: () => void;
      hide: () => void;
      init: (clientKey?: string) => void;
      pay: (snapToken: string, options?: SnapInitOptions) => void;
      embed: (
        snapToken: string,
        options: SnapInitOptions & { embedId: string },
      ) => void;
      reset: () => void;
      invalidEvent: (event: string) => void;
    };
  };
