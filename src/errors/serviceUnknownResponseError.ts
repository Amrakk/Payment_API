import BaseError from "./baseError.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../interfaces/api/index.js";

import type { IResponse } from "../interfaces/api/index.js";

export default class ServiceUnknownResponseError extends BaseError {
    service: string;
    operation: string;
    description?: string;
    details?: object;

    statusCode = 500;

    constructor(service: string, operation: string, description?: string, details?: object) {
        super(RESPONSE_MESSAGE.SERVICE_UNKNOWN_RESPONSE);

        this.service = service;
        this.operation = operation;
        this.description = description;
        this.details = details;
    }

    getResponseBody(): IResponse {
        return {
            code: RESPONSE_CODE.SERVICE_UNKNOWN_RESPONSE,
            message: RESPONSE_MESSAGE.SERVICE_UNKNOWN_RESPONSE,
            error: {
                service: this.service,
                operation: this.operation,
            },
        };
    }
}
