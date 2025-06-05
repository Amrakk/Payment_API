/** @see https://docs.zalopay.vn/v2/docs/gateway/api.html#lay-danh-sach-cac-ngan-hang-duoc-ho-tro_dac-ta-api_tham-so-api-tra-ve */
export interface GetBanksResponse {
    returncode: ZLP_RETURN_CODE;
    returnmessage: string;
    /** List of banks */
    banks: Map<ZLP_PMCID, Bank[]>;
}

export interface Bank {
    bankcode: string;
    name: string;
    displayorder: number;
    pmcid: ZLP_PMCID;
    minamount: number;
    maxamount: number;
}

export interface PaymentLinkRequestInput
    extends Omit<PaymentLinkRequests, "app_id" | "app_time" | "item" | "embed_data" | "mac"> {
    app_time?: number;
    item?: string | Record<string, unknown>;
    embed_data?: string | PaymentLinkEmbedData;
}

/** @see https://docs.zalopay.vn/v2/general/overview.html#tao-don-hang_thong-tin-don-hang */
export interface PaymentLinkRequests {
    /** Application ID issued by ZaloPay during registration */
    app_id: number;
    /** Unique user identifier: id, username, phone, etc. (size <= 50) */
    app_user: string;
    /** Unique transaction ID starting with yymmdd (GMT+7) (size <= 40) [Example: 250605_01]
     *
     * NOTE: The prefix will be handled by this api
     */
    app_trans_id: string;
    /** Order creation timestamp in milliseconds (UNIX time) */
    app_time: number;
    /** Order expiry duration in seconds (300 to 2592000) */
    expire_duration_seconds?: number;
    /** Total order amount in VND */
    amount: number;
    /** List of items in the order as JSON string (size <= 2048) */
    item: string;
    /** Description shown to the user and merchant dashboard (size <= 256) */
    description: string;
    /** Custom data returned in callback as a JSON string (size <= 1024) */
    embed_data: string;
    /** Bank code (required for specific payment methods) */
    bank_code?: string;
    /** Hash string to authenticate the order */
    mac: string;
    /** URL to receive payment result notification */
    callback_url?: string;
    /** Device info as JSON string (size <= 256) */
    device_info?: string;
    /** Sub-service ID for partner grouping (special partners only) */
    sub_app_id?: string;
    /** Order title (size <= 256) */
    title?: string;
    /** Currency code (default is VND) */
    currency?: string;
    /** User phone number (size <= 50) */
    phone?: string;
    /** User email address (size <= 100) */
    email?: string;
    /** User physical address (size <= 1024) */
    address?: string;
}

export interface PaymentLinkEmbedData {
    /** Preferred payment methods to display on ZaloPay gateway */
    preferred_payment_method?: string[];
    /** Redirect URL after successful payment */
    redirecturl?: string;
    /** JSON string custom transaction data for display in ZaloPay Merchant tool */
    columninfo?: string;
    /** JSON string promotion campaign information */
    promotioninfo?: string;
    /** Payment account ID for revenue splitting */
    zlppaymentid?: string;
}

export interface PaymentLinkResponse {
    /** Return code */
    return_code: ZLP_RETURN_CODE;
    /** Description of the return_code */
    return_message: string;
    /** Detailed sub status code */
    sub_return_code: ZLP_SUB_RETURN_CODE;
    /** Description of the sub status code */
    sub_return_message: string;
    /** URL to redirect user or generate QR code */
    order_url: string;
    /** Token identifying the order for use with ZaloPay API */
    zp_trans_token: string;
    /** Alternative token identifying the order */
    order_token: string;
    /** QR code URL for NAPAS VietQR payment */
    qr_code?: string;
}

/** @see https://docs.zalopay.vn/v2/general/overview.html#callback_dac-ta-api_du-lieu-nhan-duoc-tu-callback */
export interface PaymentLinkCallbackRequest {
    /** JSON string containing the transaction information */
    data: string;
    /** Hash string to authenticate the order */
    mac: string;
    /** Callback type */
    type: ZLP_CALLBACK_TYPE;
}

export interface PaymentLinkCallbackRequestData {
    /** ID of the application */
    app_id: number;
    /** Merchant's transaction ID (format: yymmdd + unique string) */
    app_trans_id: string;
    /** Timestamp when the order was created (in milliseconds) */
    app_time: number;
    /** Identifier for the user who initiated the order */
    app_user: string;
    /** Amount the merchant received (in VND) */
    amount: number;
    /** Custom metadata in JSON string format (always JSON string, even if empty) */
    embed_data: string;
    /** List of items purchased in JSON array string format (always JSON array string, even if empty) */
    item: string;
    /** ZaloPay transaction ID */
    zp_trans_id: number;
    /** Timestamp when the transaction was completed (in milliseconds) */
    server_time: number;
    /** Payment method/channel used (e.g., 36: Visa, 38: ZaloPay, etc.) */
    channel: ZLP_PMCID;
    /** ZaloPay user ID who completed the payment */
    merchant_user_id: string;
    /** Fee amount (if any) paid by the user */
    user_fee_amount: number;
    /** Discount amount applied to the transaction */
    discount_amount: number;
}

export interface TransactionStatusRequestInput extends Pick<TransactionStatusRequest, "app_trans_id"> {}

/** @see https://docs.zalopay.vn/v2/general/overview.html#truy-van-trang-thai-thanh-toan-cua-don-hang_dac-ta-api_du-lieu-truyen-vao-api */
export interface TransactionStatusRequest {
    /** ID of the application */
    app_id: number;
    /** Unique transaction ID starting with yymmdd (GMT+7) (size <= 40) */
    app_trans_id: string;
    /** Hash string to authenticate the order */
    mac: string;
}

/** @see https://docs.zalopay.vn/v2/general/overview.html#truy-van-trang-thai-thanh-toan-cua-don-hang_dac-ta-api_tham-so-api-tra-ve */
export interface TransactionStatusResponse {
    /** Return code */
    return_code: ZLP_RETURN_CODE;
    /** Description of the main return code */
    return_message: string;
    /** Detailed status code */
    sub_return_code: ZLP_SUB_RETURN_CODE;
    /** Description of the detailed status */
    sub_return_message: string;
    /** Indicates whether the transaction is still processing */
    is_processing: boolean;
    /** Amount received by the application (0 if not yet completed) */
    amount: number;
    /** Discount amount applied */
    discount_amount: number;
    /** ZaloPay transaction ID (0 if not yet completed) */
    zp_trans_id: number;
}

export enum ZLP_PAYMENT_METHOD {
    ACCOUNT = "account",
    DOMESTIC_CARD = "domestic_card",
    VIET_QR = "vietqr",
    ZALOPAY_WALLET = "zalopay_wallet",
    INTERNATIONAL_CARD = "international_card",
    APPLEPAY = "applepay",
}

export enum ZLP_PMCID {
    VisaMasterJCB = 36,
    BankAccount = 37,
    ZaloPay = 38,
    ATM = 39,
    VisaMasterDebit = 41,
}

export enum ZLP_CALLBACK_TYPE {
    ORDER = 1,
    AGREEMENT = 2,
}

/** @see https://docs.zalopay.vn/v2/reference/errors/overview.html */
export enum ZLP_RETURN_CODE {
    SUCCESSFUL = 1,
    ERROR = 2,
    PENDING = 3,
}

export enum ZLP_SUB_RETURN_CODE {
    PENDING = 0,
    SUCCESSFUL = 1,

    /** @see https://docs.zalopay.vn/v2/reference/common/overview.html#cac-loi-thuong-gap_6-loi-49-trans_info_not_found-khi-truy-van-trang-thai-don-hang */
    TRANS_INFO_NOT_FOUND = -49,

    // Merchant errors
    REFUND_TYPE_INVALID = -2,
    MAC_INVALID = -3,
    PMC_NOT_SUPPORT_REFUND = -4,
    TRANS_NOT_COMPLETE = -5,
    TRANS_FAIL = -6,
    TRANS_NOT_FOUND = -8,
    TRANSTYPE_NOT_SUPPORT_REFUND = -9,
    APPID_INVALID = -10,
    TRANS_ALREADY_SUCCESS = -11,
    REQUEST_FORMAT_INVALID = -12,
    REFUND_EXPIRE_TIME = -13,
    REFUND_AMOUNT_INVALID = -14,
    DUPLICATE_REFUND = -23,
    INVALID_MERCHANT_REFUNDID_FORMAT = -24,
    INVALID_MERCHANT_REFUNDID_DATE = -25,
    INVALID_MERCHANT_REFUNDID_APPID = -26,
    CLIENTID_INVALID = -27,
    TRANS_INVALID = -28,
    HMAC_INVALID = -53,
    TIME_INVALID = -54,
    ZPW_BALANCE_NOT_ENOUGH = -63,
    APPTRANSID_INVALID = -92,
    ORDER_NOT_EXIST = -101,

    ILLEGAL_DATA_REQUEST = -401,
    ILLEGAL_APP_REQUEST = -402,
    ILLEGAL_SIGNATURE_REQUEST = -403,
    ILLEGAL_CLIENT_REQUEST = -405,
    LIMIT_REQUEST_REACH = -429,

    // System errors
    REFUND_PENDING = -1,
    INSERT_REFUND_PARTIAL_HISTORY_FAIL = -15,
    INSERT_REFUND_LOG_AR_FAIL = -16,
    UPDATE_REFUND_LOG_AR_FAIL = -17,
    TRANS_STATUS_NOT_SUPPORT_REFUND = -18,
    INSERT_REFUND_TRANSLOG_FAIL = -19,
    UPDATE_TOTAL_REFUND_AMOUNT_FAIL = -20,
    REFUND_NOT_FOUND = -21,
    REFUND_STATUS_NOT_SUPPORT_REFUND = -22,
    NOT_FOUND_BANKSYSTEM = -29,
    REFUND_CACHE_AND_DB_INCONSISTENT = -30,
    REFUND_OVER_TIME = -31,
    SYSTEM_ERROR = -500,
}

export enum ERROR_RESULT_TYPE {
    NONE = "None",
    SYSTEM_ERROR = "System error",
    MERCHANT_ERROR = "Merchant error",
    USER_ERROR = "User error",
}
