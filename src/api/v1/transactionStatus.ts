import { isAxiosError } from "axios";
import { Momo, PayOS } from "../../services/index.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../../interfaces/api/index.js";

import ValidateError from "../../errors/validateError.js";
import UnsupportedError from "../../errors/unsupportedError.js";

import type { Request, Response } from "express";
import type { IResponse, ITransactionStatus } from "../../interfaces/api/index.js";

export async function transactionStatus(req: Request, res: Response<IResponse<ITransactionStatus>>) {
    const { service } = req.query;
    const user = req.context!.user;

    try {
        let result: ITransactionStatus;

        if (service === "momo") result = await Momo.transactionStatus(req.body, user);
        if (service === "payos") result = await PayOS.transactionStatus(req.body, user);

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
        else if (err instanceof UnsupportedError)
            return res.status(409).send({
                code: RESPONSE_CODE.UNSUPPORTED_ERROR,
                message: RESPONSE_MESSAGE.UNSUPPORTED_ERROR,
                error: err,
            });

        if (isAxiosError(err)) console.log(err.response?.data); // TODO: log error
        else console.log(err); // TODO: log error
        return res
            .status(500)
            .send({ code: RESPONSE_CODE.INTERNAL_SERVER_ERROR, message: RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR });
    }
}
