import BaseError from "./baseError.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../interfaces/api/index.js";

import type { IResponse } from "../interfaces/api/index.js";

export default class PaymentApiError extends BaseError {
    service: string;
    operation: string;
    description?: string;
    details?: object;

    statusCode = 500;

    constructor(service: string, operation: string, description?: string, details?: object) {
        super(RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR);

        this.service = service;
        this.operation = operation;
        this.description = description;
        this.details = details;
    }

    getResponseBody(): IResponse {
        return {
            code: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
            message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
            error: {
                service: this.service,
                operation: this.operation,
            },
        };
    }
}
