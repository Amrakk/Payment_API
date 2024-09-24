import BaseError from "./baseError.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../interfaces/api/index.js";

import type { IResponse } from "../interfaces/api/index.js";

export default class UnsupportedError extends BaseError {
    service: string;
    operation: string;
    email?: string;

    statusCode: 409 | 501;

    constructor(service: string, operation: string, email?: string) {
        if (email)
            super(
                `User with email '${email}' does not have the required information for the '${service}' service to perform the '${operation}' operation.`
            );
        else super(`The '${operation}' operation is not supported for the '${service}' service.`);

        this.service = service;
        this.operation = operation;
        this.email = email;
        this.statusCode = email ? 409 : 501;
    }

    getResponseBody(): IResponse {
        return {
            code: this.email ? RESPONSE_CODE.UNSUPPORTED_ERROR : RESPONSE_CODE.INTERNAL_SERVER_ERROR,
            message: this.email ? RESPONSE_MESSAGE.UNSUPPORTED_ERROR : RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
            error: this.email
                ? this
                : {
                      service: this.service,
                      operation: this.operation,
                  },
        };
    }
}
