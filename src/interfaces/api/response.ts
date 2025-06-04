import type BaseError from "../../errors/baseError.js";
import type { IMomo, IVietQR, IPayOS, IVNPay } from "../bankingServices/index.js";

export interface IResponse<T = undefined> {
    /** Response code */
    code: RESPONSE_CODE;
    /** Response message */
    message: RESPONSE_MESSAGE;
    /** Response data */
    data?: T;
    /** Error details */
    error?: BaseError | Record<string, unknown> | Array<unknown> | string;
}

export type IPaymentLink =
    | IMomo.PaymentLinkResponse
    | IPayOS.PaymentLinkResponseData
    | IVNPay.PaymentLinkResponse
    | undefined;
export type ITransactionStatus =
    | IMomo.TransactionStatusResponse
    | IPayOS.TransactionStatusResponseData
    | IVNPay.TransactionStatusResponse
    | undefined;

export type IGetQRCode = IVietQR.GenerateQRCodeResponse | undefined;
export type IBanks = IVietQR.Bank[] | IMomo.ResponseGetBanks | IVNPay.Bank[] | undefined;

export enum RESPONSE_CODE {
    SUCCESS = 0,
    UNAUTHORIZED = 1,
    PAYMENT_REQUIRED = 2,
    FORBIDDEN = 3,
    BAD_REQUEST = 4,
    UNSUPPORTED_ERROR = 6,
    VALIDATION_ERROR = 8,
    SERVICE_NOT_FOUND = 9,
    API_RESPONSE_ERROR = 10,

    BAD_FORMAT_REQUEST = 40,
    SERVICE_UNKNOWN_RESPONSE = 45,
    SERVICE_UNAVAILABLE = 50,
    INTERNAL_SERVER_ERROR = 100,
}

export enum RESPONSE_MESSAGE {
    SUCCESS = "Operation completed successfully",
    UNAUTHORIZED = "Access denied! Please provide valid authentication",
    PAYMENT_REQUIRED = "Payment is required to proceed",
    FORBIDDEN = "You do not have permission to access this resource",
    BAD_REQUEST = "Invalid request! Please check your input data",
    UNSUPPORTED_ERROR = "This operation is not supported",
    VALIDATION_ERROR = "Input validation failed! Please check your data",
    SERVICE_NOT_FOUND = "Service not found! Please verify the 'service' parameter and try again",
    API_RESPONSE_ERROR = "An error occurred while processing the request",

    BAD_FORMAT_REQUEST = "The request contains a value that unintentionally bypassed validation due to an unrecognized or invalid schema format.",
    SERVICE_UNKNOWN_RESPONSE = "The service returned an unexpected response from the API.",
    SERVICE_UNAVAILABLE = "Service is currently unavailable. Please try again later",
    INTERNAL_SERVER_ERROR = "An unexpected error occurred! Please try again later.",
}
