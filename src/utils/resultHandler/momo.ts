import { RESULT_CODE, RESULT_TYPE } from "../../interfaces/bankingServices/momo.js";

import ServiceError from "../../errors/serviceError.js";
import ApiResponseError from "../../errors/apiResponseError.js";
import BadFormatRequestError from "../../errors/badFormatRequestError.js";
import ServiceUnknownResponseError from "../../errors/serviceUnknownResponseError.js";

import type { IMomo } from "../../interfaces/bankingServices/index.js";

export function resultHandler(statusCode: number, data: IMomo.PaymentLinkResponse): IMomo.PaymentLinkResponse;
export function resultHandler(
    statusCode: number,
    data: IMomo.TransactionStatusResponse
): IMomo.TransactionStatusResponse;
export function resultHandler(
    statusCode: number,
    data: IMomo.TransactionStatusResponse | IMomo.PaymentLinkResponse
): IMomo.TransactionStatusResponse | IMomo.PaymentLinkResponse {
    const { resultCode } = data;
    const resultType = ResultMap.get(resultCode);

    switch (resultType) {
        case RESULT_TYPE.NONE:
        case RESULT_TYPE.PENDING:
            return data;
        case RESULT_TYPE.USER_ERROR:
            break;
        case RESULT_TYPE.SYSTEM_ERROR:
            serverResultHandler(statusCode, data);
            break;
        case RESULT_TYPE.MERCHANT_ERROR:
            merchantResultHandler(statusCode, data);
            break;
        default:
            throw new ServiceUnknownResponseError(
                "momo",
                "resultHandler",
                "There are new result type returned by momo",
                {
                    statusCode,
                    type: resultType,
                    data,
                }
            );
    }

    throw new ApiResponseError("momo", statusCode, data);
}

function serverResultHandler(
    statusCode: number,
    data: IMomo.TransactionStatusResponse | IMomo.PaymentLinkResponse
): void {
    const { resultCode } = data;

    switch (resultCode) {
        case RESULT_CODE.UNKNOWN_ERROR:
        case RESULT_CODE.SYSTEM_MAINTENANCE:
        case RESULT_CODE.QR_CODE_NOT_GENERATED:
        case RESULT_CODE.UNSUPPORTED_API_VERSION:
            throw new ServiceError("momo", statusCode, data);

        case RESULT_CODE.ACCESS_DENIED:
        case RESULT_CODE.URL_OR_QR_CODE_EXPIRED:
        case RESULT_CODE.INAPPLICABLE_INFORMATION:
        case RESULT_CODE.RESTRICTED_BY_PROMOTION_RULES:
        case RESULT_CODE.INACTIVE_OR_NONE_EXISTENT_USER_ACCOUNT:
            break;
        default:
            throw new ServiceUnknownResponseError(
                "momo",
                "serverErrorHandler",
                "There are new result code returned by momo",
                {
                    statusCode,
                    data,
                }
            );
    }
}

function merchantResultHandler(
    statusCode: number,
    data: IMomo.TransactionStatusResponse | IMomo.PaymentLinkResponse
): void {
    const { resultCode } = data;

    switch (resultCode) {
        case RESULT_CODE.BAD_FORMAT_REQUEST:
            throw new BadFormatRequestError("momo", data);

        case RESULT_CODE.REFUND_FAILED:
        case RESULT_CODE.REFUND_REJECTED:
        case RESULT_CODE.INVALID_ORDER_ID:
        case RESULT_CODE.INSUFFICIENT_FUNDS:
        case RESULT_CODE.DUPLICATED_ITEM_ID:
        case RESULT_CODE.DUPLICATED_ORDER_ID:
        case RESULT_CODE.CANCELLED_BY_MERCHANT:
        case RESULT_CODE.DUPLICATED_REQUEST_ID:
        case RESULT_CODE.INELIGIBLE_FOR_REFUND:
        case RESULT_CODE.TRANSACTION_CANCELLED:
        case RESULT_CODE.INVALID_ORDER_GROUP_ID:
        case RESULT_CODE.INVALID_TRANSACTION_AMOUNT:
        case RESULT_CODE.MERCHANT_AUTHENTICATION_FAILED:
        case RESULT_CODE.TRANSACTION_AMOUNT_OUT_OF_RANGE:
        case RESULT_CODE.ANALOGOUS_TRANSACTION_BEING_PROCESSED:
            break;
        default:
            throw new ServiceUnknownResponseError(
                "momo",
                "merchantErrorHandler",
                "There are new error code returned by momo",
                {
                    statusCode,
                    data,
                }
            );
    }
}

const ResultMap = new Map<RESULT_CODE, RESULT_TYPE>([
    [RESULT_CODE.SUCCESS, RESULT_TYPE.NONE],
    [RESULT_CODE.SYSTEM_MAINTENANCE, RESULT_TYPE.SYSTEM_ERROR],
    [RESULT_CODE.ACCESS_DENIED, RESULT_TYPE.SYSTEM_ERROR],
    [RESULT_CODE.UNSUPPORTED_API_VERSION, RESULT_TYPE.SYSTEM_ERROR],
    [RESULT_CODE.MERCHANT_AUTHENTICATION_FAILED, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.BAD_FORMAT_REQUEST, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.INVALID_TRANSACTION_AMOUNT, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.TRANSACTION_AMOUNT_OUT_OF_RANGE, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.DUPLICATED_REQUEST_ID, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.DUPLICATED_ORDER_ID, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.INVALID_ORDER_ID, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.ANALOGOUS_TRANSACTION_BEING_PROCESSED, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.DUPLICATED_ITEM_ID, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.INAPPLICABLE_INFORMATION, RESULT_TYPE.SYSTEM_ERROR],
    [RESULT_CODE.QR_CODE_NOT_GENERATED, RESULT_TYPE.SYSTEM_ERROR],
    [RESULT_CODE.UNKNOWN_ERROR, RESULT_TYPE.SYSTEM_ERROR],
    [RESULT_CODE.TRANSACTION_INITIATED, RESULT_TYPE.NONE],
    [RESULT_CODE.INSUFFICIENT_FUNDS, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.REJECTED_BY_ISSUER, RESULT_TYPE.USER_ERROR],
    [RESULT_CODE.TRANSACTION_CANCELLED, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.EXCEEDS_PAYMENT_LIMIT, RESULT_TYPE.USER_ERROR],
    [RESULT_CODE.URL_OR_QR_CODE_EXPIRED, RESULT_TYPE.SYSTEM_ERROR],
    [RESULT_CODE.USER_DENIED_PAYMENT, RESULT_TYPE.USER_ERROR],
    [RESULT_CODE.INACTIVE_OR_NONE_EXISTENT_USER_ACCOUNT, RESULT_TYPE.SYSTEM_ERROR],
    [RESULT_CODE.CANCELLED_BY_MERCHANT, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.RESTRICTED_BY_PROMOTION_RULES, RESULT_TYPE.SYSTEM_ERROR],
    [RESULT_CODE.REFUND_FAILED, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.REFUND_REJECTED, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.INELIGIBLE_FOR_REFUND, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.INVALID_ORDER_GROUP_ID, RESULT_TYPE.MERCHANT_ERROR],
    [RESULT_CODE.USER_ACCOUNT_RESTRICTED, RESULT_TYPE.USER_ERROR],
    [RESULT_CODE.USER_LOGIN_FAILED, RESULT_TYPE.USER_ERROR],
    [RESULT_CODE.TRANSACTION_BEING_PROCESSED, RESULT_TYPE.PENDING],
    [RESULT_CODE.PROVIDER_PROCESSING, RESULT_TYPE.PENDING],
    [RESULT_CODE.AUTHORIZED_SUCCESSFULLY, RESULT_TYPE.PENDING],
]);
