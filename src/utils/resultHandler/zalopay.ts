import { ERROR_RESULT_TYPE, ZLP_RETURN_CODE, ZLP_SUB_RETURN_CODE } from "../../interfaces/bankingServices/zalopay";

import type { IZaloPay } from "../../interfaces/bankingServices";
import ServiceUnknownResponseError from "../../errors/serviceUnknownResponseError";
import ApiResponseError from "../../errors/apiResponseError";
import ServiceError from "../../errors/serviceError";
import BadFormatRequestError from "../../errors/badFormatRequestError";

export function resultHandler(statusCode: number, data: IZaloPay.PaymentLinkResponse): IZaloPay.PaymentLinkResponse;
export function resultHandler(
    statusCode: number,
    data: IZaloPay.TransactionStatusResponse
): IZaloPay.TransactionStatusResponse;
export function resultHandler(
    statusCode: number,
    data: IZaloPay.PaymentLinkResponse | IZaloPay.TransactionStatusResponse
): IZaloPay.PaymentLinkResponse | IZaloPay.TransactionStatusResponse {
    const { return_code, sub_return_code } = data;

    switch (return_code) {
        case ZLP_RETURN_CODE.PENDING:
        case ZLP_RETURN_CODE.SUCCESSFUL:
            return data;

        case ZLP_RETURN_CODE.ERROR:
            const resultType = ResultMap.get(sub_return_code);

            if (resultType === ERROR_RESULT_TYPE.MERCHANT_ERROR) merchantResultHandler(statusCode, data);
            else if (resultType === ERROR_RESULT_TYPE.SYSTEM_ERROR) serverResultHandler(statusCode, data);
            break;

        default:
            throw new ServiceUnknownResponseError(
                "ZaloPay",
                "resultHandler",
                "There are new response code returned by ZaloPay",
                {
                    statusCode,
                    data,
                }
            );
    }

    throw new ApiResponseError("zalopay", 400, data);
}

function merchantResultHandler(
    statusCode: number,
    data: IZaloPay.PaymentLinkResponse | IZaloPay.TransactionStatusResponse
): void {
    const { sub_return_code } = data;

    switch (sub_return_code) {
        case ZLP_SUB_RETURN_CODE.REQUEST_FORMAT_INVALID:
        case ZLP_SUB_RETURN_CODE.APPID_INVALID:
        case ZLP_SUB_RETURN_CODE.ILLEGAL_DATA_REQUEST:
            throw new BadFormatRequestError("zalopay", data);

        case ZLP_SUB_RETURN_CODE.TRANS_NOT_FOUND:

        case ZLP_SUB_RETURN_CODE.ZPW_BALANCE_NOT_ENOUGH:
        case ZLP_SUB_RETURN_CODE.REFUND_TYPE_INVALID:
        case ZLP_SUB_RETURN_CODE.MAC_INVALID:
        case ZLP_SUB_RETURN_CODE.PMC_NOT_SUPPORT_REFUND:
        case ZLP_SUB_RETURN_CODE.TRANS_NOT_COMPLETE:
        case ZLP_SUB_RETURN_CODE.TRANS_FAIL:

        case ZLP_SUB_RETURN_CODE.TRANSTYPE_NOT_SUPPORT_REFUND:
        case ZLP_SUB_RETURN_CODE.TRANS_ALREADY_SUCCESS:
        case ZLP_SUB_RETURN_CODE.REFUND_EXPIRE_TIME:
        case ZLP_SUB_RETURN_CODE.REFUND_AMOUNT_INVALID:
        case ZLP_SUB_RETURN_CODE.DUPLICATE_REFUND:
        case ZLP_SUB_RETURN_CODE.INVALID_MERCHANT_REFUNDID_FORMAT:
        case ZLP_SUB_RETURN_CODE.INVALID_MERCHANT_REFUNDID_DATE:
        case ZLP_SUB_RETURN_CODE.INVALID_MERCHANT_REFUNDID_APPID:
        case ZLP_SUB_RETURN_CODE.CLIENTID_INVALID:
        case ZLP_SUB_RETURN_CODE.TRANS_INVALID:
        case ZLP_SUB_RETURN_CODE.TRANS_INFO_NOT_FOUND:
        case ZLP_SUB_RETURN_CODE.HMAC_INVALID:
        case ZLP_SUB_RETURN_CODE.TIME_INVALID:
        case ZLP_SUB_RETURN_CODE.APPTRANSID_INVALID:
        case ZLP_SUB_RETURN_CODE.ORDER_NOT_EXIST:
        case ZLP_SUB_RETURN_CODE.LIMIT_REQUEST_REACH:
            break;

        case ZLP_SUB_RETURN_CODE.ILLEGAL_APP_REQUEST:
        case ZLP_SUB_RETURN_CODE.ILLEGAL_SIGNATURE_REQUEST:
        case ZLP_SUB_RETURN_CODE.ILLEGAL_CLIENT_REQUEST:
        default:
            throw new ServiceUnknownResponseError(
                "zalopay",
                "serverErrorHandler",
                "There are new result code returned by zalopay",
                {
                    statusCode,
                    data,
                }
            );
    }
}

function serverResultHandler(
    statusCode: number,
    data: IZaloPay.PaymentLinkResponse | IZaloPay.TransactionStatusResponse
): void {
    const { sub_return_code } = data;

    switch (sub_return_code) {
        case ZLP_SUB_RETURN_CODE.REFUND_PENDING:
        case ZLP_SUB_RETURN_CODE.INSERT_REFUND_PARTIAL_HISTORY_FAIL:
        case ZLP_SUB_RETURN_CODE.INSERT_REFUND_LOG_AR_FAIL:
        case ZLP_SUB_RETURN_CODE.UPDATE_REFUND_LOG_AR_FAIL:
        case ZLP_SUB_RETURN_CODE.TRANS_STATUS_NOT_SUPPORT_REFUND:
        case ZLP_SUB_RETURN_CODE.INSERT_REFUND_TRANSLOG_FAIL:
        case ZLP_SUB_RETURN_CODE.UPDATE_TOTAL_REFUND_AMOUNT_FAIL:
        case ZLP_SUB_RETURN_CODE.REFUND_NOT_FOUND:
        case ZLP_SUB_RETURN_CODE.REFUND_STATUS_NOT_SUPPORT_REFUND:
        case ZLP_SUB_RETURN_CODE.NOT_FOUND_BANKSYSTEM:
        case ZLP_SUB_RETURN_CODE.REFUND_CACHE_AND_DB_INCONSISTENT:
        case ZLP_SUB_RETURN_CODE.REFUND_OVER_TIME:
        case ZLP_SUB_RETURN_CODE.SYSTEM_ERROR:
            throw new ServiceError("zalopay", statusCode, data);

        default:
            throw new ServiceUnknownResponseError(
                "zalopay",
                "serverResultHandler",
                "There are new result code returned by zalopay",
                {
                    statusCode,
                    data,
                }
            );
    }
}

const ResultMap = new Map<ZLP_SUB_RETURN_CODE, ERROR_RESULT_TYPE>([
    [ZLP_SUB_RETURN_CODE.PENDING, ERROR_RESULT_TYPE.NONE],
    [ZLP_SUB_RETURN_CODE.SUCCESSFUL, ERROR_RESULT_TYPE.NONE],

    [ZLP_SUB_RETURN_CODE.ZPW_BALANCE_NOT_ENOUGH, ERROR_RESULT_TYPE.USER_ERROR],

    [ZLP_SUB_RETURN_CODE.TRANS_INFO_NOT_FOUND, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.REFUND_TYPE_INVALID, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.MAC_INVALID, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.PMC_NOT_SUPPORT_REFUND, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.TRANS_NOT_COMPLETE, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.TRANS_FAIL, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.TRANS_NOT_FOUND, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.TRANSTYPE_NOT_SUPPORT_REFUND, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.APPID_INVALID, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.TRANS_ALREADY_SUCCESS, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.REQUEST_FORMAT_INVALID, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.REFUND_EXPIRE_TIME, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.REFUND_AMOUNT_INVALID, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.DUPLICATE_REFUND, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.INVALID_MERCHANT_REFUNDID_FORMAT, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.INVALID_MERCHANT_REFUNDID_DATE, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.INVALID_MERCHANT_REFUNDID_APPID, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.CLIENTID_INVALID, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.TRANS_INVALID, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.HMAC_INVALID, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.TIME_INVALID, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.APPTRANSID_INVALID, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.ORDER_NOT_EXIST, ERROR_RESULT_TYPE.MERCHANT_ERROR],

    [ZLP_SUB_RETURN_CODE.ILLEGAL_DATA_REQUEST, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.ILLEGAL_APP_REQUEST, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.ILLEGAL_SIGNATURE_REQUEST, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.ILLEGAL_CLIENT_REQUEST, ERROR_RESULT_TYPE.MERCHANT_ERROR],
    [ZLP_SUB_RETURN_CODE.LIMIT_REQUEST_REACH, ERROR_RESULT_TYPE.MERCHANT_ERROR],

    [ZLP_SUB_RETURN_CODE.REFUND_PENDING, ERROR_RESULT_TYPE.SYSTEM_ERROR],
    [ZLP_SUB_RETURN_CODE.INSERT_REFUND_PARTIAL_HISTORY_FAIL, ERROR_RESULT_TYPE.SYSTEM_ERROR],
    [ZLP_SUB_RETURN_CODE.INSERT_REFUND_LOG_AR_FAIL, ERROR_RESULT_TYPE.SYSTEM_ERROR],
    [ZLP_SUB_RETURN_CODE.UPDATE_REFUND_LOG_AR_FAIL, ERROR_RESULT_TYPE.SYSTEM_ERROR],
    [ZLP_SUB_RETURN_CODE.TRANS_STATUS_NOT_SUPPORT_REFUND, ERROR_RESULT_TYPE.SYSTEM_ERROR],
    [ZLP_SUB_RETURN_CODE.INSERT_REFUND_TRANSLOG_FAIL, ERROR_RESULT_TYPE.SYSTEM_ERROR],
    [ZLP_SUB_RETURN_CODE.UPDATE_TOTAL_REFUND_AMOUNT_FAIL, ERROR_RESULT_TYPE.SYSTEM_ERROR],
    [ZLP_SUB_RETURN_CODE.REFUND_NOT_FOUND, ERROR_RESULT_TYPE.SYSTEM_ERROR],
    [ZLP_SUB_RETURN_CODE.REFUND_STATUS_NOT_SUPPORT_REFUND, ERROR_RESULT_TYPE.SYSTEM_ERROR],
    [ZLP_SUB_RETURN_CODE.NOT_FOUND_BANKSYSTEM, ERROR_RESULT_TYPE.SYSTEM_ERROR],
    [ZLP_SUB_RETURN_CODE.REFUND_CACHE_AND_DB_INCONSISTENT, ERROR_RESULT_TYPE.SYSTEM_ERROR],
    [ZLP_SUB_RETURN_CODE.REFUND_OVER_TIME, ERROR_RESULT_TYPE.SYSTEM_ERROR],

    [ZLP_SUB_RETURN_CODE.SYSTEM_ERROR, ERROR_RESULT_TYPE.SYSTEM_ERROR],
]);
