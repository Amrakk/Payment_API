import { RESULT_CODE } from "../../interfaces/bankingServices/payos.js";

import PaymentApiError from "../../errors/paymentApiError.js";
import ApiResponseError from "../../errors/apiResponseError.js";
import BadFormatRequestError from "../../errors/badFormatRequestError.js";
import ServiceUnknownResponseError from "../../errors/serviceUnknownResponseError.js";

import type { IPayOS } from "../../interfaces/bankingServices/index.js";

export function resultHandler(statusCode: number, data: IPayOS.ResponsePayOS): IPayOS.ResponsePayOS;
export function resultHandler(statusCode: number, data: IPayOS.PaymentLinkResponse): IPayOS.PaymentLinkResponse;
export function resultHandler(
    statusCode: number,
    data: IPayOS.TransactionStatusResponse
): IPayOS.TransactionStatusResponse;
export function resultHandler(
    statusCode: number,
    data: IPayOS.TransactionStatusResponse | IPayOS.PaymentLinkResponse | IPayOS.ResponsePayOS
): IPayOS.TransactionStatusResponse | IPayOS.PaymentLinkResponse | IPayOS.ResponsePayOS {
    const { code: resultCode } = data;

    switch (resultCode) {
        case RESULT_CODE.SUCCESS:
            return data;

        case RESULT_CODE.BAD_FORMAT_REQUEST:
            throw new BadFormatRequestError("payos", data);

        case RESULT_CODE.SERVICE_UNAVAILABLE:
        case RESULT_CODE.MISSING_CREDENTIALS:
            throw new PaymentApiError("payos", "resultHandler", "Something went wrong with data validation", {
                statusCode,
                data,
                possibleReasons: possibleReasons.get(resultCode),
            });

        case RESULT_CODE.PAYMENT_GATEWAY_ERROR:
            throw new ApiResponseError("payos", 400, { ...data, possibleReasons: possibleReasons.get(resultCode) });

        case RESULT_CODE.INVALID_SIGNATURE:
        case RESULT_CODE.ORDER_CODE_NOT_EXISTS:
        case RESULT_CODE.ORDER_ID_ALREADY_EXISTS:
            break;
        default:
            throw new ServiceUnknownResponseError(
                "payos",
                "resultHandler",
                "There are new result code returned by payos",
                {
                    statusCode,
                    data,
                }
            );
    }

    throw new ApiResponseError("payos", 400, data);
}

const possibleReasons = new Map<RESULT_CODE, string[]>([
    [RESULT_CODE.SERVICE_UNAVAILABLE, ["Sending float order code"]],
    [RESULT_CODE.MISSING_CREDENTIALS, ["Missing API key or Client ID or both"]],
    [RESULT_CODE.PAYMENT_GATEWAY_ERROR, ["Invalid API key and Client ID pair"]],
]);
