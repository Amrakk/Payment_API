import { errorLogger } from "./logger/loggers.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../interfaces/api/index.js";

import BaseError from "../errors/baseError.js";

import type { Request, Response, NextFunction } from "express";
import ApiResponseError from "../errors/apiResponseError.js";

export async function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof BaseError) {
        if (err.statusCode >= 500) await errorLogger(err, req);

        if (err instanceof ApiResponseError && err.statusCode < 400) {
            const errBody = err.getResponseBody();
            return res
                .status(err.statusCode)
                .json({ code: errBody.code, message: errBody.message, data: errBody.error });
        }

        return res.status(err.statusCode).json(err.getResponseBody());
    }

    await errorLogger(err, req);
    return res
        .status(500)
        .send({ code: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR });
}
