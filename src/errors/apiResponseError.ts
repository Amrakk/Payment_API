import BaseError from "./baseError.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../interfaces/api/index.js";

import type { IResponse } from "../interfaces/api/index.js";
import type { IMomo, IPayOS, IVNPay, IZaloPay } from "../interfaces/bankingServices/index.js";

export default class ApiResponseError<T extends "momo" | "payos" | "vnpay" | "zalopay"> extends BaseError {
    service: T;
    statusCode: number;
    data: ResponseMapping<T>;

    constructor(service: T, statusCode: number, data: ResponseMapping<T>) {
        super(RESPONSE_MESSAGE.API_RESPONSE_ERROR);

        this.service = service;
        this.statusCode = statusCode;
        this.data = data;
    }

    getResponseBody(): IResponse {
        return {
            code: RESPONSE_CODE.API_RESPONSE_ERROR,
            message: RESPONSE_MESSAGE.API_RESPONSE_ERROR,
            error: this,
        };
    }
}

type ResponseErrorService = "momo" | "payos" | "vnpay" | "zalopay";

type ResponseMapping<T extends ResponseErrorService> = { possibleReasons?: string[] } & (T extends "momo"
    ? IMomo.PaymentLinkResponse | IMomo.TransactionStatusResponse
    : T extends "payos"
    ? IPayOS.ResponsePayOS | IPayOS.PaymentLinkResponse | IPayOS.TransactionStatusResponse
    : T extends "vnpay"
    ? IVNPay.TransactionStatusResponse
    : T extends "zalopay"
    ? IZaloPay.PaymentLinkResponse | IZaloPay.TransactionStatusResponse
    : never);
