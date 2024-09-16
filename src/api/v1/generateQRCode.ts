import { VietQR } from "../../services/index.js";
import { errorLogger } from "../../middlewares/logger/loggers.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../../interfaces/api/index.js";

import ValidateError from "../../errors/validateError.js";

import type { Request, Response } from "express";
import type { IResponse, IGetQRCode } from "../../interfaces/api/index.js";

export async function generateQRCode(req: Request, res: Response<IResponse<IGetQRCode>>) {
    const { service } = req.query;

    try {
        let result: IGetQRCode;
        if (service === "vietqr") result = await VietQR.getQRCode(req.body);

        if (!result)
            return res
                .status(409)
                .send({ code: RESPONSE_CODE.SERVICE_NOT_FOUND, message: RESPONSE_MESSAGE.SERVICE_NOT_FOUND });

        return res.status(200).send({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: result });
    } catch (err) {
        if (err instanceof ValidateError)
            return res
                .status(400)
                .send({ code: RESPONSE_CODE.VALIDATION_ERROR, message: RESPONSE_MESSAGE.VALIDATION_ERROR, error: err });

        if (err instanceof Error) errorLogger(err, req);
        return res
            .status(500)
            .send({ code: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR });
    }
}
