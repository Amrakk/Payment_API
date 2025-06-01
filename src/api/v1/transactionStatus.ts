import { Momo, PayOS } from "../../services/index.js";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "../../interfaces/api/index.js";

import type { NextFunction, Request, Response } from "express";
import type { IResponse, ITransactionStatus } from "../../interfaces/api/index.js";

export async function transactionStatus(
    req: Request,
    res: Response<IResponse<ITransactionStatus>>,
    next: NextFunction
) {
    const { service } = req.query;
    const user = req.context!.user;

    try {
        let result: ITransactionStatus;

        if (service === "momo") result = await Momo.transactionStatus(req.body, user);
        else if (service === "payos") result = await PayOS.transactionStatus(req.body, user);

        if (!result)
            return res
                .status(409)
                .send({ code: RESPONSE_CODE.SERVICE_NOT_FOUND, message: RESPONSE_MESSAGE.SERVICE_NOT_FOUND });

        return res.status(200).send({ code: RESPONSE_CODE.SUCCESS, message: RESPONSE_MESSAGE.SUCCESS, data: result });
    } catch (err) {
        next(err);
    }
}
