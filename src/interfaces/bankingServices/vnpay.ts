export interface Bank {
    /** Bank code */
    bank_code: string;
    /** Bank name */
    bank_name: string;
    /** Bank logo path */
    logo_link: string;

    bank_type: number;
    display_order: number;
}

export interface PaymentLinkRequestInput
    extends Pick<PaymentLinkRequest, "vnp_Amount" | "vnp_BankCode" | "vnp_OrderInfo" | "vnp_TxnRef"> {
    vnp_ExpireDate: number;
}

/** @see https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#danh-s%C3%A1ch-tham-s%E1%BB%91 */
export interface PaymentLinkRequest {
    /** API version used by the merchant (Current: 2.1.0) */
    vnp_Version: string;
    /** API command code */
    vnp_Command: VNPAY_COMMAND.PAY;
    /** Merchant website code */
    vnp_TmnCode: string;
    /**
     * Payment amount (multiplied by 100) [Example: 10,000 VND → send 1000000]
     *
     * NOTE: This api will auto multiply by 100
     */
    vnp_Amount: number;
    /** Payment method code. If omitted, user selects at VNPAY. */
    vnp_BankCode?: BANK_CODE;
    /** Transaction creation time, format: yyyyMMddHHmmss (GMT+7) */
    vnp_CreateDate: string;
    /** Currency code for the transaction. Currently only supports: VND */
    vnp_CurrCode: VNPAY_CURRENCY;
    /** IP address of the customer initiating the transaction */
    vnp_IpAddr: string;
    /** Interface language */
    vnp_Locale: SUPPORTED_LANG;
    /** Payment description. Must be plain text (no accents or special characters) */
    vnp_OrderInfo: string;
    /** Product category code as defined by VNPAY */
    vnp_OrderType: string;

    /** URL to receive the transaction result */
    vnp_ReturnUrl: string;
    /**
     * Transaction expiration time, format: yyyyMMddHHmmss (GMT+7)
     *
     * NOTE: This api will auto convert to yyyyMMddHHmmss
     */
    vnp_ExpireDate: string;
    /** Transaction reference code in the merchant system. Must be unique per day */
    vnp_TxnRef: string;
    /** Secure hash (checksum) to ensure data integrity during transmission */
    vnp_SecureHash: string;
}

export interface PaymentLinkResponse
    extends Pick<
        PaymentLinkRequest,
        "vnp_TxnRef" | "vnp_Amount" | "vnp_OrderInfo" | "vnp_ExpireDate" | "vnp_CreateDate"
    > {
    /** Checkout URL */
    checkoutUrl: string;
}

export enum BANK_CODE {
    VNPAYQR = "VNPAYQR",
    VNBANK = "VNBANK",
    INTCARD = "INTCARD",
}

export enum SUPPORTED_LANG {
    VN = "vn",
    EN = "en",
}

export enum VNPAY_COMMAND {
    PAY = "pay",
    REFUND = "refund",
    QUERYDR = "querydr",

    TOKEN_PAY = "token_pay",
    TOKEN_REMOVE = "token_remove",
    TOKEN_CREATE = "token_create",
    PAY_AND_CREATE = "pay_and_create",
}

export enum VNPAY_CURRENCY {
    VND = "VND",
}

export enum VNPAY_ORDER_TYPE {
    // TODO: implement more types when needed
    OTHER = "other",
}

export enum IpnRspCode {
    Success = "00",
    OrderNotFound = "01",
    OrderAlreadyConfirmed = "02",
    IpProhibited = "03",
    InvalidAmount = "04",
    FailChecksum = "97",
    UnknownError = "99",
}

export type IpnResponse = {
    RspCode: IpnRspCode;
    Message: string;
};

export const IpnResponses = new Map<IpnRspCode, IpnResponse>([
    [IpnRspCode.Success, { RspCode: IpnRspCode.Success, Message: "Confirm Success" }],
    [IpnRspCode.OrderNotFound, { RspCode: IpnRspCode.OrderNotFound, Message: "Order not found" }],
    [
        IpnRspCode.OrderAlreadyConfirmed,
        { RspCode: IpnRspCode.OrderAlreadyConfirmed, Message: "Order already confirmed" },
    ],
    [IpnRspCode.IpProhibited, { RspCode: IpnRspCode.IpProhibited, Message: "IP prohibited" }],
    [IpnRspCode.InvalidAmount, { RspCode: IpnRspCode.InvalidAmount, Message: "Invalid amount" }],
    [IpnRspCode.FailChecksum, { RspCode: IpnRspCode.FailChecksum, Message: "Fail checksum" }],
    [IpnRspCode.UnknownError, { RspCode: IpnRspCode.UnknownError, Message: "Unknown error" }],
]);
