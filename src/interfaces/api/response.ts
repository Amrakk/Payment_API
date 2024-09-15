import type PaymentAPIError from "../../errors/paymentAPIError.js";
import type { IMomo, IVietQR, IPayOS } from "../bankingServices/index.js";

export interface IResponse<T> {
    /** Response code */
    code: RESPONSE_CODE;
    /** Response message */
    message: RESPONSE_MESSAGE;
    /** Response data */
    data?: T;
    /** Error details */
    error?: PaymentAPIError;
}

export type IPaymentLink = IMomo.PaymentLinkResponse | IPayOS.PaymentLinkResponseData | undefined;
export type ITransactionStatus = IMomo.TransactionStatusResponse | IPayOS.TransactionStatusResponseData | undefined;

export type IGetQRCode = IVietQR.GenerateQRCodeResponse | undefined;
export type IBanks = IVietQR.Bank[] | IMomo.ResponseGetBanks | undefined;

export enum RESPONSE_CODE {
    SUCCESS = 0,
    UNAUTHORIZED = 1,
    PAYMENT_REQUIRED = 2,
    FORBIDDEN = 3,
    UNSUPPORTED_ERROR = 6,
    WEBHOOK_NOT_FOUND = 7,
    VALIDATION_ERROR = 8,
    SERVICE_NOT_FOUND = 9,
    INTERNAL_SERVER_ERROR = 10,
}

export enum RESPONSE_MESSAGE {
    SUCCESS = "Operation completed successfully",
    UNAUTHORIZED = "Access denied! Please provide valid authentication",
    PAYMENT_REQUIRED = "Payment is required to proceed",
    FORBIDDEN = "You do not have permission to access this resource",
    UNSUPPORTED_ERROR = "Unsupported service! Please verify the user has access to the service",
    WEBHOOK_NOT_FOUND = "Webhook not found!",
    VALIDATION_ERROR = "Input validation failed! Please check your data",
    SERVICE_NOT_FOUND = "Service not found! Please verify the 'service' parameter and try again",
    INTERNAL_SERVER_ERROR = "An unexpected error occurred! Please try again later.",
}
