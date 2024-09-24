import BaseError from "./baseError.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../interfaces/api/index.js";

import type { ZodIssue } from "zod";
import type { IResponse } from "../interfaces/api/index.js";

export default class ValidateError extends BaseError {
    operation: string;
    errors: ZodIssue[];

    statusCode = 400;

    constructor(operation: string, errors: ZodIssue[]) {
        super(RESPONSE_MESSAGE.VALIDATION_ERROR);

        this.errors = errors;
        this.operation = operation;
    }

    getResponseBody(): IResponse {
        return {
            code: RESPONSE_CODE.VALIDATION_ERROR,
            message: RESPONSE_MESSAGE.VALIDATION_ERROR,
            error: this,
        };
    }
}
