import { TransactionStatus } from './midtrans';

export interface TransactionStatusResponse {
  /**
   * Represents the HTTP status code
   * @example "407"
   */
  status_code: string;

  /**
   * Unique identifier for the transaction
   * @example "3facb1fd-dcd5-405d-9a04-5e995949b9ce"
   */
  transaction_id: string;

  /**
   * Total amount of the transaction
   * @example "100000.00"
   */
  gross_amount: string;

  /**
   * Currency of the transaction
   * @example "IDR"
   */
  currency: string;

  /**
   * Unique identifier for the order
   * @example "TRX-786d98b4-edd4-4726-bf40-aaa4dfdf610c"
   */
  order_id: string;

  /**
   * Type of payment used
   * @example "credit_card"
   */
  payment_type: string;

  /**
   * Signature key for the transaction
   * @example "40b2bb67f15ab050096ebfd318d7c0039bfe53211dabd38787ceb3e42c6949a70fc8edcd2aabfb0698b010e76e6171e066839b08bad68615c0460062923740d6"
   */
  signature_key: string;

  /**
   * Current status of the transaction
   * @example "expire"
   */
  transaction_status: TransactionStatus;

  /**
   * Status of fraud detection
   * @example "accept"
   */
  fraud_status: string;

  /**
   * Message explaining the status
   * @example "Credit Card transaction is expired"
   */
  status_message: string;

  /**
   * Merchant identifier
   * @example "G056973906"
   */
  merchant_id: string;

  /**
   * Time when the transaction was created
   * @example "2024-07-19 19:12:35"
   */
  transaction_time: string;

  /**
   * Time when the transaction will expire
   * @example "2024-07-27 19:12:35"
   */
  expiry_time: string;

  /**
   * Bank associated with the transaction
   * @example "cimb"
   */
  bank: string;

  /**
   * Masked card number used in the transaction
   * @example "48111111-1114"
   */
  masked_card: string;

  /**
   * Type of card used in the transaction
   * @example "credit"
   */
  card_type: string;

  /**
   * Payment channel used
   * @example "dragon"
   */
  channel: string;

  /**
   * Version of 3DS used
   * @example "2"
   */
  three_ds_version: string;

  /**
   * Indicates if the transaction is on-us
   * @example false
   */
  on_us: boolean;

  /**
   * Indicates if the challenge was completed
   * @example false
   */
  challenge_completion: boolean;
}

declare module 'midtrans-client' {
  export interface SnapApiConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey?: string;
  }

  export interface CustomerDetails {
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
    billing_address?: Address;
    shipping_address?: Address;
  }

  export interface Address {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address: string;
    city: string;
    postal_code: string;
    country_code: string;
  }

  export interface ItemDetail {
    id: string;
    price: number;
    quantity: number;
    name: string;
    brand?: string;
    category?: string;
    merchant_name?: string;
  }

  export interface SnapTransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  export interface SnapTransactionRequest {
    transaction_details: SnapTransactionDetails;
    item_details: ItemDetail[];
    customer_details: CustomerDetails;
    enabled_payments?: string[];
    credit_card?: {
      secure: boolean;
      bank?: string;
      channel?: string;
      installment?: {
        required: boolean;
        terms: { [bank: string]: number[] };
      };
      whitelist_bins?: string[];
    };
    bca_va?: {
      va_number?: string;
      sub_company_code?: string;
      free_text?: {
        inquiry?: {
          en?: string;
          id?: string;
        };
        payment?: {
          en?: string;
          id?: string;
        };
      };
    };
    bni_va?: {
      va_number?: string;
    };
    bri_va?: {
      va_number?: string;
    };
    permata_va?: {
      va_number?: string;
      recipient_name?: string;
    };
    callbacks?: {
      finish?: string;
    };
    expiry?: {
      start_time?: string;
      unit: string;
      duration: number;
    };
    custom_field1?: string;
    custom_field2?: string;
    custom_field3?: string;
  }

  export interface SnapTransactionResponse {
    token: string;
    redirect_url: string;
  }

  export interface SnapError {
    status_code: string;
    status_message: string;
    transaction_id?: string;
    order_id?: string;
  }

  export class MidtransError extends Error {
    data: SnapError;
    /**
     * HTTP status code returned by the Midtrans API
     * @example "404"
     */
    httpStatusCode: string;
    /**
     * API response containing the error details
     */
    ApiResponse: {
      /**
       * HTTP status code returned by the Midtrans API
       * @example "404"
       */
      status_code: string;

      /**
       * Message describing the error
       * @example "Transaction doesn't exist."
       */
      status_message: string;

      /**
       * Unique identifier for the error
       * @example "f6eb3dee-c464-4090-b0c6-ffa0f247e653"
       */
      id: string;
    };

    constructor(data: SnapError);
  }

  interface CoreApiOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface ApiConfigOptions {
    isProduction?: boolean;
    serverKey?: string;
    clientKey?: string;
  }

  interface ApiConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;

    get(): ApiConfigOptions;
    set(options: ApiConfigOptions): void;
    getCoreApiBaseUrl(): string;
    getSnapApiBaseUrl(): string;
    getIrisApiBaseUrl(): string;
  }
  interface HttpClient {
    request(
      httpMethod: 'get' | 'post',
      serverKey: string,
      requestUrl: string,
      firstParam?: object | string,
      secondParam?: object | string,
    ): Promise<any>;
  }

  interface Transaction {
    status(transactionId?: string): Promise<TransactionStatusResponse>;
    statusb2b(transactionId?: string): Promise<any>;
    approve(transactionId?: string): Promise<any>;
    deny(transactionId?: string): Promise<any>;
    cancel(transactionId?: string): Promise<any>;
    expire(transactionId?: string): Promise<any>;
    refund(transactionId?: string, parameter?: object): Promise<any>;
    refundDirect(transactionId?: string, parameter?: object): Promise<any>;
    notification(notificationObj?: object | string): Promise<any>;
  }

  export class CoreApi {
    apiConfig: ApiConfig;
    httpClient: HttpClient;
    transaction: Transaction;

    constructor(config: SnapApiConfig);

    charge(parameter: object): Promise<any>;
    capture(parameter: object): Promise<any>;
    cardRegister(parameter: object): Promise<any>;
    cardToken(parameter: object): Promise<any>;
    cardPointInquiry(tokenId: string): Promise<any>;
    linkPaymentAccount(parameter: object): Promise<any>;
    getPaymentAccount(accountId: string): Promise<any>;
    unlinkPaymentAccount(accountId: string): Promise<any>;
    createSubscription(parameter: object): Promise<any>;
    getSubscription(subscriptionId: string): Promise<any>;
    disableSubscription(subscriptionId: string): Promise<any>;
    enableSubscription(subscriptionId: string): Promise<any>;
    updateSubscription(subscriptionId: string, parameter: object): Promise<any>;
  }

  export class Snap {
    constructor(config: SnapApiConfig);

    createTransaction(
      parameters: SnapTransactionRequest,
    ): Promise<SnapTransactionResponse>;

    createTransactionToken(parameters: SnapTransactionRequest): Promise<string>;

    createTransactionRedirectUrl(
      parameters: SnapTransactionRequest,
    ): Promise<string>;
  }
}
