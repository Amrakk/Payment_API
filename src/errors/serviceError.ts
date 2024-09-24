import BaseError from "./baseError.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../interfaces/api/index.js";

import type { IResponse } from "../interfaces/api/index.js";

export default class ServiceError extends BaseError {
    service: string;
    statusCode: number;
    data: object;

    constructor(service: string, statusCode: number, data: object) {
        super(RESPONSE_MESSAGE.SERVICE_UNAVAILABLE);

        this.service = service;
        this.statusCode = statusCode;
        this.data = data;
    }

    getResponseBody(): IResponse {
        return {
            code: RESPONSE_CODE.SERVICE_UNAVAILABLE,
            message: RESPONSE_MESSAGE.SERVICE_UNAVAILABLE,
            error: this,
        };
    }
}
