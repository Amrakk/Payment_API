export interface ResponseGetBanks {
    /** Bank code */
    [bankCode: string]: Bank;
}

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
}

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

export enum SUPPORT_LANG {
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

export interface TransactionStatusRequest extends RequestBase {}

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
    lang: SUPPORT_LANG;
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
