export interface ResponseVietQR<T extends Bank[] | GenerateQRCodeResponse> {
    /** Response code */
    code: string;
    /** Response message */
    desc: string;
    /** Response data */
    data: T;
}

export interface Bank {
    /** Id */
    id: number;
    /** Bank code */
    code: string;
    /** The six first bin digits */
    bin: string;
    /** Full bank name */
    name: string;
    /** Short bank name */
    shortName: string;
    /** Bank logo url */
    logo: string;
    /** Is support VietQr */
    transferSupported: number;
    /** Is support lookup */
    lookupSupported: number;
    /** Swift code */
    swift_code: string;
}

export interface GenerateQRCodeRequest {
    /** Bank account number */
    accountNo: string;
    /**
     * Bank account holder's name
     *
     * Note: Contrary to the 'VietQR' API docs, leaving 'accountName' undefined will cause an error
     * due to a mismatch between the docs and the actual API behavior.
     */
    accountName: string;
    /** Bank identification code (BIN) */
    acqId: number;
    /** Amount to be transferred */
    amount?: number;
    /** Transfer description */
    addInfo?: string;
    /** Returned format */
    format?: string;
    /**
     * The template of the returned VietQR
     *
     * Note: Contrary to the 'VietQR' API docs, leaving 'template' undefined will cause an error
     * due to a mismatch between the docs and the actual API behavior.
     */
    template: TEMPLATE;
}

export interface GenerateQRCodeResponse {
    /** Bank identification code (BIN) */
    acpId: number;
    /** Name of the bank account */
    accountName: string;
    /** Text format QR */
    qrCode: string;
    /** Data URI format QR */
    qrDataURL: string;
}

export enum TEMPLATE {
    /** QR, Logo, info - 600x776 */
    PRINT = "print",
    /** QR - 480x480 */
    QR_ONLY = "qr_only",
    /** QR, Logo - 540x540 */
    COMPACT = "compact",
    /** QR, Logo, info - 540x640*/
    COMPACT2 = "compact2",
}

/** Always response with status 200 */
export enum ResultCode {
    SUCCESS = "00",

    MISSING_PARAMETER = "01",
    MISSING_BANK_ACCOUNT_NUMBER = "11",
    MISSING_BANK_CODE = "12",
    MISSING_BANK_ACCOUNT_NAME = "13",
    INVALID_BANK_ACCOUNT_NUMBER = "21",
    INVALID_BANK_CODE = "22",
    INVALID_BANK_ACCOUNT_NAME = "23",
    INVALID_AMOUNT = "24",
    INVALID_TRANSFER_DESCRIPTION = "25",

    INVALID_TAX_CODE = "51",
    TAX_CODE_NOT_FOUND = "52",
}
