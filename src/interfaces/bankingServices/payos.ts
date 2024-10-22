export interface ResponsePayOS<
    T extends
        | PaymentLinkResponseData
        | PaymentLinkCallbackRequestData
        | TransactionStatusResponseData
        | Record<string, unknown>
        | undefined = undefined
> {
    /** Response code */
    code: string;
    /** Response message */
    desc: string;
    /** Response data */
    data: T;
}

/** @see https://payos.vn/docs/api/#operation/payment-request */
export interface PaymentLinkRequest {
    /** Order code */
    orderCode: number;
    /** Payment amount */
    amount: number;
    /** Payment description (max: 9 characters for non-linked bank accounts) */
    description: string;
    /** Buyer's name (used for e-invoice integration) */
    buyerName?: string;
    /** Buyer's email (used for e-invoice integration) */
    buyerEmail?: string;
    /** Buyer's phone number ( used for e-invoice integration) */
    buyerPhone?: string;
    /** Buyer's address (used for e-invoice integration) */
    buyerAddress?: string;
    /** List of payment items */
    items?: Item[];
    /** URL to receive data when the user cancels the order */
    cancelUrl: string;
    /** URL to receive data when the order is successfully paid */
    returnUrl: string;
    /**
     * Expiry time for the payment link (Unix Timestamp, Int32)
     *
     * Note: This api will auto convert to Int32
     * */
    expiredAt?: number;
    /** Signature to verify the data integrity */
    signature: string;
}

/** @see https://payos.vn/docs/api/#operation/payment-request */
export interface PaymentLinkResponse extends ResponsePayOS<PaymentLinkResponseData> {
    /** Signature to verify the data integrity */
    signature: string;
}

export interface PaymentLinkResponseData extends Pick<Transaction, "amount" | "accountNumber" | "description"> {
    /** The six first bin digits */
    bin: string;
    /** Bank account holder's name */
    accountName: string;
    /** Order code */
    orderCode: number;
    /** Currency */
    currency: string;
    /** Payment link ID */
    paymentLinkId: string;
    /** Payment status */
    status: PAYMENT_STATUS;
    /** Expired time of the payment link */
    expiredAt?: number;
    /** Checkout URL */
    checkoutUrl: string;
    /** QR code */
    qrCode: string;
}

/** @see https://payos.vn/docs/du-lieu-tra-ve/webhook/ */
export interface PaymentLinkCallbackRequest extends ResponsePayOS<PaymentLinkCallbackRequestData> {
    /** Payment status */
    success: boolean;
    /** Signature to verify the data integrity */
    signature: string;
}

export interface PaymentLinkCallbackRequestData extends Transaction {
    /** Order code */
    orderCode: number;
    /** Currency used for the transaction */
    currency: string;
    /** Payment link ID */
    paymentLinkId: string;
    /** Transaction error code */
    code: string;
    /** Transaction error description */
    desc: string;
}

export interface Item {
    /** Name or identifier of the product */
    productName: string;
    /** Quantity of the product */
    quantity: number;
    /** Price of the product */
    price: number;
}

/** @see https://payos.vn/docs/api/#operation/payment-requests */
export interface TransactionStatusRequest {
    /** Payment link ID or order code */
    id: number | string;
}

/** @see https://payos.vn/docs/api/#operation/payment-requests */
export interface TransactionStatusResponse extends ResponsePayOS<TransactionStatusResponseData> {
    /** Signature to verify the data integrity */
    signature: string;
}

export interface TransactionStatusResponseData {
    /** Payment link ID */
    id: string;
    /** Order code from the store */
    orderCode: number;
    /** Total payment amount */
    amount: number;
    /** Amount already paid */
    amountPaid: number;
    /** Remaining amount that the customer needs to pay */
    amountRemaining: number;
    /** Status of the payment link */
    status: PAYMENT_STATUS;
    /** Time when the payment link was created */
    createdAt: Date;
    /** List of transactions related to the order */
    transactions: Transaction[] | null;
    /** Time when the payment link was canceled */
    canceledAt: Date | null;
    /** Reason for the cancellation */
    cancellationReason: string | null;
}

export interface Transaction {
    /** Payment amount */
    amount: number;
    /** Payment description */
    description: string;
    /** Store's account number */
    accountNumber: string;
    /** Transaction reference code used for reconciliation with the bank */
    reference: string;
    /** Date and time when the transaction was successfully completed */
    transactionDateTime: Date;
    /** Bank ID of the customer making the transfer (BIN) */
    counterAccountBankId: string | null;
    /** Bank name of the customer making the transfer */
    counterAccountBankName: string | null;
    /** Account holder name of the customer making the transfer */
    counterAccountName: string | null;
    /** Account number of the customer making the transfer */
    counterAccountNumber: string | null;
    /** Virtual account name */
    virtualAccountName: string | null;
    /** Virtual account number */
    virtualAccountNumber: string | null;
}

export enum PAYMENT_STATUS {
    PAID = "PAID",
    EXPIRED = "EXPIRED",
    PENDING = "PENDING",
    CANCELLED = "CANCELLED",
}

export enum RESULT_CODE {
    SUCCESS = "00",

    BAD_FORMAT_REQUEST = "20",
    INVALID_SIGNATURE = "201",
    ORDER_CODE_NOT_EXISTS = "101",
    /** This is returned when passing invalid pair of API key and Client ID (with status 200) */
    PAYMENT_GATEWAY_ERROR = "214",
    ORDER_ID_ALREADY_EXISTS = "231",

    MISSING_CREDENTIALS = "401",
    /** This is returned when passing float order code */
    SERVICE_UNAVAILABLE = "503",
}
