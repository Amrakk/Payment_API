import BaseError from "./baseError.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../interfaces/api/index.js";

import type { IResponse } from "../interfaces/api/index.js";

export default class BadFormatRequestError extends BaseError {
    service: string;
    data: object;

    statusCode = 500;

    constructor(service: string, data: object) {
        super(RESPONSE_MESSAGE.BAD_FORMAT_REQUEST);

        this.service = service;
        this.data = data;
    }

    getResponseBody(): IResponse {
        return {
            code: RESPONSE_CODE.BAD_FORMAT_REQUEST,
            message: RESPONSE_MESSAGE.BAD_FORMAT_REQUEST,
            error: this,
        };
    }
}
