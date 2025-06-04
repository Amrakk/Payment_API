import { VNPAY_RESPONSE_CODE } from "../../interfaces/bankingServices/vnpay";
import ServiceUnknownResponseError from "../../errors/serviceUnknownResponseError";

import ApiResponseError from "../../errors/apiResponseError";

import type { IVNPay } from "../../interfaces/bankingServices";

export function resultHandler(
    statusCode: number,
    data: IVNPay.TransactionStatusResponse
): IVNPay.TransactionStatusResponse {
    const { vnp_ResponseCode } = data;

    switch (vnp_ResponseCode) {
        case VNPAY_RESPONSE_CODE.SUCCESS:
            return data;

        case VNPAY_RESPONSE_CODE.INVALID_TMN_CODE:
            data.vnp_Message = "Invalid TMN Code";
            break;

        /** TODO: test all other response codes */
        case VNPAY_RESPONSE_CODE.SUSPICIOUS:
        case VNPAY_RESPONSE_CODE.UNREGISTERED_INTERNET_BANKING:
        case VNPAY_RESPONSE_CODE.AUTH_FAILED_3_TIMES:
        case VNPAY_RESPONSE_CODE.PAYMENT_TIMEOUT:
        case VNPAY_RESPONSE_CODE.ACCOUNT_LOCKED:
        case VNPAY_RESPONSE_CODE.INVALID_OTP:
        case VNPAY_RESPONSE_CODE.CUSTOMER_CANCELED:
        case VNPAY_RESPONSE_CODE.INSUFFICIENT_FUNDS:
        case VNPAY_RESPONSE_CODE.DAILY_LIMIT_EXCEEDED:

        case VNPAY_RESPONSE_CODE.BANK_MAINTENANCE:
        case VNPAY_RESPONSE_CODE.PASSWORD_RETRY_EXCEEDED:

        case VNPAY_RESPONSE_CODE.INVALID_DATA_FORMAT:
        case VNPAY_RESPONSE_CODE.TRANSACTION_NOT_FOUND:

        case VNPAY_RESPONSE_CODE.INVALID_CHECKSUM:

        case VNPAY_RESPONSE_CODE.DUPLICATE_REQUEST:

        case VNPAY_RESPONSE_CODE.REFUND_REQUEST_ALREADY_PROCESSING:
        case VNPAY_RESPONSE_CODE.REFUND_REQUEST_REJECTED:
            break;

        case VNPAY_RESPONSE_CODE.OTHER_ERROR:
        default:
            throw new ServiceUnknownResponseError(
                "VNPay",
                "resultHandler",
                "There are new response code returned by VNPay",
                {
                    statusCode,
                    data,
                }
            );
    }

    throw new ApiResponseError("vnpay", 400, data);
}
