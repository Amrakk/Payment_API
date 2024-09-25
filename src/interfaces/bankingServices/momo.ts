/** @see https://developers.momo.vn/v3/docs/payment/api/result-handling/bankcode */
export interface ResponseGetBanks {
    /** Bank code */
    [bankCode: string]: Bank;
}

/** @see https://developers.momo.vn/v3/docs/payment/api/result-handling/bankcode */
export interface Bank {
    /** The six first bin digits */
    bin: string;
    /** Full bank name */
    name: string;
    /** Short bank name */
    shortName: string;
    /** Bank logo url */
    bankLogoUrl: string;
    /** Is support VietQr */
    isVietQr: boolean;

    /** Is support disbursement - Skip */
    isDisburse: boolean;
    /** Is support Napas - Skip */
    isNapas: boolean;
}

export interface PaymentLinkRequestInput extends Omit<PaymentLinkRequest, "signature" | "partnerCode" | "ipnUrl"> {}

/** @see https://developers.momo.vn/v3/docs/payment/api/collection-link/ */
export interface PaymentLinkRequest extends RequestBase {
    /** Partner Name */
    partnerName?: string;
    /** Store ID */
    storeId?: string;
    /** Amount to be paid (VND), min: 1,000, max: 50,000,000 */
    amount: number;
    /** Order information */
    orderInfo: string;
    /** URL used to redirect from Momo to partner's page after payment */
    redirectUrl: string;
    /** Partner API to submit payment results (IPN method) */
    ipnUrl: string;
    /** Request type */
    requestType: REQUEST_TYPE;
    /** Base64-encoded extra data in JSON format */
    extraData: string;
    /** List of products displayed on the payment page, max: 50 items */
    items?: Item[];
    /** Info of the customer */
    userInfo?: UserInfo;
    /** Expire time of the order (minutes)[default: 100 minutes] */
    orderExpireTime: number;
    /** If set to false, payment will not be automatically captured (default: true) */
    autoCapture: boolean;
}

/** @see https://developers.momo.vn/v3/docs/payment/api/collection-link/ */
export interface PaymentLinkResponse extends ResponseBase {
    /** Same as the original request */
    requestId: string;
    /** Same as the original payment amount */
    amount: number;
    /** URL for switching from the partner's page to the Momo payment page */
    payUrl: string;

    /** CAPTURE_WALLET */
    /** URL to open Momo application directly; customers must install the Momo app first */
    deeplink?: string;
    /** Data to generate QR code for direct scanning or printing */
    qrCodeUrl?: string;
    /** URL to open the Momo app's payment confirmation screen; applies when the partner's website is embedded in the Momo app */
    deeplinkMiniApp?: string;
    /** Signature to confirm information; secure transaction in Hmac_SHA256 format */
    signature?: string;

    /** PAY_WITH_METHOD */
    shortLink?: string;

    /** PAY_WITH_CC */
    /** PAY_WITH_ATM */
    /** PAY_WITH_APPLE_PAY */
    /** INITIATE */
    /** LINKWALLET */
    /** SUBSCRIPTION */
    /** PAY_WITH_VTS */
    /** ON_DELIVERY */
}

/** @see https://developers.momo.vn/v3/docs/payment/api/result-handling/notification */
export interface PaymentLinkCallbackRequest {
    /** Integration information */
    partnerCode: string;
    /** Partner's order ID. Should match the regex ^[0-9a-zA-Z]([-_.]*[0-9a-zA-Z]+)*$ */
    orderId: string;
    /** Partner's request ID */
    requestId: string;
    /** Payment amount */
    amount: number;
    /** Order information */
    orderInfo: string;
    /** Order type */
    orderType: string;
    /** Momo's transaction ID */
    transId: number;
    /** Transaction status result code */
    resultCode: number;
    /** Description of the result; language based on 'lang' */
    message: string;
    /** Payment type: qr, webApp, credit, or napas */
    payType: PAY_TYPE;
    /** Time to respond the result to the partner (timestamp format) */
    responseTime: number;
    /** Extra data, default is empty string */
    extraData: string;
    /** Signature to confirm information; secure transaction in Hmac_SHA256 format */
    signature: string;
}

export enum SUPPORTED_LANG {
    VI = "vi",
    EN = "en",
}

export enum REQUEST_TYPE {
    /** Pay with credit card */
    PAY_WITH_CC = "payWithCC",
    /** Pay with ATM */
    PAY_WITH_ATM = "payWithATM",
    /** Capture wallet */
    CAPTURE_WALLET = "captureWallet",
    /** Pay with method */
    PAY_WITH_METHOD = "payWithMethod",
}

export enum PAY_TYPE {
    /** QR code */
    QR = "qr",
    /** Web application */
    WEB_APP = "webApp",
    /** Credit card */
    CREDIT = "credit",
    /** Napas */
    NAPAS = "napas",
}

export interface Item {
    /** SKU number */
    id: string;
    /** Name of the product */
    name: string;
    /** Description of the product */
    description?: string;
    /** Product category/classification */
    category?: string;
    /** URL of the product image */
    imageUrl?: string;
    /** Name of the manufacturer */
    manufacturer?: string;
    /** Unit price */
    price: number; // Using 'number' for Long
    /** Currency (e.g., VND) */
    currency: string;
    /** Quantity of the product (must be greater than 0) */
    quantity: number;
    /** Unit of measurement */
    unit?: string;
    /** Total price (price x quantity) */
    totalPrice: number;
    /** Total tax amount */
    taxAmount?: number;
}

export interface UserInfo {
    /** Name of the customer as registered on the merchant site */
    name?: string;
    /** Phone number of the customer as registered on the merchant site */
    phoneNumber?: string;
    /** Email address of the customer as registered on the merchant site */
    email?: string;
}

export interface TransactionStatusRequestInput extends Omit<TransactionStatusRequest, "signature" | "partnerCode"> {}

/** @see https://developers.momo.vn/v3/docs/payment/api/payment-api/query */
export interface TransactionStatusRequest extends RequestBase {}

/** @see https://developers.momo.vn/v3/docs/payment/api/payment-api/query */
export interface TransactionStatusResponse extends ResponseBase {
    /** Unique ID for the request */
    requestId: string;
    /** Additional data provided by the partner */
    extraData: string;
    /** The transaction amount */
    amount: number;
    /** Momo's transaction ID */
    transId: number;
    /** Type of payment method used (e.g., QR, WebApp, Credit, etc.) */
    payType: PAY_TYPE;
    /** List of any associated refund transactions */
    refundTrans: unknown[];
    /**
     * Time of the last status update for the transaction
     *
     * Note: Contrary to the 'Momo' API docs, the 'lastUpdated' property is returned from the API
     * due to a mismatch between the docs and the actual API behavior.
     */
    lastUpdated: number;
    /**
     * Secure signature to verify the transaction, using Hmac_SHA256 (nullable)
     *
     * Note: Contrary to the 'Momo' API docs, the 'signature' property is returned from the API (with value 'null')
     * due to a mismatch between the docs and the actual API behavior.
     */
    signature: string | null;

    /** Payment option chosen */
    paymentOption?: string;
    /** Promotion details */
    promotionInfo?: PromotionInfo[];
}

export interface PromotionInfo {
    /** Discount amount */
    amount: number;
    /** Amount merchant contributes to the discount in voucher/campaign */
    amountSponsor: number;
    /** ID of the voucher or campaign */
    voucherId: string;
    /** Type of the voucher, e.g., Percent */
    voucherType: string;
    /** Name of the voucher or campaign */
    voucherName: string;
    /** Percentage of the voucher/campaign contributed by the merchant */
    merchantRate: string;
}

export interface RequestBase {
    /** Integration information */
    partnerCode: string;
    /** Partner Transaction ID with regex: ^[0-9a-zA-Z]([-_.]*[0-9a-zA-Z]+)*$ */
    orderId: string;
    /** Request ID, unique for each request, used for idempotency control */
    requestId: string;
    /** Language of returned message (vi or en) */
    lang: SUPPORTED_LANG;
    /** Secure transaction signature using Hmac_SHA256 */
    signature: string;
}

export interface ResponseBase {
    /** Integration partner code */
    partnerCode: string;
    /** Partner's transaction ID */
    orderId: string;
    /** Time when the response was generated */
    responseTime: number;
    /** Description of the transaction result, language based on `lang` */
    message: string;
    /** Result code of the transaction status */
    resultCode: number;
}

/** @see https://developers.momo.vn/v3/docs/payment/api/result-handling/resultcode/ */
export enum RESULT_CODE {
    /** Successful. */
    SUCCESS = 0,
    /** System is under maintenance. */
    SYSTEM_MAINTENANCE = 10,
    /** Access denied. */
    ACCESS_DENIED = 11,
    /** Unsupported API version for this request. */
    UNSUPPORTED_API_VERSION = 12,
    /** Merchant authentication failed.	*/
    MERCHANT_AUTHENTICATION_FAILED = 13,
    /** Bad format request. */
    BAD_FORMAT_REQUEST = 20,
    /** Request rejected due to invalid transaction amount. */
    INVALID_TRANSACTION_AMOUNT = 21,
    /** The transaction amount is out of range. */
    TRANSACTION_AMOUNT_OUT_OF_RANGE = 22,
    /** Duplicated requestId. */
    DUPLICATED_REQUEST_ID = 40,
    /** Duplicated orderId. */
    DUPLICATED_ORDER_ID = 41,
    /** Invalid orderId or orderId is not found. */
    INVALID_ORDER_ID = 42,
    /** Request rejected due to an analogous transaction is being processed. */
    ANALOGOUS_TRANSACTION_BEING_PROCESSED = 43,
    /** Duplicated ItemId */
    DUPLICATED_ITEM_ID = 45,
    /** Request rejected due to inapplicable information in the given set of valuable data. */
    INAPPLICABLE_INFORMATION = 47,
    /** This QR Code has not been generated successfully. Please try again later. */
    QR_CODE_NOT_GENERATED = 98,
    /** Unknown error. */
    UNKNOWN_ERROR = 99,
    /** Transaction is initiated, waiting for user confirmation. */
    TRANSACTION_INITIATED = 1000,
    /** Transaction failed due to insufficient funds. */
    INSUFFICIENT_FUNDS = 1001,
    /** Transaction rejected by the issuers of the payment methods.	 */
    REJECTED_BY_ISSUER = 1002,
    /** Transaction cancelled after successfully authorized. */
    TRANSACTION_CANCELLED = 1003,
    /** Transaction failed because the amount exceeds daily /monthly payment limit. */
    EXCEEDS_PAYMENT_LIMIT = 1004,
    /** Transaction failed because the url or QR code expired. (status = 200) */
    URL_OR_QR_CODE_EXPIRED = 1005,
    /** Transaction failed because user has denied to confirm the payment. */
    USER_DENIED_PAYMENT = 1006,
    /** Transaction rejected due to inactive or nonexistent user's account. */
    INACTIVE_OR_NONE_EXISTENT_USER_ACCOUNT = 1007,
    /** Transaction cancelled by merchant. */
    CANCELLED_BY_MERCHANT = 1017,
    /** Transaction restricted due to promotion rules. */
    RESTRICTED_BY_PROMOTION_RULES = 1026,
    /** Refund attempt failed during the processing. Please retry within a short period, preferably after an hour. */
    REFUND_FAILED = 1080,
    /** Refund rejected. The original transaction might have been refunded. */
    REFUND_REJECTED = 1081,
    /** Refund rejected. The original payment transaction is ineligible to be refunded. */
    INELIGIBLE_FOR_REFUND = 1088,
    /** Request rejected due to invalid orderGroupId. */
    INVALID_ORDER_GROUP_ID = 2019,
    /** Transaction rejected because the user account is being restricted. */
    USER_ACCOUNT_RESTRICTED = 4001,
    /** Transaction failed because user has failed to login. */
    USER_LOGIN_FAILED = 4100,
    /** Transaction is being processed. */
    TRANSACTION_BEING_PROCESSED = 7000,
    /** Transaction is being processed by the provider of the payment instrument selected. */
    PROVIDER_PROCESSING = 7002,
    /** Transaction is authorized successfully. */
    AUTHORIZED_SUCCESSFULLY = 9000,
}

/** @see https://developers.momo.vn/v3/docs/payment/api/result-handling/resultcode/ */
export enum RESULT_TYPE {
    NONE = "None",
    SYSTEM_ERROR = "System error",
    MERCHANT_ERROR = "Merchant error",
    USER_ERROR = "User error",
    PENDING = "Pending",
}
